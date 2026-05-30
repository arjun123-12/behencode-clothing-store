import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  adminToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (user: User, token: string) => void;
  loginAdmin: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      adminToken: null,
      isAuthenticated: false,
      isAdmin: false,

      login: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('behencode_token', token);
          localStorage.setItem('behencode_user', JSON.stringify(user));
        }
        set({
          user,
          token,
          isAuthenticated: true,
          isAdmin: user.role === 'admin',
        });
      },

      loginAdmin: (token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('behencode_admin_token', token);
        }
        set({
          adminToken: token,
          isAdmin: true,
        });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('behencode_token');
          localStorage.removeItem('behencode_admin_token');
          localStorage.removeItem('behencode_user');
        }
        set({
          user: null,
          token: null,
          adminToken: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },
    }),
    {
      name: 'behencode_auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        adminToken: state.adminToken,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    }
  )
);

export default useAuthStore;
