const jwt = require("jsonwebtoken");
const { Token } = require("../db/models");

const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "5m",
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30m",
  });
  return { accessToken, refreshToken };
};

const saveToken = async (userId, refreshToken) => {
  const tokenData = await Token.findOne({ where: { userId } });
  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    return tokenData.save();
  }
  const token = await Token.create({ userId, refreshToken });
  return token;
};

const removeToken = async (refreshToken) => {
  await Token.destroy({ where: { refreshToken } });
};

module.exports = { generateTokens, saveToken, removeToken };


