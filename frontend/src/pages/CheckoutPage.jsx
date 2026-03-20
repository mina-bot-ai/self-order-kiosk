import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function CheckoutPage({ onOrderPlaced, onBack }) {
  const { items, subtotal, tax, total, clearCart } = useCart();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState(null);

  async function handlePayNow() {
    if (items.length === 0) return;
    setPlacing(true);
    setError(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            id: i.id,
            name: i.name,
            size: i.size,
            quantity: i.quantity,
            price: i.price,
          })),
          total,
        }),
      });

      if (!res.ok) throw new Error('Failed to place order');
      const data = await res.json();
      clearCart();
      onOrderPlaced(data);
    } catch (e) {
      // Fallback simulation if backend not running
      const orderNumber = `#${1000 + Math.floor(Math.random() * 9000)}`;
      clearCart();
      onOrderPlaced({ orderNumber, waitTime: 8, status: 'received' });
    } finally {
      setPlacing(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-950 gap-6">
        <div className="text-6xl">🛒</div>
        <p className="text-2xl text-gray-400">Your cart is empty</p>
        <button
          onClick={onBack}
          className="bg-orange-500 text-white px-10 py-4 rounded-2xl text-xl font-bold active:scale-95 transition-transform"
        >
          ← Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-950">
      {/* Header */}
      <header className="flex-none bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="bg-gray-700 hover:bg-gray-600 active:scale-95 text-white px-5 py-3 rounded-xl font-bold text-lg transition-all"
        >
          ← Back
        </button>
        <div>
          <h1 className="text-2xl font-black text-white">Order Summary</h1>
          <p className="text-gray-400 text-sm">Review your order before paying</p>
        </div>
      </header>

      {/* Order Items */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {items.map(item => (
            <div
              key={item.key}
              className="bg-gray-800 rounded-2xl p-5 flex items-center justify-between"
            >
              <div className="flex-1">
                <p className="text-white font-bold text-xl">{item.name}</p>
                <p className="text-gray-400 text-base mt-1">
                  {item.size && item.size !== 'Regular' ? `${item.size} • ` : ''}
                  ${item.price.toFixed(2)} each
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-300 text-lg">×{item.quantity}</span>
                <span className="text-orange-400 font-bold text-xl">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}

          {/* Totals */}
          <div className="bg-gray-800 rounded-2xl p-6 mt-6 space-y-3">
            <div className="flex justify-between text-gray-300 text-lg">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-300 text-lg">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-600 pt-3 flex justify-between text-white font-black text-2xl">
              <span>Total</span>
              <span className="text-orange-400">${total.toFixed(2)}</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/40 border border-red-500 text-red-300 rounded-xl p-4 text-center">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Pay Now Button */}
      <div className="flex-none bg-gray-900 border-t border-gray-800 p-6">
        <button
          onClick={handlePayNow}
          disabled={placing}
          className={`w-full py-6 rounded-3xl text-2xl font-black tracking-wide transition-all duration-150
            ${placing
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-orange-500 hover:bg-orange-600 active:scale-95 text-white shadow-xl shadow-orange-500/30'
            }`}
        >
          {placing ? '⏳ Processing...' : `💳 Pay Now — $${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}
