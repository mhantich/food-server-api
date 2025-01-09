const express = require('express');
const router = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../Controller/categories');
const { auth, authAdmin } = require('../middleware/auth');
const cache = require('../middleware/cache');
router.get('/', cache(300), getCategories);
router.post('/', auth, authAdmin, createCategory);
router.put('/:id', auth, authAdmin, updateCategory);
router.delete('/:id', auth, authAdmin, deleteCategory);



module.exports = router;
