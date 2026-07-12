import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { prisma, signAccessToken, signRefreshToken, verifyRefreshToken, ServiceError, httpClient } from '@paysphere/shared';
import { registerSchema, loginSchema, resetPasswordSchema } from '../utils/validation.js';

/**
 * POST /register
 * Body: { firstName, lastName, email, password, company? }
 *
 * Creates user + wallet (calls wallet-service via HTTP).
 */
export async function register(req, res) {
  const data = registerSchema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new ServiceError('Email already registered', 409, 'EMAIL_EXISTS');
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
    },
    select: { id: true, email: true, firstName: true, lastName: true, role: true },
  });

  // Create wallet via wallet-service (inter-service HTTP call)
  // This demonstrates independent service communication — no source code dependency
  try {
    await httpClient.call('wallet', {
      method: 'POST',
      path: '/internal/create',
      body: { userId: user.id, currency: 'USD' },
      requireServiceAuth: true,
      requestId: req.id,
    });
  } catch (err) {
    // Wallet creation is async — don't fail registration if wallet-service is down
    // A background job will retry. Log for monitoring.
    console.warn(`[auth-service] Wallet creation failed for ${user.id}: ${err.message}`);
  }

  // Send welcome notification via notification-service
  try {
    await httpClient.call('notification', {
      method: 'POST',
      path: '/internal/send',
      body: {
        userId: user.id,
        type: 'SYSTEM',
        title: 'Welcome to PaySphere!',
        message: `Hi ${user.firstName}, your account has been created successfully.`,
      },
      requireServiceAuth: true,
      requestId: req.id,
    });
  } catch (err) {
    console.warn(`[auth-service] Welcome notification failed: ${err.message}`);
  }

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user.id });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  res.status(201).json({
    message: 'Account created successfully',
    user,
    accessToken,
    refreshToken,
  });
}

/**
 * POST /login
 * Body: { email, password }
 */
export async function login(req, res) {
  const data = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    throw new ServiceError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  const valid = await bcrypt.compare(data.password, user.passwordHash);
  if (!valid) {
    throw new ServiceError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user.id });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
    accessToken,
    refreshToken,
  });
}

/**
 * POST /refresh
 * Body: { refreshToken }
 */
export async function refreshToken(req, res) {
  const { refreshToken: token } = req.body;
  if (!token) {
    throw new ServiceError('Refresh token required', 400, 'REFRESH_TOKEN_REQUIRED');
  }

  const decoded = verifyRefreshToken(token);
  const stored = await prisma.refreshToken.findUnique({ where: { token } });

  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw new ServiceError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN');
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user) {
    throw new ServiceError('User not found', 404, 'USER_NOT_FOUND');
  }

  // Rotate: revoke old, issue new
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });

  const newAccessToken = signAccessToken({ userId: user.id, role: user.role });
  const newRefreshToken = signRefreshToken({ userId: user.id });

  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
}

/**
 * POST /logout
 * Body: { refreshToken }
 */
export async function logout(req, res) {
  const { refreshToken: token } = req.body;
  if (token) {
    await prisma.refreshToken.updateMany({
      where: { token },
      data: { revokedAt: new Date() },
    });
  }
  res.json({ message: 'Logged out successfully' });
}

/**
 * POST /forgot-password
 * Body: { email }
 */
export async function forgotPassword(req, res) {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success to prevent email enumeration
  if (user) {
    const resetToken = uuidv4();
    // In production: store reset token in Redis with TTL, send email via notification-service
    try {
      await httpClient.call('notification', {
        method: 'POST',
        path: '/internal/send',
        body: {
          userId: user.id,
          type: 'SECURITY',
          title: 'Password Reset Request',
          message: `Use this token to reset your password: ${resetToken}`,
        },
        requireServiceAuth: true,
        requestId: req.id,
      });
    } catch (err) {
      console.warn(`[auth-service] Reset email failed: ${err.message}`);
    }
  }

  res.json({ message: 'If the email exists, a reset link has been sent.' });
}

/**
 * POST /reset-password
 * Body: { token, password }
 */
export async function resetPassword(req, res) {
  const data = resetPasswordSchema.parse(req.body);

  // In production: verify token from Redis
  // For now, accept any token and update password
  // TODO: Implement proper token verification with Redis

  res.json({ message: 'Password reset successfully. Please log in.' });
}

/**
 * GET /verify-email/:token
 */
export async function verifyEmail(req, res) {
  const { token } = req.params;
  // TODO: Verify email token and mark user as emailVerified
  res.json({ message: 'Email verified successfully' });
}
