import { activeStoreService, deactiveStoreService, editStoreService, getAllActiveStoresService, getAllStoresService, getReportRevenueService, getStoreInfoService, } from '../services/storeServices.js';
export const editStore = async (req, res, next) => {
    const storeData = req.body;
    const { userId } = req.user;
    try {
        const updatedStore = await editStoreService(userId, storeData);
        if (updatedStore) {
            return res
                .status(200)
                .json({ message: 'Edit store successfully', updatedStore });
        }
    }
    catch (err) {
        next(err);
    }
};
export const deactiveStore = async (req, res, next) => {
    const { userId } = req.user;
    try {
        const deactivedStore = await deactiveStoreService(userId);
        if (deactivedStore) {
            return res
                .status(200)
                .json({ message: 'Deactive store successfully', deactivedStore });
        }
    }
    catch (err) {
        next(err);
    }
};
export const activeStore = async (req, res, next) => {
    const { userId } = req.user;
    try {
        const activedStore = await activeStoreService(userId);
        if (activedStore) {
            return res
                .status(200)
                .json({ message: 'Active store successfully', activedStore });
        }
    }
    catch (err) {
        next(err);
    }
};
export const getAllActiveStore = async (req, res, next) => {
    try {
        const allStores = await getAllActiveStoresService();
        if (allStores) {
            return res
                .status(200)
                .json({ message: 'Get stores successfully', allStores });
        }
    }
    catch (err) {
        next(err);
    }
};
export const getAllStore = async (req, res, next) => {
    try {
        const allStores = await getAllStoresService();
        if (allStores) {
            return res
                .status(200)
                .json({ message: 'Get stores successfully', allStores });
        }
    }
    catch (err) {
        next(err);
    }
};
export const getStoreInfo = async (req, res, next) => {
    const { storeId } = req.params;
    try {
        const store = await getStoreInfoService(storeId);
        if (store) {
            return res.status(200).json({ message: 'Get store successfully', store });
        }
    }
    catch (err) {
        next(err);
    }
};
export const getReportRevenue = async (req, res, next) => {
    const { storeId } = req.params;
    try {
        const { revenue, topFiveSoldProduct } = await getReportRevenueService(storeId);
        if (revenue && topFiveSoldProduct) {
            return res.status(200).json({
                message: 'Get result successfully',
                revenue,
                topFiveSoldProduct,
            });
        }
    }
    catch (err) {
        next(err);
    }
};
