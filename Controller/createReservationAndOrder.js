const Reservation = require('../models/Reservation');
const Order = require('../models/Order');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Check if table is available
exports.checkTableAvailability = async (tableId, date, startTime, endTime) => {
  const existingReservation = await Reservation.findOne({
    tableId,
    reservationDate: date,
    status: { $ne: 'cancelled' },
    $or: [
      {
        // Check if new reservation starts during an existing reservation
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
      },
      {
        // Check if new reservation ends during an existing reservation
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
      }
    ]
  });

  return !existingReservation;
};

exports.createReservationAndOrder = async (req, res) => {

  try {
    // Check table availability first
    const isAvailable = await exports.checkTableAvailability(
      req.body.tableId,
      req.body.reservationDate,
      req.body.startTime,
      req.body.endTime
    );
    

    // If table is not available, return error immediately
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        error: 'Table is not available for the selected time slot'
      });
    }


    // Create reservation
    const reservation = new Reservation({
      tableId: req.body.tableId,
      userId: req.body.userId,
      reservationDate: req.body.reservationDate,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      status: 'pending'
    });

    const savedReservation = await reservation.save();

    // Create order
    const order = new Order({
      userId: req.body.userId,
      customer: {
        firstName: req.body.customer.firstName,
        lastName: req.body.customer.lastName,
        email: req.body.customer.email,
        phone: req.body.customer.phone
      },
      items: req.body.items,
      orderType: req.body.orderType,
      reservationId: savedReservation._id,
      paymentMethod: 'card',
      totalAmount: calculateTotalAmount(req.body.items),
      status: 'pending',
    });

    const savedOrder = await order.save();

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: req.body.items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?reservation_id=${savedReservation._id}&order_id=${savedOrder._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        reservation_id: savedReservation._id.toString(),
        order_id: savedOrder._id.toString()
      }
    });

    res.status(201).json({
      success: true,
      data: {
        reservation: savedReservation,
        order: savedOrder,
        sessionUrl: session.url
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

const calculateTotalAmount = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};


exports.getUserOrders = async (req, res) => {


  const userIdFromToken = req.user.id; // Extracted from the decoded token
  const userIdFromParams = req.params.userId; // Extracted from the request params




  // Ensure the authenticated user matches the requested user
  if (userIdFromToken !== userIdFromParams) {
    return res.status(403).json({ message: 'Access denied' });
  }

  const orders = await Order.find({ userId: userIdFromToken });
  if (!orders) {
    return res.status(404).json({ message: 'No orders found' });
  }

  res.json({
    success: true,
    data: orders
  });
};
