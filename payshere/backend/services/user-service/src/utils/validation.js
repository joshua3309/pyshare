import { z } from 'zod';

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

export const kycSchema = z.object({
  dateOfBirth: z.string(),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
  country: z.string().min(1),
  documentType: z.enum(['passport', 'drivers_license', 'national_id']),
  documentNumber: z.string().min(1),
});
