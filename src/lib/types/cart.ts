import { z } from "zod";

export const CartItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().int().min(1),
  image: z.string().url(),
});

export const CartSchema = z.object({
  items: z.array(CartItemSchema),
  total: z.number(),
  discountCode: z.string().optional(),
  discountAmount: z.number().optional(),
  finalTotal: z.number(),
});

export const OrderSchema = CartSchema.extend({
  id: z.number(),
  status: z.enum(["pending", "completed", "cancelled"]),
  createdAt: z.string(),
});

export const AddToCartSchema = z.object({
  productId: z.number(),
  quantity: z.number().int().min(1),
});

export const CheckoutSchema = z.object({
  cartItems: z.array(CartItemSchema),
  discountCode: z.string().optional(),
});

export const DiscountCodeSchema = z.object({
  code: z.string(),
  percentage: z.number(),
  isUsed: z.boolean(),
  createdAt: z.string(),
  usedAt: z.string().optional(),
});

export type CartItem = z.infer<typeof CartItemSchema>;
export type Cart = z.infer<typeof CartSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type AddToCartInput = z.infer<typeof AddToCartSchema>;
export type CheckoutInput = z.infer<typeof CheckoutSchema>;
export type DiscountCode = z.infer<typeof DiscountCodeSchema>;
