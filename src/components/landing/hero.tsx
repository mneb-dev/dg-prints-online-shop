import type { ComponentType, CSSProperties } from "react"
import { ArrowRightIcon, BadgeCheckIcon, ShoppingBagIcon, TruckIcon, WalletIcon, type LucideProps } from "lucide-react"
import { Link } from "react-router-dom"

import { IconBadge, type IconBadgeTone } from "@/components/icon-badge"
import { StartingPrice } from "@/components/price-tag"
import { ProductVisual } from "@/components/product-image"
import { Button } from "@/components/ui/button"
import { useCatalog } from "@/lib/catalog"
import { startingPrice } from "@/lib/pricing-resolver"
import type { ShopProduct } from "@/lib/shop-types"
import { cn } from "@/lib/utils"

const HERO_POINTS = [
  { icon: BadgeCheckIcon, label: "Price shown upfront" },
  { icon: WalletIcon, label: "Pay with GCash or Maya" },
  { icon: TruckIcon, label: "Delivered nationwide" },
]

/** Two-column hero: copy and CTAs first, then an isometric product card that shows the shop's promise
 *  (pick options, see the price) using a real product from the catalog. */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-x-clip">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pt-14 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:grid-cols-2 lg:gap-10 lg:pt-24 lg:pb-24">
        <div className="flex flex-col items-start gap-6">
          {/* "NEW" pill inside a gradient-ringed container. */}
          <span className="rounded-full bg-brand-gradient p-px shadow-soft">
            <span className="flex items-center gap-2 rounded-full bg-white py-1 pr-3.5 pl-1 text-sm font-medium text-slate-700">
              <span className="rounded-full bg-primary px-2 py-0.5 text-[0.7rem] font-bold tracking-wide text-white">NEW</span>
              Now taking orders online
            </span>
          </span>

          <h1 id="hero-title" className="text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            Print it your way, <span className="text-brand-gradient">beautifully made.</span>
          </h1>

          <p className="max-w-xl text-lg text-pretty text-muted-foreground">
            Custom stickers, 3D prints and more, made in-house by DG Prints. Choose your options and see the exact
            price before you order.
          </p>

          <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button size="lg" render={<Link to="/shop" />} nativeButton={false} className="w-full rounded-full sm:w-auto">
              <ShoppingBagIcon />
              Shop now
              <ArrowRightIcon className="size-4 transition-transform group-hover/button:translate-x-1 motion-reduce:transition-none" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              render={<Link to="/#categories" />}
              nativeButton={false}
              className="w-full rounded-full sm:w-auto"
            >
              Browse categories
            </Button>
          </div>

          <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-3">
            {HERO_POINTS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Icon className="size-4 text-success" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <HeroShowcase />
      </div>
    </section>
  )
}

/** First orderable product with a price, so the card always shows a real price. */
function showcaseProduct(products: ShopProduct[]): ShopProduct | undefined {
  return products.find((product) => product.inStock && !product.madeToOrder && startingPrice(product))
}

/** Decorative: hidden from assistive tech, since the same products are listed properly further down. */
function HeroShowcase() {
  const { products } = useCatalog()
  const product = showcaseProduct(products)
  const option = product?.options.find((candidate) => candidate.values.length > 1)

  return (
    <div aria-hidden className="relative mx-auto w-full max-w-md perspective-hero lg:max-w-lg">
      {/* Gradient glow pooled under the card. */}
      <div className="absolute inset-8 -z-10 rounded-full bg-gradient-to-br from-indigo-300/50 to-violet-300/50 blur-3xl" />

      <div className="iso-tilt rounded-2xl border border-slate-100 bg-white p-3 shadow-lift">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
          {product ? (
            <ProductVisual
              url={product.images[0]?.url}
              alt=""
              category={product.category}
              className="size-full"
              iconClassName="size-16"
              eager
            />
          ) : (
            <div className="size-full animate-pulse bg-slate-200/70 motion-reduce:animate-none" />
          )}
        </div>

        <div className="flex flex-col gap-4 p-3 pt-5">
          {product ? (
            <div>
              <p className="text-xs font-semibold tracking-wide text-indigo-600 uppercase">{product.category}</p>
              <p className="mt-1 line-clamp-1 text-lg font-semibold">{product.name}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="h-3 w-20 rounded-full bg-slate-100" />
              <div className="h-5 w-2/3 rounded-full bg-slate-100" />
            </div>
          )}

          {option && (
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">{option.name}</p>
              <div className="flex flex-wrap gap-1.5">
                {option.values.slice(0, 3).map((value, index) => (
                  <span
                    key={value}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-semibold",
                      index === 0 ? "border-transparent bg-brand-gradient text-white" : "border-slate-200 text-slate-600"
                    )}
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
            {product ? <StartingPrice product={product} className="text-xl" /> : <div className="h-6 w-20 rounded-full bg-slate-100" />}
            <span className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-gradient px-3.5 text-sm font-semibold text-white shadow-cta">
              <ShoppingBagIcon className="size-4" />
              Add to cart
            </span>
          </div>
        </div>
      </div>

      <FloatingNote icon={BadgeCheckIcon} tone="emerald" title="Price shown upfront" body="No surprise fees" className="top-10 -left-6 xl:-left-14" />
      <FloatingNote
        icon={WalletIcon}
        tone="indigo"
        title="GCash · Maya"
        body="Secure via PayMongo"
        className="-right-4 bottom-24 xl:-right-10"
        style={{ animationDelay: "2s" }}
      />
    </div>
  )
}

function FloatingNote({
  icon,
  tone,
  title,
  body,
  className,
  style,
}: {
  icon: ComponentType<LucideProps>
  tone: IconBadgeTone
  title: string
  body: string
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      style={style}
      className={cn(
        "absolute hidden animate-float-pulse items-center gap-3 rounded-xl border border-slate-100 bg-white/95 py-2.5 pr-4 pl-2.5 shadow-lift backdrop-blur sm:flex",
        className
      )}
    >
      <IconBadge icon={icon} tone={tone} size="sm" />
      <div className="leading-tight">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-muted-foreground">{body}</p>
      </div>
    </div>
  )
}
