import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Sanity client configuration
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'a1b2c3d4',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01', // Use current date (YYYY-MM-DD) to target the latest API version
  useCdn: true, // Set to false if statically generating pages, using ISR or revalidation
  token: process.env.SANITY_API_TOKEN, // Optional, for authenticated requests
});

// Image URL builder
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}

// GROQ query helper
export async function fetchSanityData<T>(
  query: string,
  params?: Record<string, any>
): Promise<T> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  
  if (!projectId) {
    console.warn('Skipping Sanity fetch: NEXT_PUBLIC_SANITY_PROJECT_ID is missing');
    return (Array.isArray([]) ? [] : ({} as any)) as T;
  }

  try {
    const data = await sanityClient.fetch<T>(query, params || {});
    return data;
  } catch (error) {
    console.error('Sanity fetch error:', error);
    if (process.env.NODE_ENV === 'production') {
       return (Array.isArray([]) ? [] : null) as unknown as T;
    }
    throw error;
  }
}

