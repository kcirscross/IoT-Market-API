import {
  sendNotificationToOneDeviceService,
  setReadService,
  viewAllUserNotificationService,
} from '../services/notiServices.js';

export const sendNotificationToOneDevice = async (req, res, next) => {
  const { userId } = req.body;

  const messageData = {
    notification: {
      title: 'Store Request Approved',
      body: `Your store request has been approved. Start doing your bussiness now!`,
    },
    data: {
      route: 'Store',
    },
  };

  try {
    const result = await sendNotificationToOneDeviceService(
      messageData,
      userId
    );
    if (result)
      res
        .status(200)
        .json({ message: 'Send notification successfully', result });
  } catch (err) {
    next(err);
  }
};

export const viewAllUserNotification = async (req, res, next) => {
  const { userId } = req.user;

  try {
    const notifications = await viewAllUserNotificationService(userId);
    if (notifications)
      res
        .status(200)
        .json({ message: 'Get notification successfully', notifications });
  } catch (err) {
    next(err);
  }
};

export const setRead = async (req, res, next) => {
  const { notificationId } = req.params;
  try {
    const notifications = await setReadService(notificationId);
    if (notifications)
      res.status(200).json({ message: 'Set read successfully' });
  } catch (err) {
    next(err);
  }
};
