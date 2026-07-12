import { Router } from 'express';
import { authenticate, authenticateService, asyncHandler } from '@paysphere/shared';
import * as ctrl from '../controllers/walletController.js';

const router = Router();

// ─── User-facing routes (require user JWT) ──────────────────────────────
router.use(authenticate);

router.get('/', asyncHandler(ctrl.getWallet));
router.post('/topup', asyncHandler(ctrl.topUp));
router.post('/withdraw', asyncHandler(ctrl.withdraw));
router.post('/convert', asyncHandler(ctrl.convertCurrency));
router.get('/transactions', asyncHandler(ctrl.getWalletTransactions));

// ─── Internal routes (for other microservices) ──────────────────────────
// These are called by auth-service (create wallet), payment-service (deduct/credit)
// Protected by service-to-service JWT authentication
const internalRouter = Router();
internalRouter.use(authenticateService);

internalRouter.post('/create', asyncHandler(ctrl.createWallet));
internalRouter.post('/deduct', asyncHandler(ctrl.deductFunds));
internalRouter.post('/credit', asyncHandler(ctrl.creditFunds));

router.use('/internal', internalRouter);

export default router;
