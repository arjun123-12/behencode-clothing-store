'use client';

import React, { useEffect, useState } from 'react';
import { Users, Mail, UserCheck, ShieldAlert } from 'lucide-react';

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
  } = useDashboardData();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
                  {users.map((u) => (
                    <TableRow key={u._id}>
                      <TableCell className="font-bold text-foreground flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-rose/10 text-rose font-bold text-xs uppercase flex items-center justify-center">
                          {u.username.slice(0, 2)}
                        </div>
                        {u.username}
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
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
