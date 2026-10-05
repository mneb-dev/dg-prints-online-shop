import { ArrowRightIcon, BadgeCheckIcon, ShoppingBagIcon, TruckIcon, WalletIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

const HERO_POINTS = [
  { icon: BadgeCheckIcon, label: "Price shown upfront" },
  { icon: WalletIcon, label: "Pay with GCash or Maya" },
  { icon: TruckIcon, label: "Delivered nationwide" },
]

/** Centered hero: the headline and CTAs carry it, over the page's soft indigo/violet orbs. */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-x-clip">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 pt-16 pb-16 text-center sm:px-6 sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-24">
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

        <p className="max-w-2xl text-lg text-pretty text-muted-foreground sm:text-xl">
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

        <ul className="mt-2 flex flex-wrap justify-center gap-x-6 gap-y-3">
          {HERO_POINTS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Icon className="size-4 text-success" aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
