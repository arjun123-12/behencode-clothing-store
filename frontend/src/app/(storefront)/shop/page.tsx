'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Product, Category } from '@/types/product';
import useProducts from '@/hooks/useProducts';
import useCategories from '@/hooks/useCategories';

// Import shop modular components
import ShopHeader from '@/components/product/ProductSort';
import ShopSidebar from '@/components/product/ProductFilters';
import MobileFilters from '@/components/product/ProductFiltersMobile';
import ShopGrid from '@/components/product/ProductGrid';

function ShopContent() {
  const searchParams = useSearchParams();
  const { addToCart } = useCart();

  // 1. Dynamic API queries leveraging TanStack Query hooks
  const { data: products = [], isLoading: isProductsLoading } = useProducts();
  const { data: dbCategories = [], isLoading: isCategoriesLoading } = useCategories();

  // State Management
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Filters State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedSize, setSelectedSize] = useState('');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState('newest');
  
  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Update initial filters from search parameters on load
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);

    const q = searchParams.get('search');
    if (q) setSearchQuery(q);

    const isNew = searchParams.get('isNewIn');
    if (isNew === 'true') setSortBy('newin');

    const isBest = searchParams.get('isBestseller');
    if (isBest === 'true') setSortBy('bestseller');
  }, [searchParams]);

  // Apply filters and sorting reactively
  useEffect(() => {
    let result = [...products];

    // Category Filter
    if (selectedCategory !== 'All') {
      const selectedCatDoc = dbCategories.find(
        (c) => c._id === selectedCategory || c.name.toLowerCase() === selectedCategory.toLowerCase()
      );
      const targetName = selectedCatDoc ? selectedCatDoc.name.toLowerCase() : selectedCategory.toLowerCase();
      const targetId = selectedCatDoc ? selectedCatDoc._id : selectedCategory;

      result = result.filter((p) => {
        if (p.category && typeof p.category === 'object') {
          const cat = p.category as Category;
          const catId = cat._id;
          const catName = cat.name?.toLowerCase();
          
          const parent = cat.parent as Category | undefined;
          const parentId = parent
            ? (typeof parent === 'object' ? parent._id : parent)
            : undefined;
          const parentName = parent && typeof parent === 'object'
            ? parent.name?.toLowerCase()
            : undefined;

          const grandParent = parent && typeof parent === 'object' ? parent.parent as Category | undefined : undefined;
          const grandParentId = grandParent
            ? (typeof grandParent === 'object' ? grandParent._id : grandParent)
            : undefined;
          const grandParentName = grandParent && typeof grandParent === 'object'
            ? grandParent.name?.toLowerCase()
            : undefined;

          return (
            catId === targetId ||
            catName === targetName ||
            parentId === targetId ||
            parentName === targetName ||
            grandParentId === targetId ||
            grandParentName === targetName
          );
        }

        if (typeof p.category === 'string') {
          if (p.category === targetId) return true;
          const matchedCat = dbCategories.find(c => c._id === p.category);
          if (matchedCat && matchedCat.name.toLowerCase() === targetName) return true;
        }
        return false;
      });
    }

    // Search Query Filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          (p.category && typeof p.category === 'object' 
            ? p.category.name.toLowerCase().includes(query) 
            : p.category.toLowerCase().includes(query))
      );
    }

    // Size Filter
    if (selectedSize !== '') {
      result = result.filter((p) => p.sizes?.includes(selectedSize));
    }

    // Price Filter
    result = result.filter((p) => {
      const price = p.discountPrice || p.price;
      return price <= maxPrice;
    });

    // Sorting Logic
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sortBy === 'bestseller') {
      result = result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    } else if (sortBy === 'newin') {
      result = result.sort((a, b) => (b.isNewIn ? 1 : 0) - (a.isNewIn ? 1 : 0));
    }

    setFilteredProducts(result);
  }, [products, dbCategories, selectedCategory, searchQuery, selectedSize, maxPrice, sortBy]);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedSize('');
    setMaxPrice(5000);
    setSortBy('newest');
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, product.sizes?.[0] || 'S');
  };

  const getSelectedCategoryName = () => {
    if (selectedCategory === 'All') return 'Our Collection';
    const found = dbCategories.find(c => c._id === selectedCategory);
    return found ? found.name : selectedCategory;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      {/* 1. Header controls, sorting selector, results counter */}
      <ShopHeader
        filteredCount={filteredProducts.length}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
        selectedCategoryName={getSelectedCategoryName()}
      />

      <div className="flex gap-8 items-start">
        {/* 2. Desktop Sidebar filters (Categories tree, search, sizes, price slider) */}
        <ShopSidebar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          dbCategories={dbCategories}
          selectedSize={selectedSize}
          onSizeSelect={setSelectedSize}
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
          onClearFilters={clearFilters}
        />

        {/* 3. Products catalog grid with layout animations & skeleton pulse loaders */}
        <div className="flex-1">
          <ShopGrid
            products={filteredProducts}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onAddToCart={handleAddToCart}
            onClearFilters={clearFilters}
            isLoading={isProductsLoading || isCategoriesLoading}
          />
        </div>
      </div>

      {/* 4. Mobile responsive slide-out filters drawer */}
      <MobileFilters
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        dbCategories={dbCategories}
        selectedSize={selectedSize}
        onSizeSelect={setSelectedSize}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        onClearFilters={clearFilters}
      />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-24 text-center select-none">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose mx-auto"></div>
          <p className="text-xs text-light-brown mt-4 tracking-widest">LOADING SHOP...</p>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
