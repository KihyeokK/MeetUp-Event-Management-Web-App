const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const nodemailerSendgrid = require("nodemailer-sendgrid");
require("dotenv").config();

const Event = require("../models/Event");
const User = require("../models/User");

exports.getIndex = (req, res, next) => {
  console.log("index");
  Event.find()
    .then((events) => {
      console.log(events.slice(2))
      // to limit featured events to 3 on landing page, and to feature most recently created events
      filteredEvents = events.length >= 3 ? events.slice(2).reverse() : events.reverse();
      res.render("events/index", {
        pageTitle: "Landing Page",
        events: filteredEvents,
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      return next(error);
    });
};

exports.getEvents = (req, res, next) => {
  console.log("events page");
  Event.find()
    .then((events) => {
      res.render("events/events", {
        pageTitle: "Events",
        events: events.reverse(), //feature most recently created events first
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      return next(error);
    });
};

exports.getSearchEvents = (req, res, next) => {
  const searchInput = req.query.searchInput;
  const searchType = req.query.searchType;
  console.log("getting search result");
  if (searchType == "byTitle") {
    Event.find({ title: searchInput })
      .then((events) => {
        res.render("events/events", {
          pageTitle: "Event Search",
          events: events,
        });
      })
      .catch((err) => {
        console.log(err);
        const error = new Error(err);
        return next(error);
      });
  } else {
    Event.find({ location: searchInput })
      .then((events) => {
        res.render("events/events", {
          pageTitle: "Event Search",
          events: events,
        });
      })
      .catch((err) => {
        console.log(err);
        const error = new Error(err);
        return next(error);
      });
  }
};

exports.postSearchEvents = (req, res, next) => {
  // Implements basic search functionality.
  const searchInput = req.body.searchInput;
  const searchType = req.body.searchType;
  console.log(searchInput, searchType);
  if (!searchInput) {
    // If there is no input, just redirect to main page.
    return res.redirect("/events");
  }
  res.redirect(
    `/search-events?searchInput=${searchInput}&searchType=${searchType}`
  );
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
            pageTitle: "Event Details",
            event: event,
            alertMessage: alertMessage,
            organizerUserName: user.userName,
          });
        } else {
          res.render("events/event-details", {
            pageTitle: "Event Details",
            event: event,
            alertMessage: false,
            organizerUserName: user.userName,
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      return next(error);
    });
};

exports.getEventRegister = (req, res, next) => {
  const eventId = req.params.eventId;
  Event.findById(eventId)
    .then((event) => {
      res.render("events/event-register", {
        pageTitle: "Register Event",
        event: event,
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      return next(error);
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
        const error = new Error(err);
        return next(error);
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
      const successMessage = req.flash("successMessage")[0];
      console.log(successMessage);

      if (alertMessage) {
        console.log("alert", alertMessage);
        res.render("events/my-events", {
          pageTitle: "My Events",
          createdEvents: createdEvents,
          registeredEvents: registeredEvents,
          alertMessage: alertMessage,
          successMessage: false,
          userName: user.userName
        });
      } else {
        console.log("success", successMessage);
        res.render("events/my-events", {
          pageTitle: "My Events",
          createdEvents: createdEvents,
          registeredEvents: registeredEvents,
          alertMessage: false,
          successMessage: successMessage,
          userName: user.userName
        });
      }
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      return next(error);
    });
};

exports.postSendInvitation = (req, res, next) => {
  const transporter = nodemailer.createTransport(
    nodemailerSendgrid({
      apiKey: process.env.SENDGRID_API_KEY,
    })
  );
  const email = req.body.email;
  const message = req.body.message;
  const eventId = req.body.eventId;
  console.log("sending email");
  console.log(process.env.EMAIL, process.env.PASSWORD);
  Event.findById(eventId)
    .then((event) => {
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: `Event Invitation from ${req.user.firstName} ${req.user.lastName}`,
        html: `<h1>User ${req.user.userName} (${req.user.firstName} ${
          req.user.lastName
        }) invites you to the following event: ${event.title}</h1>
        <a href="http://localhost:3000/events/${eventId}">Link</a>
        <div> Message: ${
          message ? `${message}` : "No message was attached to this email."
        }</div>`,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      return next(error);
    });
};
