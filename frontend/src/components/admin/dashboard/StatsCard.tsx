'use client';

import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  description?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
}) => {
  return (
    <div className="bg-background border border-border-custom/30 p-6 rounded-3xl space-y-4 text-left select-none shadow-sm hover:shadow-md transition-all duration-300 animate-fadeIn">
      <div className="flex justify-between items-start">
        <div>
          <span className="block text-[10px] font-bold text-light-brown uppercase tracking-wider">{title}</span>
          <h3 className="font-playfair text-2xl font-bold text-foreground mt-1">{value}</h3>
        </div>
        <div className="p-3 bg-rose/10 text-rose rounded-2xl">
          <Icon size={20} />
        </div>
      </div>
      {description && (
        <p className="text-[10px] text-light-brown font-medium tracking-wide">
          {description}
        </p>
      )}
    </div>
  );
};

export default StatsCard;
