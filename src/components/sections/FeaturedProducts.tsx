'use client';

import SimpleProductGrid from '@/components/product/SimpleProductGrid';
import { getBestSellers } from '@/data/products';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FeaturedProducts() {
  const products = getBestSellers();

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="font-serif text-3xl lg:text-4xl text-white mb-2">
              Çok Satanlar
            </h2>
            <p className="text-white/60">En çok tercih edilen takılarımız</p>
          </div>

          <Link
            href="/collections"
            className="hidden md:flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
          >
            Tümünü Gör
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <SimpleProductGrid products={products} columns={4} />

        <div className="mt-12 text-center md:hidden">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-black rounded-lg hover:bg-gold-light transition-colors"
          >
            Tümünü Gör
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
