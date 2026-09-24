import { startingPrice, unitSuffix } from "@/lib/pricing-resolver"
import type { ShopProduct } from "@/lib/shop-types"
import { cn, formatCurrency } from "@/lib/utils"

/** "From ₱25", "₱18 / sq.ft.", or "Price on request" for a product with no pricing. */
export function StartingPrice({ product, className }: { product: ShopProduct; className?: string }) {
  const entry = startingPrice(product)
  if (!entry) {
    return <span className={cn("text-sm font-medium text-muted-foreground", className)}>Price on request</span>
  }
  const hasRange = new Set(product.pricing.map((candidate) => candidate.price)).size > 1

  return (
    <span className={cn("tabular-nums", className)}>
      {hasRange && <span className="mr-1 text-xs font-normal text-muted-foreground">From</span>}
      <span className="font-semibold text-foreground">{formatCurrency(entry.price)}</span>
      <span className="text-xs font-normal text-muted-foreground">{unitSuffix(entry)}</span>
    </span>
  )
}
