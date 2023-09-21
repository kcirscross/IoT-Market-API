import express from 'express';

import {
  userAuthentication,
  storeAuthentication,
  adminAuthentication,
} from '../middlewares/index.js';
import {
  activeStore,
  deactiveStore,
  editStore,
  getAllActiveStore,
  getAllStore,
  getReportRevenue,
  getStoreInfo,
} from '../controllers/storeController.js';

const router = express.Router();

router.get('/activestore', getAllActiveStore);
router.get('/:storeId', getStoreInfo);
router.get('/report/:storeId', getReportRevenue);
router.patch('/', userAuthentication, storeAuthentication, editStore);
router.patch(
  '/deactive',
  userAuthentication,
  storeAuthentication,
  deactiveStore
);
router.patch('/active', userAuthentication, storeAuthentication, activeStore);
router.get('/', adminAuthentication, getAllStore);
export const storeRouter = router;
