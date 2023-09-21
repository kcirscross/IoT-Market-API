import express from 'express';
import {
  createOrder,
  getAllOrder,
  getBuyerOrders,
  getOrderDetail,
  getOrderDetailAdmin,
  getSellerOrders,
  getStoreOrdersForAdmin,
  setReceiveOrder,
} from '../controllers/orderController.js';
import { adminAuthentication } from '../middlewares/adminAuthentication.js';
import { userAuthentication } from '../middlewares/userAuthentication.js';

const router = express.Router();

router.get('/detail/:orderId', getOrderDetail);
router.get('/detailAdmin/:orderId', adminAuthentication, getOrderDetailAdmin);
router.get('/result', createOrder);
router.get('/buyer', userAuthentication, getBuyerOrders);
router.get('/seller', userAuthentication, getSellerOrders);
router.get('/store/:storeId', adminAuthentication, getStoreOrdersForAdmin);
router.get('/', adminAuthentication, getAllOrder);
router.post('/receive/:orderId', setReceiveOrder);

export const orderRouter = router;
