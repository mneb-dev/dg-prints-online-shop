/** Mirrors the public `ShopProduct` DTO served by dg-prints-management-server's `/api/shop`
 *  routes (src/types/shop.ts there) — the staff `Product` minus internal fields. Option and
 *  pricing shapes match the portal's products-slice types so the pricing logic ports 1:1. */

export const PRICING_TYPES = ["Package", "Per Unit", "Fixed"] as const
export type PricingType = (typeof PRICING_TYPES)[number]

export type PricingUnit = "Package" | "sq.ft." | "A4" | "piece"

/** Sentinel `appliesTo` value for a price that applies regardless of variant. */
export const ALL_VARIANTS = "All"

export type ProductOption = {
  id: string
  name: string
  required: boolean
  values: string[]
}

export type AppliesToCondition = {
  optionId: string
  value: string
}

export type AppliesTo = typeof ALL_VARIANTS | AppliesToCondition[]

export type PricingEntry = {
  id: string
  appliesTo: AppliesTo
  pricingType: PricingType
  packageName?: string
  price: number
  unit: PricingUnit
}

/** A product photo; the first in `ShopProduct.images` is the main one. */
export type ProductImage = {
  id: string
  url: string
}

export type ShopProduct = {
  id: string
  name: string
  category: string
  description: string
  options: ProductOption[]
  pricing: PricingEntry[]
  images: ProductImage[]
  /** Customized per buyer: shows "Message us on Facebook" instead of options + "Add to cart",
   *  and never goes in the cart. */
  madeToOrder: boolean
  /** False when DG Prints marked it unavailable — still listed, shown as "Out of stock", can't be ordered. */
  inStock: boolean
  createdAt: string
}

/** Public storefront settings from `/api/shop/settings`. */
export type ShopSettings = {
  /** "" when DG Prints hasn't configured one. */
  messengerUrl: string
  /** Processing fee baked into shop prices; 0 = off. Missing from servers older than this field. */
  convenienceFeePercent?: number
}

export type Paginated<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
}
