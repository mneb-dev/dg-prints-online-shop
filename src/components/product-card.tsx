import { Link } from "react-router-dom"

import { ProductVisual } from "@/components/product-image"
import { StartingPrice } from "@/components/price-tag"
import { Badge } from "@/components/ui/badge"
import { startingPrice } from "@/lib/pricing-resolver"
import type { ShopProduct } from "@/lib/shop-types"
import { cn } from "@/lib/utils"

const NEW_PRODUCT_DAYS = 30
const MAX_BADGES = 2

/** Status badges in priority order — availability first, then how it's ordered, then "New". */
function productBadges(product: ShopProduct): string[] {
  const badges: string[] = []
  if (!product.inStock) badges.push("Out of stock")
  if (product.madeToOrder) badges.push("Made to order")
  else if (!startingPrice(product)) badges.push("Quote")
  const ageMs = Date.now() - new Date(product.createdAt).getTime()
  if (ageMs >= 0 && ageMs < NEW_PRODUCT_DAYS * 86_400_000) badges.push("New")
  return badges.slice(0, MAX_BADGES)
}

/** Elevated product card: the image sits inset in the white card, zooms gently on hover, and the
 *  whole card lifts.
 *  Every card shows the same facts in the same order: category, name, description, price. */
export function ProductCard({ product }: { product: ShopProduct }) {
  const optionSummary = product.options.map((option) => option.name).join(" · ")
  const badges = productBadges(product)

  return (
    <Link
      to={`/shop/${product.id}`}
      className="group/product lift surface flex flex-col p-2 text-card-foreground outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
        <ProductVisual
          url={product.images[0]?.url}
          alt={product.name}
          category={product.category}
          className={cn(
            "size-full transition-transform duration-500 group-hover/product:scale-105 motion-reduce:transition-none",
            !product.inStock && "opacity-60 grayscale"
          )}
        />

        {badges.length > 0 && (
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
            {badges.map((badge) => (
              <ProductBadge key={badge} label={badge} />
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-2 pt-3 pb-2 sm:px-3 sm:pt-4 sm:pb-3">
        <p className="truncate text-xs font-semibold tracking-wide text-indigo-600 uppercase">{product.category}</p>
        <div className="flex-1">
          <h3 className="line-clamp-2 text-[0.95rem] leading-snug font-semibold tracking-tight transition-colors group-hover/product:text-primary sm:text-base">{product.name}</h3>
          {(product.description || optionSummary) && (
            <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
              {product.description || optionSummary}
            </p>
          )}
        </div>
        <StartingPrice product={product} className="mt-1 text-lg [&>span:last-child]:font-bold" />
      </div>
    </Link>
  )
}

const BADGE_VARIANTS: Record<string, "ink" | "default"> = {
  "Out of stock": "ink",
  New: "default",
}

function ProductBadge({ label }: { label: string }) {
  return (
    <Badge variant={BADGE_VARIANTS[label] ?? "glass"} className="h-6 px-2.5">
      {label}
    </Badge>
  )
}

export function OutOfStockBadge({ className }: { className?: string }) {
  return (
    <Badge variant="ink" className={className}>
      Out of stock
    </Badge>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="surface flex flex-col p-2">
      <div className="aspect-[4/3] w-full animate-pulse rounded-lg bg-slate-100" />
      <div className="flex flex-col gap-3 px-2 pt-3 pb-2 sm:px-3 sm:pt-4 sm:pb-3">
        <div className="h-4 w-16 animate-pulse rounded-full bg-slate-100" />
        <div className="h-5 w-3/4 animate-pulse rounded-full bg-slate-100" />
        <div className="h-5 w-1/3 animate-pulse rounded-full bg-slate-100" />
      </div>
    </div>
  )
}
