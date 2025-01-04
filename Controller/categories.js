const express = require('express');
const Category = require('../models/Category');
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  const category = new Category(req.body);
  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(category);
};

exports.deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Category deleted' });
};


