import type { Product } from '@/types/product';

type EditorialSelection = {
  title: string;
  eyebrow: string;
  category?: Product['category'];
  slug: string;
  href: string;
  imageIndex: number;
  fallbackImage: string;
};

const homeSelections: EditorialSelection[] = [
  {
    title: 'Yüzükler',
    eyebrow: 'Yeni sezon',
    category: 'yuzuk',
    slug: 'paris-royale-markiz-tasli-altin-yuzuk',
    href: '/collections/yuzuk',
    imageIndex: 1,
    fallbackImage:
      'https://uzxch7c5mh5aeema.public.blob.vercel-storage.com/products/barcelona-stella-altin-tasli-yuzuk/02-elde-W4eIBUPOkLwKXCiC3qi0FZNvcYIgMo.png',
  },
  {
    title: 'Küpeler',
    eyebrow: 'Zarif detay',
    category: 'kupe',
    slug: 'paris-elan-inci-sallantili-altin-kupe',
    href: '/collections/kupe',
    imageIndex: 1,
    fallbackImage:
      'https://uzxch7c5mh5aeema.public.blob.vercel-storage.com/products/paris-elan-inci-sallantili-altin-kupe/paris-elan-inci-sallantili-altin-kupe-02-model-closeup-gVZZJZyaNJxTU1k7Pkmg8qccA4HAMj.png',
  },
  {
    title: 'Bileklikler',
    eyebrow: 'Günlük ışıltı',
    category: 'bilezik',
    slug: 'paris-eclat-pave-bloklu-altin-bileklik',
    href: '/collections/bilezik',
    imageIndex: 1,
    fallbackImage:
      'https://uzxch7c5mh5aeema.public.blob.vercel-storage.com/products/paris-eclat-pave-bloklu-altin-bileklik/paris-eclat-pave-bloklu-altin-bileklik-02-sZ7OlBYnpl349ihHS9PVYwyl8nlOlm.png',
  },
];

const discoverySelections: EditorialSelection[] = [
  { ...homeSelections[0], eyebrow: 'Özgün formlar' },
  {
    title: 'Yeni gelenler',
    eyebrow: 'Son seçkiler',
    slug: 'barcelona-celeste-yildizli-denizanasi-altin-kupe',
    href: '/collections/yeni-gelenler',
    imageIndex: 1,
    fallbackImage:
      'https://uzxch7c5mh5aeema.public.blob.vercel-storage.com/products/barcelona-celeste-yildizli-denizanasi-altin-kupe/barcelona-celeste-yildizli-denizanasi-altin-kupe-02-model-closeup-a0U3Y2mdgxxGQu6P2QqFOwWfRksD2e.png',
  },
  { ...homeSelections[1], eyebrow: 'Zarif detaylar' },
  homeSelections[2],
];

function resolveSelection(
  selection: EditorialSelection,
  products: Product[],
  useFallback: boolean,
) {
  const available = products.filter((product) => !product.hidden && !product.deletedAt);
  const candidates = selection.category
    ? available.filter((product) => product.category === selection.category)
    : available;
  const product =
    available.find((item) => item.slug === selection.slug) ??
    candidates.find((item) => item.isNew) ??
    candidates[0];
  if (!product && !useFallback) return null;
  const variant = product?.variants.find((item) => item.id === product.defaultVariant) ?? product?.variants[0];
  const gallery = product?.images?.length ? product.images : variant?.images ?? [];
  const image = gallery[selection.imageIndex] ?? gallery[0] ?? selection.fallbackImage;

  return {
    title: selection.title,
    eyebrow: selection.eyebrow,
    href: selection.href,
    image,
    alt: product ? `${product.name} — ${selection.title}` : `${selection.title} kategori seçkisi`,
  };
}

/** Ana sayfa ve keşif menüsü aynı güncel editoryal seçkiden beslenir. */
export function getHomeCategories(products: Product[]) {
  return homeSelections.flatMap((selection) => {
    const category = resolveSelection(selection, products, false);
    return category ? [category] : [];
  });
}

export function getDiscoveryCategories(products: Product[]) {
  return discoverySelections.map((selection) => resolveSelection(selection, products, true)!);
}
