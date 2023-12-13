import bcrypt from 'bcryptjs';
import dateFormat from 'dateformat';
import sortObject from 'sortobject';
import * as qs from 'qs';
import crypto from 'crypto';
// import { IUser } from "../models/User";
import { IStoreRequest } from '../models/StoreRequest.js';
import User, { ICart, IUser } from '../models/User.js';
import Store, { IStore } from '../models/Store.js';
import StoreRequest from '../models/StoreRequest.js';
import { createError } from '../errors/errors.js';

import Product, { IProduct } from '../models/Product.js';
import { calculateShippingFeeService } from './shippingServices.js';
import Shipping from '../models/Shipping.js';
import { createOrderCODServices } from './orderServices.js';

interface IAddress {
  street: string;
  district: string;
  ward: string;
  city: string;
}

interface IBankingInfo {
  bankName: string;
  accountOwner: string;
  accountNumber: string;
}

export const getAllUserServices = async (): Promise<IUser[]> => {
  const users: IUser[] = await User.find()
    .populate('storeId')
    .sort({
      createdAt: -1,
    })
    .select('-deviceToken -password -deviceTokenFCM');
  return users;
};

export const getUserInfoServices = async (userId: string): Promise<IUser> => {
  if (!userId) throw createError(400, 'Please provide userId');
  const user: IUser = await User.findOne({ _id: userId });
  if (!user) throw createError(404, `No user with id ${userId}`);

  user.deviceToken = undefined;
  user.password = undefined;

  return user;
};

export const changePasswordService = async (
  userId: string,
  email: string,
  currentPassword: string,
  newPassword: string
): Promise<boolean> => {
  const user: IUser = await User.findOne({ _id: userId, email });
  if (!user) throw createError(404, `No user with id ${userId}`);

  if (!currentPassword || !newPassword) {
    throw createError(400, 'Please type current password and new password!');
  }

  if (currentPassword === newPassword)
    throw createError(
      401,
      'Current password and new password must be different, please retry!'
    );

  const isPasswordMatched: boolean = await user.comparePassword(
    currentPassword
  );
  if (!isPasswordMatched)
    throw createError(401, 'Current password is incorrect, please retry!');

  const salt: string = bcrypt.genSaltSync(10);
  const hashedPassword: string = bcrypt.hashSync(newPassword, salt);

  user.password = hashedPassword;
  await user.save();

  return true;
};

export const changeAddressService = async (
  userId: string,
  email: string,
  street: string,
  district: string,
  ward: string,
  city: string
): Promise<IAddress> => {
  const user: IUser = await User.findOne({ _id: userId, email });
  if (!user) throw createError(404, `No user with id ${userId}`);

  if (!street || !district || !ward || !city)
    throw createError(400, 'Please input all the required address field!');

  const newAddress: IAddress = {
    street,
    district,
    ward,
    city,
  };
  user.address = newAddress;
  user.updateAddressId();
  await user.save();

  return newAddress;
};

export const changeBankingInfoService = async (
  userId: string,
  email: string,
  bankName: string,
  accountOwner: string,
  accountNumber: string
): Promise<IBankingInfo> => {
  const user: IUser = await User.findOne({ _id: userId, email });
  if (!user) throw createError(404, `No user with id ${userId}`);

  if (!bankName || !accountOwner || !accountNumber)
    throw createError(400, 'Please input all the required banking field!');

  const newBankingInfo: IBankingInfo = {
    bankName,
    accountOwner,
    accountNumber,
  };
  user.bankingAccount = newBankingInfo;
  await user.save();

  return newBankingInfo;
};

export const followStoreService = async (userId, followedStoreId) => {
  const storeGotFollowedTo = await Store.findByIdAndUpdate(
    { _id: followedStoreId },
    { $push: { followers: userId } },
    { new: true }
  );
  if (!storeGotFollowedTo) throw createError(500, 'Can not find store');

  const user = await User.findByIdAndUpdate(
    { _id: userId },
    { $push: { follows: followedStoreId } },
    { new: true }
  );

  return user;
};

export const unfollowStoreService = async (userId, unfollowedStoreId) => {
  const storeGotUnfollowedTo = await Store.findByIdAndUpdate(
    { _id: unfollowedStoreId },
    { $pull: { followers: userId } },
    { new: true }
  );
  if (!storeGotUnfollowedTo) throw createError(500, 'Can not find store');

  const user = await User.findByIdAndUpdate(
    { _id: userId },
    { $pull: { follows: unfollowedStoreId } },
    { new: true }
  );
  return user;
};

