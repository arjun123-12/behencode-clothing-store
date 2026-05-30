'use client';

import React from 'react';
import { CreditCard, Banknote } from 'lucide-react';
import Button from '@/components/ui/button';

interface PaymentMethodProps {
  selectedMethod: string;
  onChange: (method: string) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({
  selectedMethod,
  onChange,
  onSubmit,
  loading = false,
}) => {
  const methods = [
    {
      id: 'COD',
      title: 'Cash On Delivery (COD)',
      description: 'Pay with cash upon delivery. Safe and simple.',
      icon: Banknote,
    },
    {
      id: 'Online',
      title: 'Online Payment (Card/UPI/NetBanking)',
      description: 'Pay securely via Stripe or Razorpay credit/debit gates.',
      icon: CreditCard,
    },
  ];

  return (
    <div className="space-y-6 text-left select-none animate-fadeIn">
      <div>
        <h3 className="font-playfair text-base font-bold text-foreground mb-1">
          Payment Method
        </h3>
        <p className="text-[10px] text-light-brown font-medium uppercase tracking-wider">
          Choose how you would like to complete your order
        </p>
      </div>

      <div className="space-y-3">
        {methods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          return (
            <button
              key={method.id}
              onClick={() => onChange(method.id)}
              className={`w-full flex items-start gap-4 p-4 border rounded-2xl cursor-pointer text-left transition-all duration-300 ${
                isSelected
                  ? 'border-rose bg-rose/5 ring-1 ring-rose/30 shadow-xs'
                  : 'border-border-custom hover:border-rose/50 bg-cream/20'
              }`}
            >
              <div className={`p-2 rounded-xl flex-shrink-0 ${isSelected ? 'bg-rose text-white' : 'bg-cream text-light-brown'}`}>
                <Icon size={16} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-foreground">
                  {method.title}
                </h4>
                <p className="text-[10px] text-light-brown font-medium leading-relaxed">
                  {method.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-4">
        <Button
          onClick={onSubmit}
          variant="primary"
          className="w-full shadow-md"
          loading={loading}
        >
          PLACE ORDER & PAY
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethod;
