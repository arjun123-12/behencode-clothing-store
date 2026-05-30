'use client';

import React, { useState } from 'react';
import API from '@/lib/api';

// Components
import AdminLayout from '@/components/admin/layout/AdminLayout';
import PageHeader from '@/components/admin/shared/PageHeader';
import CategoryTable from '@/components/admin/categories/CategoryTable';
import CategoryForm from '@/components/admin/categories/CategoryForm';

// Hooks
import { useDashboardData } from '@/hooks/admin/useDashboardData';

export default function AdminCategoriesPage() {
  const {
    categories,
    loading,
    alert,
    triggerAlert,
    deleteCategory,
    loadData,
  } = useDashboardData();

  const [editingCategory, setEditingCategory] = useState<any>(null);

  // Filter only root-level categories (no parent category)
  const rootCategories = categories.filter(c => !c.parent);

  const handleAddCategorySubmit = async (name: string) => {
    try {
      const response = await API.post('/categories', { name, parent: null });
      if (response.data?.success) {
        triggerAlert('success', 'Root Category added successfully!');
        loadData();
      }
    } catch (err: any) {
      triggerAlert('error', err.response?.data?.message || 'Failed to create category.');
    }
  };

  const handleUpdateCategorySubmit = async (id: string, name: string) => {
    try {
      const response = await API.put(`/categories/${id}`, { name, parent: null });
      if (response.data?.success) {
        triggerAlert('success', 'Category name updated successfully!');
        setEditingCategory(null);
        loadData();
      }
    } catch (err: any) {
      triggerAlert('error', err.response?.data?.message || 'Failed to update category.');
    }
  };

  return (
    <AdminLayout title="Category Management" subtitle="Manage root-level main categories for storefront sections">
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
            Resolving Category Hierarchy...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <PageHeader
            title="Root Categories"
            description={`${rootCategories.length} root categories in DB`}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 bg-background border border-border-custom/30 p-6 rounded-3xl">
              <CategoryTable
                categories={rootCategories}
                onEdit={(cat) => setEditingCategory(cat)}
                onDelete={deleteCategory}
              />
            </div>
            <div className="lg:col-span-1">
              <CategoryForm
                categoryToEdit={editingCategory}
                onSubmit={handleAddCategorySubmit}
                onUpdate={handleUpdateCategorySubmit}
                onCancelEdit={() => setEditingCategory(null)}
              />
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
