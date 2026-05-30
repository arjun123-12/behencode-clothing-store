'use client';

import React, { useState } from 'react';
import API from '@/lib/api';

// Components
import AdminLayout from '@/components/admin/layout/AdminLayout';
import PageHeader from '@/components/admin/shared/PageHeader';
import SubcategoryTable from '@/components/admin/subcategories/SubcategoryTable';
import SubcategoryForm from '@/components/admin/subcategories/SubcategoryForm';

// Hooks
import { useDashboardData } from '@/hooks/admin/useDashboardData';

export default function AdminSubcategoriesPage() {
  const {
    categories,
    loading,
    alert,
    triggerAlert,
    deleteCategory,
    loadData,
  } = useDashboardData();

  const [editingCategory, setEditingCategory] = useState<any>(null);

  // Filter root categories & nested subcategories
  const rootCategories = categories.filter((c) => !c.parent);
  const subcategories = categories.filter((c) => c.parent);

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

  const handleAddSubcategorySubmit = async (name: string, parentId: string) => {
    try {
      const response = await API.post('/categories', { name, parent: parentId });
      if (response.data?.success) {
        triggerAlert('success', 'Subcategory added successfully!');
        loadData();
      }
    } catch (err: any) {
      triggerAlert('error', err.response?.data?.message || 'Failed to create subcategory.');
    }
  };

  const handleUpdateSubcategorySubmit = async (id: string, name: string, parentId: string) => {
    try {
      const response = await API.put(`/categories/${id}`, { name, parent: parentId });
      if (response.data?.success) {
        triggerAlert('success', 'Subcategory updated successfully!');
        setEditingCategory(null);
        loadData();
      }
    } catch (err: any) {
      triggerAlert('error', err.response?.data?.message || 'Failed to update subcategory.');
    }
  };

  return (
    <AdminLayout title="Subcategory Management" subtitle="Manage nested subcategories for storefront collection builders">
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
            title="Subcategories Builder"
            description={`${subcategories.length} subcategories active`}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Table Column */}
            <div className="lg:col-span-2 bg-background border border-border-custom/30 p-6 rounded-3xl animate-slideUp">
              <SubcategoryTable
                subcategories={subcategories}
                onEdit={(cat) => setEditingCategory(cat)}
                onDelete={deleteCategory}
                getCategoryPath={getCategoryPath}
              />
            </div>
            
            {/* Form Column */}
            <div className="lg:col-span-1 animate-slideUp">
              <SubcategoryForm
                rootCategories={rootCategories}
                categoryToEdit={editingCategory}
                onSubmit={handleAddSubcategorySubmit}
                onUpdate={handleUpdateSubcategorySubmit}
                onCancelEdit={() => setEditingCategory(null)}
              />
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
