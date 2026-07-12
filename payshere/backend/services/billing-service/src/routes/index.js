import { Router } from 'express';
import { authenticate, asyncHandler } from '@paysphere/shared';
import * as ctrl from '../controllers/billingController.js';

const router = Router();

router.use(authenticate);

// Invoices
router.get('/invoices', asyncHandler(ctrl.getInvoices));
router.post('/invoices', asyncHandler(ctrl.createInvoice));
router.get('/invoices/:id', asyncHandler(ctrl.getInvoice));
router.put('/invoices/:id', asyncHandler(ctrl.updateInvoice));
router.post('/invoices/:id/send', asyncHandler(ctrl.sendInvoice));
router.delete('/invoices/:id', asyncHandler(ctrl.deleteInvoice));

// Subscriptions
router.get('/subscriptions', asyncHandler(ctrl.getSubscriptions));
router.post('/subscriptions', asyncHandler(ctrl.createSubscription));
router.delete('/subscriptions/:id', asyncHandler(ctrl.cancelSubscription));

export default router;
