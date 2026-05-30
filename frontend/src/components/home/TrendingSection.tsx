'use client';

import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types/product';

interface TrendingSectionProps {
  products: Product[];
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: Product) => void;
  isLoading?: boolean;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  products = [],
  wishlist = [],
  onToggleWishlist,
  onAddToCart,
  isLoading = false,
}) => {
  return (
    <section className="py-20 bg-cream/20 border-t border-border-custom/30 select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16 animate-fadeIn">
          <p className="font-caveat text-2xl text-rose mb-2">What Everyone Is Eyeing</p>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold tracking-wide text-foreground">
            Trending Products
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
            <span className="text-2xl">🔥</span>
            <p className="text-xs text-light-brown mt-2">No trending products found.</p>
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
                  badge="Hot"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingSection;
