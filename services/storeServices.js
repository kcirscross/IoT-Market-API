import mongoose from 'mongoose';
import { createError } from '../errors/errors.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Store from '../models/Store.js';
import User from '../models/User.js';
export const createStoreServices = async (storeData) => {
    const newStore = await Store.create(Object.assign({}, storeData));
    if (!newStore) {
        throw createError(400, 'Can not create new store in database');
    }
    const owner = await User.findByIdAndUpdate({ _id: newStore.ownerId }, { storeId: newStore._id, $push: { roles: 'Store' } }, { new: true, runValidators: true });
    if (!owner) {
        throw createError(400, 'Can not create new store in database');
    }
    newStore.updateAddressId();
    return newStore;
};
export const editStoreService = async (storeId, storeData) => {
    const updatedStore = await Store.findByIdAndUpdate({ _id: storeId }, Object.assign({}, storeData), { new: true, runValidators: true });
    if (!updatedStore)
        throw createError(400, 'Can not update store in database or this user does not have any store');
    updatedStore.updateAddressId();
    return updatedStore;
};
export const deactiveStoreService = async (storeId) => {
    const deactivedStore = await Store.findOneAndUpdate({ _id: storeId, status: 'Active' }, { status: 'Deactive' }, { new: true, runValidators: true });
    if (!deactivedStore)
        throw createError(400, 'Can not active store in database because this user does not have any store or the store is currently deactive');
    return deactivedStore;
};
export const activeStoreService = async (storeId) => {
    const activedStore = await Store.findOneAndUpdate({ _id: storeId, status: 'Deactive' }, { status: 'Active' }, { new: true, runValidators: true });
    if (!activedStore)
        throw createError(400, 'Can not active store in database because this user does not have any store or the store is currently active');
    return activedStore;
};
export const getAllActiveStoresService = async () => {
    const allStores = await Store.find({ status: 'Active' });
    return allStores;
};
export const getStoreInfoService = async (storeId) => {
    const store = await Store.findById({ _id: storeId });
    if (!store)
        throw createError(404, 'Store not found in database');
    return store;
};
export const getAllStoresService = async () => {
    const allStores = await Store.find().populate('ownerId');
    return allStores;
};
export const getReportRevenueService = async (storeId) => {
    const revenue = await Order.aggregate([
        {
            $match: {
                ownerId: new mongoose.Types.ObjectId(storeId),
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                },
                total_monthly_revenue_: { $sum: '$VNPay.vnp_Amount' },
            },
        },
        {
            $sort: { month: -1 },
        },
    ]);
    const topFiveSoldProduct = await Product.find({
        ownerId: storeId,
        soldCount: { $gt: 0 },
    })
        .sort('-soldCount')
        .limit(5);
    return { revenue, topFiveSoldProduct };
};
