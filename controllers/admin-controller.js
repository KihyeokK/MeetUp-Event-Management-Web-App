const Event = require("../models/Event");

exports.getAddEvent = (req, res, next) => {
  res.render("admin/create-event");
};

exports.postAddEvent = (req, res, next) => {
  console.log(req.body);
  const title = req.body.title;
  const organizer = req.body.organizer;
  const location = req.body.location;
  const eventFormat = req.body.eventFormat;
  const eventDate = req.body.eventDate;
  const startTime = req.body.startTime;
  const endTime = req.body.endTime;
  const price = req.body.price;
  const description = req.body.description;
  const organizerUserId = req.user._id; //_id is automatically generated when creating user.
  const event = new Event({
    title,
    organizer,
    location,
    eventFormat,
    eventDate,
    startTime,
    endTime,
    price,
    description,
    organizerUserId,
  });
  event
    .save()
    .then((result) => {
      console.log(result);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};
