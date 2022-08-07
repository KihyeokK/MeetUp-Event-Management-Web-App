const express = require('express');
const eventsController = require('../controllers/events-controller');
const isAuthMiddleware = require('../middleware/is-authenticated');

const userRouter = express.Router();

userRouter.get('/', eventsController.getEvents);

userRouter.get('/events', eventsController.getEvents);

userRouter.get('/my-events', isAuthMiddleware, eventsController.getMyEvents);

userRouter.post('/events/:eventId/register', isAuthMiddleware, eventsController.postEventRegister);

userRouter.get('/events/:eventId/register', isAuthMiddleware, eventsController.getEventRegister);

userRouter.get('/events/:eventId', eventsController.getEventDetails);

module.exports = userRouter;

