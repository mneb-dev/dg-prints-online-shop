import { ArrowRightIcon, ShoppingBagIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

/** Closing call-to-action: one violet clay slab, nothing else. */
export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="relative overflow-hidden rounded-[48px] bg-brand-gradient px-6 py-14 text-center text-white shadow-clay-button sm:rounded-[60px] sm:px-12 sm:py-20">
        {/* Soft top-left light on the slab, like the clay buttons. */}
        <div aria-hidden className="pointer-events-none absolute -top-1/3 -left-1/4 size-[70%] rounded-full bg-white/20 blur-3xl" />

        <div className="relative mx-auto flex max-w-xl flex-col items-center gap-5">
          <h2 id="cta-title" className="text-3xl leading-[1.1] font-black tracking-tight text-balance sm:text-5xl">
            Ready to print something great?
          </h2>
          <p className="text-lg leading-relaxed font-medium text-white/90">Pick your options and check out in minutes.</p>
          <div className="mt-3 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <Button
              variant="clay-secondary"
              size="clay"
              render={<Link to="/shop" />}
              nativeButton={false}
              className="w-full text-primary sm:w-auto"
            >
              <ShoppingBagIcon />
              Start shopping
              <ArrowRightIcon className="size-4 transition-transform group-hover/button:translate-x-1 motion-reduce:transition-none" />
            </Button>
            <Link
              to="/contact"
              className="inline-flex h-14 items-center rounded-[20px] px-5 font-bold text-white underline-offset-4 outline-none hover:underline focus-visible:ring-4 focus-visible:ring-white/50"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
