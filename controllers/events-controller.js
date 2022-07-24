const Event = require("../models/Event");

exports.getEvents = (req, res, next) => {
  Event.find()
    .then((events) => {
      res.render("events/index", {
        events: events,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEventDetails = (req, res, next) => {
  const eventId = req.params.eventId;
  Event.findById(eventId)
    .then((event) => {
      res.render("events/event-details", {
        event: event,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEventRegister = (req, res, next) => {
  const eventId = req.params.eventId;
  Event.findById(eventId)
    .then((event) => {
      res.render("events/event-register", {
        event: event,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getMyEvents = (req, res, next) => {
  req.user
    .populate("createdEvents")
    .then((user) => {
      const myEvents = user.createdEvents;
      res.render("events/my-events", {
        events: myEvents,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
