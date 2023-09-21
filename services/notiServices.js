import { createError } from '../errors/errors.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import firebaseAdmin from '../utils/firebase.js';
export const sendNotificationToOneDeviceService = async (messageData, userId) => {
    const user = await User.findById(userId);
    const message = Object.assign(Object.assign({}, messageData), { token: user.deviceTokenFCM });
    const result = await firebaseAdmin.messaging().send(message);
    await Notification.create({
        toUserId: userId,
        deviceTokenFCM: user.deviceTokenFCM,
        title: messageData.notification.title,
        body: messageData.notification.body,
        route: messageData.data.route,
    });
    return result;
};
export const viewAllUserNotificationService = async (userId) => {
    const notifications = await Notification.find({
        toUserId: userId,
    }).sort({
        createdAt: -1,
    });
    return notifications;
};
export const setReadService = async (notificationId) => {
    const notification = await Notification.findOneAndUpdate({ _id: notificationId }, { isRead: true }, { runValidators: true, new: true });
    if (!notification.isRead)
        throw createError(400, 'Can not update notification on database');
    return notification;
};
