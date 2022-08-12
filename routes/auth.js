const express = require("express");
const authController = require("../controllers/auth-controller");
const signupVal = require("../validations/signup-validation");

const authRouter = express.Router();

authRouter.get("/signup", authController.getSignUp);

authRouter.post(
  "/signup",
  signupVal.emailValidator,
  signupVal.pwdValidator,
  signupVal.confirmPwdValidator,
  authController.postSignUp
);

authRouter.get("/login", authController.getLogin);

authRouter.post("/login", authController.postLogin);

authRouter.post("/logout", authController.postLogout);

module.exports = authRouter;
