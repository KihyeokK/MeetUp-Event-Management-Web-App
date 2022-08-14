const { body } = require("express-validator");

module.exports = body("eventStartDate").custom((value, { req }) => {
  const startDate = new Date(value + "T" + req.body.startTime);
  const endDate = new Date(req.body.eventEndDate + "T" + req.body.endTime);
  console.log(req.body.eventEndDate + "T" + req.body.endTime);
  console.log(startDate, endDate);
  // Compare time using Date object
  if (startDate.getTime() > endDate.getTime()) {
    console.log("error. endDate is before startdate");
    throw new Error("Event end date cannot be before start date.");
  }
  // returning true indicates the success of this synchronous custom validator
  return true;
});
