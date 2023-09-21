import { createError } from '../errors/errors.js';
import User from '../models/User.js';
import Notification, { INotification } from '../models/Notification.js';
import firebaseAdmin from '../utils/firebase.js';

export const sendNotificationToOneDeviceService = async (
  messageData,
  userId: string
) => {
  const user = await User.findById(userId);
  const message = { ...messageData, token: user.deviceTokenFCM };
  const result: string = await firebaseAdmin.messaging().send(message);

  await Notification.create({
    toUserId: userId,
    deviceTokenFCM: user.deviceTokenFCM,
    title: messageData.notification.title,
    body: messageData.notification.body,
    route: messageData.data.route,
  });

  return result;
};

export const viewAllUserNotificationService = async (userId: string) => {
  const notifications: INotification[] = await Notification.find({
    toUserId: userId,
  }).sort({
    createdAt: -1,
  });
  return notifications;
};

export const setReadService = async (notificationId: string) => {
  const notification: INotification = await Notification.findOneAndUpdate(
    { _id: notificationId },
    { isRead: true },
    { runValidators: true, new: true }
  );
  if (!notification.isRead)
    throw createError(400, 'Can not update notification on database');
  return notification;
};
