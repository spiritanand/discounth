"use client";

import Image from "next/image";
import { useCart } from "~/lib/context/cart-context";
import { useCartMutations } from "~/lib/hooks/use-cart";
import type { products } from "~/lib/data/products";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Toaster } from "sonner";

type Product = (typeof products)[number];

export function ProductCard({ product }: { product: Product }) {
	const { state, decrementQuantity } = useCart();
	const { addToCart } = useCartMutations();
	const cartItem = state.items.find((item) => item.id === product.id);

	const handleAddToCart = () => {
		addToCart.mutate({
			productId: product.id,
			quantity: 1,
		});
	};

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle className="line-clamp-1">{product.name}</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<div className="relative aspect-square w-full overflow-hidden rounded-lg">
						<Image
							src={product.image}
							alt={product.name}
							fill
							className="object-cover"
						/>
					</div>
					<div className="flex items-center justify-between">
						<p className="font-semibold text-lg">${product.price}</p>
						<p className="text-muted-foreground text-sm">
							Stock: {product.stock - (cartItem?.quantity ?? 0)}
						</p>
					</div>
				</CardContent>
				<CardFooter className="flex gap-2">
					{cartItem ? (
						<>
							<Button
								variant="outline"
								size="icon"
								onClick={() => decrementQuantity(product.id)}
							>
								-
							</Button>
							<p className="w-12 text-center">{cartItem.quantity}</p>
							<Button
								variant="outline"
								size="icon"
								onClick={handleAddToCart}
								disabled={
									cartItem.quantity >= product.stock || addToCart.isPending
								}
							>
								+
							</Button>
						</>
					) : (
						<Button
							className="w-full"
							onClick={handleAddToCart}
							disabled={product.stock <= 0 || addToCart.isPending}
						>
							{addToCart.isPending ? "Adding..." : "Add to Cart"}
						</Button>
					)}
				</CardFooter>
			</Card>
		</>
	);
}
