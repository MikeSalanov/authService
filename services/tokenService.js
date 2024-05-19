const jwt = require("jsonwebtoken");
const { Token } = require('../db/models');

const generateTokens = (payload) => {
  console.log(process.env.JWT_ACCESS_SECRET, process.env.JWT_REFRESH_SECRET)
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "5m",
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "15m",
  });
  return { accessToken, refreshToken };
};

const validateAccessToken = (token) => {
  try {
    const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    return userData;
  } catch (error) {
    return null;
  }
};

const validateRefreshToken = (token) => {
  try {
    const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    return userData;
  } catch (error) {
    return null;
  }
};

const saveToken = async (userId, refreshToken) => {
  const tokenData = await Token.findOne({ where: { userId }, raw: true });
  if (tokenData) {
    await Token.update({ refreshToken }, { where: { userId } });
    return;
  }
  const token = await Token.create({ userId, refreshToken });
  return token;
};

const removeToken = async (refreshToken) => {
  await Token.destroy({ where: { refreshToken } });
};

const findToken = async (refreshToken) => {
  const tokenData = await Token.findOne({ where: { refreshToken } });
  return tokenData;
};

module.exports = {
  generateTokens,
  saveToken,
  removeToken,
  validateAccessToken,
  validateRefreshToken,
  findToken,
};
