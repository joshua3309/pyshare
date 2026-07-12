import { z } from 'zod';

export const sendMoneySchema = z.object({
  recipientName: z.string().min(1, 'Recipient name is required'),
  recipientEmail: z.string().email('Invalid email'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3).default('USD'),
  note: z.string().optional(),
});

export const requestMoneySchema = z.object({
  fromName: z.string().min(1, 'Name is required'),
  fromEmail: z.string().email('Invalid email'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3).default('USD'),
  note: z.string().optional(),
});

export const payBillSchema = z.object({
  billerName: z.string().min(1),
  accountNumber: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().length(3).default('USD'),
});

export const cardPaymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3).default('USD'),
  cardToken: z.string().min(1),
  description: z.string().optional(),
});
