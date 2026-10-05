import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/** Page numbers to show: always first and last, the current page with one neighbour each side,
 *  and "gap" where a run is skipped — e.g. 1 … 4 5 6 … 12. */
function pageItems(page: number, pageCount: number): Array<number | "gap"> {
  const pages = new Set([1, pageCount, page - 1, page, page + 1].filter((value) => value >= 1 && value <= pageCount))
  const sorted = [...pages].sort((a, b) => a - b)
  const items: Array<number | "gap"> = []
  sorted.forEach((value, index) => {
    const previous = sorted[index - 1]
    if (previous !== undefined && value - previous === 2) items.push(previous + 1)
    else if (previous !== undefined && value - previous > 2) items.push("gap")
    items.push(value)
  })
  return items
}

const stepButton =
  "flex size-11 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-xs transition-all duration-200 outline-none hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40"

export function Pagination({
  page,
  pageCount,
  total,
  pageSize,
  onPageChange,
}: {
  page: number
  pageCount: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
}) {
  const first = (page - 1) * pageSize + 1
  const last = Math.min(page * pageSize, total)

  return (
    <nav aria-label="Pagination" className="mt-14 flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <button type="button" className={stepButton} disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page">
          <ChevronLeftIcon className="size-5" />
        </button>
        <ol className="flex items-center gap-1.5 sm:gap-2">
          {pageItems(page, pageCount).map((item, index) =>
            item === "gap" ? (
              <li key={`gap-${index}`} aria-hidden className="w-6 text-center font-bold text-muted-foreground">
                …
              </li>
            ) : (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => onPageChange(item)}
                  aria-label={`Page ${item}`}
                  aria-current={item === page ? "page" : undefined}
                  className={cn(
                    "flex size-11 cursor-pointer items-center justify-center rounded-lg font-semibold tabular-nums transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                    item === page
                      ? "bg-brand-gradient text-primary-foreground shadow-cta"
                      : "text-slate-600 hover:bg-indigo-50 hover:text-primary"
                  )}
                >
                  {item}
                </button>
              </li>
            )
          )}
        </ol>
        <button type="button" className={stepButton} disabled={page >= pageCount} onClick={() => onPageChange(page + 1)} aria-label="Next page">
          <ChevronRightIcon className="size-5" />
        </button>
      </div>
      <p className="text-sm text-muted-foreground tabular-nums">
        Showing {first}–{last} of {total}
      </p>
    </nav>
  )
}
