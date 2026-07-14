'use client';

import type { Collection } from '@/data/collections';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface CollectionWithMeta extends Collection {
  productCount: number;
  coverImage: string | null;
}

interface Props {
  collections: CollectionWithMeta[];
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function CollectionIndexClient({ collections }: Props) {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="px-6 md:px-12 pt-24 pb-14 border-b border-black/8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="section-label mb-4"
        >
          Koleksiyonlar
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="font-serif font-light text-4xl md:text-6xl text-black leading-tight"
          style={{ letterSpacing: '-0.03em' }}
        >
          Her şehrin bir tonu var.<br />
          Her tonun bir takısı.
        </motion.h1>
      </section>

      {/* Grid */}
      <section className="px-6 md:px-12 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {collections.map((col, i) => (
            <CollectionCard key={col.slug} collection={col} index={i} />
          ))}
        </div>
      </section>
    </main>
  );
}

function CollectionCard({
  collection,
  index,
}: {
  collection: CollectionWithMeta;
  index: number;
}) {
  const { slug, sehir, ton, aciklamaKisa, productCount, coverImage } = collection;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
    >
      <Link href={`/koleksiyonlar/${slug}`} className="group block">
        {/* Image */}
        <motion.div
          className="relative w-full overflow-hidden bg-[#F0EFED]"
          style={{ aspectRatio: '3/2' }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {coverImage ? (
            <Image
              src={coverImage}
              alt={sehir || slug}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif text-5xl text-black/10 select-none">
                {sehir || 'N'}
              </span>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Overlay text */}
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="text-[10px] uppercase tracking-widest text-white/60 mb-1">{ton}</p>
            <h2
              className="font-serif font-light text-white leading-none"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', letterSpacing: '-0.02em' }}
            >
              {sehir || 'Klasikler'}
            </h2>
          </div>
        </motion.div>

        {/* Card footer */}
        <div className="flex items-end justify-between mt-3 pb-2 border-b border-transparent group-hover:border-[#B8A574] transition-colors duration-300">
          <p className="text-sm text-black/60 leading-snug max-w-[80%]">
            {aciklamaKisa}
          </p>
          <span className="text-xs text-black/35 whitespace-nowrap ml-3">
            {productCount} parça
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
