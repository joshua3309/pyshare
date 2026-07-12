import { Router } from 'express';
import { authenticate, asyncHandler } from '@paysphere/shared';
import * as ctrl from '../controllers/transactionController.js';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(ctrl.getTransactions));
router.get('/analytics', asyncHandler(ctrl.getAnalytics));
router.get('/export', asyncHandler(ctrl.exportTransactions));
router.get('/:id', asyncHandler(ctrl.getTransaction));

export default router;
