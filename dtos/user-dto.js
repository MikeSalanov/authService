module.exports = class UserDto {
  email;
  user_id;

  constructor(model) {
    this.email = model.email;
    this.user_id = model.id;
  }
};
