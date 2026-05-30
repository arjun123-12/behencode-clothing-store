'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/formatCurrency';

interface TopProductsProps {
  products: any[];
}

export const TopProducts: React.FC<TopProductsProps> = ({ products = [] }) => {
  const topItems = products.slice(0, 4);

  return (
    <div className="space-y-4 text-left select-none text-foreground">
      <h3 className="font-playfair text-base font-bold text-foreground uppercase tracking-wide">
        Top Performing Outfits
      </h3>

      {topItems.length === 0 ? (
        <p className="text-xs text-light-brown py-8 text-center">No outfits in catalog.</p>
      ) : (
        <div className="space-y-4">
          {topItems.map((prod) => (
            <div key={prod._id} className="flex items-center gap-3.5 border-b border-border-custom/10 pb-3 last:border-0 last:pb-0">
              <div className="w-11 h-14 rounded-lg bg-cream border border-border-custom/25 overflow-hidden flex-shrink-0">
                {prod.images && prod.images[0] ? (
                  <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs">🍃</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground truncate">{prod.name}</p>
                <p className="text-[10px] text-light-brown mt-0.5">{prod.category?.name || 'Outfit Catalog'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-foreground">{formatCurrency(prod.discountPrice || prod.price)}</p>
                <span className="flex items-center gap-0.5 justify-end text-[8px] font-bold text-green-600 bg-green-50 px-1 rounded mt-0.5">
                  <TrendingUp size={8} /> Active
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopProducts;
