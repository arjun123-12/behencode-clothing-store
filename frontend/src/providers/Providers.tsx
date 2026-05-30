'use client';

import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@teispace/next-themes';
import { SessionProvider } from 'next-auth/react';
import Lenis from 'lenis';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

interface ProvidersProps {
  children: React.ReactNode;
  session: any;
}

// Lenis smooth scroll component
const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Animation frame callback
    let animationFrameId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    };
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

export const Providers: React.FC<ProvidersProps> = ({ children, session }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false}>
          <AuthProvider>
            <CartProvider>
              <SmoothScroll>{children}</SmoothScroll>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

