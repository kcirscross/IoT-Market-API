import express from 'express';

import {
  approveStoreRequest,
  banUser,
  declineStoreRequest,
  getAllRequest,
  getRequestDetail,
  unbanUser,
} from '../controllers/adminController.js';
import { adminAuthentication } from '../middlewares/index.js';

const router = express.Router();

router.get('/request/:storeRequestId', adminAuthentication, getRequestDetail);
router.get('/request', adminAuthentication, getAllRequest);
router.patch('/ban/:userId', adminAuthentication, banUser);
router.patch('/unban/:userId', adminAuthentication, unbanUser);
router.patch(
  '/reject/:storeRequestId',
  adminAuthentication,
  declineStoreRequest
);
router.patch(
  '/approve/:storeRequestId',
  adminAuthentication,
  approveStoreRequest
);
export const adminRouter = router;
