export interface CategoryItem {
  name: string;
  count: string;
  img: string;
  link: string;
}

export const CATEGORIES: CategoryItem[] = [
  {
    name: 'Tops',
    count: '12 Items',
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
    link: '/shop?category=Tops',
  },
  {
    name: 'Bottoms',
    count: '8 Items',
    img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop',
    link: '/shop?category=Bottoms',
  },
  {
    name: 'Dresses',
    count: '15 Items',
    img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop',
    link: '/shop?category=Dresses',
  },
  {
    name: 'Coord Sets',
    count: '6 Items',
    img: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=600&auto=format&fit=crop',
    link: '/shop?category=Coord Sets',
  },
  {
    name: 'Winter Collection',
    count: '9 Items',
    img: 'https://images.unsplash.com/photo-1574164904299-3a102b110380?q=80&w=600&auto=format&fit=crop',
    link: '/shop?category=Winter Collection',
  },
];
