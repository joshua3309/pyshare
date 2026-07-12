import { Router } from 'express';
import { authenticate, asyncHandler } from '@paysphere/shared';
import * as ctrl from '../controllers/userController.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/me', asyncHandler(ctrl.getProfile));
router.put('/me', asyncHandler(ctrl.updateProfile));
router.post('/kyc', asyncHandler(ctrl.submitKyc));
router.get('/kyc', asyncHandler(ctrl.getKycStatus));
router.delete('/me', asyncHandler(ctrl.deleteAccount));

export default router;
