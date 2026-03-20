const express = require('express');
const router = express.Router();

// Shared in-memory order store (exported so other routes can access it)
const _store = new Map();
let _counter = 1000;

const orders = { _store, get _counter() { return _counter; }, set _counter(v) { _counter = v; } };

function generateOrderNumber() {
  return `#${++_counter}`;
}

function estimateWaitTime(itemCount) {
  const baseMinutes = 5;
  const perItemMinutes = 2;
  return Math.min(baseMinutes + Math.ceil(itemCount * perItemMinutes * 0.5), 25);
}

// POST /api/orders - create a new order
router.post('/', (req, res) => {
  const { items, total } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }

  const orderNumber = generateOrderNumber();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const waitTime = estimateWaitTime(itemCount);

  const order = {
    id: orderNumber,
    items,
    total: parseFloat(total) || 0,
    status: 'received',
    waitTime,
    createdAt: new Date().toISOString(),
  };

  _store.set(orderNumber, order);

  // Simulate order progression
  setTimeout(() => {
    if (_store.has(orderNumber)) {
      _store.get(orderNumber).status = 'preparing';
    }
  }, 30000);

  setTimeout(() => {
    if (_store.has(orderNumber)) {
      _store.get(orderNumber).status = 'ready';
    }
  }, waitTime * 60 * 1000);

  res.status(201).json({
    orderNumber,
    waitTime,
    status: order.status,
    createdAt: order.createdAt,
  });
});

// GET /api/orders/:id - get order status
router.get('/:id', (req, res) => {
  const orderId = req.params.id.startsWith('#') ? req.params.id : `#${req.params.id}`;
  const order = _store.get(orderId);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json(order);
});

// Export shared store so admin routes can reference it
router._store = _store;
router._counter = () => _counter;
router._incrementCounter = () => ++_counter;

module.exports = router;
