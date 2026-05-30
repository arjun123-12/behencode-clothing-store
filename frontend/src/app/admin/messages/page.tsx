'use client';

import React, { useEffect, useState } from 'react';

// Components
import AdminLayout from '@/components/admin/layout/AdminLayout';
import PageHeader from '@/components/admin/shared/PageHeader';
import MessagesTable from '@/components/admin/messages/MessagesTable';

// Hooks
import { useDashboardData } from '@/hooks/admin/useDashboardData';

export default function AdminMessagesPage() {
  const {
    messages,
    loading,
    alert,
    deleteMessage,
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

  return (
    <AdminLayout title="Customer Inquiries" subtitle="Respond to incoming contact and assistance emails">
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
            Resolving Support Inbox...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <PageHeader
            title="Support Inbox"
            description={`${messages.length} customer messages pending review`}
          />
          <div className="bg-background border border-border-custom/30 p-6 rounded-3xl">
            <MessagesTable
              messages={messages}
              onDelete={deleteMessage}
              formatDate={formatDate}
            />
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
