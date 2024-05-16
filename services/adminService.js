const { User } = require('../db/models');

const getUsers = async () => {
  try {
    const users = await User.findAll();
    return JSON.parse(JSON.stringify(users));
  } catch (e) {
    console.log(e);
  }
};

module.exports = { getUsers };
