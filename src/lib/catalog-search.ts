import type { Product } from '@/types/product';

function normalize(text: string) {
  return text.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/\p{M}/gu, '').replaceAll('ı', 'i').trim();
}

export function searchCatalogProducts(products: Product[], query: string): Product[] {
  const term = normalize(query);
  if (!term) return [];
  return products.filter((p) => [p.name, p.description, p.category, p.collection, ...p.features].some((text) => normalize(text).includes(term)));
}
