import { z } from 'zod';

export const createInvoiceSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  clientEmail: z.string().email('Invalid email'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3).default('USD'),
  dueDate: z.string(),
  notes: z.string().optional(),
  items: z
    .array(z.object({
      description: z.string().min(1),
      quantity: z.number().int().positive().default(1),
      unitPrice: z.number().positive(),
      total: z.number().positive(),
    }))
    .optional(),
});

export const updateInvoiceSchema = z.object({
  clientName: z.string().min(1).optional(),
  clientEmail: z.string().email().optional(),
  amount: z.number().positive().optional(),
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED']).optional(),
  notes: z.string().optional(),
});

export const subscriptionSchema = z.object({
  plan: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().length(3).default('USD'),
  interval: z.enum(['MONTHLY', 'YEARLY']),
});
