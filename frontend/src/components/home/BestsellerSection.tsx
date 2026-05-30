'use client';

import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types/product';

interface BestsellerSectionProps {
  products: Product[];
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: Product) => void;
  isLoading?: boolean;
}

export const BestsellerSection: React.FC<BestsellerSectionProps> = ({
  products = [],
  wishlist = [],
  onToggleWishlist,
  onAddToCart,
  isLoading = false,
}) => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 md:px-8 select-none">
      <div className="text-center mb-16">
        <p className="font-caveat text-2xl text-rose mb-2">Most Loved Outfits</p>
        <h2 className="font-playfair text-3xl md:text-4xl font-bold tracking-wide text-foreground">
          Bestsellers
        </h2>
        <div className="w-16 h-0.5 bg-rose mx-auto mt-4" />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <ProductCard key={i} isLoading={true} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-cream/10 border border-dashed border-border-custom rounded-2xl">
          <span className="text-2xl">🍃</span>
          <p className="text-xs text-light-brown mt-2">No bestsellers found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <div key={product._id}>
              <ProductCard
                product={product}
                isWishlisted={wishlist.includes(product._id)}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
                badge="Best"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default BestsellerSection;
