const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

app.use((req, res, next) => {
    //temporally getting user this way.
    //user created in MongoDB Compass for now.
    User.findById("62d89e3b73ccc2caf6294fe6")
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => console.log(err));
  });

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

const eventsRoutes = require("./routes/events");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

app.use(eventsRoutes);
app.use("/admin", adminRoutes);
app.use(authRoutes);

mongoose
  .connect(MONGODB_URI)
  .then((success) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
