"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCart } from "~/lib/context/cart-context";
import type { AddToCartInput, CartItem, CheckoutInput } from "~/lib/types/cart";
import { products } from "~/lib/data/products";

interface CheckoutResponse {
  orderId: number;
  total: number;
  discountAmount: number;
  finalTotal: number;
  newDiscountCode?: {
    code: string;
    percentage: number;
  };
}

export function useCartMutations() {
  const queryClient = useQueryClient();
  const { state, addToCart: addToCartContext, removeFromCart: removeFromCartContext } = useCart();

  const addToCart = useMutation({
    mutationFn: async (input: AddToCartInput) => {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      return response.json() as Promise<CartItem>;
    },
    onMutate: async (newItem: AddToCartInput) => {
      // Find product to add
      const product = products.find((p) => p.id === newItem.productId);
      if (!product) return;

      // Optimistically update cart
      addToCartContext(product);

      toast.success("Added to cart");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const checkout = useMutation({
    mutationFn: async (input: CheckoutInput) => {
      // Show loading toast and store its ID
      const toastId = toast.loading("Processing your order...");

      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error);
        }

        const data = (await response.json()) as CheckoutResponse;

        // Clear cart after successful checkout
        for (const item of state.items) {
          removeFromCartContext(item.id);
        }

        // Dismiss loading toast
        toast.dismiss(toastId);

        // Show success messages
        toast.success(`Order placed! Total: $${data.finalTotal.toFixed(2)}`);

        if (data.discountAmount > 0) {
          toast.success(`Saved $${data.discountAmount.toFixed(2)} with discount!`);
        }

        if (data.newDiscountCode) {
          toast.success(
            `Congratulations! You've earned a ${data.newDiscountCode.percentage}% discount code: ${data.newDiscountCode.code}`,
            { duration: 10000 }
          );
          // Invalidate discount codes query to refresh the list
          queryClient.invalidateQueries({ queryKey: ["discountCodes"] });
        }

        return data;
      } catch (error) {
        // Dismiss loading toast on error
        toast.dismiss(toastId);
        throw error;
      }
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  return {
    addToCart,
    checkout,
  };
}
