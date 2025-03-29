"use client";

import { useQuery } from "@tanstack/react-query";
import type { DiscountCode } from "~/lib/types/cart";

export function useDiscountCodes() {
  return useQuery({
    queryKey: ["discountCodes"],
    queryFn: async () => {
      const response = await fetch("/api/discount-codes");
      if (!response.ok) {
        throw new Error("Failed to fetch discount codes");
      }
      return response.json() as Promise<DiscountCode[]>;
    },
  });
}
