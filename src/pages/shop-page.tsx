import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { ChevronRightIcon, PackageSearchIcon, RotateCwIcon, XIcon, type LucideIcon } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"

import { ClayOrb } from "@/components/clay-orb"
import { ProductCard, ProductCardSkeleton } from "@/components/product-card"
import { Pagination } from "@/components/shop/pagination"
import { ActiveFilters, ShopToolbar } from "@/components/shop/shop-toolbar"
import { Button } from "@/components/ui/button"
import { SHOP_PAGE_SIZE, isShopSort, useCatalog, type ShopSort } from "@/lib/catalog"
import { cn, pluralize } from "@/lib/utils"

const SEARCH_DEBOUNCE_MS = 300

const gridClasses = "grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8"

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get("q") ?? ""
  const category = searchParams.get("category") ?? ""
  const sortParam = searchParams.get("sort") ?? ""
  const sort: ShopSort = isShopSort(sortParam) ? sortParam : "featured"
  const page = Math.max(1, Number(searchParams.get("page")) || 1)

  const { products, total, listStatus, listError, categories, categoriesStatus, loadProducts, loadCategories } =
    useCatalog()
  const [searchDraft, setSearchDraft] = useState(search)
  const [syncedSearch, setSyncedSearch] = useState(search)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Keep the box in sync when the URL changes from outside (back button, a category link) —
  // adjusted during render rather than in an effect, per React's "storing previous props" pattern.
  if (search !== syncedSearch) {
    setSyncedSearch(search)
    if (searchDraft.trim() !== search) setSearchDraft(search)
  }

  const updateParams = useCallback(
    (next: { q?: string; category?: string; sort?: ShopSort; page?: number }) => {
      setSearchParams(
        (current) => {
          const params = new URLSearchParams(current)
          for (const [key, value] of Object.entries(next)) {
            if (value === undefined) continue
            // Defaults stay out of the URL so plain /shop links stay plain.
            if (value === "" || (key === "page" && value === 1) || (key === "sort" && value === "featured")) params.delete(key)
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
    void loadProducts({ search, category, page, sort })
  }, [search, category, page, sort, loadProducts])

  // Debounce typing into the URL (which is what drives the fetch).
  useEffect(() => {
    if (searchDraft.trim() === search) return
    const timer = setTimeout(() => updateParams({ q: searchDraft.trim(), page: 1 }), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [searchDraft, search, updateParams])

  function clearAll() {
    setSearchDraft("")
    updateParams({ q: "", category: "", sort: "featured", page: 1 })
  }

  function goToPage(next: number) {
    updateParams({ page: next })
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    resultsRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" })
  }

  const pageCount = Math.max(1, Math.ceil(total / SHOP_PAGE_SIZE))
  const isLoading = listStatus === "loading" || listStatus === "idle"
  const hasFilters = search !== "" || category !== ""

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 pb-8 sm:px-6 sm:pt-14">
      <header className="mb-8 flex flex-col gap-2 sm:mb-10">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-muted-foreground">
            <li>
              <Link to="/" className="rounded-full outline-none hover:text-primary focus-visible:ring-4 focus-visible:ring-primary/30">
                Home
              </Link>
            </li>
            <BreadcrumbSeparator />
            {category ? (
              <>
                <li>
                  <button
                    type="button"
                    onClick={() => updateParams({ category: "", page: 1 })}
                    className="cursor-pointer rounded-full outline-none hover:text-primary focus-visible:ring-4 focus-visible:ring-primary/30"
                  >
                    Shop
                  </button>
                </li>
                <BreadcrumbSeparator />
                <li aria-current="page" className="text-foreground">
                  {category}
                </li>
              </>
            ) : (
              <li aria-current="page" className="text-foreground">
                Shop
              </li>
            )}
          </ol>
        </nav>
        <h1 className="text-3xl leading-[1.1] font-black tracking-tight text-balance sm:text-4xl">
          {category || "All products"}
        </h1>
      </header>

      <ShopToolbar
        searchDraft={searchDraft}
        onSearchChange={setSearchDraft}
        sort={sort}
        onSortChange={(next) => updateParams({ sort: next, page: 1 })}
        categories={categories}
        category={category}
        onCategoryChange={(next) => updateParams({ category: next, page: 1 })}
      />

      <div ref={resultsRef} className="scroll-mt-28 pt-6">
        <div className="mb-5 flex min-h-8 flex-wrap items-center justify-between gap-3" aria-live="polite">
          <ActiveFilters
            search={search}
            sort={sort}
            onClearSearch={() => {
              setSearchDraft("")
              updateParams({ q: "", page: 1 })
            }}
            onClearSort={() => updateParams({ sort: "featured", page: 1 })}
            onClearAll={clearAll}
          />
          {listStatus === "succeeded" && (
            <p className="ml-auto text-sm font-semibold text-muted-foreground">{pluralize(total, "product")}</p>
          )}
        </div>

        {listStatus === "failed" ? (
          <ShopMessage icon={RotateCwIcon} title="We couldn't load the shop" description={listError}>
            <Button variant="clay" size="clay-sm" onClick={() => void loadProducts({ search, category, page, sort })}>
              Try again
            </Button>
          </ShopMessage>
        ) : isLoading && products.length === 0 ? (
          <div className={gridClasses}>
            {Array.from({ length: 8 }, (_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <ShopMessage
            icon={PackageSearchIcon}
            title={hasFilters ? "No products match" : "No products yet"}
            description={hasFilters ? "Try a different search or category." : "Check back soon — new products are on the way."}
          >
            {hasFilters && (
              <Button variant="clay-secondary" size="clay-sm" onClick={clearAll}>
                <XIcon />
                Clear filters
              </Button>
            )}
          </ShopMessage>
        ) : (
          <>
            <div className={cn(gridClasses, "transition-opacity", isLoading && "opacity-60")}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {pageCount > 1 && (
              <Pagination page={page} pageCount={pageCount} total={total} pageSize={SHOP_PAGE_SIZE} onPageChange={goToPage} />
            )}
          </>
        )}
      </div>
    </div>
  )
}

function BreadcrumbSeparator() {
  return (
    <li aria-hidden>
      <ChevronRightIcon className="size-4" />
    </li>
  )
}

/** Clay card for the empty and error states. */
function ShopMessage({
  icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon
  title: string
  description: string | null
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-[32px] bg-card/75 px-6 py-16 text-center shadow-clay-card backdrop-blur-xl">
      <ClayOrb icon={icon} round />
      <div className="max-w-sm">
        <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">{title}</h2>
        {description && <p className="mt-2 font-medium text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  )
}
