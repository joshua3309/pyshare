import { v4 as uuidv4 } from 'uuid';
import { prisma, ServiceError, httpClient } from '@paysphere/shared';
import { sendMoneySchema, requestMoneySchema, payBillSchema, cardPaymentSchema } from '../utils/validation.js';

/**
 * POST /send
 * Body: { recipientName, recipientEmail, amount, currency, note? }
 *
 * Sends money from user's wallet. Calls wallet-service to verify & deduct balance.
 */
export async function sendMoney(req, res) {
  const data = sendMoneySchema.parse(req.body);

  // Call wallet-service to verify & deduct funds (inter-service HTTP)
  // This keeps wallet logic in wallet-service — payment-service doesn't touch wallet tables directly
  let walletResponse;
  try {
    walletResponse = await httpClient.call('wallet', {
      method: 'POST',
      path: '/internal/deduct',
      body: {
        userId: req.user.userId,
        amount: data.amount,
        currency: data.currency,
      },
      requireServiceAuth: true,
      requestId: req.id,
    });
  } catch (err) {
    if (err.code === 'INSUFFICIENT_FUNDS') {
      throw new ServiceError('Insufficient funds', 400, 'INSUFFICIENT_FUNDS');
    }
    throw new ServiceError('Wallet service unavailable', 503, 'WALLET_UNAVAILABLE');
  }

  const fee = Number(data.amount) * 0.029 + 0.3;

  const transaction = await prisma.transaction.create({
    data: {
      reference: `TXN-${uuidv4().substring(0, 8).toUpperCase()}`,
      userId: req.user.userId,
      walletId: walletResponse?.walletId,
      type: 'TRANSFER',
      status: 'COMPLETED',
      amount: data.amount,
      currency: data.currency,
      fee,
      description: data.note,
      counterpartyName: data.recipientName,
      counterpartyEmail: data.recipientEmail,
      completedAt: new Date(),
    },
  });

  // Send notification via notification-service
  try {
    await httpClient.call('notification', {
      method: 'POST',
      path: '/internal/send',
      body: {
        userId: req.user.userId,
        type: 'TRANSACTION',
        title: 'Payment Sent',
        message: `$${data.amount} sent to ${data.recipientName}`,
      },
      requireServiceAuth: true,
      requestId: req.id,
    });
  } catch (err) {
    console.warn(`[payment-service] Notification failed: ${err.message}`);
  }

  res.status(201).json({
    message: 'Payment sent successfully',
    transaction,
  });
}

/**
 * POST /request
 * Body: { fromName, fromEmail, amount, currency, note? }
 */
export async function requestMoney(req, res) {
  const data = requestMoneySchema.parse(req.body);

  const transaction = await prisma.transaction.create({
    data: {
      reference: `REQ-${uuidv4().substring(0, 8).toUpperCase()}`,
      userId: req.user.userId,
      type: 'PAYMENT',
      status: 'PENDING',
      amount: data.amount,
      currency: data.currency,
      description: data.note,
      counterpartyName: data.fromName,
      counterpartyEmail: data.fromEmail,
    },
  });

  res.status(201).json({
    message: 'Payment request created',
    transaction,
    paymentLink: `https://pay.paysphere.com/req/${transaction.reference}`,
  });
}

/**
 * POST /bill
 * Body: { billerName, accountNumber, amount, currency }
 */
export async function payBill(req, res) {
  const data = payBillSchema.parse(req.body);

  const transaction = await prisma.transaction.create({
    data: {
      reference: `BILL-${uuidv4().substring(0, 8).toUpperCase()}`,
      userId: req.user.userId,
      type: 'PAYMENT',
      status: 'PROCESSING',
      amount: data.amount,
      currency: data.currency,
      description: `Bill payment: ${data.billerName}`,
      paymentMethod: data.accountNumber,
      counterpartyName: data.billerName,
    },
  });

  res.status(201).json({
    message: 'Bill payment initiated',
    transaction,
  });
}

/**
 * POST /card
 * Body: { amount, currency, cardToken, description? }
 * Stripe-ready: uses Stripe if STRIPE_SECRET_KEY is set, otherwise mocks.
 */
export async function processCardPayment(req, res) {
  const data = cardPaymentSchema.parse(req.body);

  if (process.env.STRIPE_SECRET_KEY) {
    // ── Stripe integration (production) ──
    const Stripe = (await import('stripe')).default;
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(data.amount * 100),
      currency: data.currency.toLowerCase(),
      metadata: { userId: req.user.userId },
    });

    const transaction = await prisma.transaction.create({
      data: {
        reference: `CARD-${uuidv4().substring(0, 8).toUpperCase()}`,
        userId: req.user.userId,
        type: 'PAYMENT',
        status: 'PENDING',
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        paymentMethod: 'card',
        metadata: { stripePaymentIntentId: paymentIntent.id },
      },
    });

    res.status(201).json({
      message: 'Card payment initiated',
      transaction,
      clientSecret: paymentIntent.client_secret,
    });
  } else {
    // ── Mock mode (development) ──
    const transaction = await prisma.transaction.create({
      data: {
        reference: `CARD-${uuidv4().substring(0, 8).toUpperCase()}`,
        userId: req.user.userId,
        type: 'PAYMENT',
        status: 'COMPLETED',
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        paymentMethod: 'card',
        completedAt: new Date(),
      },
    });

    res.status(201).json({
      message: 'Card payment processed (mock)',
      transaction,
    });
  }
}

/**
 * POST /refund/:transactionId
 */
export async function refundPayment(req, res) {
  const { transactionId } = req.params;

  const original = await prisma.transaction.findFirst({
    where: { id: transactionId, userId: req.user.userId },
  });

  if (!original) {
    throw new ServiceError('Transaction not found', 404, 'TRANSACTION_NOT_FOUND');
  }

  if (original.status !== 'COMPLETED') {
    throw new ServiceError('Only completed transactions can be refunded', 400, 'NOT_REFUNDABLE');
  }

  const refund = await prisma.transaction.create({
    data: {
      reference: `REF-${uuidv4().substring(0, 8).toUpperCase()}`,
      userId: req.user.userId,
      type: 'REFUND',
      status: 'COMPLETED',
      amount: original.amount,
      currency: original.currency,
      description: `Refund for ${original.reference}`,
      completedAt: new Date(),
    },
  });

  // Restore balance via wallet-service
  if (original.walletId) {
    try {
      await httpClient.call('wallet', {
        method: 'POST',
        path: '/internal/credit',
        body: {
          userId: req.user.userId,
          amount: original.amount,
          currency: original.currency,
        },
        requireServiceAuth: true,
        requestId: req.id,
      });
    } catch (err) {
      console.warn(`[payment-service] Refund credit failed: ${err.message}`);
    }
  }

  await prisma.transaction.update({
    where: { id: original.id },
    data: { status: 'REFUNDED' },
  });

  res.json({ message: 'Refund processed', refund });
}
