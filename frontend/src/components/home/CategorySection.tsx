import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CATEGORIES, CategoryItem } from '@/data/categories';
import API from '@/lib/api';

interface CategorySectionProps {
  products?: any[];
}

const CATEGORY_IMAGES: Record<string, string> = {
  'tops': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
  'bottoms': 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop',
  'dresses': 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop',
  'coord sets': 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=600&auto=format&fit=crop',
  'winter collection': 'https://images.unsplash.com/photo-1574164904299-3a102b110380?q=80&w=600&auto=format&fit=crop',
  'winter wear': 'https://images.unsplash.com/photo-1574164904299-3a102b110380?q=80&w=600&auto=format&fit=crop',
  'sarees': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
  'kurtas': 'https://images.unsplash.com/photo-1608748010899-18f300247112?q=80&w=600&auto=format&fit=crop',
  'outerwear': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop',
  'ethnic': 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop',
  'men': 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600&auto=format&fit=crop',
  'women': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop',
  'child': 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=600&auto=format&fit=crop',
  'kids': 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=600&auto=format&fit=crop',
  'shirt': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop',
  'shirts': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop',
  'jeans': 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop',
  'pajamas': 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=600&auto=format&fit=crop',
  'chinos': 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=600&auto=format&fit=crop',
  'heels': 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop',
  'shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
};

const getCategoryImage = (name: string): string => {
  const norm = name.toLowerCase().trim();
  return CATEGORY_IMAGES[norm] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop';
};

export const CategorySection: React.FC<CategorySectionProps> = ({ products = [] }) => {
  const [allDbCategories, setAllDbCategories] = useState<any[]>([]);
  const [displayCategories, setDisplayCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get('/categories');
        if (res.data?.success) {
          const fetched = res.data.data?.categories || res.data.categories || [];
          setAllDbCategories(fetched);
          // Filter to top-level parent categories
          const parents = fetched.filter((c: any) => !c.parent);
          setDisplayCategories(parents);
        }
      } catch (err) {
        console.warn('API error loading categories. Using static fallback data.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const getProductCountText = (catId: string) => {
    if (!products || products.length === 0) return '0 Items';
    
    // Recursively find all descendants of this category to include in count
    const getDescendants = (parentId: string): string[] => {
      let ids = [parentId];
      const children = allDbCategories.filter(
        (c: any) => {
          const pId = typeof c.parent === 'object' && c.parent ? c.parent._id : c.parent;
          return pId === parentId;
        }
      );
      for (const child of children) {
        ids = [...ids, ...getDescendants(child._id)];
      }
      return ids;
    };
    
    const descendantIds = getDescendants(catId);
    
    // Count matches in current products inventory
    const count = products.filter((p: any) => {
      const pCatId = typeof p.category === 'object' && p.category ? p.category._id : p.category;
      return descendantIds.includes(pCatId);
    }).length;
    
    return `${count} ${count === 1 ? 'Item' : 'Items'}`;
  };

  // Build the list of categories to render (dynamic with static fallback)
  const itemsToRender = displayCategories.length > 0
    ? displayCategories.map((c) => ({
        name: c.name,
        count: getProductCountText(c._id),
        img: getCategoryImage(c.name),
        link: `/shop?category=${c._id}`,
      }))
    : CATEGORIES;

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 md:px-8 border-t border-border-custom/30 select-none animate-fadeIn">
      <div className="text-center mb-16">
        <p className="font-caveat text-2xl text-rose mb-2">Beautifully Tailored</p>
        <h2 className="font-playfair text-3xl md:text-4xl font-bold tracking-wide text-foreground">
          Shop by Category
        </h2>
        <div className="w-16 h-0.5 bg-rose mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {itemsToRender.map((cat: CategoryItem, idx: number) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <Link href={cat.link} className="group block text-center">
              <div className="relative aspect-[3/4] bg-cream rounded-2xl overflow-hidden mb-4 border border-border-custom/30 shadow-sm transition-all duration-500 group-hover:shadow-md group-hover:-translate-y-1">
                <Image
                  src={cat.img}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              </div>
              <h3 className="font-playfair text-base font-bold text-foreground group-hover:text-rose transition-colors uppercase">
                {cat.name}
              </h3>
              <p className="text-[10px] uppercase tracking-wider text-light-brown mt-0.5 font-semibold">
                {cat.count}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
