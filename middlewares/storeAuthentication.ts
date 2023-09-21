interface JwtPayLoad {
  userId: string;
  email: string;
  roles: string[];
  storeId?: string;
}

export const storeAuthentication = async (req, res, next) => {
  const { storeId, roles }: JwtPayLoad = req.user;
  if (roles.includes('Store')) {
    req.user.userId = storeId;
    next();
  } else {
    next();
  }
};
