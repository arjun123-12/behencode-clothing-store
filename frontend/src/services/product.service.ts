import axiosInstance from '@/lib/axios';
import { Product, Category, Review } from '@/types/product';
import { ApiResponse } from '@/types/api';

export const productService = {
  getProducts: async (params?: { category?: string; search?: string }): Promise<ApiResponse<Product[]>> => {
    try {
      const response = await axiosInstance.get('/products', { params });
      return {
        success: true,
        data: response.data?.data?.products || response.data?.products || response.data || [],
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch products.',
        data: [],
      };
    }
  },

  getProductById: async (id: string): Promise<ApiResponse<Product>> => {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      return {
        success: true,
        data: response.data?.data?.product || response.data?.product || response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch product details.',
        data: null as any,
      };
    }
  },

  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    try {
      const response = await axiosInstance.get('/categories');
      return {
        success: true,
        data: response.data?.data?.categories || response.data?.categories || response.data || [],
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch categories.',
        data: [],
      };
    }
  },

  addReview: async (productId: string, reviewData: { name: string; email: string; rating: number; comment: string }): Promise<ApiResponse<Review>> => {
    try {
      const response = await axiosInstance.post(`/products/${productId}/reviews`, reviewData);
      return {
        success: true,
        data: response.data?.review || response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to submit review.',
        data: null as any,
      };
    }
  },
};

export default productService;
