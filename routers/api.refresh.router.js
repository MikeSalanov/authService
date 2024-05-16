const router = require("express").Router();
const userService = require("../services/userService");

router.get("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const userData = await userService.refresh(refreshToken);
    console.log('USER_DATA:',userData);

    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.json(userData);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
