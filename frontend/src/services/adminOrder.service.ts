import axiosInstance from '@/lib/axios';
import { ApiResponse } from '@/types/api';

export const adminOrderService = {
  getOrders: async (): Promise<ApiResponse> => {
    try {
      const response = await axiosInstance.get('/orders');
      return {
        success: true,
        data: response.data?.data?.orders || response.data?.orders || response.data || [],
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to load orders.',
        data: [],
      };
    }
  },

  updateOrderStatus: async (id: string, status: string): Promise<ApiResponse> => {
    try {
      const response = await axiosInstance.put(`/orders/${id}/status`, { orderStatus: status });
      return {
        success: response.data?.success || false,
        message: response.data?.message || 'Order status updated.',
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to update order status.',
        data: null,
      };
    }
  },
};

export default adminOrderService;
