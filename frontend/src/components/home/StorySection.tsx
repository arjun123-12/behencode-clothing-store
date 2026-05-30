'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const StorySection: React.FC = () => {
  return (
    <section className="py-24 bg-soft-pink/30 border-t border-border-custom/25 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Story Text */}
        <div className="space-y-6 max-w-xl">
          <p className="font-caveat text-3xl text-rose">Sisterhood, Stories & Styles</p>
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Crafted with Love for the Modern Indian Girl.
          </h2>
          <p className="text-sm text-mid leading-relaxed">
            At <strong className="font-semibold text-foreground">behencode</strong>, we believe clothes are more than just fabrics—they represent comfort, sisterly advice, and the freedom to express every facet of yourself. Every design is built to let you navigate life gracefully, boldy, and effortlessly.
          </p>
          <div className="h-px bg-border-custom/50 w-full" />
          
          <div className="flex gap-8 flex-wrap">
            <div>
              <p className="font-playfair text-2xl font-bold text-rose">100%</p>
              <p className="text-[10px] uppercase tracking-wider text-light-brown mt-1 font-medium">Premium Cottons & Linens</p>
            </div>
            <div>
              <p className="font-playfair text-2xl font-bold text-rose">10k+</p>
              <p className="text-[10px] uppercase tracking-wider text-light-brown mt-1 font-medium">Happy Sisters (Behens)</p>
            </div>
            <div>
              <p className="font-playfair text-2xl font-bold text-rose">Made in</p>
              <p className="text-[10px] uppercase tracking-wider text-light-brown mt-1 font-medium">Ethical Indian Boutiques</p>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-rose hover:text-mid transition-colors uppercase border-b-2 border-rose pb-1"
            >
              Read Our Story <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Polaroid collage */}
        <div className="relative h-[480px] md:h-[550px] w-full flex items-center justify-center">
          {/* Card 1 */}
          <motion.div
            initial={{ rotate: -8, x: -40, y: -20 }}
            whileHover={{ rotate: -2, zIndex: 30, scale: 1.05 }}
            className="polaroid-card absolute w-56 md:w-64 z-10 bg-white p-3 shadow-md border border-border-custom/25"
          >
            <div className="relative aspect-square w-full mb-3 rounded-xs overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=400&auto=format&fit=crop"
                alt="lazy sundays in lilac"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <p className="font-caveat text-lg text-center text-foreground font-semibold">
              lazy sundays in lilac ♡
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ rotate: 10, x: 50, y: 30 }}
            whileHover={{ rotate: 3, zIndex: 30, scale: 1.05 }}
            className="polaroid-card absolute w-56 md:w-64 z-20 bg-white p-3 shadow-md border border-border-custom/25"
          >
            <div className="relative aspect-square w-full mb-3 rounded-xs overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=400&auto=format&fit=crop"
                alt="matching coord sets"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <p className="font-caveat text-lg text-center text-foreground font-semibold">
              matching coord sets, matching energy ✦
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ rotate: -3, x: 10, y: -110 }}
            whileHover={{ rotate: 0, zIndex: 30, scale: 1.05 }}
            className="polaroid-card absolute w-48 md:w-56 z-0 opacity-80 bg-white p-2 shadow-sm border border-border-custom/25"
          >
            <div className="relative aspect-square w-full mb-3 rounded-xs overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=400&auto=format&fit=crop"
                alt="details that matter"
                fill
                sizes="(max-width: 768px) 40vw, 20vw"
                className="object-cover"
              />
            </div>
            <p className="font-caveat text-base text-center text-foreground font-semibold">
              details that matter
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default StorySection;
