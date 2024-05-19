const userService = require('../services/userService');
const tokenService = require('../services/tokenService');
const router = require('express').Router();
const ApiError = require('../exceptions/api-error');
router.delete('/user', async (req, res) => {
  try {
    const accessToken = req.headers.authorization.split(' ')[1];
    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    const { user_id } = userData;
    const userDeleteData = await userService.deleteUser(user_id);
    return res.json(userDeleteData);
  } catch (error) {
    console.log(error);
  }
});

router.patch('/user', async (req, res, next) => {
  try {
    const { newPassword, oldPassword } = req.body;
    const accessToken = req.headers.authorization.split(' ')[1];
    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }
    const { user_id } = userData;

    const changePasswordData = await userService.changePasswordUser({
      user_id,
      oldPassword,
      newPassword,
    });

    res.json(changePasswordData);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
