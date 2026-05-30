'use client';

import React, { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-red-50/30 rounded-3xl border border-dashed border-red-200 max-w-2xl mx-auto my-12 select-none">
      <span className="text-4xl mb-4">⚠️</span>
      <h1 className="font-playfair text-2xl font-bold text-red-700">Something went wrong!</h1>
      <p className="text-xs text-red-500 mt-2 max-w-sm">
        {error?.message || 'An error occurred loading this page module.'}
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 bg-red-600 text-white text-xs tracking-widest font-semibold px-6 py-2.5 rounded-full hover:bg-red-700 transition-all cursor-pointer"
      >
        TRY AGAIN
      </button>
    </div>
  );
}
