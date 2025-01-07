const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const Table = require("./models/Table");

const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create uploads directory if it doesn't exist
const fs = require("fs");
const Reservation = require("./models/Reservation");

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
// Connect to MongoDB
const connect = async () => {
  try {
    const Contected = await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {}
};

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/categories", require("./routes/categories"));
app.use('/api/meals', require('./routes/meals'));
app.use('/api/tables', require('./routes/tables'));
app.use('/api/order', require('./routes/orderRes'));
app.use('/api/order/user-orders/:userId', require('./routes/orderRes'));



// app.use('/api/users', require('./routes/users'));
// app.use('/api/reservations', require('./routes/reservations'));
// app.use('/api/deliveries', require('./routes/deliveries'));
// app.use('/api/payments', require('./routes/payments'));

// Error handling middleware
app.use(errorHandler);





// // Create demo reservations
// const demoReservations = [
//   {
//     userId: "5f7d3a2e1c9d440000c1a2b1",
//     tableId: '677925b96e3be92b78433e06',
//     reservationDate: new Date('2025-01-15'),
//     startTime: '18:00',
//     endTime: '20:00',
//     status: 'confirmed',
//     createdAt: new Date('2025-01-04T10:00:00Z'),
//     updatedAt: new Date('2025-01-04T10:00:00Z')
//   },
//   {
//     userId: "5f7d3a2e1c9d440000c1a2b3",
//     tableId: '677925b96e3be92b78433e07',
//     reservationDate: new Date('2025-01-15'),
//     startTime: '18:00',
//     endTime: '20:00',
//     status: 'confirmed',
//     createdAt: new Date('2025-01-04T10:00:00Z'),
//     updatedAt: new Date('2025-01-04T10:00:00Z')
//   },
//   {
//     userId: "5f7d3a2e1c9d440000c1a2b3",
//     tableId: '677925b96e3be92b78433e0a',
//     reservationDate: new Date('2025-01-15'),
//     startTime: '18:00',
//     endTime: '20:00',
//     status: 'confirmed',
//     createdAt: new Date('2025-01-04T10:00:00Z'),
//     updatedAt: new Date('2025-01-04T10:00:00Z')
//   },

// ];


// Reservation.insertMany(demoReservations)
//   .then(() => {
//     console.log('Categories seeded successfully!');
//     mongoose.connection.close(); // Close the connection after seeding
//   })
//   .catch((err) => {
//     console.error('Error inserting categories:', err);
//     mongoose.connection.close();
//   });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => connect());
