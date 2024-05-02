const { body } = require('express-validator');

const validateAuthMiddleware = [
  body().notEmpty().withMessage('Body must be not empty'),
  body('userName').notEmpty().withMessage('userName is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = validateAuthMiddleware;
