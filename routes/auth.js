const express = require("express");
const authController = require("../controllers/auth-controller");
const signupValidation = require("../validations/signup-validation");
const loginValidation = require("../validations/login-validation");

const authRouter = express.Router();

authRouter.get("/signup", authController.getSignUp);

authRouter.post("/signup", signupValidation, authController.postSignUp);

authRouter.get("/login", authController.getLogin);

authRouter.post("/login", loginValidation, authController.postLogin);

authRouter.post("/logout", authController.postLogout);

module.exports = authRouter;
