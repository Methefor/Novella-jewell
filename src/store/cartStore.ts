/**
 * NOVELLA - Shopping Cart Store (Zustand)
 * Sepet state management
 */

import { NovellaProduct } from '@/lib/sanity.types';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // Unique: productId + variantId
  product: NovellaProduct;
  variant: {
    id: string;
    color?: string;
    size?: string;
    stock: number;
    sku?: string;
  };
  quantity: number;
  customization?: string; // İsim baskısı
}

interface CartStore {
  // State
  items: CartItem[];
  isDrawerOpen: boolean;

  // Computed values
  itemCount: number;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;

  // Actions
  addItem: (
    product: NovellaProduct,
    variantId: string,
    quantity?: number,
    customization?: string
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;

  // Drawer
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;

  // Coupon
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

// Kargo ücreti hesaplama
const calculateShipping = (subtotal: number): number => {
  if (subtotal >= 400) return 0; // 400₺ üzeri ücretsiz
  return 29.9;
};

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        items: [],
        isDrawerOpen: false,
        itemCount: 0,
        subtotal: 0,
        shippingCost: 0,
        discount: 0,
        total: 0,

        // Add item to cart
        addItem: (product, variantId, quantity = 1, customization) => {
          const variant = product.variants?.find((v) => v.id === variantId);
          if (!variant) return;

          const itemId = `${product.id}-${variantId}${
            customization ? `-${customization}` : ''
          }`;
          const items = get().items;
          const existingItem = items.find((item) => item.id === itemId);

          let newItems: CartItem[];

          if (existingItem) {
            // Update quantity
            const newQuantity = Math.min(
              existingItem.quantity + quantity,
              variant.stock
            );
            newItems = items.map((item) =>
              item.id === itemId ? { ...item, quantity: newQuantity } : item
            );
          } else {
            // Add new item
            const newItem: CartItem = {
              id: itemId,
              product,
              variant,
              quantity: Math.min(quantity, variant.stock),
              customization,
            };
            newItems = [...items, newItem];
          }

          const subtotal = newItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          );
          const shippingCost = calculateShipping(subtotal);
          const discount = get().discount;
          const total = subtotal + shippingCost - discount;
          const itemCount = newItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );

          set(
            {
              items: newItems,
              itemCount,
              subtotal,
              shippingCost,
              total,
              isDrawerOpen: true, // Open drawer on add
            },
            false,
            'addItem'
          );
        },

        // Remove item from cart
        removeItem: (itemId) => {
          const items = get().items.filter((item) => item.id !== itemId);
          const subtotal = items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          );
          const shippingCost = calculateShipping(subtotal);
          const discount = get().discount;
          const total = subtotal + shippingCost - discount;
          const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

          set(
            {
              items,
              itemCount,
              subtotal,
              shippingCost,
              total,
            },
            false,
            'removeItem'
          );
        },

        // Update item quantity
        updateQuantity: (itemId, quantity) => {
          if (quantity < 1) {
            get().removeItem(itemId);
            return;
          }

          const items = get().items.map((item) => {
            if (item.id === itemId) {
              const maxQty = item.variant.stock;
              return { ...item, quantity: Math.min(quantity, maxQty) };
            }
            return item;
          });

          const subtotal = items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          );
          const shippingCost = calculateShipping(subtotal);
          const discount = get().discount;
          const total = subtotal + shippingCost - discount;
          const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

          set(
            {
              items,
              itemCount,
              subtotal,
              shippingCost,
              total,
            },
            false,
            'updateQuantity'
          );
        },

        // Clear cart
        clearCart: () => {
          set(
            {
              items: [],
              itemCount: 0,
              subtotal: 0,
              shippingCost: 0,
              discount: 0,
              total: 0,
            },
            false,
            'clearCart'
          );
        },

        // Drawer controls
        openDrawer: () => set({ isDrawerOpen: true }, false, 'openDrawer'),
        closeDrawer: () => set({ isDrawerOpen: false }, false, 'closeDrawer'),
        toggleDrawer: () =>
          set(
            (state) => ({ isDrawerOpen: !state.isDrawerOpen }),
            false,
            'toggleDrawer'
          ),

        // Coupon system
        applyCoupon: (code) => {
          const validCoupons: Record<string, number> = {
            ILKALISVERIS: 50, // 50 TL indirim
            NOVELLA10: 10, // 10% indirim (subtotal)
            YENIYIL25: 25, // 25 TL indirim
          };

          const couponValue = validCoupons[code.toUpperCase()];
          if (!couponValue) return false;

          const subtotal = get().subtotal;
          let discount = 0;

          if (code.toUpperCase() === 'NOVELLA10') {
            discount = Math.round(subtotal * 0.1); // 10%
          } else {
            discount = couponValue;
          }

          const shippingCost = get().shippingCost;
          const total = subtotal + shippingCost - discount;

          set({ discount, total }, false, 'applyCoupon');
          return true;
        },

        removeCoupon: () => {
          const subtotal = get().subtotal;
          const shippingCost = get().shippingCost;
          const total = subtotal + shippingCost;

          set({ discount: 0, total }, false, 'removeCoupon');
        },
      }),
      {
        name: 'novella-cart',
        partialize: (state) => ({
          items: state.items,
          discount: state.discount,
        }),
      }
    )
  )
);

// Selectors
export const selectCartItemCount = (state: CartStore) => state.itemCount;
export const selectCartTotal = (state: CartStore) => state.total;
export const selectHasItems = (state: CartStore) => state.items.length > 0;
