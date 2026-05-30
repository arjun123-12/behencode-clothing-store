'use client';

import React from 'react';
import { Edit2, Trash2, GitBranch } from 'lucide-react';

interface SubcategoryTableProps {
  subcategories: any[];
  onEdit: (category: any) => void;
  onDelete: (categoryId: string) => void;
  getCategoryPath: (cat: any) => string;
}

export const SubcategoryTable: React.FC<SubcategoryTableProps> = ({
  subcategories = [],
  onEdit,
  onDelete,
  getCategoryPath,
}) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border-custom/30 bg-background shadow-sm select-none">
      {subcategories.length === 0 ? (
        <div className="py-16 text-center text-light-brown flex flex-col items-center justify-center space-y-2">
          <GitBranch size={24} className="text-light-brown/60" />
          <p className="text-[10px] font-bold uppercase tracking-wider">No Subcategories</p>
          <p className="text-[8px] text-light-brown/70">Create a subcategory mapping in the right-side panel</p>
        </div>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-cream/15 border-b border-border-custom/30 text-[10px] font-bold tracking-wider uppercase text-light-brown">
              <th className="py-4 px-5">Subcategory Name</th>
              <th className="py-4 px-5">Parent Path</th>
              <th className="py-4 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subcategories.map((sub) => {
              const fullPath = getCategoryPath(sub.parent);
              return (
                <tr
                  key={sub._id}
                  className="border-b border-border-custom/10 hover:bg-cream/5 transition-colors duration-200 text-xs text-foreground"
                >
                  <td className="py-3.5 px-5 font-bold">
                    {sub.name}
                  </td>
                  <td className="py-3.5 px-5 font-semibold text-light-brown text-[10px]">
                    {fullPath || 'Root'}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(sub)}
                        title="Edit Subcategory Parameters"
                        className="p-1.5 border border-border-custom hover:border-rose bg-cream/10 hover:bg-rose hover:text-white rounded-lg transition-all duration-300 cursor-pointer text-foreground"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete subcategory "${sub.name}"?`)) {
                            onDelete(sub._id);
                          }
                        }}
                        title="Delete Subcategory"
                        className="p-1.5 border border-border-custom hover:border-rose bg-cream/10 hover:bg-rose hover:text-white rounded-lg transition-all duration-300 cursor-pointer text-foreground"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SubcategoryTable;
