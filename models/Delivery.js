const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  deliveryStatus: {
    type: String,
    enum: ['pending', 'in_progress', 'delivered', 'cancelled'],
    default: 'pending'
  },
  mealId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meal',
    required: true
  },
  deliveryPersonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryPerson'
  },
  deliveryCost: {
    type: Number,
    required: true
  },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);