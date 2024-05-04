const router = require("express").Router();
const userService = require("../services/userService");

router.post("/signOut", async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const token = await userService.logout(refreshToken);
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Successfully log out" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
