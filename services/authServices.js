import dontenv from 'dotenv';
import bcrypt from 'bcryptjs';
import sgMail from '@sendgrid/mail';
import User from '../models/User.js';
import { createError } from '../errors/errors.js';
dontenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
export const signUpService = async (email, password, fullName, deviceTokenFCM) => {
    if (!email || !password || !fullName) {
        throw createError(400, 'Please provide email, password and full name');
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = await User.create({
        email,
        password: hashedPassword,
        fullName,
        deviceTokenFCM,
    });
    if (!newUser)
        throw createError(500, 'Something went wrong with server, can not sign up now, please try again');
    const token = await newUser.createJWT();
    newUser.password = undefined;
    return { token, newUser };
};
export const signInService = async (email, password, deviceTokenFCM) => {
    if (!email || !password)
        throw createError(400, 'Please provide email and password');
    const userResult = await User.findOneAndUpdate({ email }, { deviceTokenFCM }, { runValidators: true, new: true });
    if (!userResult)
        throw createError(404, 'User not found');
    if (userResult.accountStatus == 'BAN')
        throw createError(403, 'Users has been banned');
    const isPasswordMatched = await userResult.comparePassword(password);
    if (!isPasswordMatched)
        throw createError(401, 'Password is incorrect');
    const token = await userResult.createJWT();
    userResult.password = undefined;
    return { token, userResult };
};
export const googleLoginService = async (email, fullName, deviceTokenFCM) => {
    if (!email || !fullName)
        throw createError(400, 'Please provide email and fullName');
    const user = await User.findOneAndUpdate({ email }, { deviceTokenFCM }, { runValidators: true, new: true });
    if (user) {
        const token = await user.createJWT();
        user.password = undefined;
        return { token, user };
    }
    else {
        const user = await User.create({
            email,
            fullName,
            fromGoogle: true,
        });
        const token = await user.createJWT();
        user.password = undefined;
        return { token, user };
    }
};
export const logoutService = async (email) => {
    if (!email)
        throw createError(400, 'Please provide email');
    const user = await User.findOne({ email });
    if (user) {
        await user.logout();
        return true;
    }
    throw createError(404, 'User not found');
};
export const forgotPasswordService = async (email) => {
    if (!email)
        throw createError(400, 'Please provide email');
    const user = await User.findOne({ email });
    if (!user)
        throw createError(401, `The email address ${email} you entered is not connected to an account`);
    const forgotPasswordToken = user.createPasswordToken();
    const msg = {
        to: email,
        from: 'tnadung.19it3@vku.udn.vn',
        subject: 'Reset Password Email',
        html: `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><a href="http://192.168.1.202:3000/api/v1/auth/resetpassword/${forgotPasswordToken}">Reset Password</a></body></html>`,
    };
    try {
        await sgMail.send(msg);
        return true;
    }
    catch (error) {
        throw createError(500, error.message);
    }
};
export const resetPasswordServices = async (userId, email, passwordToken) => {
    if (passwordToken === '') {
        createError(401, 'Link had expired');
    }
    const newPassword = (Math.random() + 1).toString(36).substring(2);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    const user = await User.findOneAndUpdate({ _id: userId, email }, { password: hashedPassword }, { new: true, runValidators: true });
    if (!user)
        createError(404, `No user with id ${userId}`);
    const msg = {
        to: email,
        from: 'tnadung.19it3@vku.udn.vn',
        subject: 'New Password',
        html: `Your new password is: ${newPassword}`,
    };
    try {
        await sgMail.send(msg);
        return true;
    }
    catch (error) {
        throw createError(500, error.message);
    }
};
