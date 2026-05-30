'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Users, FolderTree, Star, Mail, LogOut, ArrowLeft, Sliders, TrendingUp } from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
  username?: string;
  email?: string;
  activeTab?: string;
  onTabChange?: (tab: any) => void;
  isTabMode?: boolean;
}

export const AdminSidebar: React.FC<SidebarProps> = ({
  onLogout,
  username = 'Admin',
  email = 'admin@behencode.co',
  activeTab,
  onTabChange,
  isTabMode = false,
}) => {
  const pathname = usePathname();

  const menuItems = [
    { id: 'overview', href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', href: '/admin/products', label: 'Products', icon: ShoppingBag },
    { id: 'orders', href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { id: 'categories', href: '/admin/categories', label: 'Categories', icon: FolderTree },
    { id: 'subcategories', href: '/admin/subcategories', label: 'Subcategories', icon: FolderTree },
    { id: 'messages', href: '/admin/messages', label: 'Messages', icon: Mail },
    { id: 'users', href: '/admin/customers', label: 'Users', icon: Users },
    { id: 'reviews', href: '/admin/reviews', label: 'Reviews', icon: Star },
    { id: 'analytics', href: '/admin/analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', href: '/admin/settings', label: 'Settings', icon: Sliders },
  ];

  return (
    <aside className="w-64 bg-[#2a1f1a] text-white/80 h-screen flex flex-col p-6 justify-between select-none">
      <div className="space-y-8 flex-1 flex flex-col min-h-0">
        {/* Logo / Title */}
        <div className="px-2">
          <h1 className="font-playfair text-xl font-bold tracking-widest text-white uppercase">
            Behencode <span className="text-rose">CMS</span>
          </h1>
          <p className="text-[9px] uppercase tracking-[0.2em] text-rose font-semibold mt-1">
            Sisterhood Admin Portal
          </p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href) || activeTab === item.id;
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => isTabMode && onTabChange && onTabChange(item.id)}
                className={`flex items-center gap-3 px-4 py-3 text-xs font-semibold tracking-wider uppercase rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-rose text-white shadow-md'
                    : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={15} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer profile & controls */}
      <div className="space-y-4 pt-6 border-t border-white/5 text-left flex-shrink-0">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-rose/25 text-rose flex items-center justify-center font-bold text-sm uppercase">
            {username.slice(0, 1)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{username}</p>
            <p className="text-[9px] text-white/40 truncate">{email}</p>
          </div>
        </div>

        <div className="space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold tracking-wider uppercase rounded-xl hover:bg-white/5 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Storefront</span>
          </Link>
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-xs font-bold tracking-wider uppercase rounded-xl text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
