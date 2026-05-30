export interface DashboardStats {
  totalProducts: number;
  outOfStockCount: number;
  bestsellersCount: number;
  newArrivalsCount: number;
  messagesCount: number;
  totalRevenue: number;
  totalOrdersCount: number;
}

export interface AdminMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}
