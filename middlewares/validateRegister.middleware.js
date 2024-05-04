const { body } = require('express-validator');

const validateRegisterMiddleware = [
    body().notEmpty().withMessage('Body must be not empty'),
    body('login').notEmpty().withMessage('Login is require'),
    body('password').notEmpty().withMessage('Password is require'),
    body('confirmPassword').notEmpty().withMessage('Password\'s confirm is require'),
    body('login').custom(async (login, { req }) => {
      const admin = new Admin(login);
      const resultOfCheckExist = await admin.validateRegister();
      req.adminLogin = admin.getLogin;
      return resultOfCheckExist;
    }),
    body().custom(async ({ password, confirmPassword }) => {
      if (password !== confirmPassword) throw new Error('Password doesn\'t match with confirm_password field');
      return true;
    }),
];

module.exports = validateRegisterMiddleware;
