const router = require("express").Router();
const { User } = require("../db/models");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await User.findOne({ where: { email } });
    if (newUser) {
      res.status(403).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword});
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
