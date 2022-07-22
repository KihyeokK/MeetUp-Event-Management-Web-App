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
