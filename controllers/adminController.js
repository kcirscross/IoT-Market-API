import { approveStoreRequestServices, banUserServices, declineStoreRequestServices, getAllRequestServices, getRequestDetailServices, unbanUserServices, } from '../services/adminServices.js';
export const declineStoreRequest = async (req, res, next) => {
    const { params: { storeRequestId }, body: { reasonForReject }, } = req;
    try {
        const storeRequest = await declineStoreRequestServices(storeRequestId, reasonForReject);
        return res
            .status(200)
            .json({ message: 'Reject store request successfully', storeRequest });
    }
    catch (err) {
        next(err);
    }
};
export const approveStoreRequest = async (req, res, next) => {
    const { params: { storeRequestId }, } = req;
    try {
        const newStore = await approveStoreRequestServices(storeRequestId);
        return res
            .status(200)
            .json({ message: 'Approve store request successfully', newStore });
    }
    catch (err) {
        next(err);
    }
};
export const getAllRequest = async (req, res, next) => {
    try {
        const requests = await getAllRequestServices();
        if (requests)
            res.status(200).json({ requests });
    }
    catch (err) {
        next(err);
    }
};
export const getRequestDetail = async (req, res, next) => {
    const { params: { storeRequestId }, } = req;
    try {
        const storeRequest = await getRequestDetailServices(storeRequestId);
        return res.status(200).json({ storeRequest });
    }
    catch (err) {
        next(err);
    }
};
export const banUser = async (req, res, next) => {
    const { params: { userId }, } = req;
    try {
        const userToBan = await banUserServices(userId);
        return res
            .status(200)
            .json({ message: 'Ban user successfully', userToBan });
    }
    catch (err) {
        next(err);
    }
};
export const unbanUser = async (req, res, next) => {
    const { params: { userId }, } = req;
    try {
        const userToUnban = await unbanUserServices(userId);
        return res
            .status(200)
            .json({ message: 'Unban user successfully', userToUnban });
    }
    catch (err) {
        next(err);
    }
};
