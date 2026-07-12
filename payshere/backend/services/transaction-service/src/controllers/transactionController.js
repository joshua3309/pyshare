import { prisma, ServiceError } from '@paysphere/shared';

/**
 * GET /?page=1&limit=20&type=PAYMENT&status=COMPLETED&search=...
 */
export async function getTransactions(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const skip = (page - 1) * limit;

  const where = { userId: req.user.userId };

  if (req.query.type) where.type = req.query.type;
  if (req.query.status) where.status = req.query.status;
  if (req.query.search) {
    where.OR = [
      { reference: { contains: req.query.search, mode: 'insensitive' } },
      { description: { contains: req.query.search, mode: 'insensitive' } },
      { counterpartyName: { contains: req.query.search, mode: 'insensitive' } },
    ];
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  res.json({
    transactions,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

/**
 * GET /analytics
 * Returns aggregated analytics for the user.
 */
export async function getAnalytics(req, res) {
  const userId = req.user.userId;
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [inflow, outflow, pending, volumeByDay] = await Promise.all([
    prisma.transaction.aggregate({
      where: { userId, type: { in: ['PAYMENT', 'DEPOSIT', 'INVOICE_PAYMENT'] }, status: 'COMPLETED' },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { userId, type: { in: ['TRANSFER', 'WITHDRAWAL'] }, status: 'COMPLETED' },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { userId, status: 'PENDING' },
      _sum: { amount: true },
    }),
    prisma.transaction.findMany({
      where: { userId, createdAt: { gte: thirtyDaysAgo }, status: 'COMPLETED' },
      select: { amount: true, type: true, createdAt: true },
    }),
  ]);

  const dailyVolume = {};
  volumeByDay.forEach((t) => {
    const day = t.createdAt.toISOString().split('T')[0];
    if (!dailyVolume[day]) dailyVolume[day] = { inflow: 0, outflow: 0 };
    if (['PAYMENT', 'DEPOSIT', 'INVOICE_PAYMENT'].includes(t.type)) {
      dailyVolume[day].inflow += Number(t.amount);
    } else {
      dailyVolume[day].outflow += Number(t.amount);
    }
  });

  res.json({
    inflow: inflow._sum.amount || 0,
    outflow: outflow._sum.amount || 0,
    pending: pending._sum.amount || 0,
    dailyVolume: Object.entries(dailyVolume).map(([date, values]) => ({ date, ...values })),
  });
}

/**
 * GET /export
 * Exports transactions as CSV.
 */
export async function exportTransactions(req, res) {
  const transactions = await prisma.transaction.findMany({
    where: { userId: req.user.userId },
    orderBy: { createdAt: 'desc' },
  });

  const headers = ['Reference', 'Type', 'Status', 'Amount', 'Currency', 'Fee', 'Description', 'Date'];
  const rows = transactions.map((t) => [
    t.reference, t.type, t.status, t.amount, t.currency, t.fee, t.description || '', t.createdAt.toISOString(),
  ]);

  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
  res.send(csv);
}

/**
 * GET /:id
 */
export async function getTransaction(req, res) {
  const transaction = await prisma.transaction.findFirst({
    where: { id: req.params.id, userId: req.user.userId },
  });

  if (!transaction) {
    throw new ServiceError('Transaction not found', 404, 'TRANSACTION_NOT_FOUND');
  }

  res.json({ transaction });
}
