const express = require('express');
const adminController = require("../controllers/admin-controller");
const isAuthMiddleware = require('../middleware/is-authenticated');

const adminRouter = express.Router();

// for route protection when user is not logged in.
adminRouter.use(isAuthMiddleware);

adminRouter.get('/create-event', adminController.getAddEvent);

adminRouter.post('/create-event', adminController.postAddEvent);

adminRouter.get('/edit-event/:eventId', adminController.getEditEvent);

adminRouter.post('/edit-event/:eventId', adminController.postEditEvent);

adminRouter.post('/unregister-event', adminController.postUnregisterEvent)

module.exports = adminRouter;