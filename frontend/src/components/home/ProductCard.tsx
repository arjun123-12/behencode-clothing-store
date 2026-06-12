'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Product } from '@/types/product';
import { getImageUrl } from '@/lib/utils';

interface ProductCardProps {
  product?: Product;
  isWishlisted?: boolean;
  onToggleWishlist?: (id: string) => void;
  onAddToCart?: (product: Product) => void;
  badge?: string;
  isLoading?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted = false,
  onToggleWishlist,
  onAddToCart,
  badge,
  isLoading = false,
}) => {
  // Loading Shimmer Skeleton State
  if (isLoading || !product) {
    return (
      <div className="group relative bg-background rounded-2xl p-3 border border-border-custom/30 hover:border-border-custom transition-all duration-300 hover:shadow-lg animate-pulse flex flex-col justify-between h-full">
        <div>
          {/* Image skeleton */}
          <div className="relative aspect-[3/4] rounded-xl bg-cream/60 mb-4 w-full" />
          
          {/* Category skeleton */}
          <div className="h-3 bg-cream/80 rounded-md w-1/3 mb-2 mx-auto" />
          
          {/* Title skeleton */}
          <div className="h-4 bg-cream/80 rounded-md w-3/4 mx-auto mb-3" />
        </div>
        
        {/* Price skeleton */}
        <div className="h-4 bg-cream/80 rounded-md w-1/4 mx-auto mt-2 mb-1" />
      </div>
    );
  }

  const categoryName =
    product.category && typeof product.category === 'object'
      ? product.category.name
      : product.category || 'Collection';

  return (
    <div className="group relative bg-background rounded-2xl p-3 border border-border-custom/30 hover:border-border-custom transition-all duration-300 hover:shadow-lg flex flex-col justify-between h-full">
      <div>
        {/* Image wrapper */}
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-cream mb-4 border border-border-custom/10">
          <Link href={`/products/${product._id}`} className="block w-full h-full relative">
            {getImageUrl(product.images?.[0]).includes('/uploads/') ? (
              <img
                src={getImageUrl(product.images?.[0])}
                alt={product.name}
                className="object-cover transition-transform duration-700 group-hover:scale-105 w-full h-full"
              />
            ) : (
              <Image
                src={getImageUrl(product.images?.[0])}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority={badge === 'Best'}
              />
            )}
          </Link>
          
          {/* Badge */}
          {badge && (
            <span className="absolute top-3 left-3 bg-rose text-white text-[9px] tracking-widest font-bold px-2.5 py-1 rounded-full uppercase shadow-sm z-10">
              {badge}
            </span>
          )}

          {/* Wishlist Button */}
          {onToggleWishlist && (
            <button
              type="button"
              onClick={() => onToggleWishlist(product._id)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:bg-white hover:text-rose transition-colors duration-200 cursor-pointer z-10"
              aria-label="Add to wishlist"
            >
              <Heart
                size={14}
                className={isWishlisted ? 'fill-rose text-rose' : 'text-foreground'}
              />
            </button>
          )}

          {/* Quick Add */}
          {onAddToCart && product.stockQuantity > 0 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[85%] translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
              <button
                type="button"
                onClick={() => onAddToCart(product)}
                className="w-full bg-white text-foreground hover:bg-rose hover:text-white text-[10px] tracking-wider font-bold py-2.5 rounded-lg shadow-md transition-all cursor-pointer"
              >
                QUICK ADD
              </button>
            </div>
          )}

          {product.stockQuantity <= 0 && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-dark text-cream text-[10px] tracking-widest font-bold px-3 py-1.5 rounded-full uppercase shadow-md">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-1 text-center">
          <p className="text-[10px] tracking-widest text-light-brown uppercase mb-1 font-medium">
            {categoryName}
          </p>
          <Link href={`/products/${product._id}`}>
            <h3 className="font-playfair text-sm font-bold text-foreground hover:text-rose transition-colors truncate">
              {product.name}
            </h3>
          </Link>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center gap-2 px-1 pb-1">
        {product.discountPrice ? (
          <>
            <span className="text-xs line-through text-light-brown">₹{product.price}</span>
            <span className="text-sm font-bold text-rose">₹{product.discountPrice}</span>
          </>
        ) : (
          <span className="text-sm font-bold text-foreground">₹{product.price}</span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
