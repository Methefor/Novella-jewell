// Product data fetching functions

import { fetchSanityData } from './sanity';
import {
    allCategoriesQuery,
    allProductsQuery,
    featuredProductsQuery,
    productBySlugQuery,
    productsByCategoryQuery,
    searchProductsQuery,
} from './sanity.queries';
import { NovellaProduct, SanityCategory, SanityProduct } from './sanity.types';
import { transformSanityProduct } from './sanity.utils';

/**
 * Get all products
 */
export async function getAllProducts(): Promise<NovellaProduct[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return [];

  try {
    const sanityProducts = await fetchSanityData<SanityProduct[]>(
      allProductsQuery
    );
    return sanityProducts.map(transformSanityProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return empty array on error
    return [];
  }
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string): Promise<NovellaProduct | null> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return null;

  try {
    const sanityProduct = await fetchSanityData<SanityProduct>(
      productBySlugQuery,
      { slug }
    );
    if (!sanityProduct) return null;
    return transformSanityProduct(sanityProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(): Promise<NovellaProduct[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return [];

  try {
    const sanityProducts = await fetchSanityData<SanityProduct[]>(
      featuredProductsQuery
    );
    return sanityProducts.map(transformSanityProduct);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

/**
 * Get products by category
 */
export async function getProductsByCategory(
  categorySlug: string
): Promise<NovellaProduct[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return [];

  try {
    const sanityProducts = await fetchSanityData<SanityProduct[]>(
      productsByCategoryQuery,
      { categorySlug }
    );
    return sanityProducts.map(transformSanityProduct);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

/**
 * Search products
 */
export async function searchProducts(
  searchTerm: string
): Promise<NovellaProduct[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return [];

  try {
    const sanityProducts = await fetchSanityData<SanityProduct[]>(
      searchProductsQuery,
      { searchTerm: `*${searchTerm}*` }
    );
    return sanityProducts.map(transformSanityProduct);
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

/**
 * Get all categories
 */
export async function getAllCategories(): Promise<string[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return ['Kolye', 'Bilezik', 'Küpe', 'Yüzük'];

  try {
    const categories = await fetchSanityData<SanityCategory[]>(
      allCategoriesQuery
    );
    return categories.map((cat) => cat.name);
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return default categories if Sanity fails
    return ['Kolye', 'Bilezik', 'Küpe', 'Yüzük'];
  }
}

