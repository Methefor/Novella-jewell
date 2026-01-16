/**
 * NOVELLA - Products Data
 * Tum urunler buradan yönetilir
 */

import { NovellaProduct } from '@/lib/sanity.types';

export const PRODUCTS: NovellaProduct[] = [
  // KOLYELER
  {
    id: 'kolye-1',
    name: 'Paris Glow Altin Kolye',
    slug: 'paris-glow-altin-kolye',
    description:
      'Zarif ve modern tasarimli altin kaplama kolye. Paris sokaklarinin isiltisini yansitan minimal tasarim.',
    category: 'Kolye',
    price: 349,
    originalPrice: 449,
    variants: [
      {
        id: 'v1',
        color: 'altin',
        stock: 15,
      },
    ],
    features: ['Su gecirmez', 'Hipoalerjenik', 'Paslanmaz celik'],
    material: 'altin-kaplama',
    isNew: true,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 45,
    images: ['/products/kolye/kolye-1.jpg', '/products/kolye/kolye-1.jpg'],
  },
  {
    id: 'kolye-2',
    name: 'Tokyo Edge Ince Zincir',
    slug: 'tokyo-edge-ince-zincir',
    description:
      'Minimal Japon esteteginden ilham alan ince zincir kolye. Her tarz ile uyumlu.',
    category: 'Kolye',
    price: 299,
    originalPrice: 399,
    variants: [
      {
        id: 'v1',
        color: 'gumus',
        stock: 20,
      },
    ],
    features: [
      'Su gecirmez',
      'Ayarlanabilir uzunluk',
      '925 ayar gumus kaplama',
    ],
    material: 'gumus-kaplama',
    isNew: false,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 67,
    images: ['/products/kolye/kolye-2.jpg', '/products/kolye/kolye-2.jpg'],
  },
  {
    id: 'kolye-3',
    name: 'Milan Rose Katmanli Kolye',
    slug: 'milan-rose-katmanli-kolye',
    description:
      'Italyan modasinin zarafetini yansitan rose gold katmanli kolye.',
    category: 'Kolye',
    price: 399,
    originalPrice: 499,
    variants: [
      {
        id: 'v1',
        color: 'rose-gold',
        stock: 12,
      },
    ],
    features: ['3 katmanli tasarim', 'Ayarlanabilir', 'Su gecirmez'],
    material: 'rose-gold-kaplama',
    isNew: true,
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 32,
    images: ['/products/kolye/kolye-3.jpg', '/products/kolye/kolye-3.jpg'],
  },
  {
    id: 'kolye-4',
    name: 'London Fog Pendant Kolye',
    slug: 'london-fog-pendant-kolye',
    description: 'Ingiliz klasiginin modern yorumu. Zarif pendant tasarim.',
    category: 'Kolye',
    price: 329,
    originalPrice: 429,
    variants: [
      {
        id: 'v1',
        color: 'altin',
        stock: 18,
      },
    ],
    features: ['CZ tas', 'Su gecirmez', 'Hediye kutulu'],
    material: 'altin-kaplama',
    isNew: false,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 56,
    images: ['/products/kolye/kolye-4.jpg', '/products/kolye/kolye-4.jpg'],
  },

  // BILEZIKLER
  {
    id: 'bileklik-1',
    name: 'Barcelona Sun Halka Bileklik',
    slug: 'barcelona-sun-halka-bileklik',
    description:
      'Akdeniz gunesinin sicakligini yansitan 3lu halka bileklik seti.',
    category: 'Bilezik',
    price: 379,
    originalPrice: 479,
    variants: [
      {
        id: 'v1',
        color: 'altin',
        stock: 14,
      },
    ],
    features: ['3lu set', 'Ayarlanabilir', 'Su gecirmez'],
    material: 'altin-kaplama',
    isNew: true,
    isBestSeller: true,
    images: [
      '/products/bileklik/bileklik-1.jpg',
      '/products/bileklik/bileklik-1.jpg',
    ],
    rating: 4.9,
    reviewCount: 78,
  },
  {
    id: 'bileklik-2',
    name: 'New York Edge Zincir Bileklik',
    slug: 'new-york-edge-zincir-bileklik',
    description: 'Manhattanin modern ruhunu yansitan bold zincir bileklik.',
    category: 'Bilezik',
    price: 299,
    originalPrice: 399,
    variants: [
      {
        id: 'v1',
        color: 'gumus',
        stock: 22,
      },
    ],
    features: ['316L paslanmaz celik', 'Ayarlanabilir', 'Unisex'],
    material: 'celik',
    isNew: false,
    isBestSeller: true,
    images: [
      '/products/bileklik/bileklik-2.jpg',
      '/products/bileklik/bileklik-2.jpg',
    ],
    rating: 4.8,
    reviewCount: 65,
  },
  {
    id: 'bileklik-3',
    name: 'Seoul Minimalist Ince Bileklik',
    slug: 'seoul-minimalist-ince-bileklik',
    description: 'Kore minimalizminin zarif ornegi. Ince ve sik tasarim.',
    category: 'Bilezik',
    price: 249,
    originalPrice: 329,
    variants: [
      {
        id: 'v1',
        color: 'rose-gold',
        stock: 25,
      },
    ],
    features: ['Minimal tasarim', 'Gunluk kullanim', 'Su gecirmez'],
    material: 'rose-gold-kaplama',
    isNew: true,
    isBestSeller: false,
    images: [
      '/products/bileklik/bileklik-3.jpg',
      '/products/bileklik/bileklik-3.jpg',
    ],
    rating: 4.7,
    reviewCount: 43,
  },

  // KUPELER
  {
    id: 'kupe-1',
    name: ' Vienna Classic Halka Kupe',
    slug: 'vienna-classic-halka-kupe',
    description: 'Avusturya klasiginden ilham alan zarif halka kupe.',
    category: 'Küpe',
    price: 279,
    originalPrice: 359,
    variants: [
      {
        id: 'v1',
        color: 'altin',
        stock: 28,
      },
    ],
    features: ['Hipoalerjenik', 'Hafif', 'Su gecirmez'],
    material: 'altin-kaplama',
    isNew: false,
    isBestSeller: true,
    images: ['/products/kupe/kupe-1.jpg', '/products/kupe/kupe-1.jpg'],
    rating: 4.9,
    reviewCount: 92,
  },
  {
    id: 'kupe-2',
    name: 'Dubai Luxury Tasli Kupe',
    slug: 'dubai-luxury-tasli-kupe',
    description: 'Dubainin luks ruhunu yansitan tasli drop kupe.',
    category: 'Küpe',
    price: 399,
    originalPrice: 499,
    variants: [
      {
        id: 'v1',
        color: 'altin',
        stock: 15,
      },
    ],
    features: ['CZ tas', 'Ozel davet uygun', 'Hediye kutulu'],
    material: 'altin-kaplama',
    isNew: true,
    isBestSeller: true,
    images: ['/products/kupe/kupe-2.jpg', '/products/kupe/kupe-2.jpg'],
    rating: 4.8,
    reviewCount: 54,
  },
  {
    id: 'kupe-3',
    name: 'Sydney Breeze Minimal Kupe',
    slug: 'sydney-breeze-minimal-kupe',
    description:
      'Avustralya sahillerinin ferahligini yansitan minimal stud kupe.',
    category: 'Küpe',
    price: 229,
    originalPrice: 299,
    variants: [
      {
        id: 'v1',
        color: 'gumus',
        stock: 30,
      },
    ],
    features: ['Gunluk kullanim', 'Hipoalerjenik', 'Hafif'],
    material: 'gumus-kaplama',
    isNew: false,
    isBestSeller: true,
    images: ['/products/kupe/kupe-3.jpg', '/products/kupe/kupe-3.jpg'],
    rating: 4.9,
    reviewCount: 87,
  },

  // YUZUKLER
  {
    id: 'yuzuk-1',
    name: 'Rome Elegance Tasli Yuzuk',
    slug: 'rome-elegance-tasli-yuzuk',
    description: 'Roma imparatorlugunun zarafetinden ilham alan tasli yuzuk.',
    category: 'Yüzük',
    price: 319,
    originalPrice: 419,
    variants: [
      {
        id: 'v1',
        color: 'altin',
        stock: 16,
      },
    ],
    features: ['Ayarlanabilir beden', 'CZ tas', 'Su gecirmez'],
    material: 'altin-kaplama',
    isNew: true,
    isBestSeller: false,
    images: ['/products/yuzuk/yuzuk-1.jpg', '/products/yuzuk/yuzuk-1.jpg'],
    rating: 4.7,
    reviewCount: 38,
  },
  {
    id: 'yuzuk-2',
    name: 'Stockholm Minimalist Ince Yuzuk',
    slug: 'stockholm-minimalist-ince-yuzuk',
    description: 'Iskandinav minimalizmi ile zarif ince yuzuk.',
    category: 'Yüzük',
    price: 249,
    originalPrice: 329,
    variants: [
      {
        id: 'v1',
        color: 'gumus',
        stock: 22,
      },
    ],
    features: ['316L celik', 'Ayarlanabilir', 'Gunluk kullanim'],
    material: 'celik',
    isNew: false,
    isBestSeller: true,
    images: ['/products/yuzuk/yuzuk-2.jpg', '/products/yuzuk/yuzuk-2.jpg'],
    rating: 4.8,
    reviewCount: 61,
  },
  {
    id: 'yuzuk-3',
    name: 'Santorini Sunset Rose Gold Yuzuk',
    slug: 'santorini-sunset-rose-gold-yuzuk',
    description: 'Yunan adalarinin gun batiminden ilham alan rose gold yuzuk.',
    category: 'Yüzük',
    price: 279,
    originalPrice: 359,
    variants: [
      {
        id: 'v1',
        color: 'rose-gold',
        stock: 19,
      },
    ],
    features: ['Rose gold kaplama', 'Ayarlanabilir', 'Ozel tasarim'],
    material: 'rose-gold-kaplama',
    isNew: true,
    isBestSeller: true,
    images: ['/products/yuzuk/yuzuk-3.jpg', '/products/yuzuk/yuzuk-3.jpg'],
    rating: 4.9,
    reviewCount: 72,
  },
];

// HELPER FUNCTIONS
export const getProductsByCategory = (category: string): NovellaProduct[] => {
  return PRODUCTS.filter((p) => p.category === category);
};

export const getProductBySlug = (slug: string): NovellaProduct | undefined => {
  return PRODUCTS.find((p) => p.slug === slug);
};

export const getNewProducts = (): NovellaProduct[] => {
  return PRODUCTS.filter((p) => p.isNew).slice(0, 8);
};

export const getBestSellers = (): NovellaProduct[] => {
  return PRODUCTS.filter((p) => p.isBestSeller).slice(0, 8);
};

export const getAllProducts = (): NovellaProduct[] => {
  return PRODUCTS;
};

export const getRelatedProducts = (
  productId: string,
  category: string,
  limit: number = 4
): NovellaProduct[] => {
  return PRODUCTS.filter(
    (p) => p.category === category && p.id !== productId
  ).slice(0, limit);
};
