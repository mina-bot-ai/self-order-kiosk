import React, { useEffect, useState } from 'react';

export default function ConfirmationPage({ orderData, onNewOrder }) {
  const [countdown, setCountdown] = useState(15);
  const [dots, setDots] = useState('');

  // Auto-reset countdown
  useEffect(() => {
    if (countdown <= 0) {
      onNewOrder();
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, onNewOrder]);

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const waitTime = orderData?.waitTime || 8;
  const orderNumber = orderData?.orderNumber || '#????';

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center select-none relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] bg-green-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 text-center px-8">
        {/* Success Icon */}
        <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40">
          <span className="text-6xl">✓</span>
        </div>

        <div>
          <h1 className="text-5xl font-black text-white">Order Placed!</h1>
          <p className="text-gray-400 text-xl mt-2">Your food is being prepared</p>
        </div>

        {/* Order Number */}
        <div className="bg-gray-800/80 backdrop-blur rounded-3xl px-12 py-8 border border-gray-700">
          <p className="text-gray-400 text-lg uppercase tracking-widest">Order Number</p>
          <p className="text-6xl font-black text-orange-400 mt-2">{orderNumber}</p>
        </div>

        {/* Wait Time */}
        <div className="flex items-center gap-4 bg-orange-500/20 border border-orange-500/40 rounded-2xl px-8 py-5">
          <span className="text-4xl">⏱️</span>
          <div className="text-left">
            <p className="text-orange-300 text-sm font-semibold uppercase tracking-wider">
              Estimated Wait Time
            </p>
            <p className="text-white text-2xl font-black">
              ~{waitTime} minute{waitTime !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-3 text-gray-400 text-lg">
          <span className="animate-pulse w-3 h-3 bg-green-400 rounded-full inline-block"></span>
          Preparing your order{dots}
        </div>

        {/* Tip */}
        <p className="text-gray-500 text-base">
          Please collect your order at the counter when your number is called
        </p>

        {/* New Order Button */}
        <button
          onClick={onNewOrder}
          className="mt-4 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-12 py-5 rounded-3xl text-xl font-bold transition-all duration-150 shadow-xl shadow-orange-500/30"
        >
          🍔 New Order
        </button>

        <p className="text-gray-600 text-sm">
          Auto-returning to start in {countdown}s
        </p>
      </div>
    </div>
  );
}
