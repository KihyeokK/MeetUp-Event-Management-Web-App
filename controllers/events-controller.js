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
  try {
    const myEvents = req.user.createdEvents.slice(1);
    //for now first element in myEvents array is an empty string.
    //so ignore it for now.
    res.render("events/my-events", {
      events: myEvents,
    });
  } catch (err) {
    console.log(err);
  }
};
