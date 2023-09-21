import express from 'express';

import {
  addToCart,
  buy,
  changeAddress,
  changeAvatar,
  changeBankingInfo,
  changeGender,
  changeOnlineStatus,
  changePassword,
  changePhoneNumber,
  favoriteProduct,
  followStore,
  getAllUser,
  getFavoriteListOfAUser,
  getFollowStore,
  getUserInfo,
  requestOpenStore,
  revomeFromCart,
  unfavoriteProduct,
  unfollowStore,
  viewCart,
} from '../controllers/userController.js';
import {
  adminAuthentication,
  userAuthentication,
} from '../middlewares/index.js';

const router = express.Router();

router.get('/favorite', userAuthentication, getFavoriteListOfAUser);
router.get('/follow', userAuthentication, getFollowStore);
router.get('/cart', userAuthentication, viewCart);
router.get('/:userId', getUserInfo);
router.post('/storerequest', userAuthentication, requestOpenStore);
router.patch('/changepassword', userAuthentication, changePassword);
router.patch('/changeaddress', userAuthentication, changeAddress);
router.patch('/changebanking', userAuthentication, changeBankingInfo);
router.patch('/changephone', userAuthentication, changePhoneNumber);
router.patch('/changegender', userAuthentication, changeGender);
router.patch('/changeavatar', userAuthentication, changeAvatar);
router.patch('/changeonlinestatus', userAuthentication, changeOnlineStatus);
router.patch('/follow/:followedStoreId', userAuthentication, followStore);
router.patch('/unfollow/:unfollowedStoreId', userAuthentication, unfollowStore);
router.patch(
  '/favorite/:favoriteProductId',
  userAuthentication,
  favoriteProduct
);
router.patch(
  '/unfavorite/:unfavoriteProductId',
  userAuthentication,
  unfavoriteProduct
);
router.patch('/addcart', userAuthentication, addToCart);
router.patch('/removecart', userAuthentication, revomeFromCart);
router.post('/buy', userAuthentication, buy);
router.get('/', adminAuthentication, getAllUser);
export const userRouter = router;
