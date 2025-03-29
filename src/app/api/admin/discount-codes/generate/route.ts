import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthenticated, unauthorized } from "~/lib/auth";
import { getOrders, getDiscountCodes } from "~/lib/storage";
import { formatNumber } from "~/lib/utils";
import fs from "node:fs/promises";
import path from "node:path";
import { DISCOUNT_PERCENTAGE } from "~/lib/constants";
import { NTH_ORDER } from "~/lib/constants";

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return unauthorized();
  }

  try {
    // Check if generation is allowed (nth order condition)
    const orders = await getOrders();
    if (orders.length % NTH_ORDER !== 0) {
      return NextResponse.json(
        {
          error: "Cannot generate discount code. Requires nth order condition to be met.",
          currentOrderCount: orders.length,
          requiredForNext: NTH_ORDER - (orders.length % NTH_ORDER),
        },
        { status: 400 }
      );
    }

    // Generate new code
    const newCode = {
      code: `DISCOUNT${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      percentage: formatNumber(DISCOUNT_PERCENTAGE),
      isUsed: false,
      createdAt: new Date().toISOString(),
    };

    // Get existing codes and add new one
    const codes = await getDiscountCodes();
    codes.push(newCode);

    // Save updated codes
    await fs.writeFile(
      path.join(process.cwd(), "data", "discount-codes.json"),
      JSON.stringify(codes, null, 2)
    );

    return NextResponse.json(newCode);
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate discount code" }, { status: 500 });
  }
}
