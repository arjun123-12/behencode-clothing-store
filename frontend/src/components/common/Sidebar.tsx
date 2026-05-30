'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, Users, Package, BarChart2, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const links = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  ];

  return (
    <aside className="w-64 bg-[#2a1f1a] text-white/80 min-h-screen p-6 border-r border-white/5 flex flex-col justify-between select-none">
      <div className="space-y-8">
        {/* Header/Logo */}
        <div>
          <h2 className="font-playfair text-xl font-bold text-white tracking-wide">
            behencode <span className="text-rose text-sm">Admin</span>
          </h2>
          <p className="text-[8px] tracking-[0.25em] uppercase text-white/40 mt-1">
            control panel
          </p>
        </div>

        {/* Links */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 text-xs font-semibold tracking-wider uppercase rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-rose text-white shadow-md'
                    : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer controls */}
      <div className="space-y-2 pt-6 border-t border-white/5">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-xs font-semibold tracking-wider uppercase rounded-xl hover:bg-white/5 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>View Site</span>
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-4 py-3 text-xs font-semibold tracking-wider uppercase rounded-xl text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
