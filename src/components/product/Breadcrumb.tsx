/**
 * NOVELLA - Breadcrumb Component
 * Sayfa navigasyon breadcrumb'ı
 */

'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center gap-2 text-sm">
        {/* Ana Sayfa */}
        <li>
          <Link
            href="/"
            className="text-black/60 hover:text-gold transition-colors"
          >
            Ana Sayfa
          </Link>
        </li>

        {/* Items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-black/40" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-black/60 hover:text-gold transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-black font-medium">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
