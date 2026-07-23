// Müşteri yorumları — gerçek müşterilerden gelen değerlendirmeler buraya
// elle eklenir (WhatsApp/Instagram'dan gelen yorum + fotoğraf).
// ÖNEMLİ: Buraya yalnızca GERÇEK yorumlar eklenmeli — uydurma yorum
// yayınlamak Ticari Reklam ve Haksız Ticari Uygulamalar Yönetmeliği'ne aykırıdır.
//
// Fotoğraflar public/media/yorumlar/ altına konur.

import type { Review } from '@/types/review';

export const REVIEWS: Review[] = [];

/** Bir ürünün yorumları (en yeni önce). */
export function getProductReviews(productId: string): Review[] {
  return REVIEWS.filter((r) => r.productId === productId).sort(
    (a, b) => (a.createdAt < b.createdAt ? 1 : -1)
  );
}
