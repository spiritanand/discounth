"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "~/lib/context/cart-context";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<CartProvider>
				<Toaster richColors />
				{children}
			</CartProvider>
		</QueryClientProvider>
	);
}
