'use client';

import React from 'react';
import { Menu, Sparkles } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
  title?: string;
  subtitle?: string;
}

export const AdminHeader: React.FC<HeaderProps> = ({
  onMenuToggle,
  title = 'CMS Control Panel',
  subtitle = 'Behencode Administrative Operations',
}) => {
  return (
    <header className="bg-background border-b border-border-custom/30 px-6 py-4 flex items-center justify-between select-none flex-shrink-0">
      <div className="flex items-center gap-4">
        {/* Menu trigger for mobile */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 -ml-2 text-foreground hover:text-rose rounded-lg cursor-pointer animate-fadeIn"
          aria-label="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        {/* Title block */}
        <div className="text-left">
          <h2 className="font-playfair text-lg font-bold text-foreground tracking-wide flex items-center gap-1.5 uppercase">
            {title} <Sparkles size={14} className="text-rose animate-pulse" />
          </h2>
          <p className="text-[10px] text-light-brown font-medium tracking-wide">
            {subtitle}
          </p>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
