import { ALL_VARIANTS, type AppliesTo, type PricingEntry, type ShopProduct } from "@/lib/shop-types"

// Trimmed port of dg-prints-management-portal's src/lib/pricing-resolver.ts — keep the matching
// rules in lockstep with it so the shop quotes the same price staff would.

export type PricingResolution =
  | { kind: "package"; candidates: PricingEntry[] }
  | { kind: "auto"; entry: PricingEntry }
  | { kind: "none" }

/** True when every condition in `appliesTo` is satisfied by the selected option values. */
function matchesSelection(appliesTo: AppliesTo, selectedValues: Record<string, string>): boolean {
  if (appliesTo === ALL_VARIANTS) return true
  if (!Array.isArray(appliesTo)) return false
  return appliesTo.every((condition) => selectedValues[condition.optionId] === condition.value)
}

export function describeAppliesTo(appliesTo: AppliesTo): string {
  if (appliesTo === ALL_VARIANTS) return ALL_VARIANTS
  if (!Array.isArray(appliesTo)) return String(appliesTo)
  return appliesTo.map((condition) => condition.value).join(" · ")
}

export function resolvePricing(product: ShopProduct, selectedValues: Record<string, string>): PricingResolution {
  const candidates = product.pricing.filter((entry) => matchesSelection(entry.appliesTo, selectedValues))
  if (candidates.length === 0) return { kind: "none" }

  const types = new Set(candidates.map((entry) => entry.pricingType))
  if (candidates.length > 1 && types.size === 1 && [...types][0] === "Package") {
    return { kind: "package", candidates }
  }

  const specific = candidates.find((entry) => entry.appliesTo !== ALL_VARIANTS)
  return { kind: "auto", entry: specific ?? candidates[0] }
}

export function isManualPricingProduct(product: ShopProduct): boolean {
  return product.pricing.length === 0
}

export function isAreaPriced(entry: Pick<PricingEntry, "pricingType" | "unit">): boolean {
  return entry.pricingType === "Per Unit" && entry.unit === "sq.ft."
}

/** "₱25", "₱18 / sq.ft.", "₱100 / A4" — how a single pricing entry reads on a card or tile. */
export function unitSuffix(entry: Pick<PricingEntry, "pricingType" | "unit">): string {
  if (entry.pricingType === "Package") return ""
  if (entry.unit === "Package") return ""
  return ` / ${entry.unit}`
}

/** Cheapest entry — drives the "From ₱X" price on product cards. */
export function startingPrice(product: ShopProduct): PricingEntry | undefined {
  if (product.pricing.length === 0) return undefined
  return product.pricing.reduce((min, entry) => (entry.price < min.price ? entry : min))
}

export type LinePricing = {
  pricingType: PricingEntry["pricingType"]
  unit: PricingEntry["unit"]
  unitPrice: number
  packageName?: string
  /** Feet — only set for sq.ft. (area-priced) lines. */
  width?: number
  height?: number
}

/** Same formula as the portal's `computeLineTotal`: area × rate × qty for sq.ft. lines,
 *  otherwise unit price × qty. */
export function computeLineTotal(pricing: LinePricing, quantity: number): number {
  if (pricing.pricingType === "Per Unit" && pricing.width && pricing.height) {
    return pricing.width * pricing.height * pricing.unitPrice * quantity
  }
  return pricing.unitPrice * quantity
}
