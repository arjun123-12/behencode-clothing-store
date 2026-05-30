'use client';

import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/types/order';
import { getImageUrl } from '@/lib/helpers';
import { formatCurrency } from '@/lib/formatCurrency';

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  removeFromCart: (id: string, size: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  updateQuantity,
  removeFromCart,
}) => {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-border-custom/50 last:border-b-0 animate-fadeIn text-left">
      {/* Product Image */}
      <div className="relative w-20 h-24 bg-cream rounded-md overflow-hidden flex-shrink-0 border border-border-custom/30">
        {item.image ? (
          <img
            src={getImageUrl(item.image)}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-light-brown select-none">
            No image
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-foreground truncate mb-0.5">
          {item.name}
        </h4>
        <p className="text-xs text-light-brown mb-2 font-medium">
          Size: <span className="text-rose font-bold">{item.size}</span>
        </p>
        
        {/* Quantity Controls */}
        <div className="flex items-center border border-border-custom rounded-full w-24 justify-between bg-cream select-none">
          <button
            onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
            className="p-1.5 text-foreground hover:text-rose cursor-pointer"
          >
            <Minus size={12} />
          </button>
          <span className="text-xs font-semibold text-foreground">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
            className="p-1.5 text-foreground hover:text-rose cursor-pointer"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>

      {/* Pricing & Trash */}
      <div className="flex flex-col items-end justify-between self-stretch py-1">
        <span className="text-sm font-bold text-foreground">
          {formatCurrency(item.price * item.quantity)}
        </span>
        <button
          onClick={() => removeFromCart(item._id, item.size)}
          className="text-light-brown hover:text-red-500 transition-colors p-1 cursor-pointer"
          title="Remove item"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
