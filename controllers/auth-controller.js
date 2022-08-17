const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const User = require("../models/User");

exports.getSignUp = (req, res, next) => {
  alertMessages = req.flash("alertMessage");
  res.render("auth/signup", {
    pageTitle: "Signup",
    alertMessages: alertMessages,
    userInput: {
      userName: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
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
    return res.status(422).render("auth/signup", {
      pageTitle: "Signup",
      alertMessages: alertMessages,
      userInput: {
        userName: userName,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
    });
  }
  console.log("signing up,", req.body);
  bcrypt
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
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      return next(error);
    });
};

exports.getLogin = (req, res, next) => {
  const infoMessage = req.flash("infoMessage")[0];
  const alertMessages = req.flash("alertMessages");
  res.render("auth/login", {
    pageTitle: "Login",
    infoMessage: infoMessage,
    alertMessages: alertMessages,
    userInput: { email: "", password: "" },
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req).array();
  console.log(errors);
  if (errors.length) {
    // if there is an error message
    const alertMessages = errors.map((err) => {
      return err.msg;
    });
    console.log(alertMessages);
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      infoMessage: false,
      alertMessages: alertMessages,
      userInput: { email: email, password: password },
    });
  }
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      //if user is not found
      console.log("user with this email doesn't exist.");
      req.flash("alertMessages", "User with this email doesn't exist.");
      alertMessages = req.flash("alertMessages");
      return res.status(422).render("auth/login", {
        pageTitle: "Login",
        infoMessage: false,
        alertMessages: alertMessages,
        userInput: { email: email, password: password },
      });
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
          req.flash("alertMessages", "Incorrect password.");
          alertMessages = req.flash("alertMessages");
          return res.status(422).render("auth/login", {
            pageTitle: "Login",
            infoMessage: false,
            alertMessages: alertMessages,
            userInput: { email: email, password: password },
          });
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
