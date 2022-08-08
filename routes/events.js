const express = require('express');
const eventsController = require('../controllers/events-controller');
const isAuthMiddleware = require('../middleware/is-authenticated');

const eventsRouter = express.Router();

eventsRouter.get('/', eventsController.getEvents);

eventsRouter.get('/events', eventsController.getEvents);

eventsRouter.get('/my-events', isAuthMiddleware, eventsController.getMyEvents);

eventsRouter.post('/send-invitation', eventsController.postSendInvitation);

eventsRouter.post('/events/:eventId/register', isAuthMiddleware, eventsController.postEventRegister);

eventsRouter.get('/events/:eventId/register', isAuthMiddleware, eventsController.getEventRegister);

eventsRouter.get('/events/:eventId', isAuthMiddleware, eventsController.getEventDetails);

module.exports = eventsRouter;

