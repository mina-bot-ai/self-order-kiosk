const express = require('express');
const router = express.Router();

// Lazy-load stripe with test key fallback
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
  const Stripe = require('stripe');
  return Stripe(key);
}

// POST /api/create-payment-intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount (in cents) is required' });
    }

    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // amount in cents
      currency,
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: err.message || 'Payment intent creation failed' });
  }
});

// POST /api/confirm-order
router.post('/confirm-order', async (req, res) => {
  try {
    const { paymentIntentId, items, total } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'paymentIntentId is required' });
    }

    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: `Payment not succeeded: ${paymentIntent.status}` });
    }

    // Create the order using the shared orders router store
    const ordersRouter = require('./orders');
    const orderNumber = `#${ordersRouter._incrementCounter()}`;
    const itemCount = (items || []).reduce((s, i) => s + (i.quantity || 1), 0);
    const waitTime = Math.min(5 + Math.ceil(itemCount), 25);

    const order = {
      id: orderNumber,
      items: items || [],
      total: parseFloat(total) || 0,
      status: 'received',
      waitTime,
      paymentIntentId,
      createdAt: new Date().toISOString(),
    };

    ordersRouter._store.set(orderNumber, order);

    res.json({ orderNumber, waitTime, status: 'received', createdAt: order.createdAt });
  } catch (err) {
    console.error('Confirm order error:', err.message);
    res.status(500).json({ error: err.message || 'Order confirmation failed' });
  }
});

module.exports = router;
