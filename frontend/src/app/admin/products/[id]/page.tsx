'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    if (id) {
      router.replace(`/admin/products/${id}/edit`);
    } else {
      router.replace('/admin/products');
    }
  }, [id, router]);

  return null;
}
