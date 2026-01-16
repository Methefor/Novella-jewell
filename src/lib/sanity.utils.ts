// Utility functions for Sanity data transformation

import { urlFor } from './sanity';
import { NovellaProduct, SanityProduct } from './sanity.types';

/**
 * Transform Sanity product to frontend product format
 */
export function transformSanityProduct(sanityProduct: SanityProduct): NovellaProduct {
  return {
    id: sanityProduct._id,
    name: sanityProduct.name,
    slug: sanityProduct.slug.current,
    description: sanityProduct.description,
    detailedDescription: sanityProduct.detailedDescription,
    price: sanityProduct.price,
    originalPrice: sanityProduct.originalPrice,
    category: sanityProduct.category?.name || 'Genel',
    categorySlug: sanityProduct.category?.slug?.current,
    images: sanityProduct.images?.map((img) => {
      if (img.asset?._ref) {
        return urlFor(img.asset).width(1200).url() || '';
      }
      return '';
    }).filter(Boolean),
    material: sanityProduct.material,
    variants: sanityProduct.variants,
    stock: sanityProduct.totalStock || 0,
    featured: sanityProduct.featured,
    isNew: sanityProduct.isNew,
    isBestSeller: sanityProduct.isBestSeller,
    rating: sanityProduct.rating,
    reviewCount: sanityProduct.reviewCount,
    features: sanityProduct.features,
    isCustomizable: sanityProduct.isCustomizable,
    metaTitle: sanityProduct.metaTitle,
    metaDescription: sanityProduct.metaDescription,
    createdAt: sanityProduct._createdAt,
    updatedAt: sanityProduct._updatedAt,
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
