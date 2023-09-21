import jwt from 'jsonwebtoken';

import { createError } from '../errors/errors.js';

interface JwtPayLoad {
  userId: string;
  email: string;
}

export const passwordAuthentication = async (req, res, next) => {
  const {
    params: { passwordToken },
  } = req;

  if (!passwordToken)
    throw createError(
      401,
      'Authentication invalid, need password Token in params'
    );
  try {
    const payload = jwt.verify(
      passwordToken,
      process.env.JWT_SECRET
    ) as JwtPayLoad;
    req.reset = { userId: payload.userId, email: payload.email };
    next();
  } catch (err) {
    throw createError(401, 'Authentication invalid, unexpected error.');
  }
};
