const { validationResult } = require("express-validator");
const router = require("express").Router();

const uuid = require("uuid");

const userService = require("../services/userService");
const userDto = require("../services/userService");

router.post("/signUp", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userData = await userService.register(email, password);
    return res.status(201).json({ message: "User is successfully created" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
