const express = require('express');
const router = express.Router();
const menuData = require('../data/menu.json');

// GET /api/menu - returns all menu items by category
router.get('/', (req, res) => {
  res.json(menuData);
});

// GET /api/menu/:categoryId - returns items for a specific category
router.get('/:categoryId', (req, res) => {
  const category = menuData.categories.find(c => c.id === req.params.categoryId);
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }
  res.json(category);
});

module.exports = router;
