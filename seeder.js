const mongoose = require('mongoose');
const User = require('./models/User');
const Meal = require('./models/Meal');
const Reservation = require('./models/Reservation');
const Delivery = require('./models/Delivery');
const Payment = require('./models/Payment');

mongoose.connect('mongodb://localhost:27017/food-website', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Meal.deleteMany();
    await Reservation.deleteMany();
    await Delivery.deleteMany();
    await Payment.deleteMany();

    // Create users
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '098-765-4321'
      }
    ]);

    // Create meals
    const meals = await Meal.create([
      {
        name: 'Margherita Pizza',
        type: 'Italian',
        price: 12.99,
        isPopular: true
      },
      {
        name: 'Sushi Roll',
        type: 'Japanese',
        price: 15.99,
        isPopular: true
      },
      {
        name: 'Burger',
        type: 'American',
        price: 9.99,
        isPopular: false
      }
    ]);

    // Create reservations
    await Reservation.create([
      {
        userId: users[0]._id,
        mealId: meals[0]._id,
        reservationDate: new Date(),
        reservationTime: '19:00'
      }
    ]);

    // Create deliveries
    await Delivery.create([
      {
        userId: users[1]._id,
        mealId: meals[1]._id,
        deliveryAddress: '123 Main St',
        deliveryStatus: 'pending'
      }
    ]);

    // Create payments
    await Payment.create([
      {
        userId: users[0]._id,
        amount: 12.99,
        paymentMethod: 'credit_card',
        paymentDate: new Date()
      }
    ]);

    console.log('Seed data created successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();