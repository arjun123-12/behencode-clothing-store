'use client';

import React from 'react';
import { useCart as useCartHook } from '@/hooks/useCart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const useCart = useCartHook;
