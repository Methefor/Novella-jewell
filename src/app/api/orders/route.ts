import { NextRequest, NextResponse } from 'next/server';
import { createOrder, generateOrderId, Order } from '@/lib/orders';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'customerName',
      'customerEmail',
      'customerPhone',
      'address',
      'city',
      'items',
      'total',
      'paymentMethod',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create order object
    const order: Order = {
      orderId: generateOrderId(),
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      address: body.address,
      city: body.city,
      district: body.district || '',
      postalCode: body.postalCode || '',
      items: body.items,
      total: body.total,
      paymentMethod: body.paymentMethod,
      status: 'pending',
      createdAt: new Date(),
    };

    // Save order
    const orderId = await createOrder(order);

    // TODO: Send confirmation email
    // TODO: Send notification to admin

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Order created successfully',
    });
  } catch (error) {
    console.error('Order API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // TODO: Fetch order from database
    // const order = await getOrder(orderId);

    return NextResponse.json({
      success: true,
      order: null, // Placeholder
    });
  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

