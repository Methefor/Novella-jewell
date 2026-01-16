// src/lib/sanity-queries.ts
import type { Product } from '@/types/product';
import { client } from './sanity';

/**
 * Base product fields for GROQ queries
 */
const productFields = `
  _id,
  name,
  "slug": slug.current,
  price,
  originalPrice,
  "category": category->name,
  "categorySlug": category->slug.current,
  "images": images[].asset->url,
  description,
  detailedDescription,
  material,
  variants,
  totalStock,
  featured,
  isNew,
  isBestSeller,
  rating,
  reviewCount,
  features,
  metaTitle,
  metaDescription,
  status
`;

/**
 * Fetch all published products
 * @returns Array of products
 */
export async function getAllProducts(): Promise<Product[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return [];

  const query = `*[_type == "product" && status == "published"] | order(_createdAt desc) {
    ${productFields}
  }`;
  
  return client.fetch(query, {}, { next: { revalidate: 60 } });
}

/**
 * Fetch best seller products
 * @param limit - Maximum number of products to fetch
 * @returns Array of best seller products
 */
export async function getBestSellers(limit: number = 8): Promise<Product[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return [];

  const query = `*[_type == "product" && isBestSeller == true && status == "published"] 
    | order(reviewCount desc) [0...${limit}] {
      ${productFields}
    }`;
  
  return client.fetch(query, {}, { next: { revalidate: 60 } });
}

/**
 * Fetch new arrival products
 * @param limit - Maximum number of products to fetch
 * @returns Array of new products
 */
export async function getNewArrivals(limit: number = 8): Promise<Product[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return [];

  const query = `*[_type == "product" && isNew == true && status == "published"] 
    | order(_createdAt desc) [0...${limit}] {
      ${productFields}
    }`;
  
  return client.fetch(query, {}, { next: { revalidate: 60 } });
}

/**
 * Fetch featured products
 * @param limit - Maximum number of products to fetch
 * @returns Array of featured products
 */
export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return [];

  const query = `*[_type == "product" && featured == true && status == "published"] 
    | order(_createdAt desc) [0...${limit}] {
      ${productFields}
    }`;
  
  return client.fetch(query, {}, { next: { revalidate: 60 } });
}

/**
 * Fetch product by slug
 * @param slug - Product slug
 * @returns Product or null
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return null;

  const query = `*[_type == "product" && slug.current == $slug && status == "published"][0] {
    ${productFields}
  }`;
  
  return client.fetch(query, { slug }, { next: { revalidate: 60 } });
}

/**
 * Fetch products by category
 * @param category - Category name
 * @returns Array of products
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return [];

  const query = `*[_type == "product" && category->name == $category && status == "published"] 
    | order(_createdAt desc) {
      ${productFields}
    }`;
  
  return client.fetch(query, { category }, { next: { revalidate: 60 } });
}

/**
 * Fetch related products (same category, excluding current product)
 * @param currentProductId - Current product ID
 * @param category - Category name
 * @param limit - Maximum number of products to fetch
 * @returns Array of related products
 */
export async function getRelatedProducts(
  currentProductId: string,
  category: string,
  limit: number = 4
): Promise<Product[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return [];

  const query = `*[_type == "product" 
    && category->name == $category 
    && _id != $currentProductId 
    && status == "published"] 
    | order(_createdAt desc) [0...${limit}] {
      ${productFields}
    }`;
  
  return client.fetch(
    query,
    { currentProductId, category },
    { next: { revalidate: 60 } }
  );
}

/**
 * Fetch all categories
 * @returns Array of categories
 */
export async function getAllCategories() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return [];

  const query = `*[_type == "category"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    "image": image.asset->url,
    showOnHomepage,
    order
  }`;
  
  return client.fetch(query, {}, { next: { revalidate: 3600 } });
}

/**
 * Search products by query
 * @param searchQuery - Search query string
 * @returns Array of matching products
 */
export async function searchProducts(searchQuery: string): Promise<Product[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return [];

  const query = `*[_type == "product" 
    && status == "published"
    && (
      name match $searchQuery + "*"
      || description match $searchQuery + "*"
      || category->name match $searchQuery + "*"
    )
  ] | order(_score desc) [0...20] {
    ${productFields}
  }`;
  
  return client.fetch(query, { searchQuery }, { next: { revalidate: 0 } });
}