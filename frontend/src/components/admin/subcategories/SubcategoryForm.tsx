'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/button';

interface SubcategoryFormProps {
  rootCategories: any[];
  categoryToEdit?: any;
  onSubmit: (name: string, parentId: string) => Promise<void> | void;
  onUpdate: (id: string, name: string, parentId: string) => Promise<void> | void;
  onCancelEdit: () => void;
}

export const SubcategoryForm: React.FC<SubcategoryFormProps> = ({
  rootCategories = [],
  categoryToEdit,
  onSubmit,
  onUpdate,
  onCancelEdit,
}) => {
  const [name, setName] = useState('');
  const [parent, setParent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name || '');
      const parentId = typeof categoryToEdit.parent === 'object' && categoryToEdit.parent
        ? categoryToEdit.parent._id
        : categoryToEdit.parent || '';
      setParent(parentId);
    } else {
      setName('');
      setParent(rootCategories[0]?._id || '');
    }
  }, [categoryToEdit, rootCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !parent) return;

    setLoading(true);
    try {
      if (categoryToEdit) {
        await onUpdate(categoryToEdit._id, name, parent);
      } else {
        await onSubmit(name, parent);
        setName('');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background border border-border-custom/30 p-6 rounded-3xl space-y-4 select-none">
      <h3 className="font-playfair text-sm font-bold text-foreground">
        {categoryToEdit ? 'Edit Subcategory' : 'Create Subcategory'}
      </h3>
      <p className="text-[10px] text-light-brown">
        {categoryToEdit 
          ? 'Modify the subcategory parameters and parent assignment.' 
          : 'Nest a new subcategory inside one of the root level navigations.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Name input */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-foreground uppercase tracking-wider">
            Subcategory Name *
          </label>
          <input
            type="text"
            placeholder="e.g. Linen Tops, Sage Midi Skirts"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 border border-border-custom rounded-xl text-xs bg-cream/15 focus:outline-none focus:border-rose text-foreground"
          />
        </div>

        {/* Parent Category Dropdown */}
        <div className="space-y-1.5 text-left">
          <label className="block text-[10px] font-bold text-foreground uppercase tracking-wider">
            Parent Category *
          </label>
          <select
            value={parent}
            onChange={(e) => setParent(e.target.value)}
            required
            className="w-full px-4 py-3 border border-border-custom rounded-xl text-xs bg-cream/15 focus:outline-none focus:border-rose text-foreground cursor-pointer"
          >
            <option value="" disabled className="bg-background text-foreground">Select parent category</option>
            {rootCategories.map((cat) => (
              <option key={cat._id} value={cat._id} className="bg-background text-foreground">
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 pt-2">
          {categoryToEdit && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancelEdit}
              className="flex-1"
              disabled={loading}
            >
              CANCEL
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            loading={loading}
          >
            {categoryToEdit ? 'UPDATE' : 'CREATE SUB'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SubcategoryForm;
