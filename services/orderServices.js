import sortObject from 'sortobject';
import * as qs from 'qs';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Shipping from '../models/Shipping.js';
import axios from 'axios';
import User from '../models/User.js';
import { updateProductQuantityAfterBuyingServices } from './productServices.js';
import { trackingShippingService } from './shippingServices.js';
import { createError } from '../errors/errors.js';
import { sendNotificationToOneDeviceService } from './notiServices.js';
export const createOrderServices = async (paymentData) => {
    const messageDataForStore = {
        notification: {
            title: 'New order',
            body: `Your store got new order! Please check now!`,
        },
        data: {
            route: 'Order',
        },
    };
    const messageDataForUser = {
        notification: {
            title: 'Payment success',
            body: `Check your order for more details`,
        },
        data: {
            route: 'Order',
        },
    };
    if (paymentData.vnp_ResponseCode != 0)
        throw createError(400, 'Payment not success');
    const secureHash = paymentData.vnp_SecureHash;
    const secretKey = process.env.vnp_HashSecret;
    delete paymentData.vnp_SecureHash;
    delete paymentData.vnp_SecureHashType;
    paymentData = sortObject(paymentData);
    const signData = qs.stringify(paymentData, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(signData, 'utf-8').digest('hex');
    if (secureHash === signed) {
        const userId = paymentData.vnp_OrderInfo.split('_')[0];
        const shippingId = paymentData.vnp_OrderInfo.split('_')[1];
        await sendNotificationToOneDeviceService(messageDataForUser, userId);
        const shipping = await Shipping.findById({ _id: shippingId });
        const user = await User.findById({ _id: userId });
        const orders = Promise.all(shipping.shippingFeeList.map(async (shippingFee) => {
            const items = shippingFee.productList.map((item) => {
                return {
                    name: item.productId.toString(),
                    quantity: item.quantity,
                    weight: Math.round(item.weight),
                };
            });
            await updateProductQuantityAfterBuyingServices(items);
            const createdOrderToVPN = await axios({
                url: `${process.env.ghn_Url}/v2/shipping-order/create`,
                method: 'post',
                headers: {
                    Token: process.env.ghn_token,
                    ShopId: shippingFee.ghnShopId,
                },
                data: {
                    payment_type_id: 1,
                    to_name: user.fullName,
                    to_phone: user.phoneNumber,
                    to_address: user.address.street,
                    to_ward_name: user.address.ward,
                    to_district_name: user.address.district,
                    to_province_name: user.address.city,
                    weight: Math.round(shippingFee.totalSize.weight),
                    length: Math.round(shippingFee.totalSize.length),
                    width: Math.round(shippingFee.totalSize.width),
                    height: Math.round(shippingFee.totalSize.height),
                    service_id: shippingFee.service_id,
                    required_note: 'KHONGCHOXEMHANG',
                    items,
                },
            });
            let ownerRole = 'User';
            if (shippingFee.isStore) {
                ownerRole = 'Store';
                const owner = await User.findOne({
                    storeId: shippingFee.storeId,
                });
                await sendNotificationToOneDeviceService(messageDataForStore, owner._id.toString());
            }
            else
                await sendNotificationToOneDeviceService(messageDataForStore, shippingFee.storeId);
            const order = await Order.create({
                userId,
                ownerId: shippingFee.storeId,
                refModel: ownerRole,
                expected_delivery_time: createdOrderToVPN.data.data.expected_delivery_time,
                deliveryCode: createdOrderToVPN.data.data.order_code,
                productsList: items,
                VNPay: paymentData,
            });
            return order;
        }));
        shipping.status = 'Done';
        await shipping.save();
        return orders;
    }
};
export const createOrderCODServices = async (shipping, userId) => {
    const user = await User.findById({ _id: userId });
    const messageDataForStore = {
        notification: {
            title: 'New orders',
            body: `Your store got new orders! Please check now!`,
        },
        data: {
            route: 'Order',
        },
    };
    const messageDataForUser = {
        notification: {
            title: 'Payment success',
            body: `Check your order for more details`,
        },
        data: {
            route: 'Order',
        },
    };
    await sendNotificationToOneDeviceService(messageDataForUser, userId);
    const orders = Promise.all(shipping.shippingFeeList.map(async (shippingFee) => {
        const items = shippingFee.productList.map((item) => {
            return {
                name: item.productId.toString(),
                quantity: item.quantity,
                weight: Math.round(item.weight),
            };
        });
        await updateProductQuantityAfterBuyingServices(items);
        const createdOrderToVPN = await axios({
            url: `${process.env.ghn_Url}/v2/shipping-order/create`,
            method: 'post',
            headers: {
                Token: process.env.ghn_token,
                ShopId: shippingFee.ghnShopId,
            },
            data: {
                payment_type_id: 1,
                to_name: user.fullName,
                to_phone: user.phoneNumber,
                to_address: user.address.street,
                to_ward_name: user.address.ward,
                to_district_name: user.address.district,
                to_province_name: user.address.city,
                weight: Math.round(shippingFee.totalSize.weight),
                length: Math.round(shippingFee.totalSize.length),
                width: Math.round(shippingFee.totalSize.width),
                height: Math.round(shippingFee.totalSize.height),
                service_id: shippingFee.service_id,
                required_note: 'KHONGCHOXEMHANG',
                items,
                cod_amount: shipping.totalShippingFee + shipping.totalProductCost,
            },
        });
        let ownerRole = 'User';
        if (shippingFee.isStore) {
            ownerRole = 'Store';
            const owner = await User.findOne({
                storeId: shippingFee.storeId,
            });
            await sendNotificationToOneDeviceService(messageDataForStore, owner._id.toString());
        }
        else
            await sendNotificationToOneDeviceService(messageDataForStore, shippingFee.storeId);
        const order = await Order.create({
            userId,
            ownerId: shippingFee.storeId,
            refModel: ownerRole,
            expected_delivery_time: createdOrderToVPN.data.data.expected_delivery_time,
            deliveryCode: createdOrderToVPN.data.data.order_code,
            productsList: items,
            isCod: true,
            VNPay: {
                vnp_Amount: (shipping.totalShippingFee + shipping.totalProductCost) * 100,
            },
        });
        return order;
    }));
    shipping.status = 'Done';
    await shipping.save();
    return orders;
};
export const getBuyerOrdersServices = async (userId) => {
    const orders = await Order.find({ userId }).sort({
        createdAt: -1,
    });
    return orders;
};
export const getSellerOrdersServices = async (userId, storeId) => {
    const orders = await Order.find({
        $or: [{ ownerId: userId }, { ownerId: storeId }],
    }).sort({
        createdAt: -1,
    });
    return orders;
};
export const getOrderDetailServices = async (orderId) => {
    const order = await Order.findById(orderId);
    if (!order)
        throw createError(400, 'No order found');
    const isReceived = order.shippingLogs.filter((shippingLog) => {
        return shippingLog.status === 'delivered';
    });
    if (isReceived && isReceived.length > 0)
        return order;
    const shippingLogs = await trackingShippingService(order.deliveryCode);
    order.shippingLogs = shippingLogs;
    await order.save();
    return order;
};
export const getOrderDetailServicesAdmin = async (orderId) => {
    const order = await Order.findById(orderId)
        .populate({
        path: 'productsList',
        populate: {
            path: 'name',
        },
    })
        .populate('userId ownerId');
    if (!order)
        throw createError(400, 'No order found');
    const isReceived = order.shippingLogs.filter((shippingLog) => {
        return shippingLog.status === 'delivered';
    });
    if (isReceived && isReceived.length > 0)
        return order;
    const shippingLogs = await trackingShippingService(order.deliveryCode);
    order.shippingLogs = shippingLogs;
    await order.save();
    return order;
};
export const getAllOrderServices = async () => {
    const orders = await Order.find()
        .populate('userId')
        .populate({
        path: 'productsList',
        populate: { path: 'name', model: 'Product' },
    })
        .sort({
        createdAt: -1,
    });
    return orders;
};
export const setReceiveOrderService = async (orderId) => {
    const order = await Order.findById({ _id: orderId });
    order.shippingLogs.push({
        status: 'delivered',
        updated_date: new Date().toISOString(),
    });
    await order.save();
    return order;
};
export const getBuyerOrdersForAdminServices = async (userId) => {
    const orders = await Order.find({ userId }).sort({
        createdAt: -1,
    });
    return orders;
};
export const getStoreOrdersForAdminServices = async (storeId) => {
    const orders = await Order.find({
        ownerId: storeId,
    })
        .populate('userId')
        .populate({
        path: 'productsList',
        populate: { path: 'name', model: 'Product' },
    })
        .sort({
        createdAt: -1,
    });
    return orders;
};
