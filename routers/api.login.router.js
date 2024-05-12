const userService = require("../services/userService");

const router = require("express").Router();

router.post('/signIn', async (req, res, next) => {
  try {
    const { email, password } = req.body
    const userData = await userService.login(email, password);

    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
    });
    return res.json(userData);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
