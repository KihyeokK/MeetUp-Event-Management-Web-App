const express = require('express');
const authController = require('../controllers/auth-controller');

const authRouter = express.Router();

authRouter.get('/signup', authController.getSignUp);

module.exports = authRouter;