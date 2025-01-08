const express = require('express');
const router = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../Controller/categories');
const { auth, authAdmin } = require('../middleware/auth');
router.get('/', getCategories);
router.post('/', auth, authAdmin, createCategory);
router.put('/:id', auth, authAdmin, updateCategory);
router.delete('/:id', auth, authAdmin, deleteCategory);



module.exports = router;
