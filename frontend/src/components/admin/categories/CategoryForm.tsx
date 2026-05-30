'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/button';

interface CategoryFormProps {
  categoryToEdit?: any;
  onSubmit: (name: string) => Promise<void> | void;
  onUpdate: (id: string, name: string) => Promise<void> | void;
  onCancelEdit: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  categoryToEdit,
  onSubmit,
  onUpdate,
  onCancelEdit,
}) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name || '');
    } else {
      setName('');
    }
  }, [categoryToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      if (categoryToEdit) {
        await onUpdate(categoryToEdit._id, name);
      } else {
        await onSubmit(name);
        setName('');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background border border-border-custom/30 p-6 rounded-3xl space-y-4 select-none">
      <h3 className="font-playfair text-sm font-bold text-foreground">
        {categoryToEdit ? 'Edit Main Category' : 'Create Main Category'}
      </h3>
      <p className="text-[10px] text-light-brown">
        {categoryToEdit 
          ? 'Modify the category parameters below.' 
          : 'Add a new main category root to your storefront navigation.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-foreground uppercase tracking-wider">
            Category Name *
          </label>
          <input
            type="text"
            placeholder="e.g. Sage Summer Dresses"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 border border-border-custom rounded-xl text-xs bg-cream/15 focus:outline-none focus:border-rose text-foreground"
          />
        </div>

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
            {categoryToEdit ? 'UPDATE' : 'CREATE ROOT'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
