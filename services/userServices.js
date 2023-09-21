import bcrypt from 'bcryptjs';
import dateFormat from 'dateformat';
import sortObject from 'sortobject';
import * as qs from 'qs';
import crypto from 'crypto';
import User from '../models/User.js';
import Store from '../models/Store.js';
import StoreRequest from '../models/StoreRequest.js';
import { createError } from '../errors/errors.js';
import Product from '../models/Product.js';
import { calculateShippingFeeService } from './shippingServices.js';
import Shipping from '../models/Shipping.js';
import { createOrderCODServices } from './orderServices.js';
export const getAllUserServices = async () => {
    const users = await User.find()
        .populate('storeId')
        .sort({
        createdAt: -1,
    })
        .select('-deviceToken -password -deviceTokenFCM');
    return users;
};
export const getUserInfoServices = async (userId) => {
    if (!userId)
        throw createError(400, 'Please provide userId');
    const user = await User.findOne({ _id: userId });
    if (!user)
        throw createError(404, `No user with id ${userId}`);
    user.deviceToken = undefined;
    user.password = undefined;
    return user;
};
export const changePasswordService = async (userId, email, currentPassword, newPassword) => {
    const user = await User.findOne({ _id: userId, email });
    if (!user)
        throw createError(404, `No user with id ${userId}`);
    if (!currentPassword || !newPassword) {
        throw createError(400, 'Please type current password and new password!');
    }
    if (currentPassword === newPassword)
        throw createError(401, 'Current password and new password must be different, please retry!');
    const isPasswordMatched = await user.comparePassword(currentPassword);
    if (!isPasswordMatched)
        throw createError(401, 'Current password is incorrect, please retry!');
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    return true;
};
export const changeAddressService = async (userId, email, street, district, ward, city) => {
    const user = await User.findOne({ _id: userId, email });
    if (!user)
        throw createError(404, `No user with id ${userId}`);
    if (!street || !district || !ward || !city)
        throw createError(400, 'Please input all the required address field!');
    const newAddress = {
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
export const changeBankingInfoService = async (userId, email, bankName, accountOwner, accountNumber) => {
    const user = await User.findOne({ _id: userId, email });
    if (!user)
        throw createError(404, `No user with id ${userId}`);
    if (!bankName || !accountOwner || !accountNumber)
        throw createError(400, 'Please input all the required banking field!');
    const newBankingInfo = {
        bankName,
        accountOwner,
        accountNumber,
    };
    user.bankingAccount = newBankingInfo;
    await user.save();
    return newBankingInfo;
};
export const followStoreService = async (userId, followedStoreId) => {
    const storeGotFollowedTo = await Store.findByIdAndUpdate({ _id: followedStoreId }, { $push: { followers: userId } }, { new: true });
    if (!storeGotFollowedTo)
        throw createError(500, 'Can not find store');
    const user = await User.findByIdAndUpdate({ _id: userId }, { $push: { follows: followedStoreId } }, { new: true });
    return user;
};
export const unfollowStoreService = async (userId, unfollowedStoreId) => {
    const storeGotUnfollowedTo = await Store.findByIdAndUpdate({ _id: unfollowedStoreId }, { $pull: { followers: userId } }, { new: true });
    if (!storeGotUnfollowedTo)
        throw createError(500, 'Can not find store');
    const user = await User.findByIdAndUpdate({ _id: userId }, { $pull: { follows: unfollowedStoreId } }, { new: true });
    return user;
};
export const favoriteProductService = async (userId, favoriteProductId) => {
    const productGotFavoriteTo = await Product.findByIdAndUpdate({ _id: favoriteProductId }, { $push: { peopleFavoriteThisProduct: userId } }, { new: true });
    if (!productGotFavoriteTo)
        throw createError(500, 'Can not find product');
    const user = await User.findByIdAndUpdate({ _id: userId }, { $push: { favorites: favoriteProductId } }, { new: true });
    return user;
};
export const unfavoriteProductService = async (userId, unfavoriteProductId) => {
    const productGotUnfavorite = await Product.findByIdAndUpdate({ _id: unfavoriteProductId }, { $pull: { peopleFavoriteThisProduct: userId } }, { new: true });
    if (!productGotUnfavorite)
        throw createError(500, 'Can not find product');
    const user = await User.findByIdAndUpdate({ _id: userId }, { $pull: { favorites: unfavoriteProductId } }, { new: true });
    return user;
};
export const getFavoriteListOfAUserService = async (userId) => {
    const favoriteList = await User.findOne({ _id: userId })
        .populate('favorites')
        .select('favorites -_id');
    if (!favoriteList)
        throw createError(500, 'Can not find favorite list');
    return favoriteList;
};
export const getFollowStoreService = async (userId) => {
    const followList = await User.findOne({ _id: userId })
        .populate('follows')
        .select('follows -_id');
    if (!followList)
        throw createError(500, 'Can not find follows list');
    return followList;
};
export const addToCartServices = async (userId, productId, quantityToAdd = 1) => {
    const user = await User.findById({ _id: userId }).populate({
        path: 'cart',
        populate: {
            path: 'content',
            populate: {
                path: 'productId',
                model: 'Product',
            },
        },
    });
    const productInDatabase = await Product.findById({
        _id: productId,
    });
    const sameProductInUserCartIndex = user.cart.content.findIndex((element) => element.productId._id == productId);
    if (sameProductInUserCartIndex == -1) {
        if (quantityToAdd > productInDatabase.numberInStock)
            throw createError(400, 'The number add to cart in higher than the number of products in stock');
        const productToAddToCart = {
            productId,
            quantity: quantityToAdd,
        };
        user.cart.content.push(productToAddToCart);
    }
    else {
        user.cart.content[sameProductInUserCartIndex].quantity += quantityToAdd;
        if (user.cart.content[sameProductInUserCartIndex].quantity >
            productInDatabase.numberInStock)
            throw createError(400, 'The number add to cart in higher than the number of products in stock');
    }
    user.cart.totalPrice = (parseInt(user.cart.totalPrice) +
        quantityToAdd * parseInt(productInDatabase.price)).toString();
    await user.save();
    return user;
};
export const removeFromCartServices = async (userId, productList) => {
    const user = await User.findById({ _id: userId }).populate({
        path: 'cart',
        populate: {
            path: 'content',
            populate: {
                path: 'productId',
                model: 'Product',
            },
        },
    });
    const result = await Promise.all(productList.map(async (product) => {
        const productInDatabase = await Product.findById({
            _id: product.productId,
        });
        const sameProductInUserCartIndex = user.cart.content.findIndex((element) => element.productId._id == product.productId);
        if (product.quantity <
            user.cart.content[sameProductInUserCartIndex].quantity)
            user.cart.content[sameProductInUserCartIndex].quantity -=
                product.quantity;
        else {
            product.quantity =
                user.cart.content[sameProductInUserCartIndex].quantity;
            user.cart.content.splice(sameProductInUserCartIndex, 1);
        }
        user.cart.totalPrice = (parseInt(user.cart.totalPrice) -
            product.quantity * parseInt(productInDatabase.price)).toString();
    }));
    await user.save();
    return user;
};
export const viewCartServices = async (userId) => {
    const cartList = await User.findById({ _id: userId })
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
    if (!cartList)
        throw createError(500, 'Can not find cart list');
    return cartList;
};
export const changePhoneNumberServices = async (userId, newPhoneNumber) => {
    const user = await User.findOne({ _id: userId });
    if (!user)
        throw createError(404, `No user with id ${userId}`);
    if (!newPhoneNumber)
        throw createError(400, 'Please provide correct phone number!');
    user.phoneNumber = newPhoneNumber;
    await user.save();
    return newPhoneNumber;
};
export const changeGenderServices = async (userId, newGender) => {
    const user = await User.findOne({ _id: userId });
    if (!user)
        throw createError(404, `No user with id ${userId}`);
    if (newGender === 'Male' || newGender === 'Female') {
        user.gender = newGender;
        await user.save();
        return newGender;
    }
    throw createError(400, 'Please provide correct gender!');
};
export const changeAvatarService = async (userId, newAvatarLink) => {
    const user = await User.findOne({ _id: userId });
    if (!user)
        throw createError(404, `No user with id ${userId}`);
    if (!newAvatarLink)
        throw createError(400, 'Please provide correct avatar image link!');
    user.avatar = newAvatarLink;
    await user.save();
    return newAvatarLink;
};
export const changeOnlineStatusService = async (userId, newOnlineStatus) => {
    const user = await User.findOne({ _id: userId });
    if (!user)
        throw createError(404, `No user with id ${userId}`);
    if (!newOnlineStatus)
        throw createError(400, 'Please provide online status!');
    user.onlineStatus = newOnlineStatus;
    await user.save();
    return newOnlineStatus;
};
export const requestOpenStoreService = async (userId, requestData) => {
    const duplicateStore = await Store.findOne({ ownerId: userId });
    if (duplicateStore)
        throw createError(400, 'This user already has store');
    const duplicateRequest = await StoreRequest.findOne({
        requesterId: userId,
        status: 'Pending',
    });
    if (duplicateRequest)
        throw createError(400, 'This user already sent request and currently waiting for approval');
    const user = await User.findById({ _id: userId });
    if (!user.phoneNumber)
        throw createError(400, 'The user must update its phone to be able to open store store');
    const newRequest = await StoreRequest.create(Object.assign(Object.assign({}, requestData), { requesterId: userId, phoneNumber: user.phoneNumber }));
    if (!newRequest)
        throw createError(500, 'Can not send store request!');
    return newRequest;
};
export const buyService = async (userId, productToBuy, ipAddress, isCod = false) => {
    if (productToBuy.length === 0)
        throw createError(400, 'No products in cart');
    const feeList = await calculateShippingFeeService(userId, productToBuy);
    const uploadFeeListToDatabase = await Shipping.create(Object.assign({}, feeList));
    if (!uploadFeeListToDatabase)
        throw createError(400, 'Something is wrong with database');
    if (isCod) {
        const orders = await createOrderCODServices(uploadFeeListToDatabase, userId);
        return orders;
    }
    const tmnCode = process.env.vnp_TmnCode;
    const secretKey = process.env.vnp_HashSecret;
    let vnpUrl = process.env.vnp_Url;
    const returnUrl = process.env.vnp_Returnurl;
    const date = new Date();
    const createDate = dateFormat(date, 'yyyymmddHHMMss');
    const orderId = dateFormat(date, 'HHmmss');
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
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(signData, 'utf-8').digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });
    return vnpUrl;
};
