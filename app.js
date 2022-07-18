const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static('public'));

const eventsRoutes = require("./routes/events");
const adminRoutes = require("./routes/admin");

app.use(eventsRoutes);
app.use("/admin", adminRoutes);

app.listen(3000);
