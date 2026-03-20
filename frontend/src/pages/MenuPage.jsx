import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import ItemModal from '../components/ItemModal';
import CartSidebar from '../components/CartSidebar';
import MenuGrid from '../components/MenuGrid';

export default function MenuPage({ onCheckout }) {
  const [menuData, setMenuData] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    fetch('/api/menu')
      .then(r => r.json())
      .then(data => {
        setMenuData(data);
        if (data.categories?.length > 0) {
          setActiveCategory(data.categories[0].id);
        }
      })
      .catch(() => {
        // Fallback to bundled data if API unavailable
        import('../data/menuFallback.js').then(m => {
          setMenuData(m.default);
          setActiveCategory(m.default.categories[0].id);
        });
      });
  }, []);

  const currentCategory = menuData?.categories?.find(c => c.id === activeCategory);

  return (
    <div className="w-full h-full flex flex-col bg-gray-950">
      {/* Top Header */}
      <header className="flex-none bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🍔</span>
          <div>
            <h1 className="text-2xl font-black text-white">
              Quick<span className="text-orange-500">Bite</span>
            </h1>
            <p className="text-gray-400 text-sm">Choose your meal</p>
          </div>
        </div>

        {/* Cart Button */}
        <button
          className="relative flex items-center gap-3 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-6 py-3 rounded-2xl font-bold text-lg transition-all duration-150"
          onClick={() => setCartOpen(true)}
        >
          🛒 Cart
          {itemCount > 0 && (
            <span className="bg-white text-orange-500 text-sm font-black rounded-full w-7 h-7 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>
      </header>

      {/* Category Tabs */}
      <nav className="flex-none bg-gray-900 border-b border-gray-800 px-4 py-3 overflow-x-auto">
        <div className="flex gap-3 min-w-max">
          {menuData?.categories?.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`category-tab whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Menu Grid */}
      <main className="flex-1 overflow-y-auto p-5">
        {currentCategory ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-4">
              {currentCategory.icon} {currentCategory.name}
            </h2>
            <MenuGrid items={currentCategory.items} onSelectItem={setSelectedItem} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500 text-xl">Loading menu...</div>
          </div>
        )}
      </main>

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={() => setSelectedItem(null)}
        />
      )}

      {/* Cart Sidebar */}
      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false);
          onCheckout();
        }}
      />
    </div>
  );
}
