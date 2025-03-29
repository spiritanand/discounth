import { NextResponse } from "next/server";
import { products } from "~/lib/data/products";
import { AddToCartSchema } from "~/lib/types/cart";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = AddToCartSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message ?? "Invalid request" },
        { status: 400 }
      );
    }

    const input = result.data;
    const product = products.find((p) => p.id === input.productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.stock < input.quantity) {
      return NextResponse.json({ error: "Not enough stock" }, { status: 400 });
    }

    // In a real app, we'd store this in a session or database
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: input.quantity,
      image: product.image,
    };

    return NextResponse.json(cartItem);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
