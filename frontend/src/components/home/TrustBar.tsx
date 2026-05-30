'use client';

import React from 'react';
import { Truck, RefreshCw, ShieldCheck } from 'lucide-react';

export const TrustBar: React.FC = () => {
  return (
    <section className="bg-dark text-cream py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex items-center gap-4 justify-center text-center md:text-left">
          <div className="p-3 bg-rose/20 rounded-full text-rose">
            <Truck size={24} />
          </div>
          <div>
            <h3 className="font-playfair text-sm md:text-base font-bold tracking-wide">
              Pan-India Free Shipping
            </h3>
            <p className="text-[11px] text-cream/70 mt-0.5">
              Free standard delivery on all orders above ₹199
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 justify-center text-center md:text-left">
          <div className="p-3 bg-rose/20 rounded-full text-rose">
            <RefreshCw size={24} />
          </div>
          <div>
            <h3 className="font-playfair text-sm md:text-base font-bold tracking-wide">
              Easy Exchanges
            </h3>
            <p className="text-[11px] text-cream/70 mt-0.5">
              7-day hassle-free size exchange policy
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 justify-center text-center md:text-left">
          <div className="p-3 bg-rose/20 rounded-full text-rose">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="font-playfair text-sm md:text-base font-bold tracking-wide">
              Premium Fabrics Only
            </h3>
            <p className="text-[11px] text-cream/70 mt-0.5">
              Breathable, durable, skin-friendly cottons & knits
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
