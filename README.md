# Discounth - E-commerce Store

A modern e-commerce store built with Next.js that features a dynamic discount system where every nth order receives a 10% discount coupon.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **Database**: In-memory store using the filesystem
- **Styling**: [Tailwind CSS](https://tailwindcss.com) with [shadcn/ui](https://ui.shadcn.com)
- **API Layer**: Next.js API Routes with Zod for validation
- **Type Safety**: TypeScript

## Features

### Pages

- `/` - Home page displaying available products
- `/cart` - Shopping cart page with discount code application

### API Routes

#### Customer APIs

- `POST /api/cart`
  - Add items to cart

- `POST /api/checkout`
  - Process order checkout
  - Validates discount code if provided

- `POST /api/discount-codes/validate`
  - Validate discount code

#### Admin APIs

- `GET /api/admin/stats`
  - Returns:
    - Total items purchased
    - Total purchase amount
    - List of discount codes
    - Total discount amount

- `POST /api/admin/discount-codes`
  - Generates new discount codes for admins

## Key Assumptions

1. In-memory Data Store
   - All data is stored in memory
   - Data persists only during server runtime

2. Discount System
   - Every nth order generates a new discount code
   - Discount codes are single-use only
   - 10% discount applies to entire cart value
   - New discount code becomes available after previous one is used

3. Cart System
   - Cart items persist in memory
   - No user authentication required for basic operations
   - Cart expires after checkout

## Development

1. Clone the repository
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start development server:

   ```bash
   pnpm dev
   ```

## Testing

Run the test suite:

```bash
pnpm test
```
