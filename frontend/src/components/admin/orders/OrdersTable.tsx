'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Clock, ShieldCheck, Truck, XCircle, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/formatCurrency';

interface OrdersTableProps {
  orders: any[];
  onStatusChange: (orderId: string, status: string) => void;
  formatDate: (dateStr: string) => string;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders = [],
  onStatusChange,
  formatDate,
}) => {
  const router = useRouter();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 uppercase tracking-wider">
            <ShieldCheck size={10} /> Delivered
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/25 uppercase tracking-wider">
            <Truck size={10} /> Shipped
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/25 uppercase tracking-wider">
            <Clock size={10} /> Processing
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold bg-rose/10 text-rose border border-rose/25 uppercase tracking-wider">
            <XCircle size={10} /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold bg-gray-500/10 text-gray-600 border border-gray-500/25 uppercase tracking-wider">
            <Clock size={10} /> Pending
          </span>
        );
    }
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-border-custom/30 bg-background shadow-sm select-none">
      {orders.length === 0 ? (
        <div className="py-16 text-center text-light-brown flex flex-col items-center justify-center space-y-2">
          <AlertCircle size={24} className="text-light-brown/60" />
          <p className="text-[10px] font-bold uppercase tracking-wider">No Orders Logged</p>
          <p className="text-[8px] text-light-brown/70">Customer transactions will appear here when placed</p>
        </div>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-cream/15 border-b border-border-custom/30 text-[10px] font-bold tracking-wider uppercase text-light-brown">
              <th className="py-4 px-5">Order ID</th>
              <th className="py-4 px-5">Date</th>
              <th className="py-4 px-5">Customer</th>
              <th className="py-4 px-5">Total Value</th>
              <th className="py-4 px-5">Payment</th>
              <th className="py-4 px-5">Status</th>
              <th className="py-4 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const customerName = order.customerDetails?.fullName || order.shippingAddress?.fullName || 'Anonymous Guest';
              const customerEmail = order.customerDetails?.email || 'N/A';

              return (
                <tr
                  key={order._id}
                  className="border-b border-border-custom/10 hover:bg-cream/5 transition-colors duration-200 text-xs text-foreground"
                >
                  {/* Order ID */}
                  <td className="py-3.5 px-5 font-bold text-foreground">
                    #{order.orderId || order._id.slice(-6).toUpperCase()}
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-5 font-semibold text-light-brown text-[10px]">
                    {formatDate(order.createdAt)}
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-5">
                    <div className="font-bold text-foreground truncate max-w-[150px]">{customerName}</div>
                    <div className="text-[10px] text-light-brown truncate max-w-[150px] mt-0.5">{customerEmail}</div>
                  </td>

                  {/* Total Value */}
                  <td className="py-3.5 px-5 font-bold text-rose">
                    {formatCurrency(order.totalPrice)}
                  </td>

                  {/* Payment */}
                  <td className="py-3.5 px-5">
                    <span className="font-semibold text-light-brown text-[10px] block">{order.paymentMethod}</span>
                    <span className={`inline-block text-[8px] font-bold uppercase tracking-wider mt-0.5 ${
                      order.isPaid ? 'text-emerald-600' : 'text-rose'
                    }`}>
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-5">
                    {getStatusBadge(order.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => router.push(`/admin/orders/${order._id || order.orderId}`)}
                        title="View Order Details"
                        className="p-1.5 border border-border-custom hover:border-rose bg-cream/10 hover:bg-rose hover:text-white rounded-lg transition-all duration-300 cursor-pointer text-foreground flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2.5"
                      >
                        <Eye size={12} /> View
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrdersTable;
