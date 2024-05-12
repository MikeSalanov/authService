const router = require("express").Router();
const userService = require("../services/userService");
const { produceMessageOfRequestRegistration } = require('../services/rabbitService');

router.post('/signUp', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { confirmationCode } = await userService.register(email, password);
    await produceMessageOfRequestRegistration(email, confirmationCode);
    return res.status(201).json({ message: "User has been successfully created" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
