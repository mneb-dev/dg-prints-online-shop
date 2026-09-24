import { useEffect } from "react"
import { ArrowRightIcon, BadgeCheckIcon, ShoppingBagIcon, SparklesIcon, TruckIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { CategoryIcon, CategoryTile } from "@/components/category-visual"
import { Button } from "@/components/ui/button"
import { useCatalog } from "@/lib/catalog"

const HERO_TILES = ["Sticker", "Tarpaulin", "3D Print", "Shirt"]

const VALUE_PROPS = [
  { icon: SparklesIcon, title: "Sharp, vivid prints", body: "Stickers, tarpaulins, boards and 3D prints, all made in-house." },
  { icon: BadgeCheckIcon, title: "Clear pricing", body: "See the price for your exact size and options before you order." },
  { icon: TruckIcon, title: "Ready when you need it", body: "Pick up at our shop or have it delivered to you." },
]

export function LandingPage() {
  const { categories, categoriesStatus, loadCategories } = useCatalog()

  useEffect(() => {
    if (categoriesStatus === "idle") void loadCategories()
  }, [categoriesStatus, loadCategories])

  return (
    <>
      {/* Hero — white surface, brand gradient reserved for the CTA and the highlighted word. */}
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-[-10%] size-[36rem] rounded-full bg-brand-gradient opacity-[0.07] blur-3xl dark:opacity-15"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:py-28">
          <div className="flex flex-col items-start gap-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-brand-gradient" />
              Now taking orders online
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Print it your way, <span className="text-brand-gradient">beautifully.</span>
            </h1>
            <p className="max-w-xl text-lg text-pretty text-muted-foreground">
              Custom stickers, tarpaulins, signage and 3D prints from DG Prints. Pick your product, choose your size
              and options, and see the price right away.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="gradient"
                render={<Link to="/shop" />}
                nativeButton={false}
                className="h-12 gap-2 rounded-xl px-6 text-base pointer-coarse:h-12"
              >
                <ShoppingBagIcon className="size-5" />
                Shop now
                <ArrowRightIcon className="size-4 transition-transform group-hover/button:translate-x-0.5" />
              </Button>
            </div>
          </div>

          <div aria-hidden className="grid grid-cols-2 gap-4 sm:gap-5">
            {HERO_TILES.map((category, index) => (
              <CategoryTile
                key={category}
                category={category}
                className={
                  "aspect-square rounded-2xl shadow-[var(--shadow-elevated)] " +
                  (index % 2 === 1 ? "translate-y-6" : "")
                }
                iconClassName="size-14 sm:size-16"
              />
            ))}
          </div>
        </div>
      </section>

      {/* What we print — live from the shop's categories. */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">What we print</h2>
            <Link to="/shop" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/shop?category=${encodeURIComponent(category)}`}
                className="flex min-h-14 items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-[var(--shadow-soft)] transition-[translate,box-shadow] outline-none hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)] focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:hover:translate-y-0"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <CategoryIcon category={category} className="size-5" />
                </span>
                <span className="truncate font-medium">{category}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {VALUE_PROPS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
              <span className="mb-3 flex size-10 items-center justify-center rounded-lg bg-brand-gradient text-primary-foreground shadow-[var(--shadow-button)]">
                <Icon className="size-5" />
              </span>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
