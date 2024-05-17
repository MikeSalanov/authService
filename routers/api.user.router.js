const userService = require('../services/userService');
const tokenService = require('../services/tokenService');
const router = require('express').Router();

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

module.exports = router;
