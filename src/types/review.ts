/**
 * NOVELLA - Review Types
 * Yorum ve değerlendirme tipleri
 */

export interface Review {
  id: string;
  productId: string;
  author: {
    name: string;
    email: string;
    isVerified: boolean;
  };
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  helpful: number;
  notHelpful: number;
  createdAt: string; // ← Date değil string
  updatedAt: string; // ← Date değil string
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
