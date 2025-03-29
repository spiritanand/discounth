"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCart } from "~/lib/context/cart-context";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import type { Product } from "~/lib/data/products";

export default function CartPage() {
	const { state, addToCart, decrementQuantity, removeFromCart } = useCart();
	const total = state.items.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0,
	);

	if (state.items.length === 0) {
		return (
			<main className="container mx-auto py-8">
				<div className="mb-8 flex items-center gap-4">
					<Button asChild variant="ghost" size="icon">
						<Link href="/">
							<ArrowLeft className="h-5 w-5" />
						</Link>
					</Button>
					<h1 className="font-bold text-2xl">Your Cart</h1>
				</div>
				<p className="text-muted-foreground">Your cart is empty</p>
			</main>
		);
	}

	return (
		<main className="container mx-auto py-8">
			<div className="mb-8 flex items-center gap-4">
				<Button asChild variant="ghost" size="icon">
					<Link href="/">
						<ArrowLeft className="h-5 w-5" />
					</Link>
				</Button>
				<h1 className="font-bold text-2xl">Your Cart</h1>
			</div>
			<div className="grid gap-6 lg:grid-cols-[1fr_300px]">
				<div className="flex flex-col gap-4">
					{state.items.map((item) => (
						<Card key={item.id}>
							<CardContent className="flex items-center gap-4 p-4">
								<div className="relative aspect-square h-24 overflow-hidden rounded-lg">
									<Image
										src={item.image}
										alt={item.name}
										fill
										className="object-cover"
									/>
								</div>
								<div className="flex flex-1 flex-col gap-2">
									<CardTitle className="line-clamp-1">{item.name}</CardTitle>
									<p className="font-semibold text-lg">${item.price}</p>
									<div className="flex items-center gap-2">
										<Button
											variant="outline"
											size="icon"
											onClick={() => decrementQuantity(item.id)}
										>
											-
										</Button>
										<p className="w-12 text-center">{item.quantity}</p>
										<Button
											variant="outline"
											size="icon"
											onClick={() =>
												addToCart({
													...item,
													category: "",
													description: "",
												} as Product)
											}
										>
											+
										</Button>
										<Button
											variant="destructive"
											size="icon"
											onClick={() => removeFromCart(item.id)}
										>
											×
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
				<Card className="h-fit">
					<CardHeader>
						<CardTitle>Order Summary</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<div className="flex justify-between">
							<p>Total</p>
							<p className="font-semibold">${total.toFixed(2)}</p>
						</div>
					</CardContent>
					<CardFooter>
						<Button
							className="w-full"
							onClick={() => alert("Checkout not implemented")}
						>
							Checkout
						</Button>
					</CardFooter>
				</Card>
			</div>
		</main>
	);
}
