import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number to have exactly 2 decimal places and returns as a number
 * @param value - The number to format
 * @returns The formatted number with 2 decimal places
 */
export function formatNumber(value: number): number {
  return Number(value.toFixed(2));
}

/**
 * Formats a currency value with 2 decimal places
 * @param value - The number to format as currency
 * @returns Formatted currency string
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
