"use client";

import { createContext, useContext, useReducer, type ReactNode } from "react";
import type { products } from "~/lib/data/products";

type Product = (typeof products)[number];

type CartItem = {
	id: number;
	name: string;
	price: number;
	stock: number;
	image: string;
	quantity: number;
};

type CartState = {
	items: CartItem[];
};

type CartAction =
	| { type: "ADD_TO_CART"; payload: Product }
	| { type: "REMOVE_FROM_CART"; payload: number }
	| { type: "DECREMENT"; payload: number };

type CartContextType = {
	state: CartState;
	addToCart: (product: Product) => void;
	removeFromCart: (productId: number) => void;
	decrementQuantity: (productId: number) => void;
};

const CartContext = createContext<CartContextType | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
	switch (action.type) {
		case "ADD_TO_CART": {
			const existingItem = state.items.find(
				(item) => item.id === action.payload.id,
			);
			if (existingItem) {
				if (existingItem.quantity >= action.payload.stock) return state;
				return {
					items: state.items.map((item) =>
						item.id === action.payload.id
							? { ...item, quantity: item.quantity + 1 }
							: item,
					),
				};
			}
			return { items: [...state.items, { ...action.payload, quantity: 1 }] };
		}
		case "REMOVE_FROM_CART":
			return {
				items: state.items.filter((item) => item.id !== action.payload),
			};
		case "DECREMENT": {
			const existingItem = state.items.find(
				(item) => item.id === action.payload,
			);
			if (!existingItem) return state;
			if (existingItem.quantity === 1) {
				return {
					items: state.items.filter((item) => item.id !== action.payload),
				};
			}
			return {
				items: state.items.map((item) =>
					item.id === action.payload
						? { ...item, quantity: item.quantity - 1 }
						: item,
				),
			};
		}
		default:
			return state;
	}
}

export function CartProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(cartReducer, { items: [] });

	const addToCart = (product: Product) => {
		dispatch({ type: "ADD_TO_CART", payload: product });
	};

	const removeFromCart = (productId: number) => {
		dispatch({ type: "REMOVE_FROM_CART", payload: productId });
	};

	const decrementQuantity = (productId: number) => {
		dispatch({ type: "DECREMENT", payload: productId });
	};

	return (
		<CartContext.Provider
			value={{ state, addToCart, removeFromCart, decrementQuantity }}
		>
			{children}
		</CartContext.Provider>
	);
}

export function useCart() {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
}
