// Tek veri erişim noktası.
// Supabase'e geçişte sadece bu dosya değişir — sayfalar dokunulmaz.
export {
  getAllProducts,
  getProductBySlug,
  getProductsByCategory,
  getProductsByCollection,
  getNewProducts,
  getBestSellers,
  getRelatedProducts,
} from '@/data/products';
