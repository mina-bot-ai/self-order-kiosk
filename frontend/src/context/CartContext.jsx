import React, { createContext, useContext, useReducer, useCallback } from 'react';

const CartContext = createContext(null);

const TAX_RATE = 0.08; // 8% tax

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { item } = action;
      const key = `${item.id}-${item.size}`;
      const existing = state.items.find(i => i.key === key);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.key === key ? { ...i, quantity: i.quantity + item.quantity } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...item, key }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.key !== action.key) };
    case 'UPDATE_QUANTITY': {
      const { key, delta } = action;
      return {
        ...state,
        items: state.items
          .map(i => (i.key === key ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i))
          .filter(i => i.quantity > 0),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = useCallback((item) => dispatch({ type: 'ADD_ITEM', item }), []);
  const removeItem = useCallback((key) => dispatch({ type: 'REMOVE_ITEM', key }), []);
  const updateQuantity = useCallback((key, delta) => dispatch({ type: 'UPDATE_QUANTITY', key, delta }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);

  return (
    <CartContext.Provider value={{
      items: state.items,
      subtotal,
      tax,
      total,
      itemCount,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      TAX_RATE,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
