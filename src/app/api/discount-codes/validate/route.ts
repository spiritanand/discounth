import { NextResponse } from "next/server";
import { getValidDiscountCode } from "~/lib/storage";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: "Discount code is required" }, { status: 400 });
    }

    const discountCode = await getValidDiscountCode(code);

    if (!discountCode) {
      return NextResponse.json({ error: "Invalid or used discount code" }, { status: 400 });
    }

    return NextResponse.json({
      code: discountCode.code,
      percentage: discountCode.percentage,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to validate discount code" }, { status: 500 });
  }
}
