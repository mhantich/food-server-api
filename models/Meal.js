const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['starter', 'main course', 'dessert']
  },
  price: {
    type: Number,
    required: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  description: String,
  image: String
}, { timestamps: true });

module.exports = mongoose.model('Meal', mealSchema);