export type ProductCategory = 'kolye' | 'bilezik' | 'kupe' | 'yuzuk';

export type ProductMaterial =
  | 'celik'
  | 'gumus-kaplama'
  | 'altin-kaplama'
  | 'rose-gold-kaplama';

export type ProductColor =
  | 'altin'
  | 'gumus'
  | 'rose-gold'
  | 'siyah'
  | 'beyaz'
  | 'cok-renkli';

export type CollectionSlug =
  | 'barcelona'
  | 'stockholm'
  | 'paris'
  | 'klasikler';

export interface ProductVariant {
  id: string;
  color: ProductColor;
  material: ProductMaterial;
  stock: number;
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ProductCategory;

  // Koleksiyon + mikro hikaye
  collection: CollectionSlug;
  story: string;

  // Fiyat — compareAtPrice SADECE gerçek kampanyada dolar
  price: number;
  compareAtPrice?: number;

  // Varyasyonlar
  variants: ProductVariant[];
  defaultVariant: string;

  // Özellikler
  features: string[];
  material: ProductMaterial;
  isNew?: boolean;
  isBestSeller?: boolean;
  isCustomizable?: boolean;

  // Rating (ileride gerçek yorumlardan hesaplanacak)
  rating?: number;
  reviewCount?: number;

  // Meta
  createdAt: Date;
  updatedAt: Date;
  metaTitle?: string;
  metaDescription?: string;
}

export interface FilterState {
  categories: ProductCategory[];
  collections: CollectionSlug[];
  priceRange: { min: number; max: number };
  materials: ProductMaterial[];
  colors: ProductColor[];
  isNew: boolean;
  isBestSeller: boolean;
  isCustomizable: boolean;
  inStock: boolean;
  sortBy: SortOption;
  searchQuery: string;
}

export type SortOption =
  | 'newest'
  | 'popular'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc';

export interface CollectionMeta {
  title: string;
  description: string;
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  productsPerPage: number;
}
