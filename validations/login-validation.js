const { body } = require("express-validator");

const emailValidator = body("email")
  .isEmail()
  .withMessage("Email is not in the valid format.")
  .normalizeEmail();

const pwdValidator = body("password").trim();

module.exports = [emailValidator, pwdValidator];
