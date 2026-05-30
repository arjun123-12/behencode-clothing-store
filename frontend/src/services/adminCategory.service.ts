import axiosInstance from '@/lib/axios';
import { ApiResponse } from '@/types/api';

export const adminCategoryService = {
  getCategories: async (): Promise<ApiResponse> => {
    try {
      const response = await axiosInstance.get('/categories');
      return {
        success: true,
        data: response.data?.data?.categories || response.data?.categories || response.data || [],
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to load categories.',
        data: [],
      };
    }
  },

  createCategory: async (categoryData: { name: string; parent?: string | null }): Promise<ApiResponse> => {
    try {
      const response = await axiosInstance.post('/categories', categoryData);
      return {
        success: response.data?.success || false,
        message: response.data?.message || 'Category created.',
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to create category.',
        data: null,
      };
    }
  },

  deleteCategory: async (id: string): Promise<ApiResponse> => {
    try {
      const response = await axiosInstance.delete(`/categories/${id}`);
      return {
        success: response.data?.success || false,
        message: response.data?.message || 'Category deleted.',
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to delete category.',
        data: null,
      };
    }
  },
};

export default adminCategoryService;
