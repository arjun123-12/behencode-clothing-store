'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types/product';
import useProducts from '@/hooks/useProducts';

// Import storefront layout
import SiteLayout from './(storefront)/layout';

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

  // 1. New Collection: Display latest products added by admin, limited dynamically
  const newInProducts = [...products]
    .filter((p) => p.isNewIn)
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, newArrivalsLimit);

  // 2. Best Sellers: Display products marked as bestseller, sorted by salesCount descending
  const bestsellerProducts = [...products]
    .filter((p) => p.isBestseller)
    .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));

  // 3. Trending: Display products marked as trending, sorted by popularity/views descending
  const trendingProducts = [...products]
    .filter((p) => p.isTrending)
    .sort((a, b) => (b.views || 0) - (a.views || 0));

  const handleAddToCart = (product: Product) => {
    addToCart(product, product.sizes?.[0] || 'S');
  };

  return (
    <SiteLayout>
      <div className="w-full relative overflow-x-hidden">
        {/* 1. Hero banner section with dynamic 3D blossoms backdrop */}
        <HeroSection />
        
        {/* 2. Shop categories navigation grids */}
        <CategorySection products={products} />
        
        {/* 3. New Arrivals Swiper Carousel with Shimmer pulse skeleton loading state */}
        <NewInSection
          products={newInProducts}
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
          onAddToCart={handleAddToCart}
          isLoading={isLoading}
        />
        
        {/* 4. Bestsellers responsive catalog grid */}
        <BestsellerSection
          products={bestsellerProducts}
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
          onAddToCart={handleAddToCart}
          isLoading={isLoading}
        />

        {/* 5. Trending Products responsive catalog grid */}
        <TrendingSection
          products={trendingProducts}
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
          onAddToCart={handleAddToCart}
          isLoading={isLoading}
        />
        
        {/* 6. Brand stories and Polaroid collage parallax section */}
        <StorySection />
        
        {/* 7. Brand reassurance/exchanges row */}
        <TrustBar />
      </div>
    </SiteLayout>
  );
}
