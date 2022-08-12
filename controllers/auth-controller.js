const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { validationResult } = require("express-validator");

exports.getSignUp = (req, res, next) => {
  alertMessages = req.flash("alertMessage");
  res.render("auth/signup", { alertMessages: alertMessages });
};

exports.postSignUp = (req, res, next) => {
  const { userName, firstName, lastName, email, password, confirmPassword } =
    req.body;
  const errors = validationResult(req).array();
  console.log(errors);
  if (errors.length) {
    // if there is an error message
    const alertMessages = errors.map((err) => {
      return err.msg;
    });
    console.log(alertMessages);
    return res.status(422).render("auth/signup", { alertMessages: alertMessages });
  }
  console.log("signing up,", req.body);
  User.findOne({ email: email })
    .then((user) => {
      //if user with the email already exists.
      if (user) {
        req.flash("alertMessage", "User with this E-mail exists already.");
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

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      //if user is not found
      console.log("user with this email doesn't exist.");
      return res.redirect("/login");
    }
    bcrypt
      .compare(password, user.password)
      .then((passwordMatch) => {
        if (passwordMatch) {
          // saves user in the session if password matches
          req.session.user = user;
          req.session.isLoggedIn = true;
          res.redirect("/");
        } else {
          console.log("password doesn't match");
          res.redirect("/login");
        }
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/login");
      });
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    console.log("logged out");
    res.redirect("/login");
  });
};
