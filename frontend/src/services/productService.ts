import axiosInstance from '@/lib/axios';
import { Product, Category } from '@/types/product';

export const productService = {
  getProducts: async (params?: { category?: string; search?: string }): Promise<Product[]> => {
    const response = await axiosInstance.get('/products', { params });
    const productsData = response.data?.data?.products || response.data?.products || response.data;
    
    if (Array.isArray(productsData)) {
      return productsData;
    }
    
    return [];
  },

  getProductById: async (id: string): Promise<Product | null> => {
    const response = await axiosInstance.get(`/products/${id}`);
    const productData = response.data?.data?.product || response.data?.product || response.data;
    
    if (productData && typeof productData === 'object') {
      return productData as Product;
    }
    
    return null;
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await axiosInstance.get('/categories');
    const categoriesData = response.data?.data?.categories || response.data?.categories || response.data;
    
    if (Array.isArray(categoriesData)) {
      return categoriesData;
    }
    
    return [];
  },
};

export default productService;

