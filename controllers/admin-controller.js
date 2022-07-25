const Event = require("../models/Event");

exports.getAddEvent = (req, res, next) => {
  res.render("admin/add-event", {
    editMode: false,
  });
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
    .save() //save returns saved event, but couldnt find its clarification from docs or internet.
    //Though it is mentioned that the optional callback function in save() has save object value.
    .then((event) => {
      console.log(event);
      req.user.createdEvents.push(event._id);
      console.log(req.user);
      return req.user.save();
    })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditEvent = (req, res, next) => {
  const eventId = req.params.eventId;
  Event.findById(eventId)
    .then((event) => {
      console.log(eventId)
      res.render("admin/add-event", {
        event: event,
        editMode: true
      });
    })
    .catch((err) => {
      console.log(err);
    });
};


