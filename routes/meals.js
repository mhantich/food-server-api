const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');
const { getMeals } = require('../Controller/meals');

// Get all meals
router.get('/',getMeals );
// router.post('/',createMeal);
// router.put('/:id',updateMeal);
// router.delete('/:id',deleteMeal);
// router.get('/:id',getMealById);




module.exports = router;