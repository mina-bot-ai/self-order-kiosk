require('dotenv').config();
const express = require('express');
const cors = require('cors');
const menuRouter = require('./routes/menu');
const ordersRouter = require('./routes/orders');
const paymentsRouter = require('./routes/payments');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/menu', menuRouter);
app.use('/api/orders', ordersRouter);
app.use('/api', paymentsRouter);          // POST /api/create-payment-intent, POST /api/confirm-order
app.use('/api/admin', adminRouter);       // GET/PATCH /api/admin/orders, GET/POST/PUT/DELETE /api/admin/menu

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🍔 Kiosk backend running on http://localhost:${PORT}`);
});
