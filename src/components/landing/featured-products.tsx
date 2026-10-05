import { useEffect } from "react"
import { ArrowRightIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { SectionHeading } from "@/components/landing/section-heading"
import { ProductCard, ProductCardSkeleton } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { useCatalog } from "@/lib/catalog"

const FEATURED_COUNT = 4

/** The newest products in the live catalog. Reuses the shared product list — ShopPage refetches its
 *  own query on mount, so there's no stale-filter leak. Hidden when it fails or comes back empty. */
export function FeaturedProducts() {
  const { products, listStatus, loadProducts } = useCatalog()

  useEffect(() => {
    void loadProducts({ search: "", category: "", page: 1, sort: "newest" })
  }, [loadProducts])

  const loading = listStatus === "idle" || listStatus === "loading"
  if (!loading && (listStatus === "failed" || products.length === 0)) return null

  return (
    <section aria-labelledby="featured-title" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <SectionHeading id="featured-title" align="center" eyebrow="Shop the catalog" title="Fresh off" highlight="the press" />
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {loading
          ? Array.from({ length: FEATURED_COUNT }, (_, index) => <ProductCardSkeleton key={index} />)
          : products.slice(0, FEATURED_COUNT).map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
      <div className="mt-12 flex justify-center">
        <Button variant="secondary" render={<Link to="/shop" />} nativeButton={false}>
          View all products
          <ArrowRightIcon className="transition-transform group-hover/button:translate-x-1 motion-reduce:transition-none" />
        </Button>
      </div>
    </section>
  )
}
