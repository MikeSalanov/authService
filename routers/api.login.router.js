// const { validationResult } = require("express-validator");
const userService = require("../services/userService");

// const {
//   validateAuthMiddleware,
// } = require("../middlewares/validateAuth.middleware");
// const { User } = require("../db/models");

const router = require("express").Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await userService.login(email, password);

    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.json(userData);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
