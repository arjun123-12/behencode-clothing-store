'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { Category } from '@/types/product';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

interface MobileFiltersProps {
  isOpen: boolean;
  onClose: () => void;
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

export const MobileFilters: React.FC<MobileFiltersProps> = ({
  isOpen,
  onClose,
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50 cursor-pointer lg:hidden"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-80 max-w-full bg-background border-r border-border-custom p-6 z-50 overflow-y-auto lg:hidden select-none"
          >
            <div className="flex justify-between items-center border-b border-border-custom pb-4 mb-6">
              <span className="font-playfair text-lg font-bold text-foreground">Filters</span>
              <button
                type="button"
                onClick={onClose}
                className="text-foreground hover:text-rose cursor-pointer"
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Search */}
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

              {/* Categories */}
              <div>
                <h3 className="text-xs tracking-wider font-bold text-foreground mb-3 uppercase">Category</h3>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      onCategorySelect('All');
                      onClose();
                    }}
                    className={`block text-xs font-medium cursor-pointer ${
                      selectedCategory === 'All' ? 'text-rose font-bold' : 'text-mid'
                    }`}
                  >
                    All Collection
                  </button>
                  
                  {categoriesTree.map((cat: any) => (
                    <div key={cat._id} className="pl-1 space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          onCategorySelect(cat._id);
                          onClose();
                        }}
                        className={`block text-xs font-bold cursor-pointer transition-colors text-left ${
                          selectedCategory === cat._id ? 'text-rose' : 'text-foreground'
                        }`}
                      >
                        {cat.name}
                      </button>
                      
                      {cat.subCategories && cat.subCategories.length > 0 && (
                        <div className="pl-2 space-y-1 border-l border-border-custom/30">
                          {cat.subCategories.map((sub: any) => (
                            <div key={sub._id}>
                              <button
                                type="button"
                                onClick={() => {
                                  onCategorySelect(sub._id);
                                  onClose();
                                }}
                                className={`block text-[11px] font-semibold cursor-pointer transition-colors text-left ${
                                  selectedCategory === sub._id ? 'text-rose' : 'text-mid'
                                }`}
                              >
                                {sub.name}
                              </button>
                              
                              {sub.subSubCategories && sub.subSubCategories.length > 0 && (
                                <div className="pl-2 space-y-0.5">
                                  {sub.subSubCategories.map((subSub: any) => (
                                    <button
                                      key={subSub._id}
                                      type="button"
                                      onClick={() => {
                                        onCategorySelect(subSub._id);
                                        onClose();
                                      }}
                                      className={`block text-[10px] font-medium cursor-pointer transition-colors text-left ${
                                        selectedCategory === subSub._id ? 'text-rose font-bold' : 'text-light-brown'
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

              {/* Sizes */}
              <div>
                <h3 className="text-xs tracking-wider font-bold text-foreground mb-3 uppercase">Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => onSizeSelect(selectedSize === size ? '' : size)}
                      className={`w-8 h-8 rounded-full border text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'bg-rose border-rose text-white shadow-sm'
                          : 'border-border-custom bg-cream text-foreground'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
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
                  className="w-full accent-rose"
                />
              </div>

              {/* Buttons */}
              <div className="pt-6 space-y-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full bg-rose text-white text-xs tracking-widest font-semibold py-3 rounded-full hover:bg-mid transition-all cursor-pointer"
                >
                  APPLY FILTERS
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClearFilters();
                    onClose();
                  }}
                  className="w-full bg-cream text-foreground border border-border-custom text-xs tracking-widest font-semibold py-3 rounded-full hover:border-rose hover:text-rose transition-all cursor-pointer"
                >
                  RESET ALL
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileFilters;
