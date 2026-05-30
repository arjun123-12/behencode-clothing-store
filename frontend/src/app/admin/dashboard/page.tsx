'use client';

import React from 'react';
import { ShoppingBag, Mail, DollarSign, AlertTriangle } from 'lucide-react';

// Layout & UI
import AdminLayout from '@/components/admin/layout/AdminLayout';
import StatsCard from '@/components/admin/dashboard/StatsCard';
import RecentOrders from '@/components/admin/dashboard/RecentOrders';
import TopProducts from '@/components/admin/dashboard/TopProducts';

// Hooks & Helpers
import { useDashboardData } from '@/hooks/admin/useDashboardData';
import { formatCurrency } from '@/lib/formatCurrency';

export default function AdminDashboardPage() {
  const {
    products,
    messages,
    orders,
    loading,
    alert,
    stats,
  } = useDashboardData();

  return (
    <AdminLayout title="CMS Analytics Overview" subtitle="High-level indicators showing transaction volume and storefront health">
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
            Resolving Database Logs...
          </p>
        </div>
      ) : (
        <div className="space-y-8 animate-fadeIn">
          {/* KPI Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Revenue"
              value={formatCurrency(stats.totalRevenue)}
              icon={DollarSign}
              description="All orders checkout value"
            />
            <StatsCard
              title="Orders Logged"
              value={stats.totalOrdersCount}
              icon={ShoppingBag}
              description="Incoming order transactions"
            />
            <StatsCard
              title="Out Of Stock"
              value={stats.outOfStockCount}
              icon={AlertTriangle}
              description="Inventory products at 0"
            />
            <StatsCard
              title="Unread Messages"
              value={stats.messagesCount}
              icon={Mail}
              description="Customer support messages"
            />
          </div>

          {/* Grid Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 bg-background border border-border-custom/30 p-6 rounded-3xl">
              <RecentOrders orders={orders} />
            </div>
            <div className="lg:col-span-4 bg-background border border-border-custom/30 p-6 rounded-3xl">
              <TopProducts products={products} />
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
