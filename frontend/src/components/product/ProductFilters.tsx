'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Category } from '@/types/product';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

interface ShopSidebarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategorySelect: (id: string) => void;
  dbCategories: Category[];
  selectedSize: string;
  onSizeSelect: (size: string) => void;
  maxPrice: number;
  onMaxPriceChange: (price: number) => void;
  onClearFilters: () => void;
}

export const ShopSidebar: React.FC<ShopSidebarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  dbCategories,
  selectedSize,
  onSizeSelect,
  maxPrice,
  onMaxPriceChange,
  onClearFilters,
}) => {
  const buildSidebarCategories = () => {
    const list = Array.isArray(dbCategories) ? dbCategories : [];
    const level1 = list.filter((c) => !c.parent);
    
    if (level1.length === 0) {
      return [
        { _id: 'Tops', name: 'Tops' },
        { _id: 'Bottoms', name: 'Bottoms' },
        { _id: 'Dresses', name: 'Dresses' },
        { _id: 'Coord Sets', name: 'Coord Sets' },
        { _id: 'Winter Collection', name: 'Winter Collection' },
      ];
    }

    return level1.map((l1) => {
      const level2 = list.filter(
        (c) => c.parent && (typeof c.parent === 'object' ? c.parent._id === l1._id : c.parent === l1._id)
      );
      const subCategories = level2.map((l2) => {
        const level3 = list.filter(
          (c) => c.parent && (typeof c.parent === 'object' ? c.parent._id === l2._id : c.parent === l2._id)
        );
        return { ...l2, subSubCategories: level3 };
      });
      return { ...l1, subCategories };
    });
  };

  const categoriesTree = buildSidebarCategories();

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block space-y-8 bg-cream/30 p-6 rounded-2xl border border-border-custom/50 select-none">
      {/* Search bar */}
      <div>
        <h3 className="text-xs tracking-wider font-bold text-foreground mb-3 uppercase">Search</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Find outfits..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-border-custom rounded-full bg-cream text-xs focus:outline-none focus:border-rose text-foreground"
          />
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-light-brown" />
        </div>
      </div>

      {/* Categories list */}
      <div>
        <h3 className="text-xs tracking-wider font-bold text-foreground mb-3 uppercase">Category</h3>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => onCategorySelect('All')}
            className={`block text-xs font-medium cursor-pointer transition-colors text-left ${
              selectedCategory === 'All' ? 'text-rose font-bold' : 'text-mid hover:text-rose'
            }`}
          >
            All Collection
          </button>
          
          {categoriesTree.map((cat: any) => (
            <div key={cat._id} className="space-y-1 pl-0.5">
              <button
                type="button"
                onClick={() => onCategorySelect(cat._id)}
                className={`block text-xs font-bold cursor-pointer transition-colors text-left ${
                  selectedCategory === cat._id ? 'text-rose' : 'text-foreground hover:text-rose'
                }`}
              >
                {cat.name}
              </button>
              
              {cat.subCategories && cat.subCategories.length > 0 && (
                <div className="pl-2.5 space-y-1 border-l border-border-custom/30 ml-1">
                  {cat.subCategories.map((sub: any) => (
                    <div key={sub._id}>
                      <button
                        type="button"
                        onClick={() => onCategorySelect(sub._id)}
                        className={`block text-[11px] font-semibold cursor-pointer transition-colors text-left ${
                          selectedCategory === sub._id ? 'text-rose' : 'text-mid hover:text-rose'
                        }`}
                      >
                        {sub.name}
                      </button>
                      
                      {sub.subSubCategories && sub.subSubCategories.length > 0 && (
                        <div className="pl-2.5 space-y-0.5 border-l border-border-custom/10 ml-0.5">
                          {sub.subSubCategories.map((subSub: any) => (
                            <button
                              key={subSub._id}
                              type="button"
                              onClick={() => onCategorySelect(subSub._id)}
                              className={`block text-[10px] font-medium cursor-pointer transition-colors text-left ${
                                selectedCategory === subSub._id
                                  ? 'text-rose font-bold'
                                  : 'text-light-brown hover:text-rose'
                              }`}
                            >
                              {subSub.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sizes filter */}
      <div>
        <h3 className="text-xs tracking-wider font-bold text-foreground mb-3 uppercase">Filter by Size</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => onSizeSelect(selectedSize === size ? '' : size)}
              className={`w-8 h-8 rounded-full border text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                selectedSize === size
                  ? 'bg-rose border-rose text-white shadow-sm'
                  : 'border-border-custom bg-cream hover:border-rose text-foreground'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Price slider */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs tracking-wider font-bold text-foreground uppercase">Max Price</h3>
          <span className="text-xs font-bold text-rose">₹{maxPrice}</span>
        </div>
        <input
          type="range"
          min="500"
          max="5000"
          step="100"
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className="w-full accent-rose cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-light-brown mt-1">
          <span>₹500</span>
          <span>₹5,000</span>
        </div>
      </div>

      {/* Clear filters */}
      <button
        type="button"
        onClick={onClearFilters}
        className="w-full bg-cream text-foreground border border-border-custom hover:border-rose hover:text-rose text-xs tracking-widest font-semibold py-2.5 rounded-full transition-colors cursor-pointer"
      >
        RESET ALL
      </button>
    </aside>
  );
};

export default ShopSidebar;
