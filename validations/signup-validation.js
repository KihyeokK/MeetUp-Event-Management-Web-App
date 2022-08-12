const { body } = require("express-validator");

exports.userNameValidator = body("userName")
  .isAlphanumeric()
  .withMessage("Username should only include numbers and alphabets.");

exports.emailValidator = body("email")
  .isEmail()
  .withMessage("Email is not in the valid format.");

exports.pwdValidator = body("password")
  .isLength({ min: 6, max: 15 })
  .withMessage(
    "Password should contain at least 6 characters and at most 15 characters."
  );

exports.confirmPwdValidator = body("confirmPassword").custom(
  (value, { req }) => {
    if (req.body.password !== value) {
      throw new Error("Password confirmation does not match password.");
    }
    // returning true indicates the success of this synchronous custom validator
    return true;
  }
);
