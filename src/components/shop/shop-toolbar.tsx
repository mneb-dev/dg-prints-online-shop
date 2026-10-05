import { SearchIcon, XIcon } from "lucide-react"

import { CategoryIcon } from "@/components/category-visual"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SHOP_SORTS, isShopSort, type ShopSort } from "@/lib/catalog"
import { cn } from "@/lib/utils"

const focusRing = "outline-none focus-visible:ring-4 focus-visible:ring-primary/30"

/** The shop's controls: clay category pills (as on the landing page), with search and sort beside them. */
export function ShopToolbar({
  searchDraft,
  onSearchChange,
  sort,
  onSortChange,
  categories,
  category,
  onCategoryChange,
}: {
  searchDraft: string
  onSearchChange: (value: string) => void
  sort: ShopSort
  onSortChange: (sort: ShopSort) => void
  categories: string[]
  category: string
  onCategoryChange: (category: string) => void
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {categories.length > 0 && (
        // Scrolls sideways on phones instead of wrapping into a tall block.
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pt-1 pb-3 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-1">
          <CategoryChip active={category === ""} onClick={() => onCategoryChange("")}>
            All
          </CategoryChip>
          {categories.map((name) => (
            <CategoryChip key={name} active={category === name} onClick={() => onCategoryChange(name)} icon={name}>
              {name}
            </CategoryChip>
          ))}
        </div>
      )}

      <div className="flex gap-2 lg:shrink-0">
        <div className="relative min-w-0 flex-1 lg:w-72 lg:flex-none">
          <SearchIcon aria-hidden className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchDraft}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search"
            aria-label="Search products"
            className="h-11 w-full rounded-full border-0 bg-clay-well pr-10 pl-10 text-sm font-medium text-foreground shadow-clay-pressed transition-[background-color,box-shadow] duration-200 outline-none placeholder:text-muted-foreground focus:bg-card focus:ring-4 focus:ring-primary/20 [&::-webkit-search-cancel-button]:hidden"
          />
          {searchDraft && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className={cn(
                "absolute top-1/2 right-1.5 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary",
                focusRing
              )}
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>

        <Select
          items={SHOP_SORTS}
          value={sort}
          onValueChange={(value) => {
            if (typeof value === "string" && isShopSort(value)) onSortChange(value)
          }}
        >
          <SelectTrigger
            aria-label="Sort products"
            // A raised pill rather than the default recessed field: it sits in the toolbar, not a form.
            className="h-11 w-auto shrink-0 gap-1.5 rounded-full bg-card px-4 font-heading text-sm font-extrabold shadow-clay-card hover:shadow-clay-card-hover"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end" alignItemWithTrigger={false}>
            {SHOP_SORTS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function CategoryChip({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean
  onClick: () => void
  /** Category name to pick the icon from; "All" has none. */
  icon?: string
  children: string
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full px-5 font-heading text-sm font-extrabold whitespace-nowrap transition-[translate,box-shadow,color] duration-300 active:scale-[0.96] motion-reduce:transition-none",
        focusRing,
        active
          ? "bg-brand-gradient text-primary-foreground shadow-clay-button"
          : "bg-card/80 text-foreground shadow-clay-card backdrop-blur-xl hover:-translate-y-1 hover:text-primary hover:shadow-clay-card-hover motion-reduce:hover:translate-y-0"
      )}
    >
      {icon && (
        <CategoryIcon category={icon} className={cn("size-4", !active && "text-primary")} strokeWidth={2.25} aria-hidden />
      )}
      {children}
    </button>
  )
}

/** Removable chips for the search and sort, plus "Clear all". The category isn't repeated here —
 *  its tab is already highlighted right above. */
export function ActiveFilters({
  search,
  sort,
  onClearSearch,
  onClearSort,
  onClearAll,
}: {
  search: string
  sort: ShopSort
  onClearSearch: () => void
  onClearSort: () => void
  onClearAll: () => void
}) {
  const chips = [
    search && { label: `“${search}”`, name: `search ${search}`, onClear: onClearSearch },
    sort !== "featured" && {
      label: SHOP_SORTS.find((option) => option.value === sort)?.label ?? sort,
      name: "sort order",
      onClear: onClearSort,
    },
  ].filter((chip): chip is { label: string; name: string; onClear: () => void } => Boolean(chip))

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.name}
          type="button"
          onClick={chip.onClear}
          aria-label={`Remove ${chip.name}`}
          className={cn(
            "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full bg-primary/10 pr-2 pl-3 text-sm font-bold text-primary transition-colors hover:bg-primary/15",
            focusRing
          )}
        >
          {chip.label}
          <XIcon className="size-3.5" aria-hidden />
        </button>
      ))}
      {chips.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className={cn("h-8 cursor-pointer rounded-full px-2 text-sm font-bold text-muted-foreground underline-offset-4 hover:text-primary hover:underline", focusRing)}
        >
          Clear all
        </button>
      )}
    </div>
  )
}
