import { ArrowRightIcon, ShoppingBagIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

/** Closing call-to-action: a deep indigo panel with a white button for maximum contrast. */
export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 to-indigo-950 px-6 py-16 text-center text-white shadow-lift sm:px-12 sm:py-20">
        <div aria-hidden className="pointer-events-none absolute -top-32 -right-24 -z-10 size-[28rem] rounded-full bg-violet-500/30 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-24 -z-10 size-[24rem] rounded-full bg-indigo-500/30 blur-3xl" />
        {/* Faint grid for texture. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.04)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        />

        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
          <h2 id="cta-title" className="text-3xl sm:text-4xl lg:text-5xl">
            Ready to print something great?
          </h2>
          <p className="max-w-xl text-lg text-indigo-200">Pick your options and check out in minutes.</p>
          <div className="mt-4 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <Button
              variant="secondary"
              size="lg"
              render={<Link to="/shop" />}
              nativeButton={false}
              className="w-full rounded-full border-white text-indigo-700 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-indigo-800 hover:shadow-[0_8px_24px_-4px_rgb(0_0_0/0.35)] focus-visible:ring-white focus-visible:ring-offset-indigo-950 sm:w-auto motion-reduce:hover:translate-y-0"
            >
              <ShoppingBagIcon />
              Start shopping
              <ArrowRightIcon className="size-4 transition-transform group-hover/button:translate-x-1 motion-reduce:transition-none" />
            </Button>
            <Link
              to="/contact"
              className="inline-flex h-14 items-center rounded-full px-6 font-semibold text-white/90 transition-colors outline-none hover:text-white hover:underline hover:underline-offset-4 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-950"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
