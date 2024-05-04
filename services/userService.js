const { User } = require("../db/models");
const tokenService = require("./tokenService");
const bcrypt = require("bcrypt");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");

const register = async (email, password) => {
  const newUser = await User.findOne({ where: { email } });
  if (newUser) {
    throw ApiError.BadRequest(
      `Пользователь c почтовым адресом ${email} уже зарегестрирован`
    );
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
  });

  // const userDto = new UserDto(user); // id, email, regIsConfirmed

  // const tokens = tokenService.generateTokens({ ...userDto });
  // await tokenService.saveToken(userDto.id, tokens.refreshToken);

  // return { ...tokens, user: userDto };
};

const login = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw ApiError.BadRequest("Пользователь с таким email не найден");
  }
  const isSamePass = await bcrypt.compare(password, user.password);
  if (!isSamePass) {
    throw ApiError.BadRequest("Неверный пароль");
  }
  const userDto = new UserDto(user);
  const tokens = tokenService.generateTokens({ ...userDto });
  await tokenService.saveToken(userDto.id, tokens.refreshToken);
  return { ...tokens, user: userDto };
};

const logout = async (refreshToken) => {
  await tokenService.removeToken(refreshToken);
};

module.exports = { register, login, logout };
