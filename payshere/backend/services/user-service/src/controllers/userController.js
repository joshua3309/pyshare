import { prisma, ServiceError, httpClient } from '@paysphere/shared';
import { updateProfileSchema, kycSchema } from '../utils/validation.js';

/**
 * GET /me
 */
export async function getProfile(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      avatarUrl: true,
      role: true,
      kycStatus: true,
      twoFactorEnabled: true,
      emailVerified: true,
      createdAt: true,
      lastLoginAt: true,
    },
  });

  if (!user) {
    throw new ServiceError('User not found', 404, 'USER_NOT_FOUND');
  }

  res.json({ user });
}

/**
 * PUT /me
 */
export async function updateProfile(req, res) {
  const data = updateProfileSchema.parse(req.body);

  const user = await prisma.user.update({
    where: { id: req.user.userId },
    data,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      avatarUrl: true,
    },
  });

  res.json({ message: 'Profile updated', user });
}

/**
 * POST /kyc
 * Body: { dateOfBirth, address, city, state, zip, country, documentType, documentNumber }
 */
export async function submitKyc(req, res) {
  const data = kycSchema.parse(req.body);

  const user = await prisma.user.update({
    where: { id: req.user.userId },
    data: {
      kycStatus: 'IN_REVIEW',
      kycData: data,
    },
    select: { id: true, kycStatus: true },
  });

  // Notify user that KYC is under review (via notification-service)
  try {
    await httpClient.call('notification', {
      method: 'POST',
      path: '/internal/send',
      body: {
        userId: req.user.userId,
        type: 'SYSTEM',
        title: 'KYC Under Review',
        message: 'Your identity verification is being reviewed. This usually takes 1-2 business days.',
      },
      requireServiceAuth: true,
      requestId: req.id,
    });
  } catch (err) {
    console.warn(`[user-service] KYC notification failed: ${err.message}`);
  }

  res.json({
    message: 'KYC submitted for review',
    kycStatus: user.kycStatus,
  });
}

/**
 * GET /kyc
 */
export async function getKycStatus(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: { kycStatus: true, kycData: true },
  });

  res.json({ kycStatus: user?.kycStatus, kycData: user?.kycData });
}

/**
 * DELETE /me
 */
export async function deleteAccount(req, res) {
  await prisma.user.delete({ where: { id: req.user.userId } });
  res.json({ message: 'Account deleted successfully' });
}
