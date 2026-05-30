export interface Review {
  _id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  parent?: string | Category | null;
  createdAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string | Category;
  sizes: string[];
  images: string[];
  stockQuantity: number;
  isBestseller?: boolean;
  isNewIn?: boolean;
  isTrending?: boolean;
  salesCount?: number;
  views?: number;
  rating?: number;
  numReviews?: number;
  reviews?: Review[];
  createdAt?: string;
}
