/**
 * NOVELLA - Review Card Component
 * Tek bir yorumu göster
 */

'use client';

import type { Review } from '@/types/review';
import { CheckCircle, ThumbsDown, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import RatingStars from './RatingStars';

interface ReviewCardProps {
  review: Review;
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const [hasVoted, setHasVoted] = useState<'helpful' | 'notHelpful' | null>(
    null
  );
  const [helpfulCount, setHelpfulCount] = useState(review.helpful);
  const [notHelpfulCount, setNotHelpfulCount] = useState(review.notHelpful);

  const handleVote = (type: 'helpful' | 'notHelpful') => {
    if (hasVoted === type) {
      // Remove vote
      setHasVoted(null);
      if (type === 'helpful') {
        setHelpfulCount((prev) => prev - 1);
      } else {
        setNotHelpfulCount((prev) => prev - 1);
      }
    } else {
      // Add vote or change vote
      if (hasVoted === 'helpful') {
        setHelpfulCount((prev) => prev - 1);
      } else if (hasVoted === 'notHelpful') {
        setNotHelpfulCount((prev) => prev - 1);
      }

      setHasVoted(type);
      if (type === 'helpful') {
        setHelpfulCount((prev) => prev + 1);
      } else {
        setNotHelpfulCount((prev) => prev + 1);
      }
    }
  };

  return (
    <div className="bg-white border border-[#E8E5E0] rounded-xl p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-semibold text-[#1A1A1A]">{review.author.name}</h4>
            {review.author.isVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs rounded-full">
                <CheckCircle className="w-3 h-3" />
                Doğrulanmış Alıcı
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <RatingStars rating={review.rating} size="sm" />
            <time className="text-sm text-[#9B9B9B]">
              {formatDate(review.createdAt)}
            </time>
          </div>
        </div>
      </div>

      {/* Title */}
      {review.title && (
        <h5 className="font-semibold text-[#1A1A1A] mb-2">{review.title}</h5>
      )}

      {/* Comment */}
      <p className="text-[#6B6B6B] leading-relaxed mb-4">{review.comment}</p>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-4">
          {review.images.map((image, index) => (
            <div
              key={index}
              className="w-20 h-20 rounded-lg overflow-hidden border border-[#E8E5E0]"
            >
              <Image
                src={image}
                alt={`Review ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          ))}
        </div>
      )}

      {/* Helpful Buttons */}
      <div className="flex items-center gap-4 pt-4 border-t border-[#E8E5E0]">
        <p className="text-sm text-[#6B6B6B]">
          Bu değerlendirme yardımcı oldu mu?
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleVote('helpful')}
            className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all
              ${
                hasVoted === 'helpful'
                  ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-600'
                  : 'bg-[#F8F6F3] border border-[#E8E5E0] text-[#6B6B6B] hover:border-emerald-500/30'
              }
            `}
          >
            <ThumbsUp className="w-4 h-4" />
            <span className="text-sm font-medium">{helpfulCount}</span>
          </button>

          <button
            onClick={() => handleVote('notHelpful')}
            className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all
              ${
                hasVoted === 'notHelpful'
                  ? 'bg-red-500/20 border border-red-500/50 text-red-500'
                  : 'bg-[#F8F6F3] border border-[#E8E5E0] text-[#6B6B6B] hover:border-red-500/30'
              }
            `}
          >
            <ThumbsDown className="w-4 h-4" />
            <span className="text-sm font-medium">{notHelpfulCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
