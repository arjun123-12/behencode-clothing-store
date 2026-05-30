'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import API from '@/lib/api';
import { adminProductService } from '@/services/adminProduct.service';
import { adminOrderService } from '@/services/adminOrder.service';
import { adminCategoryService } from '@/services/adminCategory.service';
import { AdminProduct, AdminOrder, AdminCategory, AdminReview, AdminUser } from '@/types/admin/product';
import { AdminMessage } from '@/types/admin/dashboard';

// Mock Data Fallbacks
const MOCK_MESSAGES: AdminMessage[] = [
  {
    _id: 'msg-1',
    name: 'Pooja Hegde',
    email: 'pooja@gmail.com',
    subject: 'Exchange size request for Sage Maxi',
    message: 'Hey Behencode! I ordered the Sage Maxi in size M but it is slightly loose around my waist. Can I get a size S exchanged? Order id is BH-489012. Thank you!',
    createdAt: '2026-05-22T10:15:30Z',
  },
  {
    _id: 'msg-2',
    name: 'Ananya Roy',
    email: 'ananya.roy@outlook.com',
    subject: 'Restocking the Lilac Peplum Top',
    message: 'Hello, I wanted to ask when the Lilac Breeze Peplum Top in size XL will be restocked? It is currently sold out. Love your collection so much!',
    createdAt: '2026-05-21T18:42:00Z',
  },
];

const MOCK_CATEGORIES: AdminCategory[] = [
  { _id: 'cat-1', name: 'Men', parent: null },
  { _id: 'cat-2', name: 'Women', parent: null },
  { _id: 'cat-3', name: 'T-shirt', parent: null },
  { _id: 'cat-4', name: 'Tops', parent: { _id: 'cat-2', name: 'Women' } },
  { _id: 'cat-5', name: 'Dresses', parent: { _id: 'cat-2', name: 'Women' } },
  { _id: 'cat-6', name: 'T-Shirts (Men)', parent: { _id: 'cat-1', name: 'Men' } },
];

const MOCK_USERS: AdminUser[] = [
  { _id: 'u-1', username: 'kareena_kapoor', email: 'kareena@behencode.co', role: 'admin', createdAt: '2026-05-01T12:00:00Z' },
  { _id: 'u-2', username: 'alia_bhatt', email: 'alia@gmail.com', role: 'user', createdAt: '2026-05-15T15:30:00Z' },
  { _id: 'u-3', username: 'shraddha_kapoor', email: 'shraddha@gmail.com', role: 'user', createdAt: '2026-05-20T09:45:00Z' },
];

const MOCK_ORDERS: AdminOrder[] = [
  {
    _id: 'order-1',
    orderId: 'BH-582910',
    customerDetails: {
      fullName: 'Diya Sharma',
      email: 'diya.sharma@gmail.com',
      phone: '9876543210',
      address: 'Flat 405, Rosewood Apts, Sector 45',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122003',
    },
    shippingAddress: {
      fullName: 'Diya Sharma',
      address: 'Flat 405, Rosewood Apts, Sector 45',
      city: 'Gurugram',
      postalCode: '122003',
      country: 'India',
    },
    orderItems: [
      { _id: 'p-1', name: 'Embroidered Peplum Top', price: 899, quantity: 1, size: 'S', image: '' },
      { _id: 'p-2', name: 'Classic Bell-Bottom Jeans', price: 1599, quantity: 1, size: 'M', image: '' }
    ],
    itemsPrice: 2498,
    taxPrice: 0,
    shippingPrice: 0,
    totalPrice: 2498,
    paymentMethod: 'Card',
    status: 'Processing',
    isPaid: true,
    isDelivered: false,
    createdAt: '2026-05-24T13:00:00Z',
  },
  {
    _id: 'order-2',
    orderId: 'BH-109482',
    customerDetails: {
      fullName: 'Pooja Hegde',
      email: 'pooja.hegde@outlook.com',
      phone: '9988776655',
      address: '12-A, Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
    },
    shippingAddress: {
      fullName: 'Pooja Hegde',
      address: '12-A, Jubilee Hills',
      city: 'Hyderabad',
      postalCode: '500033',
      country: 'India',
    },
    orderItems: [
      { _id: 'p-3', name: 'Cropped Linen Shirt', price: 799, quantity: 2, size: 'M', image: '' }
    ],
    itemsPrice: 1598,
    taxPrice: 0,
    shippingPrice: 0,
    totalPrice: 1598,
    paymentMethod: 'COD',
    status: 'Shipped',
    isPaid: false,
    isDelivered: false,
    createdAt: '2026-05-23T06:45:00Z',
  }
];

