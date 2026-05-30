'use client';

import React, { useState } from 'react';
import { Edit2, Trash2, Search, ArrowUpDown, Sparkles, TrendingUp, Package, AlertCircle } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';

interface ProductTableProps {
  products: any[];
  categories: any[];
  onEdit: (product: any) => void;
  onDelete: (productId: string) => Promise<void> | void;
  getCategoryPath: (cat: any) => string;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products = [],
  categories = [],
  onEdit,
  onDelete,
  getCategoryPath,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Search & Filter Products
  const filteredProducts = products.filter((product) => {
    const nameMatch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const descMatch = product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryName = typeof product.category === 'object' ? product.category?.name : getCategoryPath(product.category);
    const catMatch = categoryName?.toLowerCase().includes(searchTerm.toLowerCase());

    return nameMatch || descMatch || catMatch;
  });

  // Handle Sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let valueA = a[sortField];
    let valueB = b[sortField];

    // Handle nested category name sort
    if (sortField === 'category') {
      valueA = typeof a.category === 'object' ? a.category?.name : getCategoryPath(a.category);
      valueB = typeof b.category === 'object' ? b.category?.name : getCategoryPath(b.category);
    }

    if (valueA === undefined || valueA === null) return 1;
    if (valueB === undefined || valueB === null) return -1;

    if (typeof valueA === 'string') {
      return sortOrder === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    } else {
      return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
    }
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-4 select-none">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-cream/10 p-4 rounded-2xl border border-border-custom/25">
        <div className="relative w-full sm:max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-light-brown" />
          <input
            type="text"
            placeholder="Search products, category..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-xs border border-border-custom rounded-xl bg-background text-foreground placeholder:text-light-brown focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose"
          />
        </div>
        <div className="text-[10px] text-light-brown font-bold tracking-wider uppercase">
          Showing {Math.min(indexOfFirstItem + 1, sortedProducts.length)}-{Math.min(indexOfLastItem, sortedProducts.length)} of {sortedProducts.length} items
        </div>
      </div>

      {/* Table Frame */}
      {sortedProducts.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-border-custom/50 rounded-3xl bg-cream/5 flex flex-col items-center justify-center space-y-3">
          <AlertCircle size={28} className="text-light-brown animate-pulse" />
          <p className="text-[10px] font-bold text-light-brown uppercase tracking-wider">No Products Found</p>
          <p className="text-[9px] text-light-brown/80">Try adjusting your keyword or search term</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-border-custom/30 rounded-2xl bg-background shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream/15 border-b border-border-custom/30 text-[10px] font-bold tracking-wider uppercase text-light-brown select-none">
                <th className="py-4 px-5">Image</th>
                <th className="py-4 px-5 cursor-pointer hover:text-rose transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    Product Details <ArrowUpDown size={10} />
                  </div>
                </th>
                <th className="py-4 px-5 cursor-pointer hover:text-rose transition-colors" onClick={() => handleSort('category')}>
                  <div className="flex items-center gap-1">
                    Category <ArrowUpDown size={10} />
                  </div>
                </th>
                <th className="py-4 px-5 cursor-pointer hover:text-rose transition-colors" onClick={() => handleSort('price')}>
                  <div className="flex items-center gap-1">
                    Price <ArrowUpDown size={10} />
                  </div>
                </th>
                <th className="py-4 px-5 cursor-pointer hover:text-rose transition-colors" onClick={() => handleSort('stockQuantity')}>
                  <div className="flex items-center gap-1">
                    Stock <ArrowUpDown size={10} />
                  </div>
                </th>
                <th className="py-4 px-5">Badges</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((product) => {
                const imageUrl = Array.isArray(product.images) ? product.images[0] : product.images;
                const finalImg = getImageUrl(imageUrl);

                const categoryPath = typeof product.category === 'object' 
                  ? product.category?.name 
                  : getCategoryPath(product.category);

                const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 10;
                const isOutOfStock = product.stockQuantity === 0;

                return (
                  <tr
                    key={product._id}
                    className="border-b border-border-custom/10 hover:bg-cream/5 transition-colors duration-200 text-xs text-foreground"
                  >
                    {/* Thumbnail Image */}
                    <td className="py-3 px-5">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-border-custom bg-cream/10 relative shadow-sm">
                        <img
                          src={finalImg}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop';
                          }}
                        />
                      </div>
                    </td>

                    {/* Name & Short description */}
                    <td className="py-3 px-5 max-w-xs">
                      <div className="font-bold text-foreground hover:text-rose transition-colors truncate">
                        {product.name}
                      </div>
                      <div className="text-[10px] text-light-brown truncate mt-0.5 max-w-[200px]">
                        {product.description || 'No description provided.'}
                      </div>
                    </td>

                    {/* Category Path */}
                    <td className="py-3 px-5 font-semibold text-light-brown text-[10px]">
                      {categoryPath || 'Unassigned'}
                    </td>

                    {/* Prices */}
                    <td className="py-3 px-5 font-bold">
                      <div className="flex flex-col">
                        <span>₹{product.price}</span>
                        {product.discountPrice && (
                          <span className="text-[10px] text-light-brown line-through font-normal">
                            ₹{product.discountPrice}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock Status Badge */}
                    <td className="py-3 px-5 font-bold">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold bg-rose/10 text-rose border border-rose/25 uppercase tracking-wider">
                          Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/25 uppercase tracking-wider">
                          Low Stock ({product.stockQuantity})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 uppercase tracking-wider">
                          In Stock ({product.stockQuantity})
                        </span>
                      )}
                    </td>

                    {/* Badges */}
                    <td className="py-3 px-5">
                      <div className="flex flex-wrap gap-1">
                        {product.isNewIn && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[8px] font-bold bg-cream/35 text-light-brown border border-border-custom uppercase tracking-widest shadow-xs">
                            <Sparkles size={8} className="text-rose animate-pulse" /> New
                          </span>
                        )}
                        {product.isBestseller && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[8px] font-bold bg-rose text-white border border-rose uppercase tracking-widest shadow-xs">
                            <TrendingUp size={8} className="text-white" /> Bestseller
                          </span>
                        )}
                        {!product.isNewIn && !product.isBestseller && (
                          <span className="text-[9px] text-light-brown/65 italic">-</span>
                        )}
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(product)}
                          title="Edit Outfit Parameters"
                          className="p-1.5 border border-border-custom hover:border-rose bg-cream/10 hover:bg-rose hover:text-white rounded-lg transition-all duration-300 cursor-pointer"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
                              await onDelete(product._id);
                            }
                          }}
                          title="Remove Outfit from DB"
                          className="p-1.5 border border-border-custom hover:border-rose bg-cream/10 hover:bg-rose hover:text-white rounded-lg transition-all duration-300 cursor-pointer"
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
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1.5 pt-4">
          <button
            onClick={() => paginate(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 border border-border-custom rounded-xl text-[10px] font-bold tracking-wider bg-background text-foreground disabled:opacity-50 hover:border-rose transition-colors"
          >
            PREV
          </button>
          
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`w-7 h-7 flex items-center justify-center rounded-xl text-[10px] font-bold border transition-all duration-300 ${
                currentPage === index + 1
                  ? 'border-rose bg-rose text-white'
                  : 'border-border-custom bg-background text-foreground hover:border-rose'
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 border border-border-custom rounded-xl text-[10px] font-bold tracking-wider bg-background text-foreground disabled:opacity-50 hover:border-rose transition-colors"
          >
            NEXT
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
