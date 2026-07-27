import type { Product } from '@/types/product';

export type ProductReadiness = {
  ready: boolean;
  imageCount: number;
  score: number;
  missing: string[];
};

export function getProductReadiness(product: Product): ProductReadiness {
  const images = product.images?.length
    ? product.images
    : product.variants.flatMap((variant) => variant.images);
  const uniqueImages = new Set(images.filter(Boolean));
  const stock = product.variants.reduce((sum, variant) => sum + variant.stock, 0);
  const checks = [
    { ok: uniqueImages.size >= 3, label: 'En az 3 ürün görseli' },
    { ok: product.description.trim().length >= 80, label: 'Detaylı ürün açıklaması' },
    { ok: product.story.trim().length >= 10, label: 'Kısa marka hikâyesi' },
    { ok: product.features.length >= 3, label: 'En az 3 ürün özelliği' },
    { ok: product.price > 0, label: 'Geçerli fiyat' },
    { ok: stock > 0, label: 'Satılabilir stok' },
    {
      ok: product.adChecklist?.visualMatchApproved === true,
      label: 'Görsel gerçek ürünle eşleşiyor',
    },
    {
      ok: product.adChecklist?.copyApproved === true,
      label: 'Reklam metni ve ürün bilgileri onaylandı',
    },
    {
      ok: product.adChecklist?.priceStockApproved === true,
      label: 'Fiyat ve stok doğrulandı',
    },
    {
      ok: product.adChecklist?.landingPageApproved === true,
      label: 'Ürün sayfası mobilde kontrol edildi',
    },
  ];
  const passed = checks.filter((check) => check.ok).length;

  return {
    ready: passed === checks.length,
    imageCount: uniqueImages.size,
    score: Math.round((passed / checks.length) * 100),
    missing: checks.filter((check) => !check.ok).map((check) => check.label),
  };
}
