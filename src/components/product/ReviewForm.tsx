/**
 * NOVELLA - Review Form Component
 * Yorum yazma formu
 */

'use client';

import { useState } from 'react';
import RatingStars from './RatingStars';

interface ReviewFormProps {
  productId: string;
  onSubmit?: (data: {
    rating: number;
    title: string;
    comment: string;
    name: string;
    email: string;
  }) => void;
}

export default function ReviewForm({ productId, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Lütfen puan seçiniz');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const reviewData = {
      rating,
      title,
      comment,
      name,
      email,
    };

    // Call parent onSubmit if provided
    if (onSubmit) {
      onSubmit(reviewData);
    }

    // Show success message
    setShowSuccess(true);

    // Reset form
    setRating(0);
    setTitle('');
    setComment('');
    setName('');
    setEmail('');
    setIsSubmitting(false);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-lg">
          ✓ Değerlendirmeniz başarıyla gönderildi!
        </div>
      )}

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Puanınız <span className="text-red-500">*</span>
        </label>
        <RatingStars
          rating={rating}
          onRatingChange={setRating}
          size="lg"
          interactive
        />
      </div>

      {/* Title */}
      <div>
        <label
          htmlFor="review-title"
          className="block text-sm font-medium text-white mb-2"
        >
          Başlık
        </label>
        <input
          id="review-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Kısa bir başlık yazın"
          className="w-full px-4 py-3 bg-gray-700 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all"
        />
      </div>

      {/* Comment */}
      <div>
        <label
          htmlFor="review-comment"
          className="block text-sm font-medium text-white mb-2"
        >
          Yorumunuz <span className="text-red-500">*</span>
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Ürün hakkındaki düşüncelerinizi paylaşın..."
          rows={4}
          required
          className="w-full px-4 py-3 bg-gray-700 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all resize-none"
        />
      </div>

      {/* Name */}
      <div>
        <label
          htmlFor="review-name"
          className="block text-sm font-medium text-white mb-2"
        >
          Adınız <span className="text-red-500">*</span>
        </label>
        <input
          id="review-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Adınız Soyadınız"
          required
          className="w-full px-4 py-3 bg-gray-700 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="review-email"
          className="block text-sm font-medium text-white mb-2"
        >
          E-posta <span className="text-red-500">*</span>
        </label>
        <input
          id="review-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ornek@email.com"
          required
          className="w-full px-4 py-3 bg-gray-700 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="w-full py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Gönderiliyor...' : 'Değerlendirmeyi Gönder'}
      </button>
    </form>
  );
}
