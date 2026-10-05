import { Link } from "react-router-dom"

import { CategoryIcon } from "@/components/category-visual"
import { SectionHeading } from "@/components/landing/section-heading"

/** The shop's live categories as a centered row of clay pills, each opening the filtered shop. */
export function CategoryGrid({ categories, loading }: { categories: string[]; loading: boolean }) {
  if (!loading && categories.length === 0) return null

  return (
    <section id="categories" aria-labelledby="categories-title" className="mx-auto max-w-5xl scroll-mt-28 px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading
        id="categories-title"
        align="center"
        eyebrow="What we print"
        title="Made to order"
        lead="Pick a category to see its products and options."
      />

      {loading ? (
        <div aria-hidden className="flex flex-wrap justify-center gap-4">
          {[28, 36, 24, 32].map((width) => (
            <div key={width} className="h-12 animate-pulse rounded-full bg-card/60 shadow-clay-card" style={{ width: `${width / 4}rem` }} />
          ))}
        </div>
      ) : (
        <ul className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <li key={category}>
              <Link
                to={`/shop?category=${encodeURIComponent(category)}`}
                className="inline-flex h-12 items-center gap-2.5 rounded-full bg-card/80 px-5 font-heading font-extrabold text-foreground shadow-clay-card backdrop-blur-xl transition-[translate,box-shadow,color] duration-300 outline-none hover:-translate-y-1 hover:text-primary hover:shadow-clay-card-hover focus-visible:ring-4 focus-visible:ring-primary/30 active:scale-[0.96] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <CategoryIcon category={category} className="size-5 text-primary" strokeWidth={2.25} aria-hidden />
                {category}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
