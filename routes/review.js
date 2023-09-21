import express from 'express';
import { addReview, getReviewOfProduct, getReviewOfProductAdmin, getReviewOfUser, } from '../controllers/reviewController.js';
import { adminAuthentication, userAuthentication, } from '../middlewares/index.js';
const router = express.Router();
router.get('/:productId', getReviewOfProduct);
router.get('/admin/:productId', adminAuthentication, getReviewOfProductAdmin);
router.get('/user/:userId', getReviewOfUser);
router.post('/:productId', userAuthentication, addReview);
export const reviewRouter = router;
