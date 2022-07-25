const Event = require("../models/Event");

exports.getEvents = (req, res, next) => {
  Event.find()
    .then((events) => {
      const alertMessage = req.query.registered;
      if (req.query.registered) {
        res.render("events/index", {
          events: events,
          registerSuccess: true,
        });
      } else {
        res.render("events/index", {
          events: events,
          registerSuccess: false,
        });
      }
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

exports.postEventRegister = (req, res, next) => {
  const eventId = req.body.eventId;
  console.log(eventId);
  if (!req.user.participatingEvents.includes(eventId)) {
    console.log(req.user.participatingEvents);
    req.user.participatingEvents.push(eventId);
    req.user
      .save()
      .then((result) => {
        const queryString = encodeURIComponent(true);
        res.redirect("/events?registered=" + queryString);
        // use query string to show success alert message when redirected.
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    const queryString = encodeURIComponent(
      "You are already registered to the event."
    );
    res.redirect("/events/eventId/register?registerfail=" + queryString);
  }
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
