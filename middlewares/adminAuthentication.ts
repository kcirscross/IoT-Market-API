import jwt from 'jsonwebtoken';

import { createError } from '../errors/errors.js';

interface JwtPayLoad {
  userId: string;
  email: string;
  roles: string[];
  storeId?: string;
}

export const adminAuthentication = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw createError(401, 'Authentication invalid, require token');
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayLoad;
    req.user = {
      userId: payload.userId,
      email: payload.email,
      roles: payload.roles,
      storeId: payload.storeId,
    };
    if (payload.roles.includes('Admin')) next();
    else
      throw createError(
        401,
        'Authentication invalid at Bearer Token, you are not an Admin'
      );
  } catch (err) {
    throw createError(
      401,
      'Authentication invalid at Bearer Token. you are not an Admin'
    );
  }
};
