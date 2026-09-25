import { useState } from "react"

import { CategoryTile } from "@/components/category-visual"
import { cn } from "@/lib/utils"

/** A product's photo, or its category tile when it has none (or the photo fails to load) — so
 *  callers never branch on whether a product has images. */
export function ProductVisual({
  url,
  alt,
  category,
  className,
  iconClassName,
  eager = false,
}: {
  url: string | null | undefined
  alt: string
  category: string
  className?: string
  iconClassName?: string
  /** Above-the-fold images (the product page hero) load immediately instead of lazily. */
  eager?: boolean
}) {
  // Remember which URL failed rather than a boolean, so a new URL gets a fresh attempt.
  const [failedUrl, setFailedUrl] = useState<string | null>(null)

  if (!url || failedUrl === url) {
    return <CategoryTile category={category} className={className} iconClassName={iconClassName} />
  }

  return (
    <img
      src={url}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailedUrl(url)}
      className={cn("bg-muted object-cover", className)}
    />
  )
}
