const router = require("express").Router();
const userService = require("../services/userService");
const { produceMessageOfRequestRegistration } = require('../services/rabbitService');

router.post("/signUp", async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) return res.status(400).json({
      message: 'Password does not match to confirmPassword'
    });
    await userService.register(email, password);
    await produceMessageOfRequestRegistration(email);
    return res.status(201).json({ message: "User has been successfully created" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
