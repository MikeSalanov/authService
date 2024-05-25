const ApiError = require('../exceptions/api-error');
const tokenService = require('../services/tokenService');

module.exports = function (req, res, next) {
  try {
    const accessToken = req.headers.authorization.split(' ')[1];
    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }
    if (userData.email !== 'admin@admin') {
      return next(ApiError.ForbiddenError());
    }
    next();
  } catch (e) {
    next(e);
  }
};
