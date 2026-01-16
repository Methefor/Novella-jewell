// Shopier Payment Integration

export interface ShopierPaymentData {
  orderId: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
}

/**
 * Generate Shopier payment URL
 * Note: This is a simplified version. In production, you should:
 * 1. Create order on your backend
 * 2. Generate payment hash server-side
 * 3. Redirect to Shopier payment page
 */
export function generateShopierPaymentUrl(data: ShopierPaymentData): string {
  const shopierStoreId = process.env.NEXT_PUBLIC_SHOPIER_STORE_ID;
  
  if (!shopierStoreId) {
    throw new Error('Shopier Store ID is not configured');
  }

  // Shopier payment URL structure
  // In production, you need to implement proper hash generation
  const baseUrl = 'https://www.shopier.com/ShowProduct/api_pay2.php';
  
  // TODO: Implement proper hash generation with Shopier API
  // For now, return a placeholder URL
  const params = new URLSearchParams({
    store_id: shopierStoreId,
    order_id: data.orderId,
    amount: data.amount.toString(),
    currency: data.currency,
    customer_name: data.customerName,
    customer_email: data.customerEmail,
    customer_phone: data.customerPhone,
    customer_address: data.customerAddress,
  });

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Handle Shopier callback
 * This should be called from your API route after Shopier redirects back
 */
export async function handleShopierCallback(callbackData: any) {
  // TODO: Verify Shopier callback signature
  // TODO: Update order status in database
  // TODO: Send confirmation email
  
  return {
    success: true,
    orderId: callbackData.order_id,
  };
}

export const shopierClient = {
  /**
   * Cart items'larını Shopier ürün formatına dönüştürür
   */
  cartItemsToShopierProducts(items: any[]) {
    return items.map(item => ({
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity
    }));
  },

  /**
   * Sipariş oluşturur ve ödeme URL'sini döndürür
   */
  async createOrder(orderData: any) {
    try {
      // In a real implementation, this would call your backend API
      // which would then interact with Shopier's API.
      // For now, we simulate success and return a generated URL.
      
      const paymentUrl = generateShopierPaymentUrl({
        orderId: orderData.order_id,
        amount: orderData.total_amount,
        currency: 'TRY',
        customerName: `${orderData.first_name} ${orderData.last_name}`,
        customerEmail: orderData.email,
        customerPhone: orderData.phone,
        customerAddress: orderData.address,
        items: orderData.products
      });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        orderId: orderData.order_id,
        paymentUrl
      };
    } catch (error) {
      console.error('Shopier createOrder error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};

