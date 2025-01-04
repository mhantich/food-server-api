const mongoose = require('mongoose');

const deliveryPersonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: String,
  vehicleType: {
    type: String,
    enum: ['bike', 'car', 'scooter']
  },
  licenseNumber: String,
  currentLocation: String,
  isAvailable: {
    type: Boolean,
    default: true
  },
  assignedDeliveryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery'
  }
}, { timestamps: true });

module.exports = mongoose.model('DeliveryPerson', deliveryPersonSchema);