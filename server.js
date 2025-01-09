const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL, // Your frontend domain
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed HTTP methods
  credentials: true, // Allow credentials (cookies or headers)
  allowedHeaders: [
    "Content-Type",
    "Authorization", // Include custom headers such as tokens
  ], // Explicitly allow headers
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create uploads directory if it doesn't exist
const fs = require("fs");

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
app.use('/api/order/user-orders/', require('./routes/orderRes'));
// Error handling middleware
app.use(errorHandler);





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => connect());
