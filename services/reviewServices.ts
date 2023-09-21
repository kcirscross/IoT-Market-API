import Review, { IReview } from '../models/Review.js';
import User, { IUser } from '../models/User.js';
import Product, { IProduct } from '../models/Product.js';
import mongoose from 'mongoose';
import { createError } from '../errors/errors.js';

export const addReviewServices = async (
  userId: string,
  productId: string,
  reviewData: IReview
): Promise<IReview> => {
  const user: IUser = await User.findOne({ _id: userId });
  if (!user) throw createError(404, `No user with id ${userId}`);

  const product: IProduct = await Product.findOne({ _id: productId });
  if (!product) throw createError(404, `No product with id ${productId}`);

  if (user.isReview.includes(new mongoose.Types.ObjectId(productId)))
    throw createError(403, 'User had already reviewed this product');

  user.isReview.push(new mongoose.Types.ObjectId(productId));

  const newReview: IReview = await Review.create({
    ...reviewData,
    reviewerId: userId,
    productId,
  });

  if (!newReview) {
    throw createError(400, 'Can not create new review in database');
  }

  switch (reviewData.starPoints) {
    case 1:
      product.rating.oneStarCount++;
      product.rating.ratingCount++;
      await product.save();
      break;
    case 2:
      product.rating.twoStarCount++;
      product.rating.ratingCount++;
      await product.save();
      break;
    case 3:
      product.rating.threeStarCount++;
      product.rating.ratingCount++;
      await product.save();
      break;
    case 4:
      product.rating.fourStarCount++;
      product.rating.ratingCount++;
      await product.save();
      break;
    case 5:
      product.rating.fiveStarCount++;
      product.rating.ratingCount++;
      await product.save();
      break;
    default:
      throw createError(
        400,
        'Star point must be an integer and has value between 1 to 5'
      );
  }

  await product.countAverageRating();
  await user.save();
  return newReview;
};

export const getReviewOfProductServices = async (
  productId: string
): Promise<IReview[]> => {
  if (!productId) createError(400, 'Missing product ID');
  const reviews: IReview[] = await Review.find({ productId }).sort({
    createdAt: -1,
  });

  return reviews;
};

export const getReviewOfProductAdminServices = async (
  productId: string
): Promise<IReview[]> => {
  if (!productId) createError(400, 'Missing product ID');
  const reviews: IReview[] = await Review.find({ productId })
    .populate('reviewerId')
    .sort({
      createdAt: -1,
    });

  return reviews;
};

export const getReviewOfUserService = async (
  userId: string
): Promise<IReview[]> => {
  if (!userId) createError(400, 'Missing user ID');
  const reviews: IReview[] = await Review.find({ reviewerId: userId }).sort({
    createdAt: -1,
  });

  return reviews;
};
