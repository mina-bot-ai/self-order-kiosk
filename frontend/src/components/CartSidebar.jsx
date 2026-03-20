import React from 'react';
import { useCart } from '../context/CartContext';

export default function CartSidebar({ open, onClose, onCheckout }) {
  const { items, subtotal, tax, total, itemCount, updateQuantity, removeItem } = useCart();

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full z-50 w-full max-w-sm bg-gray-900 shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛒</span>
            <div>
              <h2 className="text-xl font-black text-white">Your Cart</h2>
              <p className="text-gray-400 text-sm">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 active:scale-95 text-white w-10 h-10 rounded-xl text-xl font-bold flex items-center justify-center transition-all"
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <span className="text-5xl opacity-40">🛒</span>
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <p className="text-gray-600 text-sm">Add items from the menu</p>
            </div>
          ) : (
            items.map(item => (
              <CartItem
                key={item.key}
                item={item}
                onIncrease={() => updateQuantity(item.key, 1)}
                onDecrease={() => updateQuantity(item.key, -1)}
                onRemove={() => removeItem(item.key)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="flex-none border-t border-gray-700 p-5 space-y-4">
            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-gray-400 text-base">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400 text-base">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-black text-xl border-t border-gray-600 pt-2">
                <span>Total</span>
                <span className="text-orange-400">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={onCheckout}
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white py-4 rounded-2xl text-xl font-black transition-all shadow-lg shadow-orange-500/30"
            >
              Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="bg-gray-800 rounded-2xl p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-base leading-tight truncate">{item.name}</p>
          {item.size && item.size !== 'Regular' && (
            <p className="text-gray-400 text-sm">{item.size}</p>
          )}
          <p className="text-orange-400 font-bold text-base mt-1">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
        <button
          onClick={onRemove}
          className="text-gray-500 hover:text-red-400 active:scale-95 text-lg transition-all flex-none mt-0.5"
        >
          🗑
        </button>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-3 mt-3">
        <button
          onClick={onDecrease}
          className="w-10 h-10 bg-gray-700 hover:bg-gray-600 active:scale-95 text-white rounded-xl text-xl font-bold flex items-center justify-center transition-all"
        >
          −
        </button>
        <span className="text-white text-lg font-black w-8 text-center">{item.quantity}</span>
        <button
          onClick={onIncrease}
          className="w-10 h-10 bg-gray-700 hover:bg-gray-600 active:scale-95 text-white rounded-xl text-xl font-bold flex items-center justify-center transition-all"
        >
          +
        </button>
        <span className="text-gray-500 text-sm ml-2">
          ${item.price.toFixed(2)} each
        </span>
      </div>
    </div>
  );
}
