const { User } = require("../db/models");
const tokenService = require("./tokenService");
const bcrypt = require("bcrypt");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");
const crypto = require('crypto');

const register = async (email, password) => {
  const newUser = await User.findOne({ where: { email } });
  if (newUser) {
    throw ApiError.BadRequest(
      `Пользователь c почтовым адресом ${email} уже зарегистрирован`
    );
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    id: crypto.randomUUID(),
    password: hashedPassword,
  }, {
    raw: true
  });
  return user.dataValues;
};

const login = async (email, password) => {
  const user = await User.findOne({ where: { email }, raw: true });
  if (!user) {
    throw ApiError.BadRequest("Пользователь с таким email не найден");
  }
  const isSamePass = await bcrypt.compare(password, user.password);
  if (!isSamePass) {
    throw ApiError.BadRequest("Неверный пароль");
  }
  const userDto = new UserDto(user);
  const tokens = tokenService.generateTokens({ ...userDto });
  await tokenService.saveToken(userDto.user_id, tokens.refreshToken);
  return { ...tokens, user: userDto };
};

const logout = async (refreshToken) => {
  await tokenService.removeToken(refreshToken);
};

const refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw ApiError.UnauthorizedError();
  }
  const userData = tokenService.validateRefreshToken(refreshToken);
  const tokenFromDB = await tokenService.findToken(refreshToken);
  if (!userData || !tokenFromDB) {
    throw ApiError.UnauthorizedError();
  }
  const user = await User.findByPk(userData.id);
  const userDto = new UserDto(user);
  const tokens = tokenService.generateTokens({ ...userDto });
  await tokenService.saveToken(userDto.id, tokens.refreshToken);
  return { ...tokens, user: userDto };
};

const toGetUserInfo = async (email) => {
  const user = await User.findOne({
    where: email
  }, {
    raw: true
  });
  if (!user) throw new ApiError.BadRequest('User not found');
  console.log(user);
  return user;
}

module.exports = { register, login, logout, refresh, toGetUserInfo,  };
