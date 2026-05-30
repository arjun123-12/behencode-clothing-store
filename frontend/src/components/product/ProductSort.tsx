'use client';

import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

interface ShopHeaderProps {
  filteredCount: number;
  sortBy: string;
  onSortChange: (val: string) => void;
  onOpenMobileFilters: () => void;
  selectedCategoryName: string;
}

export const ShopHeader: React.FC<ShopHeaderProps> = ({
  filteredCount,
  sortBy,
  onSortChange,
  onOpenMobileFilters,
  selectedCategoryName,
}) => {
  return (
    <div className="select-none">
      {/* PAGE HEADER */}
      <div className="text-center mb-12 animate-fadeIn">
        <h2 className="font-playfair text-3xl md:text-5xl font-bold tracking-wide text-foreground uppercase">
          {selectedCategoryName === 'All' ? 'Our Collection' : selectedCategoryName}
        </h2>
        <p className="font-caveat text-xl text-rose mt-2">
          Sisterhood approved, effortlessly gorgeous
        </p>
      </div>

      {/* FILTER CONTROL BAR */}
      <div className="flex flex-wrap items-center justify-between border-b border-border-custom pb-6 mb-8 gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="lg:hidden flex items-center gap-2 border border-border-custom px-4 py-2 rounded-full text-xs font-semibold hover:border-rose cursor-pointer text-foreground"
          >
            <SlidersHorizontal size={14} /> FILTERS
          </button>
          <span className="text-xs text-light-brown font-medium">
            Showing {filteredCount} beautiful items
          </span>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-light-brown font-medium hidden sm:inline">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="border border-border-custom px-4 py-2 rounded-full text-xs font-semibold focus:outline-none focus:border-rose bg-cream text-foreground cursor-pointer"
          >
            <option value="newest" className="bg-background text-foreground">Newest First</option>
            <option value="newin" className="bg-background text-foreground">Arrivals</option>
            <option value="bestseller" className="bg-background text-foreground">Bestsellers</option>
            <option value="price-low" className="bg-background text-foreground">Price: Low to High</option>
            <option value="price-high" className="bg-background text-foreground">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ShopHeader;
