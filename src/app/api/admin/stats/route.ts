import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthenticated, unauthorized } from "~/lib/auth";
import { getOrders, getDiscountCodes } from "~/lib/storage";
import { formatNumber } from "~/lib/utils";

interface OrderStats {
  totalOrders: number;
  totalItems: number;
  totalAmount: number;
  totalDiscountAmount: number;
  averageOrderValue: number;
  discountCodes: {
    total: number;
    used: number;
    available: number;
    codes: Array<{
      code: string;
      percentage: number;
      isUsed: boolean;
      createdAt: string;
      usedAt?: string;
    }>;
  };
  topProducts: Array<{
    id: number;
    name: string;
    quantity: number;
    totalAmount: number;
  }>;
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return unauthorized();
  }

  try {
    const [orders, discountCodes] = await Promise.all([getOrders(), getDiscountCodes()]);

    // Calculate total items and create product stats map
    const productStats = new Map<number, { name: string; quantity: number; totalAmount: number }>();
    let totalItems = 0;
    let totalAmount = 0;
    let totalDiscountAmount = 0;

    // Process orders
    for (const order of orders) {
      totalAmount += formatNumber(order.total);
      totalDiscountAmount += formatNumber(order.discountAmount || 0);

      for (const item of order.items) {
        totalItems += item.quantity;

        const existing = productStats.get(item.id) || {
          name: item.name,
          quantity: 0,
          totalAmount: 0,
        };

        const itemTotal = formatNumber(item.price * item.quantity);

        productStats.set(item.id, {
          name: item.name,
          quantity: existing.quantity + item.quantity,
          totalAmount: formatNumber(existing.totalAmount + itemTotal),
        });
      }
    }

    // Convert product stats to sorted array
    const topProducts = Array.from(productStats.entries())
      .map(([id, stats]) => ({
        id,
        ...stats,
        totalAmount: formatNumber(stats.totalAmount),
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5); // Top 5 products

    const stats: OrderStats = {
      totalOrders: orders.length,
      totalItems,
      totalAmount: formatNumber(totalAmount),
      totalDiscountAmount: formatNumber(totalDiscountAmount),
      averageOrderValue: formatNumber(orders.length ? totalAmount / orders.length : 0),
      discountCodes: {
        total: discountCodes.length,
        used: discountCodes.filter((code) => code.isUsed).length,
        available: discountCodes.filter((code) => !code.isUsed).length,
        codes: discountCodes,
      },
      topProducts,
    };

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
