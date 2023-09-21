import { createError } from '../errors/errors.js';
import { IStore } from '../models/Store.js';
import StoreRequest, { IStoreRequest } from '../models/StoreRequest.js';
import User, { IUser } from '../models/User.js';
import { sendNotificationToOneDeviceService } from './notiServices.js';
import { createStoreServices } from './storeServices.js';

// import User from "../models/User.js";

export const declineStoreRequestServices = async (
  storeRequestId: string,
  reasonForReject: string
): Promise<IStoreRequest> => {
  if (!reasonForReject)
    throw createError(
      400,
      'Please provide for user your reason for declining this request'
    );

  const storeRequest = await StoreRequest.findOne({
    _id: storeRequestId,
    status: 'Pending',
  });
  if (!storeRequest)
    throw createError(
      404,
      `No store request with id ${storeRequestId} or the request has already been approved/decline`
    );

  storeRequest.status = 'Rejected';
  storeRequest.reasonForReject = reasonForReject;
  await storeRequest.save();

  const messageData = {
    notification: {
      title: 'Store Request Declined',
      body: `Your store request has been declined\nThe reason is that ${reasonForReject}`,
    },
    data: {
      route: 'Store',
    },
  };
  await sendNotificationToOneDeviceService(
    messageData,
    storeRequest.requesterId.toString()
  );

  return storeRequest;
};

export const approveStoreRequestServices = async (
  storeRequestId: string
): Promise<IStore> => {
  const storeRequest = await StoreRequest.findOne({
    _id: storeRequestId,
    status: 'Pending',
  });
  if (!storeRequest)
    throw createError(
      404,
      `No store request with id ${storeRequestId} or the request has already been approved/decline`
    );
  storeRequest.status = 'Approved';
  await storeRequest.save();

  const {
    requesterId: ownerId,
    displayName,
    description,
    shopImage,
    address,
    phoneNumber,
  } = storeRequest;

  const newStore = await createStoreServices({
    ownerId,
    displayName,
    description,
    shopImage,
    address,
    phoneNumber,
    status: 'Active',
  });

  const messageData = {
    notification: {
      title: 'Store Request Approved',
      body: `Your store request has been approved. Start doing your bussiness now!`,
    },
    data: {
      route: 'Store',
    },
  };

  await sendNotificationToOneDeviceService(
    messageData,
    storeRequest.requesterId.toString()
  );
  return newStore;
};

export const getAllRequestServices = async () => {
  const requests: IStoreRequest[] = await StoreRequest.find()
    .populate('requesterId')
    .sort({
      createdAt: -1,
    });
  return requests;
};

export const getRequestDetailServices = async (requestId) => {
  const request: IStoreRequest = await StoreRequest.findById(
    requestId
  ).populate('requesterId');

  if (!request)
    throw createError(404, 'There is no request with this id in database');
  return request;
};

export const banUserServices = async (userId: string): Promise<IUser> => {
  const userToBan: IUser = await User.findOne({
    _id: userId,
    accountStatus: 'Active',
  });

  if (!userToBan)
    throw createError(
      404,
      `No user with id ${userId} or the user has already been banned`
    );
  userToBan.accountStatus = 'BAN';
  await userToBan.save();

  return userToBan;
};

export const unbanUserServices = async (userId: string): Promise<IUser> => {
  const userToUnban: IUser = await User.findOne({
    _id: userId,
    accountStatus: 'BAN',
  });

  if (!userToUnban)
    throw createError(404, `No user with id ${userId} or the user is active`);
  userToUnban.accountStatus = 'Active';
  await userToUnban.save();

  return userToUnban;
};
