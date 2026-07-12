/**
 * Auth Service — Routes
 * Handles: Login, Register, Forgot/Reset Password, Refresh Token, Logout
 */
import { Router } from 'express';
import { asyncHandler } from '@paysphere/shared';
import * as ctrl from '../controllers/authController.js';

const router = Router();

router.post('/register', asyncHandler(ctrl.register));
router.post('/login', asyncHandler(ctrl.login));
router.post('/refresh', asyncHandler(ctrl.refreshToken));
router.post('/logout', asyncHandler(ctrl.logout));
router.post('/forgot-password', asyncHandler(ctrl.forgotPassword));
router.post('/reset-password', asyncHandler(ctrl.resetPassword));
router.get('/verify-email/:token', asyncHandler(ctrl.verifyEmail));

export default router;
