import { addReviewServices, getReviewOfProductAdminServices, getReviewOfProductServices, getReviewOfUserService, } from '../services/reviewServices.js';
export const addReview = async (req, res, next) => {
    const { userId } = req.user;
    const { productId } = req.params;
    const reviewData = req.body;
    try {
        const newReview = await addReviewServices(userId, productId, reviewData);
        if (newReview)
            res
                .status(200)
                .json({ message: 'Add review to product successfully', newReview });
    }
    catch (err) {
        next(err);
    }
};
export const getReviewOfProduct = async (req, res, next) => {
    const { productId } = req.params;
    try {
        const reviews = await getReviewOfProductServices(productId);
        res.status(200).json({ message: 'Get reviews successfully', reviews });
    }
    catch (err) {
        next(err);
    }
};
export const getReviewOfProductAdmin = async (req, res, next) => {
    const { productId } = req.params;
    try {
        const reviews = await getReviewOfProductAdminServices(productId);
        res.status(200).json({ message: 'Get reviews successfully', reviews });
    }
    catch (err) {
        next(err);
    }
};
export const getReviewOfUser = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const reviews = await getReviewOfUserService(userId);
        res.status(200).json({ message: 'Get reviews successfully', reviews });
    }
    catch (err) {
        next(err);
    }
};
