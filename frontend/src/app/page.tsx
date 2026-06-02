'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types/product';
import useProducts from '@/hooks/useProducts';

// Import storefront layout
import SiteLayout from './(shop)/layout';

// Import Home modular components
import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import NewInSection from '@/components/home/NewInSection';
import BestsellerSection from '@/components/home/BestsellerSection';
import StorySection from '@/components/home/StorySection';
import TrustBar from '@/components/home/TrustBar';

export default function HomePage() {
  const { data: products = [], isLoading } = useProducts();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { addToCart } = useCart();

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const newInProducts = products.filter((p) => p.isNewIn);
  const bestsellerProducts = products.filter((p) => p.isBestseller);

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
        
        {/* 4. Bestsellers responsive catalog grid with Shimmer pulse skeleton loading state */}
        <BestsellerSection
          products={bestsellerProducts}
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
          onAddToCart={handleAddToCart}
          isLoading={isLoading}
        />
        
        {/* 5. Brand stories and Polaroid collage parallax section */}
        <StorySection />
        
        {/* 6. Brand reassurance/exchanges row */}
        <TrustBar />
      </div>
    </SiteLayout>
  );
}
