const Event = require('../models/Event');

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
