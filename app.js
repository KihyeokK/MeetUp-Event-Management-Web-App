const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

const eventsRoutes = require("./routes/events");
const adminRoutes = require("./routes/admin");

app.use(eventsRoutes);
app.use("/admin", adminRoutes);

mongoose
  .connect(MONGODB_URI)
  .then((success) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
