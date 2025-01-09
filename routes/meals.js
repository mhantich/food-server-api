const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');
const { getMeals } = require('../Controller/meals');
const cache = require('../middleware/cache');
// Get all meals
router.get('/', cache(36000), getMeals );
// router.post('/',createMeal);
// router.put('/:id',updateMeal);
// router.delete('/:id',deleteMeal);
// router.get('/:id',getMealById);




module.exports = router;