/**
 * NOVELLA - Review Stats Component
 * Rating dağılımı ve istatistikler
 */

'use client';

import type { ReviewStats as ReviewStatsType } from '@/types/review';
import { Star } from 'lucide-react';

interface ReviewStatsProps {
  stats: ReviewStatsType;
}

export default function ReviewStats({ stats }: ReviewStatsProps) {
  const { averageRating, totalReviews, ratingDistribution } = stats;

  return (
    <div className="bg-gray-800 border border-white/10 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">
        Müşteri Değerlendirmeleri
      </h3>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Average Rating */}
        <div className="text-center">
          <div className="text-6xl font-bold text-gold mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 ${
                  i < Math.floor(averageRating)
                    ? 'text-gold fill-gold'
                    : i < averageRating
                    ? 'text-gold fill-gold opacity-50'
                    : 'text-white/20'
                }`}
              />
            ))}
          </div>
          <p className="text-white/60 text-sm">{totalReviews} değerlendirme</p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count =
              ratingDistribution[rating as keyof typeof ratingDistribution] ||
              0;
            const percentage =
              totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm text-white/70">{rating}</span>
                  <Star className="w-4 h-4 text-gold fill-gold" />
                </div>

                <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold to-gold-light transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="text-sm text-white/60 w-12 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
