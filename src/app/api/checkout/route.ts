/**
 * Checkout API endpoint that processes orders and applies discount codes.
 * Validates discount codes, calculates totals, and potentially generates new discount codes.
 */

import { NextResponse } from "next/server";
import { CheckoutSchema } from "~/lib/types/cart";
import { getValidDiscountCode, markDiscountCodeAsUsed, saveOrder } from "~/lib/storage";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = CheckoutSchema.parse(body);

    // Handle discount code validation and application
    let discountAmount = 0;
    if (input.discountCode) {
      const discountCode = await getValidDiscountCode(input.discountCode);
      if (!discountCode) {
        return NextResponse.json({ error: "Invalid or used discount code" }, { status: 400 });
      }
      await markDiscountCodeAsUsed(input.discountCode);
      discountAmount = discountCode.percentage / 100;
    }

    // Calculate order totals
    const total = input.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const finalTotal = total - total * discountAmount;

    // Create and save the order
    const order = {
      id: Date.now(),
      items: input.cartItems,
      total,
      discountCode: input.discountCode,
      discountAmount: total * discountAmount,
      finalTotal,
      status: "completed" as const,
      createdAt: new Date().toISOString(),
    };

    // Save order and potentially get a new discount code if this is the Nth order
    const newDiscountCode = await saveOrder(order);

    return NextResponse.json({
      orderId: order.id,
      total: order.total,
      discountAmount: order.discountAmount,
      finalTotal: order.finalTotal,
      newDiscountCode,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
