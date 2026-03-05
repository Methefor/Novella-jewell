/**
 * NOVELLA - Simple Product Grid
 * Basit ürün grid görünümü (filtreleme olmadan) - scroll-triggered stagger animations
 */

'use client';

import type { Product } from '@/types/product';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

interface SimpleProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
};

export default function SimpleProductGrid({
  products,
  columns = 4,
}: SimpleProductGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-[#6B6B6B] text-lg">Ürün bulunamadı</p>
      </div>
    );
  }

  return (
    <motion.div
      className={`grid ${gridCols[columns]} gap-6`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
