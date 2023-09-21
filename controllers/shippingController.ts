import {
  calculateShippingFeeService,
  trackingShippingService,
} from '../services/shippingServices.js';

export const calculateShippingFee = async (req, res, next) => {
  const { userId }: { userId: string } = req.user;
  const productToBuy = req.body;
  try {
    const order = await calculateShippingFeeService(userId, productToBuy);
    if (order) res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

export const trackingShipping = async (req, res, next) => {
  const { deliveryCode } = req.body;
  try {
    const shippingLog = await trackingShippingService(deliveryCode);
    if (shippingLog) res.status(200).json(shippingLog);
  } catch (err) {
    next(err);
  }
};
