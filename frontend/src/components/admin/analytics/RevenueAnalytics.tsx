'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';

export const RevenueAnalytics: React.FC = () => {
  return (
    <div className="bg-background border border-border-custom/30 p-6 rounded-3xl space-y-4 text-left select-none shadow-sm hover:shadow-md transition-all duration-300 animate-fadeIn">
      <div className="flex justify-between items-start">
        <div className="p-3 bg-rose/10 text-rose rounded-2xl">
          <span className="font-bold text-sm">₹</span>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
          <TrendingUp size={10} /> +8.2%
        </span>
      </div>
      <div>
        <span className="block text-[10px] font-bold text-light-brown uppercase tracking-wider">Gross Billing Revenue</span>
        <h3 className="font-playfair text-2xl font-bold text-foreground mt-1">₹2,48,900</h3>
        <p className="text-[10px] text-light-brown mt-1.5 leading-relaxed">
          Analyze checkout invoices, net revenues, and average transaction size.
        </p>
      </div>
      {/* Simple visual bar chart */}
      <div className="pt-2 flex items-end gap-2.5 h-16 w-full">
        <div className="bg-rose/20 rounded-md flex-1 h-[30%]" />
        <div className="bg-rose/20 rounded-md flex-1 h-[45%]" />
        <div className="bg-rose/20 rounded-md flex-1 h-[60%]" />
        <div className="bg-rose/25 rounded-md flex-1 h-[55%]" />
        <div className="bg-rose rounded-md flex-1 h-[85%]" />
      </div>
    </div>
  );
};

export default RevenueAnalytics;
