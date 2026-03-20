import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function ItemModal({ item, onClose, onAddToCart }) {
  const { addItem } = useCart();
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const size = item.sizes?.[selectedSizeIndex] || 'Regular';
  const sizePrice = item.sizePrices?.[selectedSizeIndex] || 0;
  const unitPrice = item.price + sizePrice;
  const totalPrice = unitPrice * quantity;

  function handleAdd() {
    addItem({
      id: item.id,
      name: item.name,
      size,
      price: unitPrice,
      quantity,
    });
    setAdded(true);
    setTimeout(() => {
      onAddToCart();
    }, 600);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-56 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full text-xl font-bold flex items-center justify-center active:scale-95 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div>
            <h2 className="text-2xl font-black text-white">{item.name}</h2>
            <p className="text-gray-400 mt-1 text-base">{item.description}</p>
          </div>

          {/* Size Selector */}
          {item.sizes && item.sizes.length > 1 && (
            <div>
              <p className="text-gray-300 font-semibold mb-3 text-base uppercase tracking-wider">Size</p>
              <div className="flex gap-3">
                {item.sizes.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSizeIndex(i)}
                    className={`flex-1 py-3 rounded-2xl font-bold text-base transition-all active:scale-95 ${
                      selectedSizeIndex === i
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {s}
                    {item.sizePrices?.[i] > 0 && (
                      <span className="block text-xs opacity-75 mt-0.5">
                        +${item.sizePrices[i].toFixed(2)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div>
            <p className="text-gray-300 font-semibold mb-3 text-base uppercase tracking-wider">Quantity</p>
            <div className="flex items-center gap-5">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-14 h-14 bg-gray-700 hover:bg-gray-600 active:scale-95 text-white rounded-2xl text-2xl font-bold flex items-center justify-center transition-all"
              >
                −
              </button>
              <span className="text-white text-3xl font-black w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(20, q + 1))}
                className="w-14 h-14 bg-gray-700 hover:bg-gray-600 active:scale-95 text-white rounded-2xl text-2xl font-bold flex items-center justify-center transition-all"
              >
                +
              </button>

              <div className="flex-1 text-right">
                <span className="text-orange-400 font-black text-3xl">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAdd}
            disabled={added}
            className={`w-full py-5 rounded-3xl text-xl font-black transition-all duration-150 ${
              added
                ? 'bg-green-500 text-white scale-95'
                : 'bg-orange-500 hover:bg-orange-600 active:scale-95 text-white shadow-xl shadow-orange-500/30'
            }`}
          >
            {added ? '✓ Added to Cart!' : `🛒 Add to Cart — $${totalPrice.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
