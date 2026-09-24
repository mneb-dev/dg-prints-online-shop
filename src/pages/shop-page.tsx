import { useCallback, useEffect, useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon, PackageSearchIcon, RotateCwIcon, SearchIcon, XIcon } from "lucide-react"
import { useSearchParams } from "react-router-dom"

import { ProductCard, ProductCardSkeleton } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { SHOP_PAGE_SIZE, useCatalog } from "@/lib/catalog"
import { cn, pluralize } from "@/lib/utils"

const SEARCH_DEBOUNCE_MS = 300

function CategoryChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 shrink-0 cursor-pointer items-center rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 pointer-coarse:h-10",
        active
          ? "border-transparent bg-brand-gradient text-primary-foreground shadow-[var(--shadow-button)]"
          : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get("q") ?? ""
  const category = searchParams.get("category") ?? ""
  const page = Math.max(1, Number(searchParams.get("page")) || 1)

  const { products, total, listStatus, listError, categories, categoriesStatus, loadProducts, loadCategories } =
    useCatalog()
  const [searchDraft, setSearchDraft] = useState(search)
  const [syncedSearch, setSyncedSearch] = useState(search)

  // Keep the box in sync when the URL changes from outside (back button, a category link) —
  // adjusted during render rather than in an effect, per React's "storing previous props" pattern.
  if (search !== syncedSearch) {
    setSyncedSearch(search)
    if (searchDraft.trim() !== search) setSearchDraft(search)
  }

  const updateParams = useCallback(
    (next: { q?: string; category?: string; page?: number }) => {
      setSearchParams(
        (current) => {
          const params = new URLSearchParams(current)
          for (const [key, value] of Object.entries(next)) {
            if (value === undefined) continue
            if (value === "" || (key === "page" && value === 1)) params.delete(key)
            else params.set(key, String(value))
          }
          return params
        },
        { replace: true }
      )
    },
    [setSearchParams]
  )

  useEffect(() => {
    if (categoriesStatus === "idle") void loadCategories()
  }, [categoriesStatus, loadCategories])

  useEffect(() => {
    void loadProducts({ search, category, page })
  }, [search, category, page, loadProducts])

  // Debounce typing into the URL (which is what drives the fetch).
  useEffect(() => {
    if (searchDraft.trim() === search) return
    const timer = setTimeout(() => updateParams({ q: searchDraft.trim(), page: 1 }), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [searchDraft, search, updateParams])

  const pageCount = Math.max(1, Math.ceil(total / SHOP_PAGE_SIZE))
  const isLoading = listStatus === "loading" || listStatus === "idle"
  const hasFilters = search !== "" || category !== ""

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Shop</h1>
        <p className="text-muted-foreground">Browse our products and build your order.</p>
      </div>

      <div className="mb-6 flex flex-col gap-4">
        <div className="relative max-w-md">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
            placeholder="Search products"
            aria-label="Search products"
            className="h-10 pl-9"
          />
        </div>
        {categories.length > 0 && (
          // Scrolls sideways on phones instead of wrapping into a tall block.
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            <CategoryChip active={category === ""} onClick={() => updateParams({ category: "", page: 1 })}>
              All
            </CategoryChip>
            {categories.map((name) => (
              <CategoryChip key={name} active={category === name} onClick={() => updateParams({ category: name, page: 1 })}>
                {name}
              </CategoryChip>
            ))}
          </div>
        )}
      </div>

      {listStatus === "failed" ? (
        <Empty className="border border-border bg-card py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <RotateCwIcon />
            </EmptyMedia>
            <EmptyTitle>We couldn't load the shop</EmptyTitle>
            <EmptyDescription>{listError}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" onClick={() => void loadProducts({ search, category, page })}>
              Try again
            </Button>
          </EmptyContent>
        </Empty>
      ) : isLoading && products.length === 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {Array.from({ length: 8 }, (_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <Empty className="border border-border bg-card py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PackageSearchIcon />
            </EmptyMedia>
            <EmptyTitle>{hasFilters ? "No products match" : "No products yet"}</EmptyTitle>
            <EmptyDescription>
              {hasFilters ? "Try a different search or category." : "Check back soon — new products are on the way."}
            </EmptyDescription>
          </EmptyHeader>
          {hasFilters && (
            <EmptyContent>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchDraft("")
                  updateParams({ q: "", category: "", page: 1 })
                }}
              >
                <XIcon />
                Clear filters
              </Button>
            </EmptyContent>
          )}
        </Empty>
      ) : (
        <>
          <p className="mb-3 text-sm text-muted-foreground" aria-live="polite">
            {pluralize(total, "product")}
          </p>
          <div
            className={cn(
              "grid grid-cols-2 gap-3 transition-opacity sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5",
              isLoading && "opacity-60"
            )}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {pageCount > 1 && (
            <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="lg"
                disabled={page <= 1}
                onClick={() => updateParams({ page: page - 1 })}
              >
                <ChevronLeftIcon />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground tabular-nums">
                Page {page} of {pageCount}
              </span>
              <Button
                variant="outline"
                size="lg"
                disabled={page >= pageCount}
                onClick={() => updateParams({ page: page + 1 })}
              >
                Next
                <ChevronRightIcon />
              </Button>
            </nav>
          )}
        </>
      )}
    </div>
  )
}
