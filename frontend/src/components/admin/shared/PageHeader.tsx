'use client';

import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, action }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-left border-b border-border-custom/20 pb-4 mb-6 select-none animate-fadeIn">
      <div>
        <h1 className="font-playfair text-2xl font-bold text-foreground uppercase tracking-wide">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-light-brown mt-1 font-medium">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
