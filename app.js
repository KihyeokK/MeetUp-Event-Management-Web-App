const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const User = require("./models/User");

const eventsRoutes = require("./routes/events");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const errorsController = require('./controllers/errors-controller');

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();
const sessionStore = new MongoDBStore({
  uri: MONGODB_URI,
  collections: "sessions",
});
const csrfProtection = csrf(); // middlware for csrf protection

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

// resave: session will be saved only when there is a change in the session.
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

app.use(flash());
app.use(csrfProtection);

app.use((req, res, next) => {
  if (!req.session.user) {
    // if user is not logged in
    console.log("user not logged in to session. user doesn't exist");
    next();
  } else {
    console.log("getting user");
    // if user is logged in, get user info from database
    // user is fetched in every request while the session is not destroyed(while user is logged in)
    // so the existence of session decides if the user data can be fetched or not.
    User.findById(req.session.user._id)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => console.log(err));
  }
});

// making variables available in the views rendered from requests
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(eventsRoutes);
app.use("/admin", adminRoutes);
app.use(authRoutes);

app.get('/500error', errorsController.get500error);

// 404 error middlware is executed without any specified route, when none of the middleware functions handled the request before
app.use(errorsController.get404error);
// any thrown error will be handled in this middleware
app.use((err, req, res, next) => {
  res.redirect('/500error');
});

mongoose
  .connect(MONGODB_URI)
  .then((success) => {
    console.log("connected");
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });
