import { Metadata } from 'next';
import { Suspense } from 'react';
import SearchResults from '@/components/SearchResults';

export const metadata: Metadata = {
  title: 'Arama | NOVELLA',
  description: 'Ürünlerde arama yapın',
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const searchQuery = q || '';

  return (
    <div className="min-h-screen bg-[#0F0F0F] pt-24 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 font-cormorant text-4xl font-bold text-white md:text-5xl">
          Arama
        </h1>
        <Suspense fallback={<SearchLoading />}>
          <SearchResults query={searchQuery} />
        </Suspense>
      </div>
    </div>
  );
}

function SearchLoading() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="glass h-[400px] animate-pulse rounded-2xl bg-white/5"
        />
      ))}
    </div>
  );
}

