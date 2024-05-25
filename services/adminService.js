const { where } = require('sequelize');
const { User, Token, registration_confirm } = require('../db/models');

const getUsers = async () => {
  try {
    const users = await User.findAll();
    return JSON.parse(JSON.stringify(users));
  } catch (e) {
    console.log(e);
  }
};


const delUser = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user){
      return {message:'Такой пользователь не найден'}

    }
    const tokens = await Token.findAll({where:{userId:id}})
    if (tokens){ await Token.destroy({where:{userId:id}})}

    const confirm = await registration_confirm.findAll({where:{user_id:id}})
    if (confirm){ await registration_confirm.destroy({where:{user_id:id}})}

    await User.destroy({where:{id}})
    return {message: 'Пользователь удален', id};
  } catch (e) {
    console.log(e);
  }
};

module.exports = { getUsers, delUser };
