export interface PurchasedItem {
  productId: string;
  variantId: string;
  ad: string;
  adet: number;
  birimFiyat: number;
}

export interface VerifiedPurchase {
  items: PurchasedItem[];
  total: number;
}

/** Only values verified against the saved paid order enter this function. */
export function purchaseEvent(transactionId: string, purchase: VerifiedPurchase) {
  const value = Math.round(purchase.items.reduce((sum, i) => sum + i.birimFiyat * i.adet, 0) * 100) / 100;
  return {
    transaction_id: transactionId, currency: 'TRY', value,
    shipping: Math.max(0, Math.round((purchase.total - value) * 100) / 100),
    items: purchase.items.map((i) => ({ item_id: i.productId, item_variant: i.variantId, item_name: i.ad, item_brand: 'NOVELLA', price: i.birimFiyat, quantity: i.adet })),
  };
}