export const favoriteProductService = async (userId, favoriteProductId) => {
  const productGotFavoriteTo = await Product.findByIdAndUpdate(
    { _id: favoriteProductId },
    { $push: { peopleFavoriteThisProduct: userId } },
    { new: true }
  );
  if (!productGotFavoriteTo) throw createError(500, 'Can not find product');

  const user = await User.findByIdAndUpdate(
    { _id: userId },
    { $push: { favorites: favoriteProductId } },
    { new: true }
  );

  return user;
};

export const unfavoriteProductService = async (userId, unfavoriteProductId) => {
  const productGotUnfavorite = await Product.findByIdAndUpdate(
    { _id: unfavoriteProductId },
    { $pull: { peopleFavoriteThisProduct: userId } },
    { new: true }
  );
  if (!productGotUnfavorite) throw createError(500, 'Can not find product');

  const user = await User.findByIdAndUpdate(
    { _id: userId },
    { $pull: { favorites: unfavoriteProductId } },
    { new: true }
  );

  return user;
};

export const getFavoriteListOfAUserService = async (userId) => {
  const favoriteList = await User.findOne({ _id: userId })
    .populate('favorites')
    .select('favorites -_id');
  if (!favoriteList) throw createError(500, 'Can not find favorite list');

  return favoriteList;
};

export const getFollowStoreService = async (userId) => {
  const followList = await User.findOne({ _id: userId })
    .populate('follows')
    .select('follows -_id');
  if (!followList) throw createError(500, 'Can not find follows list');

  return followList;
};

export const addToCartServices = async (
  userId,
  productId,
  quantityToAdd = 1
) => {
  const user: IUser = await User.findById({ _id: userId }).populate({
    path: 'cart',
    populate: {
      path: 'content',
      populate: {
        path: 'productId',
        model: 'Product',
      },
    },
  });

  const productInDatabase: IProduct = await Product.findById({
    _id: productId,
  });

  const sameProductInUserCartIndex: number = user.cart.content.findIndex(
    (element) => element.productId._id == productId
  );

  if (sameProductInUserCartIndex == -1) {
    if (quantityToAdd > productInDatabase.numberInStock)
      throw createError(
        400,
        'The number add to cart in higher than the number of products in stock'
      );

    const productToAddToCart: ICart = {
      productId,
      quantity: quantityToAdd,
    };

    user.cart.content.push(productToAddToCart);
  } else {
    user.cart.content[sameProductInUserCartIndex].quantity += quantityToAdd;
    if (
      user.cart.content[sameProductInUserCartIndex].quantity >
      productInDatabase.numberInStock
    )
      throw createError(
        400,
        'The number add to cart in higher than the number of products in stock'
      );
  }

  user.cart.totalPrice = (
    parseInt(user.cart.totalPrice) +
    quantityToAdd * parseInt(productInDatabase.price)
  ).toString();

  await user.save();
  return user;
};

export const removeFromCartServices = async (userId, productList) => {
  const user: IUser = await User.findById({ _id: userId }).populate({
    path: 'cart',
    populate: {
      path: 'content',
      populate: {
        path: 'productId',
        model: 'Product',
      },
    },
  });
  const result = await Promise.all(
    productList.map(async (product) => {
      const productInDatabase: IProduct = await Product.findById({
        _id: product.productId,
      });

      const sameProductInUserCartIndex: number = user.cart.content.findIndex(
        (element) => element.productId._id == product.productId
      );

      if (
        product.quantity <
        user.cart.content[sameProductInUserCartIndex].quantity
      )
        user.cart.content[sameProductInUserCartIndex].quantity -=
          product.quantity;
      else {
        product.quantity =
          user.cart.content[sameProductInUserCartIndex].quantity;
        user.cart.content.splice(sameProductInUserCartIndex, 1);
      }

      user.cart.totalPrice = (
        parseInt(user.cart.totalPrice) -
        product.quantity * parseInt(productInDatabase.price)
      ).toString();
    })
  );
  await user.save();
  return user;
};

export const viewCartServices = async (userId) => {
  const cartList: IUser = await User.findById({ _id: userId })
    .populate({
      path: 'cart',
      populate: {
        path: 'content',
        populate: {
          path: 'productId',
          model: 'Product',
        },
      },
    })
    .select('-_id cart');
  if (!cartList) throw createError(500, 'Can not find cart list');

  return cartList;
};

