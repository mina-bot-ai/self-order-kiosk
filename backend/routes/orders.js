const express = require('express');
const router = express.Router();

// In-memory order store
const orders = new Map();
let orderCounter = 1000;

function generateOrderNumber() {
  return `#${++orderCounter}`;
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

  orders.set(orderNumber, order);

  // Simulate order progression
  setTimeout(() => {
    if (orders.has(orderNumber)) {
      orders.get(orderNumber).status = 'preparing';
    }
  }, 30000);

  setTimeout(() => {
    if (orders.has(orderNumber)) {
      orders.get(orderNumber).status = 'ready';
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
  const order = orders.get(orderId);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json(order);
});

module.exports = router;
