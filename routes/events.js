const express = require('express');

const router = express.Router();

const eventsController = require('../controllers/events-controller');

router.get('/', eventsController.getEvents);

router.get('/events', eventsController.getEvents);

router.get('/my-events', eventsController.getMyEvents);

//dynamic route for specific event details.
router.get('/events/:eventId', eventsController.getEventDetails);

router.get('/events/:eventId/register', eventsController.getEventRegister);

router.post('/events/:eventId/register', eventsController.postEventRegister);

module.exports = router;

