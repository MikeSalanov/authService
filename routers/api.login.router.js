const {validationResult } = require("express-validator");
const { releaseTokens }  = require('../utils/releaseTokens');
const {validateAuthMiddleware} = require('../middlewares/validateAuth.middleware');
const { User } = require("../db/models");

const router = require('express').Router();

router.route('/login').post(
 
);

export default router;

