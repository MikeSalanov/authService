const uuid = require("uuid");
const { User } = require("../db/models");
const tokenService = require("./tokenService");
const bcrypt = require("bcrypt");
const mailService = require("./mailService");
const UserDto = require("../dtos/user-dto");

const register = async (userName = undefined, email, password) => {
  const newUser = await User.findOne({ where: { email } });
  if (newUser) {
    throw new Error(
      `Пользователь c почтовым адресом ${email} уже зарегестрирован`
    );
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const activationLink = uuid.v4();
  const user = await User.create({
    userName,
    email,
    password: hashedPassword,
    activationLink,
  });
  // await mailService.sendActivationMail(
  //   email,
  //   ` ${process.env.API_URL}/api/activate/${activationLink}`
  // );

  const userDto = new UserDto(user); // id, email, isActivated

  const tokens = tokenService.generateTokens({ ...userDto });
  await tokenService.saveToken(userDto.id, tokens.refreshToken);

  return { ...tokens, user: userDto };
};

const activate = async (activationLink) => {
  const user = await User.findOne({ where: { activationLink } });
  if (!user) {
    throw new Error("Неккоретная сслыка активации");
  }
  user.isActivated = true;
  await user.save();
};

const login = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw Error("Пользователь с таким email не найден");
  }
  const isSamePass = await bcrypt.compare(password, user.password);
  if (!isSamePass) {
    throw Error("Неверный пароль");
  }
  const userDto = new UserDto(user);
  const tokens = tokenService.generateTokens({ ...userDto });
  await tokenService.saveToken(userDto.id, tokens.refreshToken);
  return { ...tokens, user: userDto };
};

module.exports = { register, activate, login };
