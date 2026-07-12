import { v4 as uuidv4 } from 'uuid';
import { prisma, ServiceError } from '@paysphere/shared';
import { topUpSchema, withdrawSchema, convertSchema } from '../utils/validation.js';

// Mock exchange rates (in production, use a real FX API)
const exchangeRates = {
  'USD-EUR': 0.92, 'EUR-USD': 1.09,
  'USD-GBP': 0.79, 'GBP-USD': 1.27,
  'USD-JPY': 149.5, 'JPY-USD': 0.0067,
};

/**
 * GET /
 */
export async function getWallet(req, res) {
  const wallet = await prisma.wallet.findUnique({
    where: { userId: req.user.userId },
    include: { balances: true },
  });

  if (!wallet) {
    throw new ServiceError('Wallet not found', 404, 'WALLET_NOT_FOUND');
  }

  res.json({ wallet });
}

/**
 * POST /topup
 */
export async function topUp(req, res) {
  const data = topUpSchema.parse(req.body);

  const wallet = await prisma.wallet.findUnique({
    where: { userId: req.user.userId },
    include: { balances: true },
  });

  if (!wallet) throw new ServiceError('Wallet not found', 404, 'WALLET_NOT_FOUND');

  let balance = wallet.balances.find((b) => b.currency === data.currency);

  const [updatedBalance, transaction] = await prisma.$transaction([
    balance
      ? prisma.walletBalance.update({ where: { id: balance.id }, data: { amount: { increment: data.amount } } })
      : prisma.walletBalance.create({ data: { walletId: wallet.id, currency: data.currency, amount: data.amount } }),
    prisma.transaction.create({
      data: {
        reference: `TOP-${uuidv4().substring(0, 8).toUpperCase()}`,
        userId: req.user.userId, walletId: wallet.id, type: 'DEPOSIT', status: 'COMPLETED',
        amount: data.amount, currency: data.currency,
        description: `Top up via ${data.paymentMethod}`, paymentMethod: data.paymentMethod,
        completedAt: new Date(),
      },
    }),
  ]);

  res.json({ message: 'Top up successful', balance: updatedBalance, transaction });
}

/**
 * POST /withdraw
 */
export async function withdraw(req, res) {
  const data = withdrawSchema.parse(req.body);

  const wallet = await prisma.wallet.findUnique({
    where: { userId: req.user.userId },
    include: { balances: true },
  });

  if (!wallet) throw new ServiceError('Wallet not found', 404, 'WALLET_NOT_FOUND');

  const balance = wallet.balances.find((b) => b.currency === data.currency);
  if (!balance || balance.amount < data.amount) {
    throw new ServiceError('Insufficient funds', 400, 'INSUFFICIENT_FUNDS');
  }

  const [updatedBalance, transaction] = await prisma.$transaction([
    prisma.walletBalance.update({ where: { id: balance.id }, data: { amount: { decrement: data.amount } } }),
    prisma.transaction.create({
      data: {
        reference: `WDW-${uuidv4().substring(0, 8).toUpperCase()}`,
        userId: req.user.userId, walletId: wallet.id, type: 'WITHDRAWAL', status: 'PROCESSING',
        amount: data.amount, currency: data.currency,
        description: `Withdrawal to ${data.destination}`, paymentMethod: data.destination,
      },
    }),
  ]);

  res.json({ message: 'Withdrawal initiated', balance: updatedBalance, transaction });
}

/**
 * POST /convert
 */