export const changePhoneNumberServices = async (
  userId: string,
  newPhoneNumber: string
): Promise<string> => {
  const user: IUser = await User.findOne({ _id: userId });
  if (!user) throw createError(404, `No user with id ${userId}`);

  if (!newPhoneNumber)
    throw createError(400, 'Please provide correct phone number!');

  user.phoneNumber = newPhoneNumber;
  await user.save();

  return newPhoneNumber;
};

export const changeGenderServices = async (
  userId: string,
  newGender: string
): Promise<string> => {
  const user: IUser = await User.findOne({ _id: userId });
  if (!user) throw createError(404, `No user with id ${userId}`);
  if (newGender === 'Male' || newGender === 'Female') {
    user.gender = newGender;
    await user.save();
    return newGender;
  }

  throw createError(400, 'Please provide correct gender!');
};

export const changeAvatarService = async (
  userId: string,
  newAvatarLink: string
): Promise<string> => {
  const user: IUser = await User.findOne({ _id: userId });
  if (!user) throw createError(404, `No user with id ${userId}`);

  if (!newAvatarLink)
    throw createError(400, 'Please provide correct avatar image link!');

  user.avatar = newAvatarLink;
  await user.save();

  return newAvatarLink;
};

export const changeOnlineStatusService = async (
  userId: string,
  newOnlineStatus: string
): Promise<string> => {
  const user: IUser = await User.findOne({ _id: userId });
  if (!user) throw createError(404, `No user with id ${userId}`);

  if (!newOnlineStatus) throw createError(400, 'Please provide online status!');

  user.onlineStatus = newOnlineStatus;
  await user.save();

  return newOnlineStatus;
};

export const requestOpenStoreService = async (
  userId: string,
  requestData: IStoreRequest
): Promise<IStoreRequest> => {
  const duplicateStore: IStore = await Store.findOne({ ownerId: userId });
  if (duplicateStore) throw createError(400, 'This user already has store');

  const duplicateRequest: IStoreRequest = await StoreRequest.findOne({
    requesterId: userId,
    status: 'Pending',
  });
  if (duplicateRequest)
    throw createError(
      400,
      'This user already sent request and currently waiting for approval'
    );

  const user = await User.findById({ _id: userId });
  if (!user.phoneNumber)
    throw createError(
      400,
      'The user must update its phone to be able to open store store'
    );

  const newRequest: IStoreRequest = await StoreRequest.create({
    ...requestData,
    requesterId: userId,
    phoneNumber: user.phoneNumber,
  });
  if (!newRequest) throw createError(500, 'Can not send store request!');

  return newRequest;
};

export const buyService = async (
  userId: string,
  productToBuy,
  ipAddress: string,
  isCod = false
) => {
  if (productToBuy.length === 0) throw createError(400, 'No products in cart');

  const feeList = await calculateShippingFeeService(userId, productToBuy);

  const uploadFeeListToDatabase = await Shipping.create({ ...feeList });
  if (!uploadFeeListToDatabase)
    throw createError(400, 'Something is wrong with database');

  if (isCod) {
    const orders = await createOrderCODServices(
      uploadFeeListToDatabase,
      userId
    );
    return orders;
  }

  const tmnCode: string = process.env.vnp_TmnCode;
  const secretKey: string = process.env.vnp_HashSecret;
  let vnpUrl: string = process.env.vnp_Url;
  const returnUrl: string = process.env.vnp_Returnurl;

  const date: Date = new Date();
  const createDate: string = dateFormat(date, 'yyyymmddHHMMss');
  const orderId: string = dateFormat(date, 'HHmmss');
  const locale = 'vn';
  const currCode = 'VND';

  let vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = `${userId}_${uploadFeeListToDatabase._id}`;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] =
    (feeList.totalProductCost + feeList.totalShippingFee) * 100;
  vnp_Params['vnp_ReturnUrl'] = encodeURIComponent(returnUrl);
  vnp_Params['vnp_IpAddr'] = ipAddress;
  vnp_Params['vnp_CreateDate'] = createDate;
  vnp_Params = sortObject(vnp_Params);

  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('HMACSHA512', secretKey);
  const signed = hmac.update(signData, 'utf-8').digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;
  vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });

  return vnpUrl;
};
