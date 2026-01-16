/**
 * NOVELLA - Category Collection Page
 * Luxury Cream Theme
 */

import CategoryClient from './CategoryClient';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  return <CategoryClient category={resolvedParams.category} />;
}