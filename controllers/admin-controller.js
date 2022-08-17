const { validationResult } = require("express-validator");

const Event = require("../models/Event");
const User = require("../models/User");

exports.getAddEvent = (req, res, next) => {
  res.render("admin/add-event", {
    pageTitle: "Add Event",
    editMode: false,
    firstName: req.user.firstName,
    alertMessages: [],
    userInput: {
      title: "",
      organizer: "",
      location: "",
      eventFormat: "",
      eventStartDate: "",
      eventEndDate: "",
      startTime: "",
      endTime: "",
      price: "",
      description: "",
    },
  });
};

exports.postAddEvent = (req, res, next) => {
  const {
    title,
    organizer,
    location,
    eventFormat,
    eventStartDate,
    eventEndDate,
    startTime,
    endTime,
    price,
    description,
  } = req.body;
  let correctedEventFormat;
  if (eventFormat === "inPerson") {
    correctedEventFormat = "In person";
  } else if (eventFormat === "online") {
    correctedEventFormat = "Online";
  } else if (eventFormat === "toBeDetermined") {
    correctedEventFormat = "To be determined";
  }
  const errors = validationResult(req).array();
  console.log(errors);
  if (errors.length) {
    // if there is an error message
    const alertMessages = errors.map((err) => {
      return err.msg;
    });
    console.log(alertMessages);
    return res.status(422).render("admin/add-event", {
      pageTitle: "Add Event",
      editMode: false,
      firstName: req.user.firstName,
      alertMessages: alertMessages,
      userInput: {
        title: title,
        organizer: organizer,
        location: location,
        eventFormat: correctedEventFormat,
        eventStartDate: eventStartDate,
        eventEndDate: eventEndDate,
        startTime: startTime,
        endTime: endTime,
        price: price,
        description: description,
      },
    });
  }
  const organizerUserId = req.user._id; //_id is automatically generated when creating user.
  const event = new Event({
    title: title,
    organizer: organizer,
    location: location,
    eventFormat: correctedEventFormat,
    eventStartDate: eventStartDate,
    eventEndDate: eventEndDate,
    startTime: startTime,
    endTime: endTime,
    price: price,
    description: description,
    organizerUserId: organizerUserId,
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
      req.flash("successMessage", "Successfully created the event!");
      res.redirect("/my-events");
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      return next(error);
    });
};

exports.getEditEvent = (req, res, next) => {
  const eventId = req.params.eventId;
  Event.findById(eventId)
    .then((event) => {
      console.log(event.eventFormat);
      res.render("admin/add-event", {
        pageTitle: "Edit Event",
        event: event,
        editMode: true,
        alertMessages: [],
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      return next(error);
    });
};

exports.postEditEvent = (req, res, next) => {
  const {
    eventId,
    title,
    organizer,
    location,
    eventFormat,
    eventStartDate,
    eventEndDate,
    startTime,
    endTime,
    price,
    description,
  } = req.body;
  let correctedEventFormat;
  if (eventFormat === "inPerson") {
    correctedEventFormat = "In person";
  } else if (eventFormat === "online") {
    correctedEventFormat = "Online";
  } else if (eventFormat === "toBeDetermined") {
    correctedEventFormat = "To be determined";
  } else {
    correctedEventFormat = eventFormat; // if the user doesn't change the event format
  }
  Event.findById(eventId)
    .then((event) => {
      const errors = validationResult(req).array();
      console.log(errors);
      if (errors.length) {
        // if there is an error message
        const alertMessages = errors.map((err) => {
          return err.msg;
        });
        console.log(alertMessages);
        res.status(422).render("admin/add-event", {
          pageTitle: "Edit Event",
          event: event,
          editMode: true,
          alertMessages: alertMessages,
        });
      }
      console.log(event);
      event.title = title;
      event.organizer = organizer;
      event.location = location;
      console.log("hey", event.eventFormat);
      console.log(correctedEventFormat);
      event.eventFormat = correctedEventFormat;
      console.log(event.eventFormat);
      event.eventStartDate = eventStartDate;
      event.eventEndDate = eventEndDate;
      event.startTime = startTime;
      event.endTime = endTime;
      event.price = price;
      event.description = description;
      return event.save();
    })
    .then((result) => {
      const errors = validationResult(req).array();
      if (!errors.length) {
        res.redirect("/");
      }
    })
    .catch((err) => {
      const error = new Error(err);
      return next(error);
    });
};

exports.postUnregisterEvent = (req, res, next) => {
  const eventId = req.body.eventId;
  let events = req.user.registeredEvents;
  req.user.registeredEvents = events.filter((event) => event != eventId);
  req.user
    .save()
    .then((result) => {
      req.flash("successMessage", "Succesfully unregistered from the event!");
      res.redirect("/my-events");
    })
    .catch((err) => {
      const error = new Error(err);
      return next(error);
    });
};

exports.postDeleteEvent = (req, res, next) => {
  const eventId = req.body.eventId;
  console.log(eventId);
  Event.findByIdAndDelete(eventId).then((result) => {
    User.find({ registeredEvents: eventId })
      .then((users) => {
        console.log("deleting", users);
        return users.forEach((user) => {
          const registeredEvents = user.registeredEvents.filter((event) => {
            return event.toString() !== eventId.toString(); //deleting event
          });
          console.log(registeredEvents);
          user.registeredEvents = registeredEvents; //update registered events
          if (user._id.toString() == req.user._id.toString()) {
            // if user is the currently logged in user
            const createdEvents = user.createdEvents.filter(
              (event) => event.toString() !== eventId.toString()
            );
            console.log("deleting event in createdEvents", createdEvents);
            user.createdEvents = createdEvents;
            console.log(user);
          }
          user.save();
        });
      })
      .then((result) => {
        req.flash("successMessage", "Successfully deleted the event!");
        res.redirect("/my-events");
      })
      .catch((err) => {
        const error = new Error(err);
        return next(error);
      });
  });
  // $unset will replace the event with null.
  // return User.updateMany(
  //   { registeredEvents: eventId },
  //   { $unset: { "registeredEvents.$": "" } }
  // )
};
