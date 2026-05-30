'use client';

import React from 'react';
import { Edit2, Trash2, FolderOpen } from 'lucide-react';

interface CategoryTableProps {
  categories: any[];
  onEdit: (category: any) => void;
  onDelete: (categoryId: string) => void;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories = [],
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border-custom/30 bg-background shadow-sm">
      {categories.length === 0 ? (
        <div className="py-16 text-center text-light-brown flex flex-col items-center justify-center space-y-2">
          <FolderOpen size={24} className="text-light-brown/60" />
          <p className="text-[10px] font-bold uppercase tracking-wider">No Root Categories</p>
          <p className="text-[8px] text-light-brown/70">Create a new category in the form on the right</p>
        </div>
      ) : (
        <table className="w-full text-left border-collapse select-none">
          <thead>
            <tr className="bg-cream/15 border-b border-border-custom/30 text-[10px] font-bold tracking-wider uppercase text-light-brown">
              <th className="py-4 px-5">ID</th>
              <th className="py-4 px-5">Category Name</th>
              <th className="py-4 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, idx) => (
              <tr
                key={category._id}
                className="border-b border-border-custom/10 hover:bg-cream/5 transition-colors duration-200 text-xs text-foreground"
              >
                <td className="py-3.5 px-5 font-semibold text-light-brown text-[10px]">
                  #{idx + 1}
                </td>
                <td className="py-3.5 px-5 font-bold">
                  {category.name}
                </td>
                <td className="py-3.5 px-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(category)}
                      title="Edit Category Name"
                      className="p-1.5 border border-border-custom hover:border-rose bg-cream/10 hover:bg-rose hover:text-white rounded-lg transition-all duration-300 cursor-pointer text-foreground"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
                          onDelete(category._id);
                        }
                      }}
                      title="Delete Category"
                      className="p-1.5 border border-border-custom hover:border-rose bg-cream/10 hover:bg-rose hover:text-white rounded-lg transition-all duration-300 cursor-pointer text-foreground"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategoryTable;
