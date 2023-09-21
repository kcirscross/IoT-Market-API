import express from 'express';

import {
  sendNotificationToOneDevice,
  setRead,
  viewAllUserNotification,
} from '../controllers/notiController.js';
import { userAuthentication } from '../middlewares/index.js';

const router = express.Router();
router.post('/', sendNotificationToOneDevice);
router.get('/', userAuthentication, viewAllUserNotification);
router.post('/:notificationId', setRead);
export const notiRouter = router;
