import express from 'express';
import { calculateShippingFee, trackingShipping, } from '../controllers/shippingController.js';
import { userAuthentication } from '../middlewares/index.js';
const router = express.Router();
router.post('/calculate', userAuthentication, calculateShippingFee);
router.get('/tracking', trackingShipping);
export const shippingRouter = router;
