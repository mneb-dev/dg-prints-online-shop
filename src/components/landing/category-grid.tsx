import { ArrowRightIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { categoryBlurb, CategoryIcon } from "@/components/category-visual"
import { SectionHeading } from "@/components/landing/section-heading"

/** Card widths for a centered, wrapping row: 1 up on small phones, 2 from sm, 4 on desktop. Centering
 *  (rather than a fixed grid) keeps a short last row balanced when the category count is uneven. */
const ITEM_WIDTH = "w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]"

/** The shop's live categories as icon cards (no imagery needed), each opening the filtered shop. */
export function CategoryGrid({ categories, loading }: { categories: string[]; loading: boolean }) {
  if (!loading && categories.length === 0) return null

  return (
    <section id="categories" aria-labelledby="categories-title" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <SectionHeading
        id="categories-title"
        align="center"
        eyebrow="What we print"
        title="Made to order,"
        highlight="just for you"
        lead="Pick a category to see its products and options."
      />

      {loading ? (
        <div aria-hidden className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className={`${ITEM_WIDTH} surface flex flex-col gap-4 p-6`}>
              <div className="size-12 animate-pulse rounded-xl bg-slate-100 motion-reduce:animate-none" />
              <div className="h-5 w-1/2 animate-pulse rounded-full bg-slate-100 motion-reduce:animate-none" />
              <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-100 motion-reduce:animate-none" />
            </div>
          ))}
        </div>
      ) : (
        <ul className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {categories.map((category) => (
            <li key={category} className={ITEM_WIDTH}>
              <Link
                to={`/shop?category=${encodeURIComponent(category)}`}
                className="group/category lift surface relative isolate flex h-full items-center gap-4 overflow-hidden p-4 outline-none sm:flex-col sm:items-start sm:gap-0 sm:p-6 hover:border-indigo-100 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                {/* Oversized faded icon in the corner for depth; tilts and brightens on hover. */}
                <CategoryIcon
                  category={category}
                  aria-hidden
                  strokeWidth={1.25}
                  className="pointer-events-none absolute -right-6 -bottom-6 -z-10 size-24 -rotate-12 text-indigo-50 sm:size-32 transition-[rotate,color] duration-500 ease-out group-hover/category:rotate-0 group-hover/category:text-indigo-100/80 motion-reduce:transition-none"
                />
                {/* Soft wash that fades in on hover. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-br from-indigo-50/0 to-violet-50/0 transition-colors duration-300 group-hover/category:from-indigo-50/70 group-hover/category:to-violet-50/40"
                />

                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100 transition-all duration-300 ring-inset group-hover/category:bg-brand-gradient group-hover/category:text-white group-hover/category:shadow-glow group-hover/category:ring-transparent">
                  <CategoryIcon category={category} aria-hidden className="size-6" strokeWidth={2} />
                </span>

                <span className="flex min-w-0 flex-1 flex-col sm:mt-5 sm:flex-none">
                  <span className="text-base font-semibold text-slate-900 sm:text-lg">{category}</span>
                  <span className="mt-0.5 text-sm text-muted-foreground sm:mt-1">{categoryBlurb(category)}</span>
                </span>

                {/* Phones: just the arrow at the end of the row. */}
                <ArrowRightIcon aria-hidden className="size-5 shrink-0 text-indigo-500 sm:hidden" />
                <span className="mt-6 hidden items-center gap-1.5 text-sm font-semibold text-primary sm:inline-flex">
                  Browse products
                  <ArrowRightIcon
                    aria-hidden
                    className="size-4 transition-transform duration-200 group-hover/category:translate-x-1 motion-reduce:transition-none"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
