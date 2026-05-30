'use client';

import React from 'react';
import { useAuth as useAuthHook } from '@/hooks/useAuth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const useAuth = useAuthHook;
