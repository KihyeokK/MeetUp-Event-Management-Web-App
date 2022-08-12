const { body } = require("express-validator");
const User = require("../models/User");

const userNameValidator = body("userName")
  .isAlphanumeric()
  .withMessage("Username should only include numbers and alphabets.");

const emailValidator = body("email")
  .isEmail()
  .withMessage("Email is not in the valid format.")
  .custom((value) => {
    // value is the email entered by the user.
    return User.findOne({ email: value }).then((user) => {
      // if user with the email already exists.
      if (user) {
        return Promise.reject("User with this E-mail already exists.");
      }
    });
  });

const pwdValidator = body("password")
  .isLength({ min: 6, max: 15 })
  .withMessage(
    "Password should contain at least 6 characters and at most 15 characters."
  );

const confirmPwdValidator = body("confirmPassword").custom((value, { req }) => {
  if (req.body.password !== value) {
    throw new Error("Password confirmation does not match password.");
  }
  // returning true indicates the success of this synchronous custom validator
  return true;
});

// exports a list of validators
module.exports = [
  userNameValidator,
  emailValidator,
  pwdValidator,
  confirmPwdValidator,
];
