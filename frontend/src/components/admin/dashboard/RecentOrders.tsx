'use client';

import React from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/formatCurrency';

interface RecentOrdersProps {
  orders: any[];
}

export const RecentOrders: React.FC<RecentOrdersProps> = ({ orders = [] }) => {
  return (
    <div className="space-y-4 text-left select-none text-foreground">
      <div className="flex items-center justify-between">
        <h3 className="font-playfair text-base font-bold text-foreground uppercase tracking-wide">
          Recent Transactions
        </h3>
        <Link
          href="/admin/orders"
          className="text-[10px] text-rose font-bold uppercase tracking-wider hover:underline"
        >
          View All
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="text-xs text-light-brown py-8 text-center">No orders logged yet.</p>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full text-xs text-left text-foreground">
            <thead>
              <tr className="border-b border-border-custom/30 text-light-brown">
                <th className="py-3 font-bold uppercase tracking-wider">Order ID</th>
                <th className="py-3 font-bold uppercase tracking-wider">Customer</th>
                <th className="py-3 font-bold uppercase tracking-wider">Value</th>
                <th className="py-3 font-bold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order._id} className="border-b border-border-custom/20 hover:bg-cream/10 transition-colors">
                  <td className="py-3.5 font-semibold text-rose hover:underline">
                    <Link href={`/admin/orders/${order._id}`}>{order.orderId || order._id.slice(-6).toUpperCase()}</Link>
                  </td>
                  <td className="py-3.5 font-medium">{order.shippingAddress?.fullName || 'Guest Customer'}</td>
                  <td className="py-3.5 font-bold">{formatCurrency(order.totalAmount)}</td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      order.status === 'delivered'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : order.status === 'shipped'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                    }`}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentOrders;
