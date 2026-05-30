'use client';

import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Product } from '@/types/product';
import { getImageUrl } from '@/lib/helpers';
import { formatCurrency } from '@/lib/formatCurrency';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - (product.discountPrice || 0)) / product.price) * 100)
    : 0;

  return (
    <div className="group relative bg-background border border-border-custom/30 rounded-2xl overflow-hidden hover-lift shadow-xs">
      
      {/* Product Image & Badges */}
      <div className="relative aspect-[3/4] bg-cream w-full overflow-hidden">
        <Link href={`/products/${product._id}`} className="block h-full w-full">
          <img
            src={getImageUrl(product.images?.[0])}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 select-none">
          {product.isNewIn && (
            <span className="bg-blush text-mid text-[8px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase">
              NEW
            </span>
          )}
          {hasDiscount && (
            <span className="bg-rose text-white text-[8px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase">
              {discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Quick Wishlist */}
        <button 
          className="absolute top-3 right-3 p-2 bg-white/70 backdrop-blur-xs text-light-brown hover:text-rose hover:bg-white rounded-full shadow-sm transition-all duration-300 cursor-pointer"
          title="Add to Wishlist"
        >
          <Heart size={14} />
        </button>

        {/* Quick Size Tag Overlay on hover */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="absolute bottom-3 left-3 right-3 bg-white/80 backdrop-blur-xs p-2 rounded-xl border border-border-custom/25 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-center select-none">
            <p className="text-[7px] text-light-brown font-bold tracking-widest uppercase mb-1">
              Available Sizes
            </p>
            <div className="flex justify-center gap-1.5">
              {product.sizes.map((size) => (
                <span key={size} className="text-[9px] font-bold text-foreground bg-cream px-1.5 py-0.5 rounded">
                  {size}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-1.5 text-left">
        <Link href={`/products/${product._id}`} className="block">
          <h3 className="font-playfair font-bold text-xs text-foreground group-hover:text-rose transition-colors truncate">
            {product.name}
          </h3>
        </Link>
        
        {/* Pricing */}
        <div className="flex items-center gap-2">
          {hasDiscount ? (
            <>
              <span className="text-xs font-bold text-rose">
                {formatCurrency(product.discountPrice || 0)}
              </span>
              <span className="text-[10px] font-medium text-light-brown line-through">
                {formatCurrency(product.price)}
              </span>
            </>
          ) : (
            <span className="text-xs font-bold text-foreground">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>
      </div>

    </div>
  );
};

export default ProductCard;
