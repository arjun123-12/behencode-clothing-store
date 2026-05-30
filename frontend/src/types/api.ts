export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T = any> {
  products: T[];
  page: number;
  pages: number;
  total: number;
}
