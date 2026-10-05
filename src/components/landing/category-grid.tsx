import { ArrowRightIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { CategoryTile } from "@/components/category-visual"
import { SectionHeading } from "@/components/landing/section-heading"

/** Card widths for a centered, wrapping row: 2 up on phones, 3 on tablets, 4 on desktop. Centering
 *  (rather than a fixed grid) keeps a short last row balanced when the category count is uneven. */
const ITEM_WIDTH = "w-[calc(50%-0.5rem)] sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)]"

/** The shop's live categories as elevated cards, each opening the filtered shop. */
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
            <div key={index} className={`${ITEM_WIDTH} surface p-2`}>
              <div className="aspect-[4/3] animate-pulse rounded-lg bg-slate-100 motion-reduce:animate-none" />
              <div className="m-3 h-5 w-2/3 animate-pulse rounded-full bg-slate-100 motion-reduce:animate-none" />
            </div>
          ))}
        </div>
      ) : (
        <ul className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {categories.map((category) => (
            <li key={category} className={ITEM_WIDTH}>
              <Link
                to={`/shop?category=${encodeURIComponent(category)}`}
                className="group/category lift surface flex h-full flex-col p-2 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                <div className="aspect-[4/3] overflow-hidden rounded-lg">
                  <CategoryTile
                    category={category}
                    className="size-full transition-transform duration-500 ease-out group-hover/category:scale-105 motion-reduce:transition-none"
                    iconClassName="size-10 sm:size-12"
                  />
                </div>
                <span className="flex items-center justify-between gap-2 px-2 pt-3 pb-1.5 sm:px-3">
                  <span className="truncate text-sm font-semibold sm:text-base">{category}</span>
                  <ArrowRightIcon
                    aria-hidden
                    className="size-4 shrink-0 text-indigo-500 transition-transform duration-200 group-hover/category:translate-x-1 motion-reduce:transition-none"
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
