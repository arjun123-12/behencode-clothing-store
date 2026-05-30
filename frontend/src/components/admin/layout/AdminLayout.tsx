'use client';

import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AdminLayout: React.FC<LayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  const { adminUser, loading, logout } = useAdminAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream/25 flex items-center justify-center select-none">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose mx-auto" />
          <p className="text-[10px] text-light-brown font-bold tracking-widest uppercase">
            Loading Backoffice Session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream/20 flex flex-col md:flex-row text-foreground">
      {/* Sidebar - Hidden on mobile, shown on desktop */}
      <div className="hidden md:block flex-shrink-0">
        <AdminSidebar
          onLogout={logout}
          username={adminUser?.username}
          email={adminUser?.email}
        />
      </div>

      {/* Mobile Drawer Menu Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-fadeIn duration-250 select-none">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs cursor-pointer"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer content */}
          <div className="relative z-10 flex flex-col h-full bg-[#2a1f1a]">
            <AdminSidebar
              onLogout={logout}
              username={adminUser?.username}
              email={adminUser?.email}
            />
          </div>
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header toolbar */}
        <AdminHeader
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          title={title}
          subtitle={subtitle}
        />

        {/* Content Viewport scroll window */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full" data-lenis-prevent>
          <div className="max-w-7xl w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
