import { NextResponse } from "next/server";
import { getValidDiscountCode } from "~/lib/storage";
import { z } from "zod";

const ValidateDiscountCodeSchema = z.object({
  code: z.string().min(1, "Discount code is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = ValidateDiscountCodeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { code } = result.data;
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
