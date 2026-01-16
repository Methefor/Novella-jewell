// Utility functions for Sanity data transformation

import { SanityProduct, Product } from './sanity.types';
import { urlFor } from './sanity';

/**
 * Transform Sanity product to frontend product format
 */
export function transformSanityProduct(sanityProduct: SanityProduct): Product {
  return {
    id: sanityProduct._id,
    name: sanityProduct.name,
    slug: sanityProduct.slug.current,
    description: sanityProduct.description,
    price: sanityProduct.price,
    category: sanityProduct.category.name,
    images: sanityProduct.images?.map((img) => {
      if (img.asset?._ref) {
        return urlFor(img.asset).width(800).url() || '';
      }
      return '';
    }).filter(Boolean),
    stock: sanityProduct.stock,
    featured: sanityProduct.featured,
    bestseller: sanityProduct.bestseller,
    new: sanityProduct.new,
  };
}

/**
 * Get main product image URL
 */
export function getProductImageUrl(
  product: SanityProduct,
  width: number = 800
): string {
  if (!product.images || product.images.length === 0) {
    return '/placeholder-product.jpg';
  }

  const firstImage = product.images[0];
  if (firstImage.asset?._ref) {
    return urlFor(firstImage.asset).width(width).url() || '/placeholder-product.jpg';
  }

  return '/placeholder-product.jpg';
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
  }).format(price);
}

