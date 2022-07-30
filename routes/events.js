const express = require('express');
const eventsController = require('../controllers/events-controller');

const userRouter = express.Router();

userRouter.get('/', eventsController.getEvents);

userRouter.get('/events', eventsController.getEvents);

userRouter.get('/my-events', eventsController.getMyEvents);

//dynamic route for specific event details.
userRouter.get('/events/:eventId', eventsController.getEventDetails);

userRouter.get('/events/:eventId/register', eventsController.getEventRegister);

userRouter.post('/events/:eventId/register', eventsController.postEventRegister);

module.exports = userRouter;

