import axiosInstance from '@/lib/axios';
import { ApiResponse } from '@/types/api';

export const adminProductService = {
  getProducts: async (): Promise<ApiResponse> => {
    try {
      const response = await axiosInstance.get('/products');
      return {
        success: true,
        data: response.data?.data?.products || response.data?.products || response.data || [],
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to load products.',
        data: [],
      };
    }
  },

  createProduct: async (formData: FormData): Promise<ApiResponse> => {
    try {
      const response = await axiosInstance.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return {
        success: response.data?.success || false,
        message: response.data?.message || 'Product created.',
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to create product.',
        data: null,
      };
    }
  },

  updateProduct: async (id: string, formData: FormData): Promise<ApiResponse> => {
    try {
      const response = await axiosInstance.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return {
        success: response.data?.success || false,
        message: response.data?.message || 'Product updated.',
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to update product.',
        data: null,
      };
    }
  },

  deleteProduct: async (id: string): Promise<ApiResponse> => {
    try {
      const response = await axiosInstance.delete(`/products/${id}`);
      return {
        success: response.data?.success || false,
        message: response.data?.message || 'Product deleted.',
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to delete product.',
        data: null,
      };
    }
  },
};

export default adminProductService;
