const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const ADMIN_TOKEN = 'admin123';
const CUSTOM_MENU_PATH = path.join(__dirname, '../data/custom-menu.json');

// Middleware: require admin token
function requireAdmin(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized: invalid admin token' });
  }
  next();
}

router.use(requireAdmin);

// ── Orders ──────────────────────────────────────────────────────────────────

// GET /api/admin/orders - return all orders
router.get('/orders', (req, res) => {
  const ordersRouter = require('./orders');
  const allOrders = Array.from(ordersRouter._store.values()).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  res.json(allOrders);
});

// PATCH /api/admin/orders/:id - update order status
router.patch('/orders/:id', (req, res) => {
  const ordersRouter = require('./orders');
  const orderId = req.params.id.startsWith('#') ? req.params.id : `#${req.params.id}`;
  const order = ordersRouter._store.get(orderId);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const validStatuses = ['received', 'preparing', 'ready', 'completed'];
  const { status } = req.body;

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  order.status = status;
  res.json(order);
});

// ── Menu ─────────────────────────────────────────────────────────────────────

function readCustomMenu() {
  try {
    const raw = fs.readFileSync(CUSTOM_MENU_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { items: [] };
  }
}

function writeCustomMenu(data) {
  fs.writeFileSync(CUSTOM_MENU_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// GET /api/admin/menu - return full merged menu
router.get('/menu', (req, res) => {
  const defaultMenu = require('../data/menu.json');
  const custom = readCustomMenu();
  res.json({ ...defaultMenu, customItems: custom.items });
});

// POST /api/admin/menu/items - add a new custom item
router.post('/menu/items', (req, res) => {
  const { name, category, price, description, icon } = req.body;

  if (!name || !category || price === undefined) {
    return res.status(400).json({ error: 'name, category, and price are required' });
  }

  const custom = readCustomMenu();
  const newItem = {
    id: `custom_${Date.now()}`,
    name,
    category,
    price: parseFloat(price),
    description: description || '',
    icon: icon || '🍽️',
    isCustom: true,
    createdAt: new Date().toISOString(),
  };

  custom.items.push(newItem);
  writeCustomMenu(custom);

  res.status(201).json(newItem);
});

// PUT /api/admin/menu/items/:id - update a custom item
router.put('/menu/items/:id', (req, res) => {
  const custom = readCustomMenu();
  const idx = custom.items.findIndex(i => i.id === req.params.id);

  if (idx === -1) {
    return res.status(404).json({ error: 'Custom item not found' });
  }

  const updated = {
    ...custom.items[idx],
    ...req.body,
    id: custom.items[idx].id, // prevent id changes
    isCustom: true,
  };

  custom.items[idx] = updated;
  writeCustomMenu(custom);

  res.json(updated);
});

// DELETE /api/admin/menu/items/:id - delete a custom item
router.delete('/menu/items/:id', (req, res) => {
  const custom = readCustomMenu();
  const idx = custom.items.findIndex(i => i.id === req.params.id);

  if (idx === -1) {
    return res.status(404).json({ error: 'Custom item not found' });
  }

  const [removed] = custom.items.splice(idx, 1);
  writeCustomMenu(custom);

  res.json({ message: 'Item deleted', item: removed });
});

module.exports = router;
