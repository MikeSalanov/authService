// const uuid = require("uuid");
const { User } = require("../db/models");
const tokenService = require("./tokenService");
const bcrypt = require("bcrypt");
// const mailService = require("./mailService");
const UserDto = require("../dtos/user-dto");

const register = async (email, password) => {
  try {
    const newUser = await User.findOne({ where: { email } });
    if (newUser) {
      throw new Error(
        `Пользователь c почтовым адресом ${email} уже зарегестрирован`
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // const activationLink = uuid.v4();
    const user = await User.create({
      email,
      password: hashedPassword,
    });
    // await mailService.sendActivationMail(
    //   email,
    //   ` ${process.env.API_URL}/api/activate/${activationLink}`
    // );

    const userDto = new UserDto(user); // id, email, regIsConfirmed

    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  } catch (error) {
    console.log(error);
  }
};

// const activate = async (activationLink) => {
//   const user = await User.findOne({ where: { activationLink } });
//   if (!user) {
//     throw new Error("Неккоретная сслыка активации");
//   }
//   user.isActivated = true;
//   await user.save();
// };

const login = async (email, password) => {
  try {
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
    
  } catch (error) {
    
  }
  const user = await User.findOne({ where: { email } });
};

module.exports = { register, login };
