const { body } = require('express-validator');

const validateRegisterMiddleware = [
    body().notEmpty().withMessage('Body must be not empty'),
    body('userName').notEmpty().withMessage('userName is required'),
    body('password').notEmpty().withMessage('Password is required'),
    body('email').notEmpty().withMessage('Email is required'),
];

module.exports = validateRegisterMiddleware;
