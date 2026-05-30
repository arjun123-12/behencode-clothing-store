'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('behencode_admin_token');
    if (token) {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/admin/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-cream/20 flex items-center justify-center select-none">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose mx-auto" />
        <p className="text-[10px] text-light-brown font-bold tracking-widest uppercase">
          Initializing CMS session...
        </p>
      </div>
    </div>
  );
}
