const router = require("express").Router();
const userService = require("../services/userService");

const activate = async (req, res) => {
  try {
    const activationLink = req.params.link;
    await userService.activate(activationLink);
    return res.redirect(process.env.CLIENT_URL)
  } catch (error) {
    console.log(error);
  }
};
