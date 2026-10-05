import { useState } from "react"
import { ArrowUpRightIcon, ExternalLinkIcon, QuoteIcon, StarIcon } from "lucide-react"

import { SectionHeading } from "@/components/landing/section-heading"
import { Button } from "@/components/ui/button"
import { averageRating, isFacebookUrl, TESTIMONIALS, TESTIMONIALS_SECTION, type Testimonial } from "@/lib/testimonials"
import { cn } from "@/lib/utils"

if (import.meta.env.DEV) {
  for (const item of TESTIMONIALS) {
    if (item.photoUrl?.includes("fbcdn.net")) {
      console.warn(`Testimonial photo for "${item.name}" is a Facebook image link and will expire; save it to public/testimonials/ instead.`)
    }
  }
}

/** Real customer feedback from lib/testimonials, as a card grid. Hidden while the list is empty. */
export function Testimonials() {
  const { enabled, eyebrow, title, highlight, lead, moreUrl, showAverage } = TESTIMONIALS_SECTION
  if (!enabled || TESTIMONIALS.length === 0) return null

  const summary = showAverage && TESTIMONIALS.length >= 2
  const average = averageRating(TESTIMONIALS)
  // With exactly three, the middle card is the highlight (the design's "center emphasis").
  const emphasizeMiddle = TESTIMONIALS.length === 3

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <SectionHeading
        id="reviews-title"
        align="center"
        eyebrow={eyebrow}
        title={title}
        highlight={highlight}
        lead={
          summary ? (
            <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
              <StarIcon aria-hidden className="size-5 fill-amber-400 text-amber-400" />
              <span>
                <span className="font-semibold text-foreground">{average.toFixed(1)}</span> · from {TESTIMONIALS.length} customer
                reviews
              </span>
            </span>
          ) : (
            lead || undefined
          )
        }
      />

      <ul className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((item, index) => (
          <li key={`${item.name}-${index}`} className={cn(emphasizeMiddle && index === 1 && "lg:z-10 lg:scale-105")}>
            <TestimonialCard item={item} emphasized={emphasizeMiddle && index === 1} />
          </li>
        ))}
      </ul>

      {isFacebookUrl(moreUrl) && (
        <div className="mt-12 flex justify-center">
          <Button variant="secondary" render={<a href={moreUrl} target="_blank" rel="noopener noreferrer" />} nativeButton={false}>
            See all reviews on Facebook
            <ExternalLinkIcon />
            <span className="sr-only">(opens in new tab)</span>
          </Button>
        </div>
      )}
    </section>
  )
}

function TestimonialCard({ item, emphasized }: { item: Testimonial; emphasized: boolean }) {
  const linked = isFacebookUrl(item.postUrl)
  const meta = [item.location, item.product && `Ordered: ${item.product}`].filter(Boolean).join(" · ")
  const className = cn(
    "group/review surface flex h-full flex-col p-6 text-left sm:p-7",
    emphasized && "lg:ring-2 lg:ring-indigo-500/20",
    linked && "lift outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
  )

  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <Stars rating={item.rating} label={`Rated ${item.rating} out of 5`} />
        {linked && (
          <span className="flex items-center gap-1 text-xs font-medium text-slate-500 transition-colors group-hover/review:text-primary">
            <span aria-hidden className="flex size-5 items-center justify-center rounded-full bg-[#1877F2] text-[0.7rem] font-bold text-white">
              f
            </span>
            <ArrowUpRightIcon
              aria-hidden
              className="size-4 transition-transform duration-200 group-hover/review:translate-x-0.5 group-hover/review:-translate-y-0.5 motion-reduce:transition-none"
            />
          </span>
        )}
      </div>

      <blockquote className="mt-5 mb-6 flex-1">
        <QuoteIcon aria-hidden className="mb-2 size-6 fill-indigo-100 text-indigo-200" />
        <p className="leading-relaxed text-pretty text-slate-700">{item.quote}</p>
      </blockquote>

      <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-4">
        <Avatar name={item.name} photoUrl={item.photoUrl} />
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900">{item.name}</p>
          {meta && <p className="text-sm leading-snug text-muted-foreground">{meta}</p>}
        </div>
      </div>
    </>
  )

  return linked ? (
    <a
      href={item.postUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Read ${item.name}'s review on Facebook (opens in new tab)`}
      className={className}
    >
      {body}
    </a>
  ) : (
    <figure className={className}>{body}</figure>
  )
}

function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <span role="img" aria-label={label} className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          aria-hidden
          className={cn("size-4", star <= rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200")}
        />
      ))}
    </span>
  )
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "")).toUpperCase()
}

/** Profile photo, or the customer's initials when there's none or it fails to load (Facebook image
 *  links expire). Remembers which URL failed, so a new URL gets a fresh try. */
function Avatar({ name, photoUrl }: { name: string; photoUrl?: string }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)

  if (!photoUrl || failedUrl === photoUrl) {
    return (
      <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-white shadow-soft">
        {initials(name)}
      </span>
    )
  }

  return (
    <img
      src={photoUrl}
      alt=""
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailedUrl(photoUrl)}
      className="size-11 shrink-0 rounded-full bg-slate-100 object-cover shadow-soft ring-2 ring-white"
    />
  )
}
