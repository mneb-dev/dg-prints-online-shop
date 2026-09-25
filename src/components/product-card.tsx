import { Link } from "react-router-dom"

import { ProductVisual } from "@/components/product-image"
import { StartingPrice } from "@/components/price-tag"
import { Badge } from "@/components/ui/badge"
import type { ShopProduct } from "@/lib/shop-types"
import { cn } from "@/lib/utils"

export function ProductCard({ product }: { product: ShopProduct }) {
  const optionSummary = product.options.map((option) => option.name).join(" · ")

  return (
    <Link
      to={`/shop/${product.id}`}
      className="group/product flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-[var(--shadow-soft)] transition-[translate,box-shadow] outline-none hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)] focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <ProductVisual
          url={product.images[0]?.url}
          alt={product.name}
          category={product.category}
          className={cn(
            "size-full transition-transform duration-300 group-hover/product:scale-105 motion-reduce:transition-none",
            !product.inStock && "opacity-60 grayscale"
          )}
        />
        {!product.inStock && <OutOfStockBadge className="absolute top-2 left-2" />}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <Badge variant="secondary" className="max-w-full truncate">
          {product.category}
        </Badge>
        <div className="flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold tracking-tight sm:text-base">{product.name}</h3>
          {(product.description || optionSummary) && (
            <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
              {product.description || optionSummary}
            </p>
          )}
        </div>
        <StartingPrice product={product} />
      </div>
    </Link>
  )
}

export function OutOfStockBadge({ className }: { className?: string }) {
  return (
    <Badge variant="secondary" className={cn("bg-foreground text-background", className)}>
      Out of stock
    </Badge>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <div className="aspect-[4/3] w-full animate-pulse bg-muted" />
      <div className="flex flex-col gap-3 p-3 sm:p-4">
        <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}
