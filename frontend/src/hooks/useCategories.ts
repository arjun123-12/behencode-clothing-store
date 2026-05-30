import { useQuery, UseQueryResult } from '@tanstack/react-query';
import productService from '@/services/productService';
import { Category } from '@/types/product';

export const useCategories = (): UseQueryResult<Category[], Error> => {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
  });
};

export default useCategories;
