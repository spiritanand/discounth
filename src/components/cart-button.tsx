"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "~/lib/context/cart-context";
import { Button } from "~/components/ui/button";

export function CartButton() {
	const { state } = useCart();
	const itemCount = state.items.reduce((acc, item) => acc + item.quantity, 0);

	return (
		<Button asChild variant="outline" size="icon" className="relative">
			<Link href="/cart">
				<ShoppingCart className="h-5 w-5" />
				{itemCount > 0 && (
					<span className="-right-2 -top-2 absolute flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
						{itemCount}
					</span>
				)}
			</Link>
		</Button>
	);
}
