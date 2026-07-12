import { z } from 'zod';

export const topUpSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3).default('USD'),
  paymentMethod: z.string().min(1),
});

export const withdrawSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3).default('USD'),
  destination: z.string().min(1),
});

export const convertSchema = z.object({
  fromCurrency: z.string().length(3),
  toCurrency: z.string().length(3),
  amount: z.number().positive('Amount must be positive'),
});
