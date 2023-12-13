import dontenv from 'dotenv';
import bcrypt from 'bcryptjs';
import sgMail from '@sendgrid/mail';

import User, { IUser } from '../models/User.js';

import { createError } from '../errors/errors.js';

dontenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const signUpService = async (
  email: string,
  password: string,
  fullName: string,
  deviceTokenFCM: string
): Promise<{ token: string; newUser: IUser }> => {
  if (!email || !password || !fullName) {
    throw createError(400, 'Please provide email, password and full name');
  }

  const salt: string = bcrypt.genSaltSync(10);
  const hashedPassword: string = bcrypt.hashSync(password, salt);

  const newUser: IUser = await User.create({
    email,
    password: hashedPassword,
    fullName,
    deviceTokenFCM,
  });
  if (!newUser)
    throw createError(
      500,
      'Something went wrong with server, can not sign up now, please try again'
    );

  const token: string = await newUser.createJWT();
  newUser.password = undefined;

  return { token, newUser };
};

export const signInService = async (
  email: string,
  password: string,
  deviceTokenFCM: string
): Promise<{ token: string; userResult: IUser }> => {
  if (!email || !password)
    throw createError(400, 'Please provide email and password');

  const userResult: IUser = await User.findOneAndUpdate(
    { email },
    { deviceTokenFCM },
    { runValidators: true, new: true }
  );
  if (!userResult) throw createError(404, 'User not found');

  if (userResult.accountStatus == 'BAN')
    throw createError(403, 'Users has been banned');

  const isPasswordMatched: boolean = await userResult.comparePassword(password);
  if (!isPasswordMatched) throw createError(401, 'Password is incorrect');

  const token: string = await userResult.createJWT();
  userResult.password = undefined;
  return { token, userResult };
};

export const googleLoginService = async (
  email: string,
  fullName: string,
  deviceTokenFCM: string
): Promise<{ token: string; user: IUser }> => {
  if (!email || !fullName)
    throw createError(400, 'Please provide email and fullName');

  const user: IUser = await User.findOneAndUpdate(
    { email },
    { deviceTokenFCM },
    { runValidators: true, new: true }
  );

  if (user) {
    const token: string = await user.createJWT();
    user.password = undefined;
    return { token, user };
  } else {
    const user: IUser = await User.create({
      email,
      fullName,
      fromGoogle: true,
    });
    const token: string = await user.createJWT();
    user.password = undefined;
    return { token, user };
  }
};

export const logoutService = async (email: string): Promise<boolean> => {
  if (!email) throw createError(400, 'Please provide email');

  const user: IUser = await User.findOne({ email });

  if (user) {
    await user.logout();
    return true;
  }
  throw createError(404, 'User not found');
};

export const forgotPasswordService = async (
  email: string
): Promise<boolean> => {
  if (!email) throw createError(400, 'Please provide email');

  const user: IUser = await User.findOne({ email });
  if (!user)
    throw createError(
      401,
      `The email address ${email} you entered is not connected to an account`
    );

  const forgotPasswordToken: string = user.createPasswordToken();

  const msg = {
    to: email,
    from: 'hungofhydra@gmail.com',
    subject: 'Reset Password Email',
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><a href="http://192.168.1.202:3000/api/v1/auth/resetpassword/${forgotPasswordToken}">Reset Password</a></body></html>`,
  } as undefined;

  try {
    await sgMail.send(msg);
    return true;
  } catch (error) {
    throw createError(500, error.message);
  }
};

export const resetPasswordServices = async (
  userId: string,
  email: string,
  passwordToken: string
): Promise<boolean> => {
  if (passwordToken === '') {
    createError(401, 'Link had expired');
  }

  const newPassword: string = (Math.random() + 1).toString(36).substring(2);

  const salt: string = await bcrypt.genSalt(10);
  const hashedPassword: string = await bcrypt.hash(newPassword, salt);

  const user: IUser = await User.findOneAndUpdate(
    { _id: userId, email },
    { password: hashedPassword },
    { new: true, runValidators: true }
  );
  if (!user) createError(404, `No user with id ${userId}`);

  const msg = {
    to: email,
    from: 'hungofhydra@gmail.com',
    subject: 'New Password',
    html: `Your new password is: ${newPassword}`,
  } as undefined;

  try {
    await sgMail.send(msg);
    return true;
  } catch (error) {
    throw createError(500, error.message);
  }
};
