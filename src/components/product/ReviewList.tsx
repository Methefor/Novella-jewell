/**
 * NOVELLA - Review List Component
 * Yorumları listele, sırala, paginate et
 */

'use client';

import type { Review } from '@/types/review';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import ReviewCard from './ReviewCard';

interface ReviewListProps {
  reviews: Review[];
}

type SortOption = 'newest' | 'highest' | 'lowest' | 'helpful';

const REVIEWS_PER_PAGE = 5;

export default function ReviewList({ reviews }: ReviewListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const endIndex = startIndex + REVIEWS_PER_PAGE;
  const currentReviews = sortedReviews.slice(startIndex, endIndex);

  if (reviews.length === 0) {
    return (
      <div className="bg-white border border-[#E8E5E0] rounded-xl p-12 text-center">
        <p className="text-[#6B6B6B] text-lg">
          Henüz değerlendirme yapılmamış. İlk yorumu siz yapın!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[#1A1A1A]">
          Tüm Değerlendirmeler ({reviews.length})
        </h3>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as SortOption);
              setCurrentPage(1);
            }}
            className="appearance-none bg-white border border-[#E8E5E0] text-[#1A1A1A] px-4 py-2 pr-10 rounded-lg cursor-pointer hover:border-gold transition-colors focus:outline-none focus:border-gold"
          >
            <option value="newest">En Yeni</option>
            <option value="highest">En Yüksek Puan</option>
            <option value="lowest">En Düşük Puan</option>
            <option value="helpful">En Faydalı</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B] pointer-events-none" />
        </div>
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {currentReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-[#E8E5E0] rounded-lg text-[#1A1A1A] hover:border-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Önceki
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`
                w-10 h-10 rounded-lg font-semibold transition-all
                ${
                  currentPage === page
                    ? 'bg-gold text-black'
                    : 'bg-white border border-[#E8E5E0] text-[#1A1A1A] hover:border-gold'
                }
              `}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border border-[#E8E5E0] rounded-lg text-[#1A1A1A] hover:border-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sonraki
          </button>
        </div>
      )}
    </div>
  );
}
