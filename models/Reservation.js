const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: true
  },
  reservationDate: {
    type: Date,
    required: true
  },
  reservationTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);