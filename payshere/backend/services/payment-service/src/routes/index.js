import { Router } from 'express';
import { authenticate, asyncHandler } from '@paysphere/shared';
import * as ctrl from '../controllers/paymentController.js';

const router = Router();

router.use(authenticate);

router.post('/send', asyncHandler(ctrl.sendMoney));
router.post('/request', asyncHandler(ctrl.requestMoney));
router.post('/bill', asyncHandler(ctrl.payBill));
router.post('/card', asyncHandler(ctrl.processCardPayment));
router.post('/refund/:transactionId', asyncHandler(ctrl.refundPayment));

export default router;
