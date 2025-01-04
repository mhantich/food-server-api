const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create uploads directory if it doesn't exist
const fs = require("fs");
const { registerRoute } = require("./routes/auth");
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

// app.use('/api/users', require('./routes/users'));
// app.use('/api/reservations', require('./routes/reservations'));
// app.use('/api/deliveries', require('./routes/deliveries'));
// app.use('/api/payments', require('./routes/payments'));

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => connect());
