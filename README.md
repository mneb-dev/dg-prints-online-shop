# DG Prints

Public storefront for DG Prints. Sibling of `dg-prints-management-portal` (staff app) and
`dg-prints-management-server` (API), sharing the portal's stack and design tokens:
React 19 + Vite, Tailwind v4 + shadcn (`base-nova`, Base UI), Redux Toolkit, axios.

## Pages

- `/` landing page with a hero and a **Shop now** button
- `/shop` lists the products that are Active and have **Show in shop** enabled in the portal. It has search and category filters.
- `/shop/:id` shows one product. The customer chooses options, a package or a size (sq.ft.) and a quantity, sees the live price, and adds it to the cart.
- `/cart` shows the order summary. The cart is saved in `localStorage` (`dgprints_shop_cart`). There's no checkout yet.

## Data

The shop reads the server's public, unauthenticated routes:
- `GET /api/shop/products`
- `GET /api/shop/products/:id`
- `GET /api/shop/categories`

The server enforces visibility (Active + `show_in_shop` + not deleted) and returns a trimmed product shape.

`src/lib/pricing-resolver.ts` is a trimmed port of the portal's pricing resolver. Keep the matching rules in sync with it.

## Development

```sh
npm install
npm run dev      # http://localhost:5174
npm run build
npm run lint
```

`VITE_API_BASE_URL` in `.env.development` / `.env.production` (see `.env.example`) points at the server's `/api`.
The server's `CORS_ORIGIN` must include this app's origin. It accepts a comma-separated list.

Product images aren't supported yet. Cards show a gradient tile with a category icon (`src/components/category-visual.tsx`).
