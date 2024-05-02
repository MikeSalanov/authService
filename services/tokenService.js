const jwt = require("jsonwebtoken");
const { Token } = require("../db/models");

const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "30m",
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });
  return { accessToken, refreshToken };
};

const saveToken = async (userId, refreshToken) => {
  try {
    const tokenData = await Token.findOne({ userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await Token.create({ userId, refreshToken });
    return token;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { generateTokens, saveToken};


//{"userName": "Mansur", "password":"111", "email": "m@m"}