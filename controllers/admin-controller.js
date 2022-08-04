const Event = require("../models/Event");
const User = require("../models/User");

exports.getAddEvent = (req, res, next) => {
  res.render("admin/add-event", {
    editMode: false,
    firstName: req.user.firstName,
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

exports.postUnregisterEvent = (req, res, next) => {
  const eventId = req.body.eventId;
  let events = req.user.registeredEvents;
  req.user.registeredEvents = events.filter((event) => event != eventId);
  req.user
    .save()
    .then((result) => {
      queryString = encodeURIComponent(true);
      res.redirect("/my-events?unregistered=" + queryString);
    })
    .catch((err) => {
      console.log(err);
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
          let registeredEvents = user.registeredEvents.filter((event) => {
            return event.toString() !== eventId.toString(); //deleting event
          });
          console.log(registeredEvents);
          user.registeredEvents = registeredEvents; //update registered events
          if (user._id.toString() == req.user._id.toString()) { // if user is the currently logged in user
            let createdEvents = user.createdEvents.filter((event) => {
              return event.toString() !== eventId.toString();
            });
            console.log("deleting event in createdEvents", createdEvents);
            user.createdEvents = createdEvents;
            console.log(user);
          }
          user.save();
        });
      })
      .then((result) => {
        res.redirect("/my-events");
      });
  });
  // $unset will replace the event with null.
  // return User.updateMany(
  //   { registeredEvents: eventId },
  //   { $unset: { "registeredEvents.$": "" } }
  // )
};
