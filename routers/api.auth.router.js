const { validationResult } = require("express-validator");
const router = require("express").Router();
const validateRegisterMiddleware = require("../middlewares/validateRegister.middleware");
// const mailService = require (...)
const uuid = require("uuid");

const userService = require("../services/userService");
// const refreshtoken = require("../db/models/refreshtoken");
const userDto = require("../services/userService");

router.post("/signUp", validateRegisterMiddleware, async (req, res) => {
  try {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      switch (validationErrors.array()[0].msg) {
        case "Password doesn't match with confirm_password field":
          return res
            .status(400)
            .json({ message: validationErrors.array()[0].msg });
        default:
          return res.status(400).json({ message: "Invalid request" });
      }
    }

    const {email, password } = req.body;

    const userData = await userService.register(email, password);

    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res
      .status(201)
      .json(userData);
  } catch (error) {
    console.log(error);
  }



});


module.exports = router;
