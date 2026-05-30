'use client';

import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import Button from '@/components/ui/button';

interface ProductFormProps {
  product?: any;
  categories: any[];
  onSubmit: (formData: FormData, imageUrlString?: string, imageFiles?: FileList | null) => void;
  onCancel: () => void;
  getCategoryPath: (cat: any) => string;
  loading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  categories = [],
  onSubmit,
  onCancel,
  getCategoryPath,
  loading = false,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stockQuantity, setStockQuantity] = useState('10');
  const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L']);
  const [isNewIn, setIsNewIn] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [salesCount, setSalesCount] = useState('0');
  const [views, setViews] = useState('0');
  const [imageUrlString, setImageUrlString] = useState('');
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  // Parse and generate image previews for both static URLs and uploaded files
  useEffect(() => {
    const objectUrls: string[] = [];
    const currentPreviews: string[] = [];

    if (imageUrlString) {
      const urls = imageUrlString
        .split(',')
        .map((url) => url.trim())
        .filter(Boolean);
      currentPreviews.push(...urls);
    }

    if (imageFiles && imageFiles.length > 0) {
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const url = URL.createObjectURL(file);
        objectUrls.push(url);
        currentPreviews.push(url);
      }
    }

    setPreviews(currentPreviews);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageUrlString, imageFiles]);

  const [parentCat, setParentCat] = useState('');
  const [subCat, setSubCat] = useState('');
  const [subSubCat, setSubSubCat] = useState('');

  // Trace category lineage: returns [parentCategory, subCategory, subSubCategory]
  const traceLineage = (catId: string) => {
    const list: any[] = [];
    let current = categories.find(c => c._id === catId);
    while (current) {
      list.unshift(current);
      const parentId = typeof current.parent === 'object' && current.parent 
        ? current.parent._id 
        : current.parent;
      current = parentId ? categories.find(c => c._id === parentId) : null;
    }
    return list; // [level1, level2, level3]
  };

  const handleParentChange = (parentId: string) => {
    setParentCat(parentId);
    
    // Find children of this parent
    const children = categories.filter(c => {
      const pId = typeof c.parent === 'object' && c.parent ? c.parent._id : c.parent;
      return pId === parentId;
    });

    if (children.length > 0) {
      const firstChildId = children[0]._id;
      setSubCat(firstChildId);

      // Find children of this child
      const grandChildren = categories.filter(c => {
        const pId = typeof c.parent === 'object' && c.parent ? c.parent._id : c.parent;
        return pId === firstChildId;
      });

      if (grandChildren.length > 0) {
        setSubSubCat(grandChildren[0]._id);
        setCategory(grandChildren[0]._id);
      } else {
        setSubSubCat('');
        setCategory(firstChildId);
      }
    } else {
      setSubCat('');
      setSubSubCat('');
      setCategory(parentId);
    }
  };

  const handleSubChange = (subId: string) => {
    setSubCat(subId);

    const grandChildren = categories.filter(c => {
      const pId = typeof c.parent === 'object' && c.parent ? c.parent._id : c.parent;
      return pId === subId;
    });

    if (grandChildren.length > 0) {
      setSubSubCat(grandChildren[0]._id);
      setCategory(grandChildren[0]._id);
    } else {
      setSubSubCat('');
      setCategory(subId);
    }
  };

  const handleSubSubChange = (subSubId: string) => {
    setSubSubCat(subSubId);
    setCategory(subSubId);
  };

  // Available Sizes for standard storefront
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setDescription(product.description || '');
      setPrice(product.price ? String(product.price) : '');
      setDiscountPrice(product.discountPrice ? String(product.discountPrice) : '');
      
      const catId = typeof product.category === 'object' && product.category
        ? product.category._id
        : product.category || '';
      
      setCategory(catId);
      
      if (catId && categories.length > 0) {
        const lineage = traceLineage(catId);
        if (lineage.length === 1) {
          setParentCat(lineage[0]._id);
          setSubCat('');
          setSubSubCat('');
        } else if (lineage.length === 2) {
          setParentCat(lineage[0]._id);
          setSubCat(lineage[1]._id);
          setSubSubCat('');
        } else if (lineage.length >= 3) {
          setParentCat(lineage[0]._id);
          setSubCat(lineage[1]._id);
          setSubSubCat(lineage[2]._id);
        }
      }

      setStockQuantity(product.stockQuantity ? String(product.stockQuantity) : '10');
      setSizes(product.sizes || ['S', 'M', 'L']);
      setIsNewIn(!!product.isNewIn);
      setIsBestseller(!!product.isBestseller);
      setIsTrending(!!product.isTrending);
      setSalesCount(product.salesCount !== undefined ? String(product.salesCount) : '0');
      setViews(product.views !== undefined ? String(product.views) : '0');
      setImageUrlString(
        Array.isArray(product.images) ? product.images.join(', ') : product.images || ''
      );
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setDiscountPrice('');
      
      const firstCatId = categories[0]?._id || '';
      setCategory(firstCatId);
      
      if (firstCatId && categories.length > 0) {
        const lineage = traceLineage(firstCatId);
        if (lineage.length === 1) {
          setParentCat(lineage[0]._id);
          setSubCat('');
          setSubSubCat('');
        } else if (lineage.length === 2) {
          setParentCat(lineage[0]._id);
          setSubCat(lineage[1]._id);
          setSubSubCat('');
        } else if (lineage.length >= 3) {
          setParentCat(lineage[0]._id);
          setSubCat(lineage[1]._id);
          setSubSubCat(lineage[2]._id);
        }
      } else {
        setParentCat('');
        setSubCat('');
        setSubSubCat('');
      }

      setStockQuantity('10');
      setSizes(['S', 'M', 'L']);
      setIsNewIn(false);
      setIsBestseller(false);
      setIsTrending(false);
      setSalesCount('0');
      setViews('0');
      setImageUrlString('');
    }
    setImageFiles(null);
  }, [product, categories]);

  const handleSizeToggle = (size: string) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('discountPrice', discountPrice || '');
    formData.append('category', category);
    formData.append('stockQuantity', stockQuantity);
    formData.append('isNewIn', String(isNewIn));
    formData.append('isBestseller', String(isBestseller));
    formData.append('isTrending', String(isTrending));
    formData.append('salesCount', salesCount || '0');
    formData.append('views', views || '0');
    formData.append('sizes', sizes.join(','));

    onSubmit(formData, imageUrlString, imageFiles);
  };

  const parentOptions = categories.filter(c => !c.parent);

  const subOptions = parentCat 
    ? categories.filter(c => {
        const pId = typeof c.parent === 'object' && c.parent ? c.parent._id : c.parent;
        return pId === parentCat;
      })
    : [];

  const subSubOptions = subCat 
    ? categories.filter(c => {
        const pId = typeof c.parent === 'object' && c.parent ? c.parent._id : c.parent;
        return pId === subCat;
      })
    : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left select-none animate-fadeIn text-foreground">
      {/* Name */}
      <div className="space-y-1.5">
        <label className="block text-[10px] font-bold text-foreground uppercase tracking-wider">
          Product Name *
        </label>
        <input
          type="text"
          placeholder="e.g. Sage Linen Summer Dress"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-3 border border-border-custom rounded-xl text-xs bg-cream/15 focus:outline-none focus:border-rose text-foreground"
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="block text-[10px] font-bold text-foreground uppercase tracking-wider">
          Description *
        </label>
        <textarea
          placeholder="Describe the dress, cut, fabric quality, fit, etc."
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full px-4 py-3 border border-border-custom rounded-xl text-xs bg-cream/15 focus:outline-none focus:border-rose text-foreground"
        />
      </div>

      {/* Pricing & Stock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Price */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-foreground uppercase tracking-wider">
            Base Price (₹) *
          </label>
          <input
            type="number"
            placeholder="e.g. 1999"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            className="w-full px-4 py-3 border border-border-custom rounded-xl text-xs bg-cream/15 focus:outline-none focus:border-rose text-foreground"
          />
        </div>

        {/* Discount Price */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-foreground uppercase tracking-wider">
            Discount Price (₹)
          </label>
          <input
            type="number"
            placeholder="e.g. 1499"
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
            min="0"
            className="w-full px-4 py-3 border border-border-custom rounded-xl text-xs bg-cream/15 focus:outline-none focus:border-rose text-foreground"
          />
        </div>

        {/* Stock Quantity */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-foreground uppercase tracking-wider">
            Stock Quantity *
          </label>
          <input
            type="number"
            placeholder="10"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            required
            min="0"
            className="w-full px-4 py-3 border border-border-custom rounded-xl text-xs bg-cream/15 focus:outline-none focus:border-rose text-foreground"
          />
        </div>
      </div>

      {/* Category Selection & Sizes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Dynamic Category Hierarchy Selector */}
        <div className="space-y-4 bg-cream/10 p-5 rounded-2xl border border-border-custom/20">
          <span className="block text-[10px] font-bold text-light-brown uppercase tracking-wider">
            Category Hierarchy *
          </span>
          <div className="space-y-4">
            {/* Main Category */}
            <div className="space-y-1.5 text-left">
              <label className="block text-[9px] font-bold text-foreground uppercase tracking-wider">
                Main Category
              </label>
              <select
                value={parentCat}
                onChange={(e) => handleParentChange(e.target.value)}
                className="w-full px-4 py-3 border border-border-custom rounded-xl text-xs bg-cream/15 focus:outline-none focus:border-rose text-foreground cursor-pointer"
              >
                <option value="" disabled className="bg-background text-foreground">Select Main Category</option>
                {parentOptions.map((cat) => (
                  <option key={cat._id} value={cat._id} className="bg-background text-foreground">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            {subOptions.length > 0 && (
              <div className="space-y-1.5 text-left animate-fadeIn">
                <label className="block text-[9px] font-bold text-foreground uppercase tracking-wider">
                  Subcategory
                </label>
                <select
                  value={subCat}
                  onChange={(e) => handleSubChange(e.target.value)}
                  className="w-full px-4 py-3 border border-border-custom rounded-xl text-xs bg-cream/15 focus:outline-none focus:border-rose text-foreground cursor-pointer"
                >
                  {subOptions.map((cat) => (
                    <option key={cat._id} value={cat._id} className="bg-background text-foreground">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sub-subcategory */}
            {subSubOptions.length > 0 && (
              <div className="space-y-1.5 text-left animate-fadeIn">
                <label className="block text-[9px] font-bold text-foreground uppercase tracking-wider">
                  Detail Category (Optional)
                </label>
                <select
                  value={subSubCat}
                  onChange={(e) => handleSubSubChange(e.target.value)}
                  className="w-full px-4 py-3 border border-border-custom rounded-xl text-xs bg-cream/15 focus:outline-none focus:border-rose text-foreground cursor-pointer"
                >
                  {subSubOptions.map((cat) => (
                    <option key={cat._id} value={cat._id} className="bg-background text-foreground">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Sizes */}
        <div className="space-y-4 bg-cream/10 p-5 rounded-2xl border border-border-custom/20">
          <label className="block text-[10px] font-bold text-light-brown uppercase tracking-wider">
            Available Sizes
          </label>
          <div className="flex flex-wrap gap-2 pt-1.5">
            {availableSizes.map((size) => {
              const isSelected = sizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`px-4 py-2.5 text-xs font-bold rounded-xl border select-none cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'border-rose bg-rose text-white shadow-sm'
                      : 'border-border-custom bg-cream/20 text-light-brown hover:bg-cream/40'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Image Upload System */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-foreground uppercase tracking-wider">
            Static Image URLs (separated by comma)
          </label>
          <input
            type="text"
            placeholder="https://images.unsplash.com/... , https://..."
            value={imageUrlString}
            onChange={(e) => setImageUrlString(e.target.value)}
            className="w-full px-4 py-3 border border-border-custom rounded-xl text-xs bg-cream/15 focus:outline-none focus:border-rose text-foreground"
          />
        </div>

        <div className="text-center font-bold text-[9px] text-light-brown tracking-widest uppercase">
          - OR UPLOAD LOCAL FILES -
        </div>

        {/* Upload inputs */}
        <div className="border border-dashed border-border-custom rounded-2xl p-4 bg-cream/20 hover:bg-cream/40 transition-colors flex flex-col items-center justify-center text-center cursor-pointer select-none relative">
          <Upload size={24} className="text-light-brown mb-2 animate-bounce-subtle" />
          <p className="text-[10px] text-foreground font-bold uppercase tracking-wider">
            {imageFiles && imageFiles.length > 0
              ? `${imageFiles.length} files selected`
              : 'Select product images to upload'}
          </p>
          <p className="text-[8px] text-light-brown mt-0.5">Supports PNG, JPG, JPEG</p>
          <input
            type="file"
            multiple
            onChange={(e) => setImageFiles(e.target.files)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            accept="image/*"
          />
        </div>

        {/* Image Preview Grid */}
        {previews.length > 0 && (
          <div className="space-y-2 mt-4 animate-fadeIn">
            <span className="block text-[10px] font-bold text-light-brown uppercase tracking-wider">
              Selected Image Previews ({previews.length})
            </span>
            <div className="grid grid-cols-4 gap-3 bg-cream/10 p-3 rounded-2xl border border-border-custom/20">
              {previews.map((url, idx) => (
                <div
                  key={idx}
                  className="group aspect-square relative rounded-xl border border-border-custom/50 overflow-hidden bg-background shadow-sm hover:shadow-md transition-all duration-300 animate-scaleUp"
                >
                  <img
                    src={url}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-[2px] text-[8px] font-bold text-white px-1.5 py-0.5 rounded-md">
                    {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Promotional Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-cream/25 p-4 rounded-2xl border border-border-custom/30 select-none">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-foreground">
          <input
            type="checkbox"
            checked={isNewIn}
            onChange={(e) => setIsNewIn(e.target.checked)}
            className="w-4 h-4 accent-rose rounded cursor-pointer"
          />
          <span>Mark as "New Arrival"</span>
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-foreground">
          <input
            type="checkbox"
            checked={isBestseller}
            onChange={(e) => setIsBestseller(e.target.checked)}
            className="w-4 h-4 accent-rose rounded cursor-pointer"
          />
          <span>Mark as "Bestseller"</span>
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-foreground">
          <input
            type="checkbox"
            checked={isTrending}
            onChange={(e) => setIsTrending(e.target.checked)}
            className="w-4 h-4 accent-rose rounded cursor-pointer"
          />
          <span>Mark as "Trending Product"</span>
        </label>
      </div>

      {/* Analytics & Metrics Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-cream/10 p-5 rounded-2xl border border-border-custom/20 text-left">
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-light-brown uppercase tracking-wider">
            Mock Sales Count (Bestseller sorting)
          </label>
          <input
            type="number"
            placeholder="0"
            value={salesCount}
            onChange={(e) => setSalesCount(e.target.value)}
            min="0"
            className="w-full px-4 py-3 border border-border-custom rounded-xl text-xs bg-cream/15 focus:outline-none focus:border-rose text-foreground"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-light-brown uppercase tracking-wider">
            Mock Popularity/Views (Trending sorting)
          </label>
          <input
            type="number"
            placeholder="0"
            value={views}
            onChange={(e) => setViews(e.target.value)}
            min="0"
            className="w-full px-4 py-3 border border-border-custom rounded-xl text-xs bg-cream/15 focus:outline-none focus:border-rose text-foreground"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-4 border-t border-border-custom/50 flex-shrink-0">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          CANCEL
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="flex-1 shadow-md"
          loading={loading}
        >
          {product ? 'SAVE EDITS' : 'ADD PRODUCT'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
