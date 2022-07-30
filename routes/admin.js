const express = require('express');
const adminController = require("../controllers/admin-controller");

const adminRouter = express.Router();

adminRouter.get('/create-event', adminController.getAddEvent);

adminRouter.post('/create-event', adminController.postAddEvent);

adminRouter.get('/edit-event/:eventId', adminController.getEditEvent);

adminRouter.post('/edit-event/:eventId', adminController.postEditEvent);

adminRouter.post('/unregister-event', adminController.postUnregisterEvent)

module.exports = adminRouter;