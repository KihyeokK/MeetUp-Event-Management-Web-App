const Event = require("../models/Event");
const User = require("../models/User");

exports.getEvents = (req, res, next) => {
  console.log(req.user.createdEvents);
  Event.find()
    .then((events) => {
      const alertMessage = req.query.registered;
      if (alertMessage) {
        res.render("events/index", {
          events: events,
          registerSuccess: alertMessage,
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
  const registerFailMessage = req.query.registerfail;
  Event.findById(eventId)
    .then((event) => {
      const userId = event.organizerUserId;
      User.findById(userId).then((user) => {
        if (registerFailMessage) {
          res.render("events/event-details", {
            event: event,
            registerFailMessage: registerFailMessage,
            organizerUserName: user.userName,
          });
        } else {
          res.render("events/event-details", {
            event: event,
            registerFailMessage: false,
            organizerUserName: user.userName,
          });
        }
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
  if (!req.user.registeredEvents.includes(eventId)) {
    req.user.registeredEvents.push(eventId);
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
      "You are already registered for the event."
    );
    res.redirect(`/events/${eventId}?registerfail=` + queryString);
  }
};

exports.getMyEvents = (req, res, next) => {
  req.user
    .populate("createdEvents")
    .then((user) => {
      //populating multiple fields
      return user.populate("registeredEvents");
    })
    .then((user) => {
      const createdEvents = user.createdEvents;
      const registeredEvents = user.registeredEvents;
      const alertMessage = req.query.unregistered;
      if (alertMessage) {
        res.render("events/my-events", {
          createdEvents: createdEvents,
          registeredEvents: registeredEvents,
          unregisterSuccess: alertMessage,
        });
      } else {
        res.render("events/my-events", {
          createdEvents: createdEvents,
          registeredEvents: registeredEvents,
          unregisterSuccess: false,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
