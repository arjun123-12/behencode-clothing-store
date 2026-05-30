'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import API from '@/lib/api';

// Components
import AdminLayout from '@/components/admin/layout/AdminLayout';
import PageHeader from '@/components/admin/shared/PageHeader';
import ProductTable from '@/components/admin/products/ProductTable';
import ProductForm from '@/components/admin/products/ProductForm';
import Modal from '@/components/ui/modal';
import Button from '@/components/ui/button';

// Hooks & Helpers
import { useDashboardData } from '@/hooks/admin/useDashboardData';

export default function AdminProductsPage() {
  const router = useRouter();
  const {
    products,
    setProducts,
    categories,
    loading,
    alert,
    triggerAlert,
    deleteProduct,
    loadData,
  } = useDashboardData();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper: dynamic category path resolution
  const getCategoryPath = (cat: any): string => {
    if (!cat) return '';
    if (typeof cat === 'string') {
      const matched = categories.find((c) => c._id === cat || c.name === cat);
      if (matched) return getCategoryPath(matched);
      return cat;
    }
    const parts = [cat.name];
    let current = cat.parent;
    while (current) {
      if (typeof current === 'object' && current) {
        parts.unshift(current.name);
        current = current.parent;
      } else {
        const found = categories.find((c) => c._id === current);
        if (found) {
          parts.unshift(found.name);
          current = found.parent;
        } else {
          current = null;
        }
      }
    }
    return parts.join(' > ');
  };

  // Submit Handler: Add Product
  const handleAddProductSubmit = async (formData: FormData, imageUrlString?: string, imageFiles?: FileList | null) => {
    setSubmitting(true);
    try {
      if (imageFiles && imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          formData.append('images', imageFiles[i]);
        }
      } else if (imageUrlString) {
        const urls = imageUrlString.split(',').map(url => url.trim()).filter(Boolean);
        urls.forEach(url => formData.append('images', url));
      } else {
        triggerAlert('error', 'Product images are required.');
        setSubmitting(false);
        return;
      }

      const response = await API.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data?.success) {
        triggerAlert('success', 'Product added successfully!');
        setIsAddModalOpen(false);
        loadData();
      }
    } catch (err: any) {
      console.warn('API error saving product. Simulating local addition.');
      
      const newMockItem = {
        _id: 'mock-' + Math.floor(Math.random() * 1000),
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: Number(formData.get('price')),
        discountPrice: formData.get('discountPrice') ? Number(formData.get('discountPrice')) : undefined,
        category: formData.get('category') as string,
        sizes: (formData.get('sizes') as string).split(','),
        stockQuantity: Number(formData.get('stockQuantity')),
        inStock: Number(formData.get('stockQuantity')) > 0,
        isNewIn: formData.get('isNewIn') === 'true',
        isBestseller: formData.get('isBestseller') === 'true',
        images: imageUrlString ? imageUrlString.split(',').map(url => url.trim()).filter(Boolean) : ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop'],
      };

      setProducts((prev) => [newMockItem, ...prev]);
      triggerAlert('success', 'Product simulated successfully (offline mode).');
      setIsAddModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Handler: Edit Product
  const handleEditProductSubmit = async (formData: FormData, imageUrlString?: string, imageFiles?: FileList | null) => {
    if (!selectedProduct) return;
    setSubmitting(true);
    try {
      if (imageFiles && imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          formData.append('images', imageFiles[i]);
        }
      } else if (imageUrlString) {
        const urls = imageUrlString.split(',').map(url => url.trim()).filter(Boolean);
        urls.forEach(url => formData.append('images', url));
      }

      const response = await API.put(`/products/${selectedProduct._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data?.success) {
        triggerAlert('success', 'Product updated successfully!');
        setIsEditModalOpen(false);
        loadData();
      }
    } catch (err: any) {
      console.warn('API error updating product. Simulating local edit.');
      
      setProducts((prev) =>
        prev.map((p) =>
          p._id === selectedProduct._id
            ? {
                ...p,
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                price: Number(formData.get('price')),
                discountPrice: formData.get('discountPrice') ? Number(formData.get('discountPrice')) : undefined,
                category: formData.get('category') as string,
                stockQuantity: Number(formData.get('stockQuantity')),
                inStock: Number(formData.get('stockQuantity')) > 0,
                isNewIn: formData.get('isNewIn') === 'true',
                isBestseller: formData.get('isBestseller') === 'true',
                sizes: (formData.get('sizes') as string).split(','),
                images: imageUrlString ? imageUrlString.split(',').map(url => url.trim()).filter(Boolean) : p.images,
              }
            : p
        )
      );
      triggerAlert('success', 'Product edits simulated (offline mode).');
      setIsEditModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditInit = (product: any) => {
    router.push(`/admin/products/${product._id}/edit`);
  };

  return (
    <AdminLayout title="Product Inventory" subtitle="Manage your e-commerce catalog items">
      {/* Alert toast info */}
      {alert && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 border rounded-2xl flex items-center shadow-lg animate-fadeIn font-semibold text-xs ${
          alert.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {alert.text}
        </div>
      )}

      {loading ? (
        <div className="py-24 text-center select-none space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose mx-auto" />
          <p className="text-[10px] text-light-brown font-bold tracking-widest uppercase">
            Resolving Product Database...
          </p>
        </div>
      ) : (
         <div className="space-y-6">
          <PageHeader
            title="Product Catalog"
            description={`${products.length} outfits total in DB`}
            action={
              <Button
                variant="primary"
                onClick={() => router.push('/admin/products/create')}
                leftIcon={<Plus size={14} />}
              >
                ADD PRODUCT
              </Button>
            }
          />
          <div className="bg-background border border-border-custom/30 p-6 rounded-3xl">
            <ProductTable
              products={products}
              categories={categories}
              onEdit={handleEditInit}
              onDelete={deleteProduct}
              getCategoryPath={getCategoryPath}
            />
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
