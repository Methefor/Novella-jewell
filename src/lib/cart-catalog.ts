import type { CartItem } from '@/store/cartStore';
import type { Product } from '@/types/product';

/** Reconcile persisted selections with current sellable variants and prices. */
export function reconcileCart(items: CartItem[], products: Product[]): CartItem[] {
  const used = new Map<string, number>();
  return items.flatMap((item) => {
    const product = products.find((p) => p.id === item.product.id);
    const variant = product?.variants.find((v) => v.id === item.variant.id);
    if (!product || !variant) return [];
    const key = JSON.stringify([product.id, variant.id]);
    const remaining = Math.min(20, variant.stock) - (used.get(key) ?? 0);
    const quantity = Math.min(Math.max(0, Math.floor(item.quantity)), remaining);
    if (quantity < 1) return [];
    used.set(key, (used.get(key) ?? 0) + quantity);
    return [{ ...item, product, variant, quantity }];
  });
}
