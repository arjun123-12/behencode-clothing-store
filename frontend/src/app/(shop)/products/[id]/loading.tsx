'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 select-none">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose mx-auto"></div>
      <p className="text-xs text-light-brown mt-4 tracking-widest uppercase">LOADING CONTENT...</p>
    </div>
  );
}
