/**
 * Prisma Seed Script
 * Run: npm run prisma:seed
 *
 * Seeds the database with a demo user, wallet, and sample transactions.
 */
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo user
  const passwordHash = await bcrypt.hash('Password123!', 12);
  const user = await prisma.user.upsert({
    where: { email: 'sarah@flowcommerce.com' },
    update: {},
    create: {
      email: 'sarah@flowcommerce.com',
      passwordHash,
      firstName: 'Sarah',
      lastName: 'Chen',
      phone: '+1 (555) 123-4567',
      role: 'ADMIN',
      kycStatus: 'VERIFIED',
      emailVerified: true,
    },
  });

  // Create wallet with balances
  const wallet = await prisma.wallet.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      balances: {
        create: [
          { currency: 'USD', amount: 248590.5 },
          { currency: 'EUR', amount: 45200.0 },
          { currency: 'GBP', amount: 18750.0 },
          { currency: 'JPY', amount: 1250000 },
        ],
      },
    },
  });

  // Create sample transactions
  const transactions = [
    { type: 'PAYMENT', amount: 12400, currency: 'USD', description: 'Stripe payout', counterpartyName: 'Stripe', status: 'COMPLETED' },
    { type: 'TRANSFER', amount: 3200, currency: 'USD', description: 'AWS Services', counterpartyName: 'AWS', status: 'COMPLETED' },
    { type: 'INVOICE_PAYMENT', amount: 8750, currency: 'USD', description: 'Client invoice #1042', counterpartyName: 'Acme Corp', status: 'COMPLETED' },
    { type: 'TRANSFER', amount: 4500, currency: 'USD', description: 'Office rent', counterpartyName: 'Property Co', status: 'PENDING' },
    { type: 'TRANSFER', amount: 45, currency: 'USD', description: 'Figma subscription', counterpartyName: 'Figma', status: 'COMPLETED' },
  ];

  for (const txn of transactions) {
    await prisma.transaction.create({
      data: {
        reference: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        userId: user.id,
        walletId: wallet.id,
        ...txn,
        fee: Number(txn.amount) * 0.029 + 0.3,
        completedAt: txn.status === 'COMPLETED' ? new Date() : null,
      },
    });
  }

  // Create sample invoices
  const invoices = [
    { number: 'INV-1042', clientName: 'Acme Corp', clientEmail: 'billing@acme.com', amount: 8750, status: 'PAID', dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
    { number: 'INV-1041', clientName: 'Globex Inc', clientEmail: 'ap@globex.com', amount: 12300, status: 'PAID', dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
    { number: 'INV-1040', clientName: 'Initech', clientEmail: 'finance@initech.com', amount: 5400, status: 'SENT', dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) },
  ];

  for (const inv of invoices) {
    await prisma.invoice.create({
      data: {
        userId: user.id,
        ...inv,
        currency: 'USD',
        issueDate: new Date(),
      },
    });
  }

  console.log('Seed complete!');
  console.log('Demo user: sarah@flowcommerce.com / Password123!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
