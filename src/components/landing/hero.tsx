import { ArrowRightIcon, BadgeCheckIcon, ShoppingBagIcon, TruckIcon, WalletIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

const HERO_POINTS = [
  { icon: BadgeCheckIcon, label: "Price shown upfront" },
  { icon: WalletIcon, label: "Pay with GCash or Maya" },
  { icon: TruckIcon, label: "Delivered nationwide" },
]

/** Centered, single-column hero: the headline and CTAs carry it, with one soft glow behind. */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-20 lg:pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-1/2 -z-10 size-[min(40rem,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-3xl"
      />

      <div className="mx-auto flex max-w-3xl flex-col items-center gap-7 text-center">
        <span className="inline-flex items-center gap-2.5 rounded-full bg-card/80 px-4 py-2 font-heading text-sm font-extrabold text-foreground shadow-clay-card backdrop-blur-xl">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-clay-emerald opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2.5 rounded-full bg-clay-emerald" />
          </span>
          Now taking orders online
        </span>

        <h1
          id="hero-title"
          className="text-5xl leading-[1.05] font-black tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-8xl"
        >
          Print it your way, <span className="text-clay-gradient">beautifully.</span>
        </h1>

        <p className="max-w-xl text-lg leading-relaxed font-medium text-pretty text-muted-foreground sm:text-xl">
          Custom stickers, 3D prints and more, made in-house by DG Prints. Choose your options and see the exact
          price before you order.
        </p>

        <div className="mt-2 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <Button variant="clay" size="clay-lg" render={<Link to="/shop" />} nativeButton={false} className="w-full sm:w-auto">
            <ShoppingBagIcon />
            Shop now
            <ArrowRightIcon className="size-4 transition-transform group-hover/button:translate-x-1 motion-reduce:transition-none" />
          </Button>
          <Button
            variant="clay-secondary"
            size="clay-lg"
            render={<Link to="/#categories" />}
            nativeButton={false}
            className="w-full sm:w-auto"
          >
            Browse categories
          </Button>
        </div>

        <ul className="mt-2 flex flex-wrap justify-center gap-x-6 gap-y-3">
          {HERO_POINTS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Icon className="size-4.5 text-primary" strokeWidth={2.25} aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
