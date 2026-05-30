'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AdminUser } from '@/types/admin/product';

export const useAdminAuth = () => {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(() => {
    if (typeof window === 'undefined') return;

    let token = localStorage.getItem('behencode_admin_token');
    let userStr = localStorage.getItem('behencode_admin_user');

    // Bridge standard user auth to admin auth if they are already logged in as admin
    if (!token || !userStr || token === 'undefined' || userStr === 'undefined') {
      const mainToken = localStorage.getItem('behencode_token');
      const mainUserStr = localStorage.getItem('behencode_user');
      if (mainToken && mainUserStr && mainToken !== 'undefined' && mainUserStr !== 'undefined') {
        try {
          const parsedMainUser = JSON.parse(mainUserStr);
          if (parsedMainUser && parsedMainUser.role === 'admin') {
            token = mainToken;
            userStr = JSON.stringify({
              _id: parsedMainUser._id || parsedMainUser.id,
              username: parsedMainUser.username || 'Admin',
              email: parsedMainUser.email,
              role: 'admin'
            });
            localStorage.setItem('behencode_admin_token', token);
            localStorage.setItem('behencode_admin_user', userStr);
          }
        } catch (e) {
          // ignore parsing error
        }
      }
    }

    if (!token || !userStr || token === 'undefined' || userStr === 'undefined') {
      localStorage.removeItem('behencode_admin_token');
      localStorage.removeItem('behencode_admin_user');
      setAdminUser(null);
      setLoading(false);
      router.push('/admin/login');
    } else {
      try {
        const parsedUser = JSON.parse(userStr);
        setAdminUser(parsedUser);
      } catch (e) {
        localStorage.removeItem('behencode_admin_token');
        localStorage.removeItem('behencode_admin_user');
        setAdminUser(null);
        router.push('/admin/login');
      }
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem('behencode_admin_token');
    localStorage.removeItem('behencode_admin_user');
    setAdminUser(null);
    router.push('/admin/login');
  }, [router]);

  return {
    adminUser,
    loading,
    logout,
    checkAuth,
  };
};

export default useAdminAuth;
