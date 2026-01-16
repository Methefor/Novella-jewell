/**
 * NOVELLA - Reviews Mock Data
 * Ürün yorumları ve değerlendirmeleri
 */

import type { Review, ReviewStats } from '@/types/review';

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'review-1',
    productId: 'kolye-1',
    author: {
      name: 'Ayşe Yılmaz',
      email: 'ayse@example.com',
      isVerified: true,
    },
    rating: 5,
    title: 'Harika bir ürün!',
    comment:
      'Kalitesi çok iyi, fotoğraflardaki gibi geldi. Paketleme de çok özenli yapılmış. Kesinlikle tavsiye ederim.',
    images: [],
    helpful: 12,
    notHelpful: 1,
    createdAt: '2024-12-15T10:30:00Z',
    updatedAt: '2024-12-15T10:30:00Z',
  },
  {
    id: 'review-2',
    productId: 'kolye-1',
    author: {
      name: 'Mehmet Kaya',
      email: 'mehmet@example.com',
      isVerified: true,
    },
    rating: 4,
    title: 'Güzel ancak rengi biraz farklı',
    comment:
      'Ürün kaliteli ama fotoğraftaki renge göre biraz daha mat geldi. Yine de memnunum.',
    images: [],
    helpful: 8,
    notHelpful: 2,
    createdAt: '2024-12-10T14:20:00Z',
    updatedAt: '2024-12-10T14:20:00Z',
  },
  {
    id: 'review-3',
    productId: 'bileklik-1',
    author: {
      name: 'Zeynep Demir',
      email: 'zeynep@example.com',
      isVerified: true,
    },
    rating: 5,
    title: 'Mükemmel!',
    comment:
      'Tam beklediğim gibi çıktı. Hem zarif hem de günlük kullanıma uygun. Çok beğendim.',
    images: [],
    helpful: 15,
    notHelpful: 0,
    createdAt: '2024-12-12T16:45:00Z',
    updatedAt: '2024-12-12T16:45:00Z',
  },
  {
    id: 'review-4',
    productId: 'kupe-1',
    author: {
      name: 'Elif Şahin',
      email: 'elif@example.com',
      isVerified: false,
    },
    rating: 3,
    title: 'İdare eder',
    comment: 'Fiyatına göre uygun ama biraz daha kaliteli olabilirdi.',
    images: [],
    helpful: 5,
    notHelpful: 3,
    createdAt: '2024-12-08T09:15:00Z',
    updatedAt: '2024-12-08T09:15:00Z',
  },
];

/**
 * Ürün ID'sine göre yorumları getir
 */
export function getReviewsByProductId(productId: string): Review[] {
  return MOCK_REVIEWS.filter((review) => review.productId === productId);
}

/**
 * Yorum istatistiklerini hesapla
 */
export function calculateReviewStats(reviews: Review[]): ReviewStats {
  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
    };
  }

  const totalReviews = reviews.length;
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / totalReviews;

  const ratingDistribution = reviews.reduce(
    (acc, review) => {
      acc[review.rating as keyof typeof acc]++;
      return acc;
    },
    { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  );

  return {
    averageRating,
    totalReviews,
    ratingDistribution,
  };
}
