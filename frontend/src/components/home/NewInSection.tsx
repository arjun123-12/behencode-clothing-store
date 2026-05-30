'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ProductCard from './ProductCard';
import { Product } from '@/types/product';

// Import swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface NewInSectionProps {
  products: Product[];
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: Product) => void;
  isLoading?: boolean;
}

export const NewInSection: React.FC<NewInSectionProps> = ({
  products = [],
  wishlist = [],
  onToggleWishlist,
  onAddToCart,
  isLoading = false,
}) => {
  return (
    <section className="py-20 bg-cream/40 border-t border-b border-border-custom/30 select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <p className="font-caveat text-2xl text-rose mb-1">Aesthetic Additions</p>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold tracking-wide text-foreground">
              The New In Collection
            </h2>
          </div>
          <Link
            href="/shop?isNewIn=true"
            className="text-xs font-bold tracking-wider text-rose hover:text-mid flex items-center gap-1.5 mt-4 md:mt-0 transition-colors uppercase"
          >
            View All Arrivals <ArrowRight size={14} />
          </Link>
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
            <p className="text-xs text-light-brown mt-2">No new arrivals found.</p>
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="pb-12"
          >
            {products.map((product) => (
              <SwiperSlide key={product._id}>
                <ProductCard
                  product={product}
                  isWishlisted={wishlist.includes(product._id)}
                  onToggleWishlist={onToggleWishlist}
                  onAddToCart={onAddToCart}
                  badge="New"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default NewInSection;
