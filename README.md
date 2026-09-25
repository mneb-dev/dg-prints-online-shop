# DG Prints

Public storefront for DG Prints. Sibling of `dg-prints-management-portal` (staff app) and
`dg-prints-management-server` (API), sharing the portal's stack and design tokens:
React 19 + Vite, Tailwind v4 + shadcn (`base-nova`, Base UI), Redux Toolkit, axios.

## Pages

- `/` landing page with a hero and a **Shop now** button
- `/shop` lists the products that have **Show in shop** enabled in the portal. It has search and category filters. Products marked unavailable (Inactive) in the portal stay listed as **Out of stock**. They can't be ordered or messaged about.
- `/shop/:id` shows one product. The customer chooses options, a package or a size (sq.ft.), a quantity and an optional note, and sees the live price. What it offers depends on the product's **Made to order** switch in the portal:
  - **Off (default):** the options and **Add to cart**.
  - **On:** no options, quantity, notes or cart; just **Message us on Facebook**. It opens the link from the portal's Settings → Online shop, prefilled with "I'd like to order a <product>". The text is also copied, because Messenger doesn't always honour `?text=`.
- `/cart` shows the order summary, and each line has an editable note. The cart is saved in `localStorage` (`dgprints_shop_cart`). **Proceed to checkout** goes to `/checkout`.
- `/checkout` collects contact details (name, PH mobile number) and a shipping address (house no. & street, barangay, city/municipality, province, optional ZIP). The province sets the region, and the region sets the shipping fee (Luzon / Visayas / Mindanao, configured in the portal under Settings → Online shop). "Place order" calls `POST /api/shop/orders`, which re-prices everything on the server and creates a pending, unpaid order with channel "Online shop". The address is saved as one line. Contact and address are remembered on the device (`dgprints_shop_checkout`).
- `/checkout/success` shows the order number and clears the cart.
- **Mobile (below `lg`):** the product and cart pages pin their main button to a bottom bar (`src/components/mobile-action-bar.tsx`). Tapping "Add to cart" before the required options are chosen opens a bottom sheet with the options, package, size and quantity.

## Data

The shop reads the server's public, unauthenticated routes:
- `GET /api/shop/products`
- `GET /api/shop/products/:id`
- `GET /api/shop/categories`
- `GET /api/shop/settings` (`{ messengerUrl }`; `""` hides the message buttons)

The server enforces visibility (`show_in_shop` + not deleted) and returns a trimmed product shape, with `inStock: false` for Inactive products.

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
