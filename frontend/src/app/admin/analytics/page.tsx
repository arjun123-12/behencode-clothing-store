'use client';

import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import PageHeader from '@/components/admin/shared/PageHeader';
import SalesAnalytics from '@/components/admin/analytics/SalesAnalytics';
import RevenueAnalytics from '@/components/admin/analytics/RevenueAnalytics';
import UserAnalytics from '@/components/admin/analytics/UserAnalytics';

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout title="CMS Store Analytics" subtitle="Analyze sales volume, billing revenues, and user registration metrics">
      <div className="space-y-6">
        <PageHeader
          title="Performance Metrics"
          description="Visual indicators representing dynamic store catalog metrics"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <SalesAnalytics />
          <RevenueAnalytics />
          <UserAnalytics />
        </div>
      </div>
    </AdminLayout>
  );
}
