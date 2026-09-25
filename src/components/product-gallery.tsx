import { useRef, useState, type KeyboardEvent } from "react"

import { ProductVisual } from "@/components/product-image"
import type { ShopProduct } from "@/lib/shop-types"
import { cn } from "@/lib/utils"

/** Product page hero: the main image large, with a thumbnail row to switch between the rest.
 *  Falls back to the category tile when the product has no images. */
export function ProductGallery({ product, className }: { product: ShopProduct; className?: string }) {
  const { images } = product
  const [selectedIndex, setSelectedIndex] = useState(0)
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([])
  const selected = images[selectedIndex] ?? images[0]

  function select(index: number) {
    const next = (index + images.length) % images.length
    setSelectedIndex(next)
    thumbRefs.current[next]?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") select(selectedIndex + 1)
    else if (event.key === "ArrowLeft") select(selectedIndex - 1)
    else return
    event.preventDefault()
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <ProductVisual
        url={selected?.url}
        alt={images.length > 1 ? `${product.name} — image ${selectedIndex + 1} of ${images.length}` : product.name}
        category={product.category}
        eager
        className="aspect-[4/3] w-full rounded-2xl shadow-[var(--shadow-elevated)] lg:aspect-square"
        iconClassName="size-20 sm:size-24"
      />
      {images.length > 1 && (
        <div
          role="tablist"
          aria-label={`${product.name} images`}
          onKeyDown={handleKeyDown}
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pt-1 pb-2 [scrollbar-width:thin]"
        >
          {images.map((image, index) => {
            const isSelected = index === selectedIndex
            return (
              <button
                key={image.id}
                ref={(element) => {
                  thumbRefs.current[index] = element
                }}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`Show image ${index + 1}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  "size-16 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 bg-muted transition-[border-color,opacity] outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:size-20",
                  isSelected ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                )}
              >
                <img src={image.url} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
