'use client';

import React, { useEffect, useState } from 'react';
import { Users, Mail, UserCheck, ShieldAlert, ChevronDown, ShoppingBag } from 'lucide-react';

// Components
import AdminLayout from '@/components/admin/layout/AdminLayout';
import PageHeader from '@/components/admin/shared/PageHeader';
import StatsCard from '@/components/admin/dashboard/StatsCard';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/admin/ui/table';

// Hooks
import { useDashboardData } from '@/hooks/admin/useDashboardData';

export default function AdminCustomersPage() {
  const {
    users,
    loading,
    alert,
    orders = [],
  } = useDashboardData();

  const [mounted, setMounted] = useState(false);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getUserOrders = (email: string, userId: string) => {
    if (!orders || orders.length === 0) return [];
    return orders.filter(
      (o) =>
        o.customerDetails?.email?.toLowerCase() === email.toLowerCase() ||
        (o.user && (typeof o.user === 'object' ? o.user._id === userId : o.user === userId))
    );
  };

  const formatOrderDate = (dateStr: string) => {
    if (!mounted || !dateStr) return '';
    return new Date(dateStr).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateStr: string) => {
    if (!mounted || !dateStr) return '';
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const adminCount = users.filter((u) => u.role === 'admin').length;
  const customerCount = users.filter((u) => u.role !== 'admin').length;

  return (
    <AdminLayout title="Registered Accounts" subtitle="Manage registered storefront and backoffice accounts">
      {/* Alert toast info */}
      {alert && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 border rounded-2xl flex items-center shadow-lg animate-fadeIn font-semibold text-xs ${
          alert.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {alert.text}
        </div>
      )}

      {loading ? (
        <div className="py-24 text-center select-none space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose mx-auto" />
          <p className="text-[10px] text-light-brown font-bold tracking-widest uppercase">
            Resolving Account Registry...
          </p>
        </div>
      ) : (
        <div className="space-y-8 animate-fadeIn">
          {/* Summary KPI */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatsCard
              title="Total Accounts"
              value={users.length}
              icon={Users}
              description="Registered user profiles"
            />
            <StatsCard
              title="Store Buyers"
              value={customerCount}
              icon={UserCheck}
              description="Customer tier accounts"
            />
            <StatsCard
              title="Administrators"
              value={adminCount}
              icon={ShieldAlert}
              description="Privileged backoffice accounts"
            />
          </div>

          <div className="space-y-6">
            <PageHeader
              title="User Directory"
              description={`${users.length} accounts in database`}
            />
            <div className="bg-background border border-border-custom/30 p-6 rounded-3xl select-none">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User Name</TableHead>
                    <TableHead>Email Address</TableHead>
                    <TableHead>Privilege Level</TableHead>
                    <TableHead>Registration Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => {
                    const userOrders = getUserOrders(u.email, u._id);
                    const isExpanded = expandedUser === u._id;
                    return (
                      <React.Fragment key={u._id}>
                        <TableRow 
                          onClick={() => setExpandedUser(isExpanded ? null : u._id)}
                          className="cursor-pointer hover:bg-cream/10 select-none transition-colors"
                        >
                          <TableCell className="font-bold text-foreground flex items-center gap-2">
                            <ChevronDown 
                              size={16} 
                              className={`text-light-brown transition-transform duration-200 flex-shrink-0 ${
                                isExpanded ? 'rotate-180 text-rose' : ''
                              }`} 
                            />
                            <div className="w-7 h-7 rounded-full bg-rose/10 text-rose font-bold text-xs uppercase flex items-center justify-center flex-shrink-0">
                              {u.username.slice(0, 2)}
                            </div>
                            <div className="flex flex-col">
                              <span className="truncate max-w-[120px] sm:max-w-none">{u.username}</span>
                              <span className="text-[9px] text-rose font-bold tracking-widest uppercase block mt-0.5">
                                {userOrders.length} {userOrders.length === 1 ? 'order' : 'orders'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-light-brown font-semibold">
                            <span className="flex items-center gap-1.5">
                              <Mail size={12} className="text-light-brown/50" /> {u.email}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2.5 py-0.5 rounded-full border text-[8px] font-bold uppercase tracking-wider ${
                              u.role === 'admin' ? 'bg-rose/10 border-rose/30 text-rose' : 'bg-cream text-mid border-border-custom/30'
                            }`}>
                              {u.role || 'User'}
                            </span>
                          </TableCell>
                          <TableCell className="text-light-brown font-semibold">{formatDate(u.createdAt || '')}</TableCell>
                        </TableRow>
                        {isExpanded && (
                          <TableRow className="bg-cream/5 hover:bg-cream/5 border-b border-border-custom/20">
                            <TableCell colSpan={4} className="p-6">
                              {userOrders.length === 0 ? (
                                <p className="text-xs text-light-brown text-center py-2">
                                  This account has not placed any orders yet.
                                </p>
                              ) : (
                                <div className="space-y-4">
                                  <h4 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-1.5 border-b border-border-custom/10 pb-2">
                                    <ShoppingBag size={14} className="text-rose" /> Order History ({userOrders.length})
                                  </h4>
                                  <div className="border border-border-custom/20 rounded-2xl overflow-hidden divide-y divide-border-custom/10 bg-background shadow-xs">
                                    {userOrders.map((order) => (
                                      <div key={order._id} className="p-4 space-y-3">
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center text-xs border-b border-border-custom/5 pb-2 gap-2">
                                          <div>
                                            <span className="font-bold text-rose">ID: {order.orderId || order._id.slice(-6).toUpperCase()}</span>
                                            <span className="text-light-brown font-medium ml-3">
                                              Time: {formatOrderDate(order.createdAt || '')}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${
                                              order.status === 'Delivered'
                                                ? 'bg-green-50 text-green-700 border border-green-200'
                                                : order.status === 'Shipped'
                                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                            }`}>
                                              {order.status || 'Pending'}
                                            </span>
                                            <span className="font-bold text-foreground bg-cream px-2 py-0.5 rounded border border-border-custom/25 text-[10px]">
                                              Total: ₹{order.totalAmount || order.totalPrice}
                                            </span>
                                          </div>
                                        </div>
                                        
                                        {/* Order items list */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-1">
                                          {(order.orderItems || order.items || []).map((item: any, idx: number) => (
                                            <div key={item._id || idx} className="flex items-center gap-3 text-xs">
                                              <div className="w-9 h-12 bg-cream rounded-md overflow-hidden border border-border-custom/15 flex-shrink-0">
                                                {item.image ? (
                                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                  <div className="w-full h-full flex items-center justify-center bg-rose/10 text-rose font-bold text-[10px] uppercase">
                                                    {item.name.slice(0, 1)}
                                                  </div>
                                                )}
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <p className="font-bold text-foreground truncate">{item.name}</p>
                                                <p className="text-[10px] text-light-brown font-semibold mt-0.5">
                                                  Size: <strong className="text-foreground">{item.size}</strong> | Qty: <strong className="text-foreground">{item.quantity}</strong> | Price: <strong className="text-foreground">₹{item.price}</strong>
                                                </p>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
