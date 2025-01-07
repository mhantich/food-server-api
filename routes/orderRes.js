const express = require('express');
const router = express.Router();
const { createReservationAndOrder, getUserOrders } = require('../Controller/createReservationAndOrder');
router.post('/reservation-order', createReservationAndOrder);
router.get('/', getUserOrders);

module.exports = router;