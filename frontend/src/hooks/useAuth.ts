'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import { User } from '@/types/user';

export const useAuth = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const store = useAuthStore();

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    const result = await authService.login(email, password);
    setIsLoading(false);
    
    if (result.success) {
      store.login(result.data.user, result.data.token);
      return result.data.user;
    } else {
      throw new Error(result.message);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<User> => {
    setIsLoading(true);
    const result = await authService.register(username, email, password);
    setIsLoading(false);
    
    if (result.success) {
      store.login(result.data.user, result.data.token);
      return result.data.user;
    } else {
      throw new Error(result.message);
    }
  };

  const logout = () => {
    store.logout();
  };

  if (!isHydrated) {
    return {
      user: null,
      token: null,
      isLoading: true,
      isAuthenticated: false,
      isAdmin: false,
      login,
      register,
      logout,
    };
  }

  return {
    user: store.user,
    token: store.token,
    isLoading: isLoading,
    isAuthenticated: store.isAuthenticated,
    isAdmin: store.isAdmin,
    login,
    register,
    logout,
  };
};

export default useAuth;
