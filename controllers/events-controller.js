const Event = require("../models/Event");
const User = require("../models/User");

const mongoose = require("mongoose");

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
  const alertMessage = req.flash("alertMessage")[0]; //indexing from array of messages
  console.log("getting event details");
  console.log(eventId);
  console.log(mongoose.Types.ObjectId.isValid(eventId));
  Event.findById(eventId)
    .then((event) => {
      const userId = event.organizerUserId;
      User.findById(userId).then((user) => {
        if (alertMessage) {
          res.render("events/event-details", {
            event: event,
            alertMessage: alertMessage,
            organizerUserName: user.userName,
          });
        } else {
          res.render("events/event-details", {
            event: event,
            alertMessage: false,
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
  console.log("registering to:", eventId);
  if (!req.user.registeredEvents.includes(eventId)) {
    req.user.registeredEvents.push(eventId);
    req.user
      .save()
      .then((result) => {
        req.flash("successMessage", "Succesfully registered for the event!");
        res.redirect("/my-events");
        // use flash instead of query string to show alert/success messages.
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    req.flash("alertMessage", "You are already registered for the event.");
    res.redirect(`/events/${eventId}`);
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
      const alertMessage = req.flash("alertMessage")[0];
      console.log(alertMessage);
      let successMessage = req.flash("successMessage")[0];
      console.log(successMessage);
      
      if (alertMessage) {
        console.log('alert', alertMessage);
        res.render("events/my-events", {
          createdEvents: createdEvents,
          registeredEvents: registeredEvents,
          alertMessage: alertMessage,
          successMessage: false
        });
      } else {
        console.log('success', successMessage);
        res.render("events/my-events", {
          createdEvents: createdEvents,
          registeredEvents: registeredEvents,
          alertMessage: false,
          successMessage: successMessage
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
