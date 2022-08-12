const { body } = require("express-validator");

const emailValidator = body("email")
  .isEmail()
  .withMessage("Email is not in the valid format.");

const pwdValidator = body(
  "password",
  "Password should contain 7-20 numbers and letters, and must not contain spaces, special characters, or emoji."
)
  .isLength({ min: 7, max: 20 })
  .isAlphanumeric();

module.exports = [emailValidator, pwdValidator];
