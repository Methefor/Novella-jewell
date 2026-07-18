import { SHIPPING } from '@/lib/config';
import { PRODUCTS } from '@/data/products';
import type { Order, OrderCustomer, OrderItem } from './types';

/**
 * GÜVENLİK NOTU — bu dosyanın var olma sebebi.
 *
 * Eskiden client `total` alanını kendisi hesaplayıp /api/checkout'a gönderiyordu,
 * sunucu da onu doğrudan imzalayıp Shopier'e iletiyordu. Yani kullanıcı
 * {"total": 1} POST ederek 12.000 ₺'lik sepeti 1 ₺'ye alabiliyordu ve imza
 * geçerli oluyordu (çünkü bizim secret'ımızla imzalanıyordu).
 *
 * Kural: client YALNIZCA ne istediğini söyler (ürün + adet).
 * Fiyat, kargo ve toplam DAİMA burada, sunucuda, PRODUCTS'tan yeniden hesaplanır.
 * Client'tan gelen hiçbir fiyat alanına güvenilmez.
 */

/** Client'ın gönderebileceği tek şey: ne, hangi varyant, kaç adet. */
export interface CheckoutRequestItem {
  productId: string;
  variantId: string;
  quantity: number;
  customization?: string;
}

export type BuildOrderResult =
  | { ok: true; order: Order }
  | { ok: false; error: string };

const MAX_QUANTITY_PER_ITEM = 20;

export function buildOrder(
  rawItems: unknown,
  customer: OrderCustomer,
  orderId: string
): BuildOrderResult {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return { ok: false, error: 'Sepetiniz boş.' };
  }

  if (rawItems.length > 50) {
    return { ok: false, error: 'Sepette çok fazla ürün var.' };
  }

  const items: OrderItem[] = [];
  let subtotal = 0;

  for (const raw of rawItems) {
    const req = raw as Partial<CheckoutRequestItem>;

    if (typeof req?.productId !== 'string' || typeof req?.variantId !== 'string') {
      return { ok: false, error: 'Geçersiz ürün bilgisi.' };
    }

    const quantity = Number(req.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_ITEM) {
      return { ok: false, error: 'Geçersiz adet.' };
    }

    // Ürünü client'tan değil, kendi verimizden buluyoruz.
    const product = PRODUCTS.find((p) => p.id === req.productId);
    if (!product) {
      return { ok: false, error: 'Ürün bulunamadı.' };
    }

    const variant = product.variants.find((v) => v.id === req.variantId);
    if (!variant) {
      return { ok: false, error: `${product.name} için geçersiz seçenek.` };
    }

    // Stok kontrolü — statik veriye dayanıyor. Kalıcı stok takibi
    // (Supabase) geldiğinde burada DB'den okunmalı ve satış sonrası düşülmeli.
    if (variant.stock < quantity) {
      return {
        ok: false,
        error:
          variant.stock === 0
            ? `${product.name} tükendi.`
            : `${product.name} için yeterli stok yok (kalan: ${variant.stock}).`,
      };
    }

    // FİYAT BURADAN GELİR — client'ın gönderdiği fiyat tamamen yok sayılır.
    const price = product.price;
    subtotal += price * quantity;

    items.push({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price,
      quantity,
    });
  }

  const shippingCost = subtotal >= SHIPPING.freeThreshold ? 0 : SHIPPING.fee;
  const total = subtotal + shippingCost;

  return {
    ok: true,
    order: {
      id: orderId,
      items,
      customer,
      subtotal: round2(subtotal),
      shippingCost: round2(shippingCost),
      total: round2(total),
      currency: 'TRY',
      createdAt: new Date().toISOString(),
    },
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
