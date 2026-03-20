const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const CUSTOM_MENU_PATH = path.join(__dirname, '../data/custom-menu.json');

function readCustomMenu() {
  try {
    const raw = fs.readFileSync(CUSTOM_MENU_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { items: [] };
  }
}

// GET /api/menu - returns all menu items by category (merged with custom items)
router.get('/', (req, res) => {
  const menuData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/menu.json'), 'utf8'));
  const custom = readCustomMenu();

  // Group custom items by category and merge into menu
  const merged = { ...menuData };

  if (custom.items && custom.items.length > 0) {
    // Build a map of existing categories
    const categoryMap = new Map(merged.categories.map(c => [c.id, c]));

    for (const item of custom.items) {
      const catId = item.category;
      if (categoryMap.has(catId)) {
        // Add to existing category
        const cat = categoryMap.get(catId);
        if (!cat.items.find(i => i.id === item.id)) {
          cat.items = [...cat.items, item];
        }
      } else {
        // Create a new category for custom items not matching existing
        if (!categoryMap.has('custom')) {
          const customCat = { id: 'custom', name: 'Specials', icon: '⭐', items: [] };
          categoryMap.set('custom', customCat);
          merged.categories = [...merged.categories, customCat];
        }
        const customCat = categoryMap.get('custom');
        if (!customCat.items.find(i => i.id === item.id)) {
          customCat.items = [...customCat.items, item];
        }
      }
    }

    merged.categories = merged.categories.map(c => categoryMap.get(c.id) || c);
  }

  res.json(merged);
});

// GET /api/menu/:categoryId - returns items for a specific category
router.get('/:categoryId', (req, res) => {
  const menuData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/menu.json'), 'utf8'));
  const category = menuData.categories.find(c => c.id === req.params.categoryId);
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }
  res.json(category);
});

module.exports = router;
