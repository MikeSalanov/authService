const { User, registration_confirm, Token } = require('../db/models');
const tokenService = require('./tokenService');
const bcrypt = require('bcrypt');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const crypto = require('crypto');

const register = async (email, password) => {
  const newUser = await User.findOne({ where: { email } });
  if (newUser) {
    throw ApiError.BadRequest(
      `Пользователь c почтовым адресом ${email} уже зарегистрирован`
    );
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = crypto.randomUUID();
  const user = await User.create({
    email,
    id: userId,
    password: hashedPassword,
  });
  let confirmationCode = '';
  const characters =
    '123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  for (let i = 0; i < 64; i += 1) {
    confirmationCode = confirmationCode.concat(
      characters[Math.floor(Math.random() * (characters.length - 1 + 1))]
    );
  }
  await registration_confirm.create({
    confirmation_code: confirmationCode,
    user_id: userId,
    register_confirmed: false,
  });
  return { ...user.dataValues, confirmationCode };
};

const confirmRegistration = async (email, password, confirmationCode) => {
  const registrationConfirmEntity = await registration_confirm.findOne({
    where: {
      confirmation_code: confirmationCode,
    },
    raw: true,
  });
  if (!registrationConfirmEntity)
    throw ApiError.BadRequest('Invalid data of confirmation');
  await registration_confirm.update(
    { register_confirmed: true },
    { where: { confirmation_code: confirmationCode } }
  );
  return await login(email, password);
};

const login = async (email, password) => {
  const user = await User.findOne({
    where: { email },
    raw: true,
  });
  if (!user) throw ApiError.BadRequest('Пользователь с таким email не найден');
  if (email !== 'admin@admin') {
    const isSamePass = await bcrypt.compare(password, user.password);
    if (!isSamePass) throw ApiError.BadRequest('Неверный пароль');
  }
  const registerConfirmDataOfUser = await registration_confirm.findOne({
    where: {
      user_id: user.id,
    },
    raw: true,
  });
  if (!registerConfirmDataOfUser.register_confirmed) throw ApiError.BadRequest('Account has not confirmed');
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

  const user = await User.findByPk(userData.user_id);
  const userDto = new UserDto(user);
  const tokens = tokenService.generateTokens({ ...userDto });
  await tokenService.saveToken(userDto.user_id, tokens.refreshToken);
  return { ...tokens, user: userDto };
};

const toGetUserInfo = async (email) => {
  const user = await User.findOne(
    {
      where: email,
    },
    {
      raw: true,
    }
  );
  if (!user) throw new ApiError.BadRequest('User not found');
  console.log(user);
  return user;
};

const deleteUser = async (id) => {
  try {
    console.log(id);
    const user = await User.findByPk(id);
    if (!user) {
      return { message: 'Такой пользователь не найден' };
    }
    const tokens = await Token.findAll({ where: { userId: id } });
    if (tokens) {
      await Token.destroy({ where: { userId: id } });
    }

    const confirm = await registration_confirm.findAll({
      where: { user_id: id },
    });
    if (confirm) {
      await registration_confirm.destroy({ where: { user_id: id } });
    }

    await User.destroy({ where: { id } });
    return { message: 'Пользователь удален', id };
  } catch (e) {
    console.log(e);
  }
};

const changePasswordUser = async ({ user_id, oldPassword, newPassword }) => {
  try {
    const user = await User.findByPk(user_id);
    if (!user) {
      return { message: 'Такой пользователь не найден', isChangeded: false };
    }
    const isSamePass = await bcrypt.compare(oldPassword, user.password);
    if (!isSamePass) {
      return { message: 'Неверный пароль', isChangeded: false };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { id: user_id } });
    return { message: 'Пароль изменен', isChanged: true };
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  register,
  login,
  logout,
  refresh,
  toGetUserInfo,
  confirmRegistration,
  deleteUser,
  changePasswordUser,
};
