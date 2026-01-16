/**
 * NOVELLA - Category Grid Section
 * Ana kategorileri gösteren grid
 */

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const categories = [
  {
    name: 'Kolyeler',
    slug: 'kolye',
    image: '/products/kolye/kolye-1.jpg',
    description: 'Zarif kolye modelleri',
  },
  {
    name: 'Bilezikler',
    slug: 'bilezik',
    image: '/products/bileklik/bileklik-1.jpg',
    description: 'Şık bilezik tasarımları',
  },
  {
    name: 'Küpeler',
    slug: 'kupe',
    image: '/products/kupe/kupe-1.jpg',
    description: 'Modern küpe modelleri',
  },
  {
    name: 'Yüzükler',
    slug: 'yuzuk',
    image: '/products/yuzuk/yuzuk-1.jpg',
    description: 'İnce yüzük tasarımları',
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl lg:text-4xl text-white mb-4">
            Koleksiyonlarımızı Keşfedin
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Her kategoride özenle seçilmiş, kaliteli ve şık tasarımlar
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/collections/${category.slug}`}
                className="group block relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-800"
              >
                {/* Image */}
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="font-serif text-2xl text-white mb-2 group-hover:text-gold transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-white/80">
                    {category.description}
                  </p>
                </div>

                {/* Hover Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold transition-colors rounded-lg" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