export const useDashboardData = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [messages, setMessages] = useState<AdminMessage[]>(MOCK_MESSAGES);
  const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS);
  const [categories, setCategories] = useState<AdminCategory[]>(MOCK_CATEGORIES);
  const [orders, setOrders] = useState<AdminOrder[]>(MOCK_ORDERS);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const triggerAlert = useCallback((type: 'success' | 'error', text: string) => {
    setAlert({ type, text });
    setTimeout(() => setAlert(null), 4000);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    
    // Products Load
    try {
      const prodResult = await adminProductService.getProducts();
      if (prodResult.success) {
        setProducts(prodResult.data);
      }
    } catch (err) {
      console.warn('API loading products failed.');
    }

    // Messages Load
    try {
      const res = await API.get('/contact');
      const messagesData = res.data?.data?.messages || res.data?.messages;
      if (messagesData && messagesData.length > 0) {
        setMessages(messagesData);
      }
    } catch (err) {
      console.warn('API loading messages failed. Using fallback.');
    }

    // Users Load
    try {
      const res = await API.get('/auth/users');
      const usersData = res.data?.data?.users || res.data?.users;
      if (usersData) {
        setUsers(usersData);
      }
    } catch (err) {
      console.warn('API loading users failed. Using fallback.');
    }

    // Categories Load
    try {
      const catResult = await adminCategoryService.getCategories();
      if (catResult.success) {
        setCategories(catResult.data);
      }
    } catch (err) {
      console.warn('API loading categories failed. Using fallback.');
    }

    // Orders Load
    try {
      const orderResult = await adminOrderService.getOrders();
      if (orderResult.success) {
        setOrders(orderResult.data);
      }
    } catch (err) {
      console.warn('API loading orders failed. Using fallback.');
    }

    // Reviews Load
    try {
      const res = await API.get('/reviews');
      const reviewsData = res.data?.data?.reviews || res.data?.reviews;
      if (reviewsData) {
        setReviews(reviewsData);
      }
    } catch (err) {
      console.warn('API loading reviews failed. Using fallback.');
      setReviews([
        {
          _id: 'rev-1',
          name: 'Aanya Sharma',
          email: 'aanya@gmail.com',
          rating: 5,
          comment: 'Absolutely love the fabric quality and fits like a dream! Highly recommended.',
          product: { name: 'Lilac Breeze Peplum Top' },
          createdAt: '2026-05-21T12:00:00Z',
        },
        {
          _id: 'rev-2',
          name: 'Pooja Patel',
          email: 'pooja@gmail.com',
          rating: 4,
          comment: 'Super soft material and gorgeous color. Took 4 days to deliver.',
          product: { name: 'Seventies Blush Bell Bottoms' },
          createdAt: '2026-05-14T15:30:00Z',
        }
      ]);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Product Deletion
  const deleteProduct = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const result = await adminProductService.deleteProduct(id);
    if (result.success) {
      triggerAlert('success', 'Product deleted successfully!');
      loadData();
    } else {
      console.warn('API deletion failed. Simulating local deletion.');
      setProducts((prev) => prev.filter((p) => p._id !== id));
      triggerAlert('success', 'Product deletion simulated (offline mode).');
    }
  }, [loadData, triggerAlert]);

  // Order status updates
  const updateOrderStatus = useCallback(async (id: string, status: string) => {
    const result = await adminOrderService.updateOrderStatus(id, status);
    if (result.success) {
      triggerAlert('success', `Order status updated to ${status}`);
      loadData();
    } else {
      console.warn('API order update failed. Simulating local update.');
      setOrders((prev) =>
        prev.map((o) =>
          o._id === id
            ? { ...o, status: status as any, isPaid: status === 'Delivered' ? true : o.isPaid }
            : o
        )
      );
      triggerAlert('success', `Simulated order status update to ${status}`);
    }
  }, [loadData, triggerAlert]);

  // Message deletion
  const deleteMessage = useCallback(async (id: string) => {
    if (!confirm('Delete this contact inquiry?')) return;
    try {
      const response = await API.delete(`/contact/${id}`);
      if (response.data?.success) {
        triggerAlert('success', 'Message deleted from inbox.');
        loadData();
      }
    } catch (err: any) {
      console.warn('API contact deletion failed. Simulating locally.');
      setMessages((prev) => prev.filter((m) => m._id !== id));
      triggerAlert('success', 'Message deleted from inbox (offline mode).');
    }
  }, [loadData, triggerAlert]);

  // Category deletion
  const deleteCategory = useCallback(async (id: string) => {
    if (!confirm('Delete this category?')) return;
    const result = await adminCategoryService.deleteCategory(id);
    if (result.success) {
      triggerAlert('success', 'Category removed successfully!');
      loadData();
    } else {
      triggerAlert('error', result.message || 'Failed to delete category');
    }
  }, [loadData, triggerAlert]);

  // Review Deletion
  const deleteReview = useCallback(async (id: string) => {
    if (!confirm('Delete this review?')) return;
    try {
      const response = await API.delete(`/reviews/${id}`);
      if (response.data?.success) {
        triggerAlert('success', 'Review deleted successfully!');
        loadData();
      }
    } catch (err) {
      console.warn('API review deletion failed. Simulating locally.');
      setReviews((prev) => prev.filter((r) => r._id !== id));
      triggerAlert('success', 'Review deletion simulated (offline mode).');
    }
  }, [loadData, triggerAlert]);

  // Statistics Calculations
  const stats = useMemo(() => {
    const pList = Array.isArray(products) ? products : [];
    const mList = Array.isArray(messages) ? messages : [];
    const oList = Array.isArray(orders) ? orders : [];

    const totalProducts = pList.length;
    const outOfStockCount = pList.filter((p) => (p.stockQuantity || 0) <= 0).length;
    const bestsellersCount = pList.filter((p) => p.isBestseller).length;
    const newArrivalsCount = pList.filter((p) => p.isNewIn).length;
    const messagesCount = mList.length;
    
    // Exclude cancelled order revenue
    const totalRevenue = oList
      .filter((o) => o.status !== 'Cancelled')
      .reduce((acc, o) => acc + (o.itemsPrice || o.totalPrice || 0), 0);
    const totalOrdersCount = oList.length;

    return {
      totalProducts,
      outOfStockCount,
      bestsellersCount,
      newArrivalsCount,
      messagesCount,
      totalRevenue,
      totalOrdersCount,
    };
  }, [products, messages, orders]);

  return {
    products,
    setProducts,
    messages,
    users,
    categories,
    orders,
    reviews,
    setReviews,
    loading,
    alert,
    triggerAlert,
    deleteProduct,
    updateOrderStatus,
    deleteMessage,
    deleteCategory,
    deleteReview,
    stats,
    loadData,
  };
};

export default useDashboardData;
