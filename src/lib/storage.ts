/**
 * In-memory storage implementation using JSON files.
 * Data persists between server restarts but is not suitable for production use.
 * Uses local JSON files to simulate a database for development purposes.
 */

import fs from "node:fs/promises";
import path from "node:path";
import type { Order, DiscountCode } from "./types/cart";
import { DISCOUNT_PERCENTAGE } from "./constants";
import { NTH_ORDER } from "./constants";

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const DISCOUNT_CODES_FILE = path.join(DATA_DIR, "discount-codes.json");

/**
 * Ensures the data directory exists, creating it if necessary.
 * This is crucial for first-time setup and after clearing the data directory.
 */
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

/**
 * Initializes storage files if they don't exist.
 * Creates empty arrays as initial state for both orders and discount codes.
 */
async function initializeFiles() {
  await ensureDataDir();

  try {
    await fs.access(ORDERS_FILE);
  } catch {
    await fs.writeFile(ORDERS_FILE, JSON.stringify([]));
  }

  try {
    await fs.access(DISCOUNT_CODES_FILE);
  } catch {
    await fs.writeFile(DISCOUNT_CODES_FILE, JSON.stringify([]));
  }
}

// Orders
export async function getOrders(): Promise<Order[]> {
  await initializeFiles();
  const data = await fs.readFile(ORDERS_FILE, "utf-8");
  return JSON.parse(data);
}

/**
 * Saves a new order and potentially generates a new discount code.
 * A new discount code is generated for every Nth order (N defined in constants).
 * @returns The newly generated discount code if this was the Nth order, null otherwise
 */
export async function saveOrder(order: Order): Promise<DiscountCode | null> {
  const orders = await getOrders();
  orders.push(order);
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));

  // Generate discount code for every Nth order
  if (orders.length % NTH_ORDER === 0) {
    const newCode: DiscountCode = {
      code: `DISCOUNT${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      percentage: DISCOUNT_PERCENTAGE,
      isUsed: false,
      createdAt: new Date().toISOString(),
    };

    const codes = await getDiscountCodes();
    codes.push(newCode);
    await fs.writeFile(DISCOUNT_CODES_FILE, JSON.stringify(codes, null, 2));

    return newCode;
  }

  return null;
}

// Discount Codes
export async function getDiscountCodes(): Promise<DiscountCode[]> {
  await initializeFiles();
  const data = await fs.readFile(DISCOUNT_CODES_FILE, "utf-8");
  return JSON.parse(data);
}

/**
 * Retrieves a valid (unused) discount code by its code string.
 * A code is valid if it exists and hasn't been used yet.
 */
export async function getValidDiscountCode(code: string): Promise<DiscountCode | null> {
  const codes = await getDiscountCodes();
  return codes.find((c) => c.code === code && !c.isUsed) || null;
}

/**
 * Marks a discount code as used and records the usage timestamp.
 * This ensures each code can only be used once.
 */
export async function markDiscountCodeAsUsed(code: string): Promise<void> {
  const codes = await getDiscountCodes();
  const updatedCodes = codes.map((c) =>
    c.code === code ? { ...c, isUsed: true, usedAt: new Date().toISOString() } : c
  );
  await fs.writeFile(DISCOUNT_CODES_FILE, JSON.stringify(updatedCodes, null, 2));
}

async function generateDiscountCode(): Promise<void> {
  const codes = await getDiscountCodes();
  const newCode: DiscountCode = {
    code: `DISCOUNT${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    percentage: 10,
    isUsed: false,
    createdAt: new Date().toISOString(),
  };
  codes.push(newCode);
  await fs.writeFile(DISCOUNT_CODES_FILE, JSON.stringify(codes, null, 2));
}
