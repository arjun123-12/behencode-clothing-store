'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/home/ProductCard';
import { Product } from '@/types/product';

interface ShopGridProps {
  products: Product[];
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: Product) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

export const ShopGrid: React.FC<ShopGridProps> = ({
  products = [],
  wishlist = [],
  onToggleWishlist,
  onAddToCart,
  onClearFilters,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-pulse select-none">
        {[...Array(6)].map((_, i) => (
          <ProductCard key={i} isLoading={true} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-cream/10 rounded-2xl border border-dashed border-border-custom select-none animate-fadeIn">
        <span className="text-4xl">🍃</span>
        <h3 className="font-playfair text-xl font-bold mt-4 text-foreground">No Outfits Found</h3>
        <p className="text-xs text-light-brown mt-2">
          Try widening your search filters or resetting them to start fresh.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-6 bg-rose text-white text-xs tracking-widest font-semibold px-6 py-2.5 rounded-full hover:bg-mid transition-all cursor-pointer"
        >
          RESET FILTERS
        </button>
      </div>
    );
  }

  return (
    <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      <AnimatePresence mode="popLayout">
        {products.map((product) => (
          <motion.div
            layout
            key={product._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <ProductCard
              product={product}
              isWishlisted={wishlist.includes(product._id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              badge={product.isNewIn ? 'New' : undefined}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default ShopGrid;
