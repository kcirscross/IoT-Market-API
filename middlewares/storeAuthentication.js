export const storeAuthentication = async (req, res, next) => {
    const { storeId, roles } = req.user;
    if (roles.includes('Store')) {
        req.user.userId = storeId;
        next();
    }
    else {
        next();
    }
};
