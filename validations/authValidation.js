
// validations/registerValidation.js
const { body } = require('express-validator');

const registerValidation = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("firstName")
    .notEmpty()
    .withMessage("First name is required"),
  body("lastName")
    .notEmpty()
    .withMessage("Last name is required"),
];

module.exports = {
  registerValidation
};

