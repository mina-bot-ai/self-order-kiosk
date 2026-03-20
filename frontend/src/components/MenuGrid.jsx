import React from 'react';

export default function MenuGrid({ items, onSelectItem }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map(item => (
        <MenuCard key={item.id} item={item} onSelect={() => onSelectItem(item)} />
      ))}
    </div>
  );
}

function MenuCard({ item, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className="menu-card text-left group w-full"
    >
      {/* Item Image */}
      <div className="relative overflow-hidden bg-gray-700" style={{ paddingBottom: '66%' }}>
        <img
          src={item.image}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Item Info */}
      <div className="p-4">
        <h3 className="text-white font-bold text-lg leading-tight">{item.name}</h3>
        <p className="text-gray-400 text-sm mt-1 line-clamp-2 leading-snug">{item.description}</p>

        <div className="flex items-center justify-between mt-3">
          <span className="text-orange-400 font-black text-xl">
            ${item.price.toFixed(2)}
          </span>
          <span className="bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-xl">
            + Add
          </span>
        </div>

        {/* Size options hint */}
        {item.sizes && item.sizes.length > 1 && (
          <p className="text-gray-500 text-xs mt-2">
            {item.sizes.join(' · ')}
          </p>
        )}
      </div>
    </button>
  );
}
