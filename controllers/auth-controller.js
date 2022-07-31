const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.getSignUp = (req, res, next) => {
  res.render("auth/signup");
};

exports.postSignUp = (req, res, next) => {
  const { userName, firstName, lastName, email, password, confirmPassword } =
    req.body;
  console.log("signing up,", req.body);
  User.findOne({ email: email })
    .then((user) => {
      //if user with the email already exists.
      if (user) {
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const newUser = new User({
            userName: userName,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            createdEvents: [],
            registeredEvents: [],
          });
          return newUser.save();
        })
        .then((result) => {
          res.redirect("/");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getLogin = (req, res, next) => {
  res.render("auth/login");
};
