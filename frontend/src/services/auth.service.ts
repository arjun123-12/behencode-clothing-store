import axiosInstance from '@/lib/axios';
import { User, AuthResponse } from '@/types/user';
import { ApiResponse } from '@/types/api';

export const authService = {
  login: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const resData = response.data;
      const success = resData?.success;
      const token = resData?.data?.token || resData?.token;
      const userData = resData?.data || resData;

      if (success && token) {
        const user: User = {
          _id: userData._id || userData.user?._id || userData.userId,
          username: userData.username || userData.user?.username || 'User',
          email: userData.email || userData.user?.email || email,
          role: userData.role || userData.user?.role || 'user',
        };
        return {
          success: true,
          data: {
            token,
            user,
          },
        };
      }
      return {
        success: false,
        message: resData?.message || 'Login failed.',
        data: null as any,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Server connection error.',
        data: null as any,
      };
    }
  },

  register: async (username: string, email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await axiosInstance.post('/auth/register', {
        username,
        email,
        password,
        role: 'user',
      });
      const resData = response.data;
      const success = resData?.success;
      const token = resData?.data?.token || resData?.token;
      const userData = resData?.data || resData;

      if (success && token) {
        const user: User = {
          _id: userData._id || userData.user?._id || userData.userId,
          username: userData.username || userData.user?.username || username,
          email: userData.email || userData.user?.email || email,
          role: userData.role || userData.user?.role || 'user',
        };
        return {
          success: true,
          data: {
            token,
            user,
          },
        };
      }
      return {
        success: false,
        message: resData?.message || 'Registration failed.',
        data: null as any,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Server connection error.',
        data: null as any,
      };
    }
  },
};

export default authService;
