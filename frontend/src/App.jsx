import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import WelcomeScreen from './pages/WelcomeScreen';
import MenuPage from './pages/MenuPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';

export default function App() {
  const [screen, setScreen] = useState('welcome'); // welcome | menu | checkout | confirmation
  const [orderData, setOrderData] = useState(null);

  const handleStart = () => setScreen('menu');
  const handleCheckout = () => setScreen('checkout');
  const handleOrderPlaced = (data) => {
    setOrderData(data);
    setScreen('confirmation');
  };
  const handleNewOrder = () => {
    setOrderData(null);
    setScreen('welcome');
  };

  return (
    <CartProvider>
      <div className="w-screen h-screen overflow-hidden">
        {screen === 'welcome' && (
          <WelcomeScreen onStart={handleStart} />
        )}
        {screen === 'menu' && (
          <MenuPage onCheckout={handleCheckout} />
        )}
        {screen === 'checkout' && (
          <CheckoutPage onOrderPlaced={handleOrderPlaced} onBack={() => setScreen('menu')} />
        )}
        {screen === 'confirmation' && (
          <ConfirmationPage orderData={orderData} onNewOrder={handleNewOrder} />
        )}
      </div>
    </CartProvider>
  );
}
