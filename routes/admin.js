const express = require('express');

const router = express.Router();

const adminController = require("../controllers/admin-controller");

router.get('/create-event', adminController.getAddEvent);

router.post('/create-event', adminController.postAddEvent);

router.get('/edit-event/:eventId', adminController.getEditEvent);

router.post('/edit-event/:eventId', adminController.postEditEvent);

module.exports = router;