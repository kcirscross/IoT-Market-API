import mongoose from 'mongoose';
import { createError } from '../errors/errors.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Store, { IStore } from '../models/Store.js';
import User, { IUser } from '../models/User.js';

export const createStoreServices = async (storeData): Promise<IStore> => {
  const newStore: IStore = await Store.create({
    ...storeData,
  });

  if (!newStore) {
    throw createError(400, 'Can not create new store in database');
  }

  const owner: IUser = await User.findByIdAndUpdate(
    { _id: newStore.ownerId },
    { storeId: newStore._id, $push: { roles: 'Store' } },
    { new: true, runValidators: true }
  );

  if (!owner) {
    throw createError(400, 'Can not create new store in database');
  }

  newStore.updateAddressId();
  return newStore;
};

export const editStoreService = async (
  storeId: string,
  storeData: IStore
): Promise<IStore> => {
  const updatedStore: IStore = await Store.findByIdAndUpdate(
    { _id: storeId },
    { ...storeData },
    { new: true, runValidators: true }
  );
  if (!updatedStore)
    throw createError(
      400,
      'Can not update store in database or this user does not have any store'
    );
  updatedStore.updateAddressId();
  return updatedStore;
};

export const deactiveStoreService = async (
  storeId: string
): Promise<IStore> => {
  const deactivedStore: IStore = await Store.findOneAndUpdate(
    { _id: storeId, status: 'Active' },
    { status: 'Deactive' },
    { new: true, runValidators: true }
  );

  if (!deactivedStore)
    throw createError(
      400,
      'Can not active store in database because this user does not have any store or the store is currently deactive'
    );
  return deactivedStore;
};

export const activeStoreService = async (storeId: string): Promise<IStore> => {
  const activedStore: IStore = await Store.findOneAndUpdate(
    { _id: storeId, status: 'Deactive' },
    { status: 'Active' },
    { new: true, runValidators: true }
  );

  if (!activedStore)
    throw createError(
      400,
      'Can not active store in database because this user does not have any store or the store is currently active'
    );
  return activedStore;
};

export const getAllActiveStoresService = async (): Promise<IStore[]> => {
  const allStores: IStore[] = await Store.find({ status: 'Active' });
  return allStores;
};

export const getStoreInfoService = async (storeId: string): Promise<IStore> => {
  const store: IStore = await Store.findById({ _id: storeId });

  if (!store) throw createError(404, 'Store not found in database');
  return store;
};

export const getAllStoresService = async (): Promise<IStore[]> => {
  const allStores: IStore[] = await Store.find().populate('ownerId');
  return allStores;
};

export const getReportRevenueService = async (storeId: string) => {
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
