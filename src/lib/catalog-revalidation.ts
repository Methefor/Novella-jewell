import 'server-only';
import { revalidatePath } from 'next/cache';

/** Call after a committed product, publication or stock change. */
export function revalidateCatalog() {
  for (const path of ['/', '/urunler', '/koleksiyonlar', '/sitemap.xml']) revalidatePath(path);
  for (const path of ['/urun/[slug]', '/collections/[category]', '/koleksiyonlar/[slug]']) revalidatePath(path, 'page');
  revalidatePath('/urun/[slug]/opengraph-image', 'page');
}
