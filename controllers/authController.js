// import User from '../models/User.js';
import { signUpService, signInService, googleLoginService, logoutService, forgotPasswordService, resetPasswordServices, } from '../services/authServices.js';
export const signUp = async (req, res, next) => {
    const { email, password, fullName, } = req.body;
    const { devicetokenfcm } = req.headers;
    try {
        const { token, newUser } = await signUpService(email, password, fullName, devicetokenfcm);
        return res.status(200).json({
            statusCode: 200,
            message: 'User created successfully',
            data: newUser,
            token,
        });
    }
    catch (err) {
        next(err);
    }
};
export const signIn = async (req, res, next) => {
    const { email, password } = req.body;
    const { devicetokenfcm } = req.headers;
    console.log(devicetokenfcm);
    try {
        const { token, userResult } = await signInService(email, password, devicetokenfcm);
        return res
            .cookie('access_token', token, {
            httpOnly: true,
        })
            .status(200)
            .json({
            statusCode: 200,
            message: 'User logined successfully',
            data: userResult,
            token,
        });
    }
    catch (err) {
        next(err);
    }
};
export const googleAuth = async (req, res, next) => {
    const { email, fullName } = req.body;
    const { devicetokenfcm } = req.headers;
    try {
        const { token, user } = await googleLoginService(email, fullName, devicetokenfcm);
        return res
            .cookie('access_token', token, {
            httpOnly: true,
        })
            .status(200)
            .json({
            statusCode: 200,
            message: 'User logined successfully',
            data: user,
            token,
        });
    }
    catch (err) {
        next(err);
    }
};
export const logOut = async (req, res, next) => {
    try {
        const result = await logoutService(req.body.email);
        if (result == true) {
            return res
                .cookie('access_token', 'none', {
                expires: new Date(Date.now() + 5 * 1000),
                httpOnly: true,
            })
                .status(200)
                .json({ success: true, message: 'User logged out successfully' });
        }
    }
    catch (err) {
        next(err);
    }
};
export const forgotPassword = async (req, res, next) => {
    try {
        const result = await forgotPasswordService(req.body.email);
        if (result == true)
            res
                .status(200)
                .json({ message: 'Sent password request to email successfully' });
    }
    catch (err) {
        next(err);
    }
};
export const resetPassword = async (req, res, next) => {
    const { reset: { userId, email }, params: { passwordToken }, } = req;
    try {
        const result = await resetPasswordServices(userId, email, passwordToken);
        if (result == true)
            res.status(200).json({
                message: 'Reseted password successfully. Email with new password has been sent to your email',
            });
    }
    catch (err) {
        next(err);
    }
};
