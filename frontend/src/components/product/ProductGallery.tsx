'use client';

import React, { useState } from 'react';
import { getImageUrl } from '@/lib/helpers';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images = [], name }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="w-full aspect-[3/4] bg-cream rounded-2xl flex items-center justify-center text-xs text-light-brown select-none">
        No image available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Focus Image */}
      <div className="w-full aspect-[3/4] bg-cream rounded-2xl overflow-hidden border border-border-custom/30 shadow-xs relative">
        <img
          src={getImageUrl(images[activeIndex])}
          alt={`${name} preview ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-500"
        />
      </div>

      {/* Thumbnails list */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 select-none">
          {images.map((img, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`relative w-20 aspect-[3/4] rounded-xl overflow-hidden bg-cream border flex-shrink-0 cursor-pointer transition-all duration-300 ${
                  isActive ? 'border-rose ring-1 ring-rose/50 scale-95 shadow-sm' : 'border-border-custom/30 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={getImageUrl(img)}
                  alt={`${name} thumb ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
