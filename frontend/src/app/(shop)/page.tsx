'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types/product';
import useProducts from '@/hooks/useProducts';

// Import Home modular components
import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import NewInSection from '@/components/home/NewInSection';
import BestsellerSection from '@/components/home/BestsellerSection';
import TrendingSection from '@/components/home/TrendingSection';
import StorySection from '@/components/home/StorySection';
import TrustBar from '@/components/home/TrustBar';

export default function HomePage() {
  const { data: products = [], isLoading } = useProducts();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { addToCart } = useCart();
  const [newArrivalsLimit, setNewArrivalsLimit] = useState(8);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLimit = localStorage.getItem('behencode_settings_new_limit');
      if (savedLimit) {
        setNewArrivalsLimit(parseInt(savedLimit, 10) || 8);
      }
    }
  }, []);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 1. New Collection
  const newInProducts = [...products]
    .filter((p) => p.isNewIn)
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, newArrivalsLimit);

  // 2. Best Sellers
  const bestsellerProducts = [...products]
    .filter((p) => p.isBestseller)
    .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));

  // 3. Trending
  const trendingProducts = [...products]
    .filter((p) => p.isTrending)
    .sort((a, b) => (b.views || 0) - (a.views || 0));

  const handleAddToCart = (product: Product) => {
    addToCart(product, product.sizes?.[0] || 'S');
  };

  return (
    <div className="w-full relative overflow-x-hidden">
      <HeroSection />
      <CategorySection products={products} />
      <NewInSection
        products={newInProducts}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
        onAddToCart={handleAddToCart}
        isLoading={isLoading}
      />
      <BestsellerSection
        products={bestsellerProducts}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
        onAddToCart={handleAddToCart}
        isLoading={isLoading}
      />
      <TrendingSection
        products={trendingProducts}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
        onAddToCart={handleAddToCart}
        isLoading={isLoading}
      />
      <StorySection />
      <TrustBar />
    </div>
  );
}
