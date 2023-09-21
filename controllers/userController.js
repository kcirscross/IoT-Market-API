import { addToCartServices, buyService, changeAddressService, changeAvatarService, changeBankingInfoService, changeGenderServices, changeOnlineStatusService, changePasswordService, changePhoneNumberServices, favoriteProductService, followStoreService, getAllUserServices, getFavoriteListOfAUserService, getFollowStoreService, getUserInfoServices, removeFromCartServices, requestOpenStoreService, unfavoriteProductService, unfollowStoreService, viewCartServices, } from '../services/userServices.js';
export const getAllUser = async (req, res, next) => {
    try {
        const users = await getAllUserServices();
        if (users)
            res.status(200).json({ users });
    }
    catch (err) {
        next(err);
    }
};
export const getUserInfo = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const result = await getUserInfoServices(userId);
        if (result)
            res
                .status(200)
                .json({ message: 'Get user info successfully', userInfo: result });
    }
    catch (err) {
        next(err);
    }
};
export const changePassword = async (req, res, next) => {
    const { userId, email } = req.user;
    const { currentPassword, newPassword, } = req.body;
    try {
        const result = await changePasswordService(userId, email, currentPassword, newPassword);
        if (result)
            res.status(200).json({ message: 'Changed password successfully' });
    }
    catch (err) {
        next(err);
    }
};
export const changeAddress = async (req, res, next) => {
    const { userId, email } = req.user;
    const { street, district, ward, city, } = req.body;
    try {
        const newAddress = await changeAddressService(userId, email, street, district, ward, city);
        if (newAddress)
            res
                .status(200)
                .json({ message: 'Changed address successfully', newAddress });
    }
    catch (err) {
        next(err);
    }
};
export const changeBankingInfo = async (req, res, next) => {
    const { userId, email } = req.user;
    const { bankName, accountOwner, accountNumber, } = req.body;
    try {
        const newBankingInfo = await changeBankingInfoService(userId, email, bankName, accountOwner, accountNumber);
        if (newBankingInfo)
            res
                .status(200)
                .json({ message: 'Changed banking info successfully', newBankingInfo });
    }
    catch (err) {
        next(err);
    }
};
export const followStore = async (req, res, next) => {
    const { userId } = req.user;
    const { followedStoreId } = req.params;
    try {
        const result = await followStoreService(userId, followedStoreId);
        if (result)
            res.status(200).json({ message: 'Followed store successfully' });
    }
    catch (err) {
        next(err);
    }
};
export const unfollowStore = async (req, res, next) => {
    const { userId } = req.user;
    const { unfollowedStoreId } = req.params;
    try {
        const result = await unfollowStoreService(userId, unfollowedStoreId);
        if (result)
            res.status(200).json({ message: 'Unfollowed store successfully' });
    }
    catch (err) {
        next(err);
    }
};
export const favoriteProduct = async (req, res, next) => {
    const { userId } = req.user;
    const { favoriteProductId } = req.params;
    try {
        const result = await favoriteProductService(userId, favoriteProductId);
        if (result)
            res.status(200).json({ message: 'Add product to favorite successfully' });
    }
    catch (err) {
        next(err);
    }
};
export const unfavoriteProduct = async (req, res, next) => {
    const { userId } = req.user;
    const { unfavoriteProductId } = req.params;
    try {
        const result = await unfavoriteProductService(userId, unfavoriteProductId);
        if (result)
            res
                .status(200)
                .json({ message: 'Remove product from favorite successfully' });
    }
    catch (err) {
        next(err);
    }
};
export const getFavoriteListOfAUser = async (req, res, next) => {
    const { userId } = req.user;
    try {
        const result = await getFavoriteListOfAUserService(userId);
        if (result)
            res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
};
export const getFollowStore = async (req, res, next) => {
    const { userId } = req.user;
    try {
        const result = await getFollowStoreService(userId);
        if (result)
            res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
};
export const addToCart = async (req, res, next) => {
    const { userId } = req.user;
    const { productId, quantity } = req.body;
    try {
        const result = await addToCartServices(userId, productId, quantity);
        if (result)
            res.status(200).json({
                message: 'Add product to cart successfully',
            });
    }
    catch (err) {
        next(err);
    }
};
export const revomeFromCart = async (req, res, next) => {
    const { userId } = req.user;
    const productList = req.body;
    try {
        const result = await removeFromCartServices(userId, productList);
        if (result)
            res.status(200).json({
                message: 'Remove product from cart successfully',
            });
    }
    catch (err) {
        next(err);
    }
};
export const viewCart = async (req, res, next) => {
    const { userId } = req.user;
    try {
        const result = await viewCartServices(userId);
        if (result)
            res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
};
export const changePhoneNumber = async (req, res, next) => {
    const { userId } = req.user;
    const { phoneNumber } = req.body;
    try {
        const newPhoneNumber = await changePhoneNumberServices(userId, phoneNumber);
        if (newPhoneNumber)
            res
                .status(200)
                .json({ message: 'Changed phone number successfully', newPhoneNumber });
    }
    catch (err) {
        next(err);
    }
};
export const changeGender = async (req, res, next) => {
    const { userId } = req.user;
    const { gender } = req.body;
    try {
        const newGender = await changeGenderServices(userId, gender);
        if (newGender)
            res
                .status(200)
                .json({ message: 'Changed gender successfully', newGender });
    }
    catch (err) {
        next(err);
    }
};
export const changeAvatar = async (req, res, next) => {
    const { userId } = req.user;
    const { avatarLink } = req.body;
    try {
        const newAvatarLink = await changeAvatarService(userId, avatarLink);
        if (newAvatarLink)
            res
                .status(200)
                .json({ message: 'Changed avatar successfully', newAvatarLink });
    }
    catch (err) {
        next(err);
    }
};
export const changeOnlineStatus = async (req, res, next) => {
    const { userId } = req.user;
    const { status } = req.body;
    try {
        const newOnlineStatus = await changeOnlineStatusService(userId, status);
        if (newOnlineStatus)
            res
                .status(200)
                .json({ message: 'Changed status successfully', newOnlineStatus });
    }
    catch (err) {
        next(err);
    }
};
export const requestOpenStore = async (req, res, next) => {
    const { userId } = req.user;
    const requestData = req.body;
    try {
        const newRequest = await requestOpenStoreService(userId, requestData);
        if (newRequest)
            res
                .status(200)
                .json({ message: 'Send request successfully', newRequest });
    }
    catch (err) {
        next(err);
    }
};
export const buy = async (req, res, next) => {
    const { userId } = req.user;
    const { isCodQuery } = req.query;
    const productToBuy = req.body;
    let ipAddress = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    if (ipAddress === '::1')
        ipAddress = '127.0.0.1';
    try {
        let isCod;
        if (isCodQuery === 'true')
            isCod = true;
        else
            isCod = false;
        const vnpUrl = await buyService(userId, productToBuy, ipAddress, isCod);
        if (vnpUrl)
            res
                .status(200)
                .json({ message: 'Send payment request successfully', vnpUrl });
    }
    catch (err) {
        next(err);
    }
};
