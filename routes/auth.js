const express = require('express');
const authController = require('../controllers/auth-controller');

const authRouter = express.Router();

authRouter.get('/signup', authController.getSignUp);

authRouter.post('/signup', authController.postSignUp);

authRouter.get('/login', authController.getLogin);

module.exports = authRouter;