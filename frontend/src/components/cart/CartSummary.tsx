import React from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/formatCurrency';

interface CartSummaryProps {
  total: number;
  showCheckoutBtn?: boolean;
  onCheckoutClick?: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  total,
  showCheckoutBtn = false,
  onCheckoutClick,
}) => {
  return (
    <div className="p-6 border border-border-custom bg-cream/30 rounded-3xl space-y-4 text-left select-none">
      <h3 className="font-playfair text-base font-bold text-foreground mb-2">
        Order Summary
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs font-semibold text-light-brown">
          <span>Subtotal</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-light-brown font-medium">
          <span>Delivery</span>
          <span className="text-green-600 font-semibold">FREE</span>
        </div>
        <div className="h-px bg-border-custom/50 my-1" />
        <div className="flex justify-between items-center text-sm font-bold text-foreground">
          <span>Total Estimated</span>
          <span className="text-rose">{formatCurrency(total)}</span>
        </div>
      </div>

      {showCheckoutBtn && (
        <div className="pt-2">
          <Link
            href="/checkout"
            onClick={onCheckoutClick}
            className="w-full bg-rose text-white text-[10px] text-center tracking-widest font-bold py-3.5 rounded-full hover:bg-mid transition-all duration-300 shadow-sm flex items-center justify-center uppercase"
          >
            PROCEED TO CHECKOUT
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartSummary;
