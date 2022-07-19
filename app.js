const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static('public'));

app.use(bodyParser.urlencoded( {extended: false} ));

const eventsRoutes = require("./routes/events");
const adminRoutes = require("./routes/admin");

app.use(eventsRoutes);
app.use("/admin", adminRoutes);

app.listen(3000);
