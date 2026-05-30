import { Product, Category, Review } from '@/types/product';
import { User } from '@/types/user';
import { Order } from '@/types/order';

export interface AdminCategory extends Category {
  parent: any;
}

export interface AdminProduct extends Product {
  inStock?: boolean;
}

export interface AdminUser extends User {}

export interface AdminReview extends Review {
  product: {
    name: string;
  };
}

export interface AdminOrder extends Order {
  orderId: string;
  customerDetails: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}
