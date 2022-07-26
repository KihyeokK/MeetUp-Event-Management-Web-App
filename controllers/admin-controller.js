const Event = require("../models/Event");

exports.getAddEvent = (req, res, next) => {
  res.render("admin/add-event", {
    editMode: false,
  });
};

exports.postAddEvent = (req, res, next) => {
  const {
    title,
    organizer,
    location,
    eventFormat,
    eventDate,
    startTime,
    endTime,
    price,
    description,
  } = req.body;
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
      res.render("admin/add-event", {
        event: event,
        editMode: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditEvent = (req, res, next) => {
  const {
    eventId,
    title,
    organizer,
    location,
    eventFormat,
    eventDate,
    startTime,
    endTime,
    price,
    description,
  } = req.body;
  Event.findById(eventId)
    .then((event) => {
      event.title = title;
      event.organizer = organizer;
      event.location = location;
      event.eventFormat = eventFormat;
      event.eventDate = eventDate;
      event.startTime = startTime;
      event.endTime = endTime;
      event.price = price;
      event.description = description;
      return event.save();
    })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};
