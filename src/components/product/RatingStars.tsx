/**
 * NOVELLA - Rating Stars Component
 * Yıldız puanlama gösterimi ve interaktif seçim
 */

'use client';

import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export default function RatingStars({
  rating,
  maxRating = 5,
  size = 'md',
  showNumber = false,
  interactive = false,
  onRatingChange,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (selectedRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= rating;
          const isPartial = starValue > rating && starValue - 1 < rating;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(starValue)}
              disabled={!interactive}
              className={`
                ${
                  interactive
                    ? 'cursor-pointer hover:scale-110'
                    : 'cursor-default'
                }
                transition-transform duration-200
                ${
                  interactive
                    ? 'focus:outline-none focus:ring-2 focus:ring-gold/50 rounded'
                    : ''
                }
              `}
            >
              <Star
                className={`
                  ${sizeClasses[size]}
                  ${
                    isFilled
                      ? 'text-gold fill-gold'
                      : isPartial
                      ? 'text-gold fill-gold opacity-50'
                      : 'text-white/20'
                  }
                  transition-colors duration-200
                `}
              />
            </button>
          );
        })}
      </div>

      {showNumber && (
        <span className="text-sm text-white/70 font-medium">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
