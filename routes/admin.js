const express = require('express');
const adminController = require("../controllers/admin-controller");
const isAuthMiddleware = require('../middleware/is-authenticated');
const eventValidation = require('../validations/event-validation');

const adminRouter = express.Router();

// for route protection when user is not logged in.
adminRouter.use(isAuthMiddleware);

adminRouter.get('/create-event', adminController.getAddEvent);

adminRouter.post('/create-event', eventValidation, adminController.postAddEvent);

adminRouter.post('/unregister-event', adminController.postUnregisterEvent);

adminRouter.post('/delete-event', adminController.postDeleteEvent);

adminRouter.get('/edit-event/:eventId', adminController.getEditEvent);

adminRouter.post('/edit-event/:eventId', eventValidation, adminController.postEditEvent);

module.exports = adminRouter;