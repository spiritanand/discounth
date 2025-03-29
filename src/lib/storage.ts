import fs from "node:fs/promises";
import path from "node:path";
import type { Order, DiscountCode } from "./types/cart";

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const DISCOUNT_CODES_FILE = path.join(DATA_DIR, "discount-codes.json");

// Constants
const NTH_ORDER = 1; // Generate discount code for every 5th order
const DISCOUNT_PERCENTAGE = 10;

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Initialize files if they don't exist
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

export async function getValidDiscountCode(code: string): Promise<DiscountCode | null> {
  const codes = await getDiscountCodes();
  return codes.find((c) => c.code === code && !c.isUsed) || null;
}

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