export async function convertCurrency(req, res) {
  const data = convertSchema.parse(req.body);

  const rateKey = `${data.fromCurrency}-${data.toCurrency}`;
  const rate = exchangeRates[rateKey];
  if (!rate) throw new ServiceError('Currency pair not supported', 400, 'UNSUPPORTED_CURRENCY');

  const wallet = await prisma.wallet.findUnique({
    where: { userId: req.user.userId },
    include: { balances: true },
  });

  if (!wallet) throw new ServiceError('Wallet not found', 404, 'WALLET_NOT_FOUND');

  const fromBalance = wallet.balances.find((b) => b.currency === data.fromCurrency);
  if (!fromBalance || fromBalance.amount < data.amount) {
    throw new ServiceError('Insufficient funds', 400, 'INSUFFICIENT_FUNDS');
  }

  const convertedAmount = Number(data.amount) * rate;
  let toBalance = wallet.balances.find((b) => b.currency === data.toCurrency);

  await prisma.$transaction([
    prisma.walletBalance.update({ where: { id: fromBalance.id }, data: { amount: { decrement: data.amount } } }),
    toBalance
      ? prisma.walletBalance.update({ where: { id: toBalance.id }, data: { amount: { increment: convertedAmount } } })
      : prisma.walletBalance.create({ data: { walletId: wallet.id, currency: data.toCurrency, amount: convertedAmount } }),
    prisma.transaction.create({
      data: {
        reference: `CVT-${uuidv4().substring(0, 8).toUpperCase()}`,
        userId: req.user.userId, walletId: wallet.id, type: 'TRANSFER', status: 'COMPLETED',
        amount: data.amount, currency: data.fromCurrency,
        description: `Currency conversion ${data.fromCurrency}→${data.toCurrency}`,
        metadata: { rate, convertedAmount, toCurrency: data.toCurrency },
        completedAt: new Date(),
      },
    }),
  ]);

  res.json({ message: 'Currency converted', rate, convertedAmount });
}

/**
 * GET /transactions
 */
export async function getWalletTransactions(req, res) {
  const wallet = await prisma.wallet.findUnique({ where: { userId: req.user.userId } });
  if (!wallet) throw new ServiceError('Wallet not found', 404, 'WALLET_NOT_FOUND');

  const transactions = await prisma.transaction.findMany({
    where: { walletId: wallet.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  res.json({ transactions });
}

// ─── Internal Endpoints (called by other services) ──────────────────────

/**
 * POST /internal/create
 * Called by auth-service when a new user registers.
 * Body: { userId, currency }
 */
export async function createWallet(req, res) {
  const { userId, currency = 'USD' } = req.body;

  const existing = await prisma.wallet.findUnique({ where: { userId } });
  if (existing) {
    return res.json({ message: 'Wallet already exists', walletId: existing.id });
  }

  const wallet = await prisma.wallet.create({
    data: {
      userId,
      balances: { create: { currency, amount: 0 } },
    },
  });

  res.status(201).json({ message: 'Wallet created', walletId: wallet.id });
}

/**
 * POST /internal/deduct
 * Called by payment-service to deduct funds for a transfer.
 * Body: { userId, amount, currency }
 */
export async function deductFunds(req, res) {
  const { userId, amount, currency = 'USD' } = req.body;

  const wallet = await prisma.wallet.findUnique({
    where: { userId },
    include: { balances: true },
  });

  if (!wallet) throw new ServiceError('Wallet not found', 404, 'WALLET_NOT_FOUND');

  const balance = wallet.balances.find((b) => b.currency === currency);
  if (!balance || balance.amount < amount) {
    throw new ServiceError('Insufficient funds', 400, 'INSUFFICIENT_FUNDS');
  }

  await prisma.walletBalance.update({
    where: { id: balance.id },
    data: { amount: { decrement: amount } },
  });

  res.json({ message: 'Funds deducted', walletId: wallet.id, newBalance: Number(balance.amount) - amount });
}

/**
 * POST /internal/credit
 * Called by payment-service to credit funds (e.g. refund).
 * Body: { userId, amount, currency }
 */
export async function creditFunds(req, res) {
  const { userId, amount, currency = 'USD' } = req.body;

  const wallet = await prisma.wallet.findUnique({
    where: { userId },
    include: { balances: true },
  });

  if (!wallet) throw new ServiceError('Wallet not found', 404, 'WALLET_NOT_FOUND');

  let balance = wallet.balances.find((b) => b.currency === currency);

  if (balance) {
    await prisma.walletBalance.update({
      where: { id: balance.id },
      data: { amount: { increment: amount } },
    });
  } else {
    await prisma.walletBalance.create({
      data: { walletId: wallet.id, currency, amount },
    });
  }

  res.json({ message: 'Funds credited', walletId: wallet.id });
}
