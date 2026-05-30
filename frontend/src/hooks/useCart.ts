'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export const useCart = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  // Safely wait for store to hydrate to prevent SSR mismatch
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const store = useCartStore();
  const { user } = useAuthStore();
  const userId = user ? user._id : 'guest';

  if (!isHydrated) {
    return {
      cartItems: [],
      isCartOpen: false,
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      setIsCartOpen: () => {},
      cartCount: 0,
      cartTotal: 0,
    };
  }

  const activeItems = store.carts?.[userId] || [];

  return {
    cartItems: activeItems,
    isCartOpen: store.isCartOpen,
    addToCart: store.addToCart,
    removeFromCart: store.removeFromCart,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    setIsCartOpen: store.setIsCartOpen,
    cartCount: activeItems.reduce((total, item) => total + item.quantity, 0),
    cartTotal: activeItems.reduce((total, item) => total + item.price * item.quantity, 0),
  };
};

export default useCart;

