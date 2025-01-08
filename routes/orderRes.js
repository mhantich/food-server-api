const express = require('express');
const router = express.Router();
const { createReservationAndOrder, getUserOrders } = require('../Controller/createReservationAndOrder');
const { auth } = require('../middleware/auth');
router.post('/reservation-order', auth, createReservationAndOrder);
router.get('/:userId', auth, getUserOrders);

module.exports = router;