// Sanity Product Type Definitions

export interface SanityProduct {
  _id: string;
  _type: 'product';
  name: string;
  slug: {
    current: string;
  };
  description?: string;
  price: number;
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
  }>;
  stock?: number;
  featured?: boolean;
  bestseller?: boolean;
  new?: boolean;
  seoTitle?: string;
  seoDescription?: string;
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

// Frontend Product Interface (simplified)
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  category: string;
  images?: string[];
  stock?: number;
  featured?: boolean;
  bestseller?: boolean;
  new?: boolean;
}

