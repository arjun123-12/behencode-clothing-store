import { useQuery, UseQueryResult } from '@tanstack/react-query';
import productService from '@/services/productService';
import { Product } from '@/types/product';

export const useProducts = (params?: { category?: string; search?: string }): UseQueryResult<Product[], Error> => {
  return useQuery<Product[], Error>({
    queryKey: ['products', params],
    queryFn: () => productService.getProducts(params),
  });
};

export default useProducts;
