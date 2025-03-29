import { NextResponse } from "next/server";
import { getDiscountCodes } from "~/lib/storage";

export async function GET() {
  try {
    const codes = await getDiscountCodes();
    const availableCodes = codes.filter((code) => !code.isUsed);
    return NextResponse.json(availableCodes);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
