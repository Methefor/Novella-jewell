// src/lib/sanity.ts
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { createClient } from 'next-sanity';

// Sanity project configuration
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'a1b2c3d4';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

// Create Sanity client
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to true for production, false for development
  perspective: 'published', // Only fetch published content
});

// Image URL builder
const builder = imageUrlBuilder(client);

/**
 * Generate Sanity image URL
 * @param source - Sanity image source
 * @returns Image URL builder instance
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Generate optimized image URL
 * @param source - Sanity image source
 * @param width - Image width
 * @param quality - Image quality (1-100)
 * @returns Optimized image URL
 */
export function getImageUrl(
  source: SanityImageSource,
  width: number = 800,
  quality: number = 75
): string {
  return urlFor(source).width(width).quality(quality).url();
}