"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useCart } from "~/lib/context/cart-context";
import { useCartMutations } from "~/lib/hooks/use-cart";
import { useDiscountCodes } from "~/lib/hooks/use-discount-codes";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Toaster } from "sonner";
import { toast } from "sonner";

interface DiscountInfo {
	code: string;
	percentage: number;
}

export default function CartPage() {
	const [discountCode, setDiscountCode] = useState("");
	const [appliedDiscount, setAppliedDiscount] = useState<DiscountInfo | null>(
		null,
	);
	const { state, decrementQuantity, removeFromCart } = useCart();
	const { checkout } = useCartMutations();
	const { data: availableDiscounts = [] } = useDiscountCodes();

	const subtotal = state.items.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0,
	);

	const discountAmount = appliedDiscount
		? subtotal * (appliedDiscount.percentage / 100)
		: 0;

	const total = subtotal - discountAmount;

	const handleApplyDiscount = async (code: string) => {
		try {
			const response = await fetch("/api/discount-codes/validate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ code }),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error);
			}

			const discount = await response.json();
			setAppliedDiscount(discount);
			setDiscountCode(code);
			toast.success("Discount code applied successfully!");
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Failed to apply discount code");
			}
			setAppliedDiscount(null);
			setDiscountCode("");
		}
	};

	const handleCheckout = () => {
		checkout.mutate({
			cartItems: state.items,
			discountCode: appliedDiscount?.code,
		});
	};

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
				<Toaster />
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
				<div className="space-y-6">
					{availableDiscounts.length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle>Available Discounts</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									{availableDiscounts.map((discount) => (
										<div
											key={discount.code}
											className="flex items-center justify-between rounded-lg border p-3"
										>
											<div>
												<p className="font-medium">{discount.code}</p>
												<p className="text-muted-foreground text-sm">
													{discount.percentage}% off your order
												</p>
											</div>
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleApplyDiscount(discount.code)}
												disabled={appliedDiscount?.code === discount.code}
											>
												{appliedDiscount?.code === discount.code
													? "Applied"
													: "Apply"}
											</Button>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					)}
					<Card className="h-fit">
						<CardHeader>
							<CardTitle>Order Summary</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col gap-4">
							<div className="space-y-2">
								<p className="font-medium text-sm">Discount Code</p>
								<div className="flex gap-2">
									<Input
										placeholder="Enter code"
										value={discountCode}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											setDiscountCode(e.target.value)
										}
									/>
									<Button
										variant="outline"
										onClick={() => handleApplyDiscount(discountCode)}
										disabled={
											!discountCode || appliedDiscount?.code === discountCode
										}
									>
										Apply
									</Button>
								</div>
							</div>
							<div className="space-y-2 border-t pt-4">
								<div className="flex justify-between">
									<p>Subtotal</p>
									<p className="font-semibold">${subtotal.toFixed(2)}</p>
								</div>
								{appliedDiscount && (
									<div className="flex justify-between text-green-500">
										<p>Discount ({appliedDiscount.percentage}%)</p>
										<p>-${discountAmount.toFixed(2)}</p>
									</div>
								)}
								<div className="flex justify-between font-bold text-lg">
									<p>Total</p>
									<p>${total.toFixed(2)}</p>
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<Button
								className="w-full"
								onClick={handleCheckout}
								disabled={checkout.isPending}
							>
								{checkout.isPending ? "Processing..." : "Checkout"}
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
			<Toaster />
		</main>
	);
}
