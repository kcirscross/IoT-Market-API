import { IStore } from '../models/Store.js';
import {
  activeStoreService,
  deactiveStoreService,
  editStoreService,
  getAllActiveStoresService,
  getAllStoresService,
  getReportRevenueService,
  getStoreInfoService,
} from '../services/storeServices.js';

export const editStore = async (req, res, next) => {
  const storeData: IStore = req.body;
  const { userId }: { userId: string } = req.user;
  try {
    const updatedStore: IStore = await editStoreService(userId, storeData);
    if (updatedStore) {
      return res
        .status(200)
        .json({ message: 'Edit store successfully', updatedStore });
    }
  } catch (err) {
    next(err);
  }
};

export const deactiveStore = async (req, res, next) => {
  const { userId }: { userId: string } = req.user;
  try {
    const deactivedStore: IStore = await deactiveStoreService(userId);
    if (deactivedStore) {
      return res
        .status(200)
        .json({ message: 'Deactive store successfully', deactivedStore });
    }
  } catch (err) {
    next(err);
  }
};

export const activeStore = async (req, res, next) => {
  const { userId }: { userId: string } = req.user;
  try {
    const activedStore: IStore = await activeStoreService(userId);
    if (activedStore) {
      return res
        .status(200)
        .json({ message: 'Active store successfully', activedStore });
    }
  } catch (err) {
    next(err);
  }
};

export const getAllActiveStore = async (req, res, next) => {
  try {
    const allStores: IStore[] = await getAllActiveStoresService();
    if (allStores) {
      return res
        .status(200)
        .json({ message: 'Get stores successfully', allStores });
    }
  } catch (err) {
    next(err);
  }
};

export const getAllStore = async (req, res, next) => {
  try {
    const allStores: IStore[] = await getAllStoresService();
    if (allStores) {
      return res
        .status(200)
        .json({ message: 'Get stores successfully', allStores });
    }
  } catch (err) {
    next(err);
  }
};

export const getStoreInfo = async (req, res, next) => {
  const { storeId } = req.params;
  try {
    const store: IStore = await getStoreInfoService(storeId);
    if (store) {
      return res.status(200).json({ message: 'Get store successfully', store });
    }
  } catch (err) {
    next(err);
  }
};

export const getReportRevenue = async (req, res, next) => {
  const { storeId } = req.params;
  try {
    const { revenue, topFiveSoldProduct } = await getReportRevenueService(
      storeId
    );
    if (revenue && topFiveSoldProduct) {
      return res.status(200).json({
        message: 'Get result successfully',
        revenue,
        topFiveSoldProduct,
      });
    }
  } catch (err) {
    next(err);
  }
};
