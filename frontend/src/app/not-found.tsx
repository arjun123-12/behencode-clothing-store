'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 select-none animate-fadeIn">
      <span className="text-6xl mb-4">🍂</span>
      <h1 className="font-playfair text-3xl font-bold text-foreground">Page Not Found</h1>
      <p className="text-xs text-light-brown mt-2 max-w-sm">
        We couldn't find the beautiful items or page you were looking for.
      </p>
      <Link
        href="/"
        className="mt-8 bg-rose text-white text-xs tracking-widest font-semibold px-8 py-3 rounded-full hover:bg-mid hover:shadow-lg transition-all"
      >
        RETURN HOME
      </Link>
    </div>
  );
}
