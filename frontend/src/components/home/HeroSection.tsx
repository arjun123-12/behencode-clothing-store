'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Load Canvas3D dynamically to prevent SSR issues (WebGL relies on browser APIs)
const Canvas3D = dynamic(() => import('@/components/Canvas3D'), { ssr: false });

const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full min-h-[90vh] bg-gradient-to-b from-soft-pink/50 via-cream/30 to-background flex flex-col justify-center items-center px-6 py-12 md:py-24 overflow-hidden">
      {/* 3D Blossoms Canvas Background */}
      <div className="absolute inset-0 z-0 pointer-events-none md:pointer-events-auto">
        <Canvas3D />
      </div>

      {/* Hero Text Content */}
      <div className="relative z-10 text-center max-w-4xl flex flex-col items-center select-none">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
          transition={{ duration: 0.8 }}
          className="mb-4 inline-block px-4 py-1.5 bg-blush/60 rounded-full border border-border-custom/50 text-xs tracking-[0.2em] font-semibold text-mid uppercase"
        >
          Spring / Summer Collection &apos;26
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
          transition={{ duration: 1.0, delay: 0.2 }}
          className="font-playfair text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6"
        >
          Where she is free <br />
          <span className="font-caveat text-rose text-5xl sm:text-7xl md:text-8xl normal-case font-normal inline-block mt-2">
            to be all of her
          </span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="text-sm sm:text-base text-mid max-w-lg leading-relaxed mb-10 font-medium"
        >
          Effortless, premium clothing built on sisterhood, comfort, and unmatched quality. Designed for every mood of the Indian girl.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/shop"
            className="bg-rose text-white text-xs tracking-widest font-semibold px-8 py-4 rounded-full hover:bg-mid hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 group cursor-pointer"
          >
            EXPLORE SHOP
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/about"
            className="border border-border-custom bg-white/70 hover:bg-cream text-foreground text-xs tracking-widest font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:border-rose hover:text-rose cursor-pointer"
          >
            OUR STORY
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
