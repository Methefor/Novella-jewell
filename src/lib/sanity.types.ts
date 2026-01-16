// Sanity Product Type Definitions

export interface SanityProduct {
  _id: string;
  _type: 'product';
  name: string;
  slug: {
    current: string;
  };
  description?: string;
  detailedDescription?: any; // Portable Text
  price: number;
  originalPrice?: number;
  category: {
    _id: string;
    name: string;
    slug: {
      current: string;
    };
  };
  images?: Array<{
    _key: string;
    asset: {
      _ref: string;
      _type: 'reference';
    };
    alt?: string;
  }>;
  material?: string;
  variants?: Array<{
    id: string;
    color?: string;
    size?: string;
    stock: number;
    sku?: string;
  }>;
  totalStock?: number;
  featured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  isCustomizable?: boolean;
  rating?: number;
  reviewCount?: number;
  features?: string[];
  metaTitle?: string;
  metaDescription?: string;
  _createdAt: string;
  _updatedAt: string;
}

export interface SanityCategory {
  _id: string;
  _type: 'category';
  name: string;
  slug: {
    current: string;
  };
  description?: string;
}

// Frontend Product Interface (unified)
export interface NovellaProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  detailedDescription?: any;
  price: number;
  originalPrice?: number;
  category: string;
  categorySlug?: string;
  images?: string[];
  material?: string;
  variants?: Array<{
    id: string;
    color?: string;
    size?: string;
    stock: number;
    sku?: string;
  }>;
  stock?: number;
  featured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  isCustomizable?: boolean;
  rating?: number;
  reviewCount?: number;
  features?: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}
