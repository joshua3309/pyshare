import { prisma, ServiceError, httpClient } from '@paysphere/shared';
import { createInvoiceSchema, updateInvoiceSchema, subscriptionSchema } from '../utils/validation.js';

/**
 * GET /invoices
 */
export async function getInvoices(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const status = req.query.status;

  const where = { userId: req.user.userId };
  if (status) where.status = status;

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where, include: { items: true }, orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit, take: limit,
    }),
    prisma.invoice.count({ where }),
  ]);

  res.json({ invoices, pagination: { page, limit, total } });
}

/**
 * POST /invoices
 */
export async function createInvoice(req, res) {
  const data = createInvoiceSchema.parse(req.body);

  const invoice = await prisma.invoice.create({
    data: {
      number: `INV-${Date.now().toString().substring(0, 8)}`,
      userId: req.user.userId,
      clientName: data.clientName, clientEmail: data.clientEmail,
      amount: data.amount, currency: data.currency,
      dueDate: new Date(data.dueDate), notes: data.notes,
      items: { create: data.items || [] },
    },
    include: { items: true },
  });

  res.status(201).json({ message: 'Invoice created', invoice });
}

/**
 * GET /invoices/:id
 */
export async function getInvoice(req, res) {
  const invoice = await prisma.invoice.findFirst({
    where: { id: req.params.id, userId: req.user.userId },
    include: { items: true },
  });

  if (!invoice) throw new ServiceError('Invoice not found', 404, 'INVOICE_NOT_FOUND');

  res.json({ invoice });
}

/**
 * PUT /invoices/:id
 */
export async function updateInvoice(req, res) {
  const data = updateInvoiceSchema.parse(req.body);

  const result = await prisma.invoice.updateMany({
    where: { id: req.params.id, userId: req.user.userId },
    data,
  });

  if (result.count === 0) throw new ServiceError('Invoice not found', 404, 'INVOICE_NOT_FOUND');

  res.json({ message: 'Invoice updated' });
}

/**
 * POST /invoices/:id/send
 * Sends invoice to client via notification-service.
 */
export async function sendInvoice(req, res) {
  const invoice = await prisma.invoice.findFirst({
    where: { id: req.params.id, userId: req.user.userId },
  });

  if (!invoice) throw new ServiceError('Invoice not found', 404, 'INVOICE_NOT_FOUND');

  await prisma.invoice.update({
    where: { id: invoice.id },
    data: { status: 'SENT' },
  });

  // Send notification to user (invoice sent confirmation)
  try {
    await httpClient.call('notification', {
      method: 'POST',
      path: '/internal/send',
      body: {
        userId: req.user.userId,
        type: 'INVOICE',
        title: `Invoice ${invoice.number} sent`,
        message: `Invoice for $${invoice.amount} has been sent to ${invoice.clientName}.`,
      },
      requireServiceAuth: true,
      requestId: req.id,
    });
  } catch (err) {
    console.warn(`[billing-service] Notification failed: ${err.message}`);
  }

  res.json({ message: 'Invoice sent to client' });
}

/**
 * DELETE /invoices/:id
 */
export async function deleteInvoice(req, res) {
  await prisma.invoice.deleteMany({
    where: { id: req.params.id, userId: req.user.userId },
  });

  res.json({ message: 'Invoice deleted' });
}

/**
 * GET /subscriptions
 */
export async function getSubscriptions(req, res) {
  const subscriptions = await prisma.subscription.findMany({
    where: { userId: req.user.userId },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ subscriptions });
}

/**
 * POST /subscriptions
 */
export async function createSubscription(req, res) {
  const data = subscriptionSchema.parse(req.body);

  const subscription = await prisma.subscription.create({
    data: {
      userId: req.user.userId,
      plan: data.plan, amount: data.amount, currency: data.currency, interval: data.interval,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + (data.interval === 'YEARLY' ? 365 : 30) * 24 * 60 * 60 * 1000),
    },
  });

  res.status(201).json({ message: 'Subscription created', subscription });
}

/**
 * DELETE /subscriptions/:id
 */
export async function cancelSubscription(req, res) {
  await prisma.subscription.updateMany({
    where: { id: req.params.id, userId: req.user.userId },
    data: { status: 'CANCELLED', cancelAtPeriodEnd: true },
  });

  res.json({ message: 'Subscription cancelled' });
}
