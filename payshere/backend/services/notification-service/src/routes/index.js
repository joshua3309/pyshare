import { Router } from 'express';
import { authenticate, authenticateService, asyncHandler } from '@paysphere/shared';
import * as ctrl from '../controllers/notificationController.js';

const router = Router();

// ─── User-facing routes ─────────────────────────────────────────────────
router.use(authenticate);

router.get('/', asyncHandler(ctrl.getNotifications));
router.post('/mark-read/:id', asyncHandler(ctrl.markAsRead));
router.post('/mark-all-read', asyncHandler(ctrl.markAllAsRead));
router.delete('/:id', asyncHandler(ctrl.deleteNotification));

// ─── Internal routes (for other services) ──────────────────────────────
const internalRouter = Router();
internalRouter.use(authenticateService);

internalRouter.post('/send', asyncHandler(ctrl.sendInternal));

router.use('/internal', internalRouter);

export default router;
