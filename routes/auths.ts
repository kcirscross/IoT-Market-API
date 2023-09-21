import express from 'express';

import {
  signUp,
  signIn,
  googleAuth,
  logOut,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { passwordAuthentication } from '../middlewares/index.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/google', googleAuth);
router.post('/logout', logOut);
router.post('/forgotpassword', forgotPassword);

router.get(
  '/resetpassword/:passwordToken',
  passwordAuthentication,
  resetPassword
);

export const authRouter = router;
