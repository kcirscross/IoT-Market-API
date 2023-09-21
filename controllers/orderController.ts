import { IPaymentInfo } from '../models/Order.js';
import {
  createOrderServices,
  getAllOrderServices,
  getBuyerOrdersServices,
  getOrderDetailServices,
  getOrderDetailServicesAdmin,
  getSellerOrdersServices,
  getStoreOrdersForAdminServices,
  setReceiveOrderService,
} from '../services/orderServices.js';

export const createOrder = async (req, res, next) => {
  const paymentData: IPaymentInfo = req.query;
  try {
    const order = await createOrderServices(paymentData);
    if (order) res.status(200).json({ message: 'Buy successfully', order });
  } catch (err) {
    next(err);
  }
};

export const getBuyerOrders = async (req, res, next) => {
  const { userId }: { userId: string } = req.user;
  try {
    const orders = await getBuyerOrdersServices(userId);
    if (orders) res.status(200).json({ orders });
  } catch (err) {
    next(err);
  }
};

export const getStoreOrdersForAdmin = async (req, res, next) => {
  const { storeId }: { storeId: string } = req.params;
  try {
    const orders = await getStoreOrdersForAdminServices(storeId);
    if (orders) res.status(200).json({ orders });
  } catch (err) {
    next(err);
  }
};

export const getSellerOrders = async (req, res, next) => {
  const { userId, storeId }: { userId: string; storeId: string } = req.user;
  try {
    const orders = await getSellerOrdersServices(userId, storeId);
    if (orders) res.status(200).json({ message: 'Buy successfully', orders });
  } catch (err) {
    next(err);
  }
};

export const getOrderDetail = async (req, res, next) => {
  const { orderId }: { orderId: string } = req.params;
  try {
    const order = await getOrderDetailServices(orderId);
    if (order) res.status(200).json({ order });
  } catch (err) {
    next(err);
  }
};

export const getOrderDetailAdmin = async (req, res, next) => {
  const { orderId }: { orderId: string } = req.params;
  try {
    const order = await getOrderDetailServicesAdmin(orderId);
    if (order) res.status(200).json({ order });
  } catch (err) {
    next(err);
  }
};

export const getAllOrder = async (req, res, next) => {
  try {
    const orders = await getAllOrderServices();
    if (orders) res.status(200).json({ orders });
  } catch (err) {
    next(err);
  }
};

export const setReceiveOrder = async (req, res, next) => {
  const { orderId }: { orderId: string } = req.params;

  try {
    const order = await setReceiveOrderService(orderId);
    if (order)
      res
        .status(200)
        .json({ message: 'Set order to receive status successfully' });
  } catch (err) {
    next(err);
  }
};
