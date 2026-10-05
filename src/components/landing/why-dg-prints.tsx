import type { ComponentType, ReactNode } from "react"
import { BadgeCheckIcon, CheckIcon, ShieldCheckIcon, TruckIcon, WalletIcon, type LucideProps } from "lucide-react"

import { IconBadge, type IconBadgeTone } from "@/components/icon-badge"
import { SectionHeading } from "@/components/landing/section-heading"
import { PaymentIcon } from "@/components/payment-logo"
import { POLICY } from "@/lib/business-info"
import { cn } from "@/lib/utils"

const REGIONS = [
  { name: "Luzon", time: POLICY.deliveryTime.luzon },
  { name: "Visayas", time: POLICY.deliveryTime.visayas },
  { name: "Mindanao", time: POLICY.deliveryTime.mindanao },
].filter((region) => region.time)

const BENEFITS: Array<{
  icon: ComponentType<LucideProps>
  tone: IconBadgeTone
  title: string
  body: string
  visual: ReactNode
}> = [
  {
    icon: BadgeCheckIcon,
    tone: "emerald",
    title: "Exact price upfront",
    body: "Choose your options and the price updates right away. What you see at checkout is what you pay.",
    visual: <PriceVisual />,
  },
  {
    icon: WalletIcon,
    tone: "indigo",
    title: "Pay with GCash or Maya",
    body: "Pay securely in your e-wallet app through PayMongo. We never ask for your PIN or OTP.",
    visual: <PaymentVisual />,
  },
  {
    icon: TruckIcon,
    tone: "violet",
    title: "Shipped nationwide",
    body: POLICY.couriers
      ? `We ship anywhere in the Philippines with ${POLICY.couriers}.`
      : "We ship anywhere in the Philippines, with the fee shown before you pay.",
    visual: <DeliveryVisual />,
  },
]

/** Quick facts, all from business-info — a fact whose source is empty is left out. */
const FACTS = [
  POLICY.productionTime && { value: POLICY.productionTime, label: "Production time" },
  POLICY.deliveryTime.luzon && { value: POLICY.deliveryTime.luzon, label: "Luzon delivery" },
  POLICY.claimDays && { value: `${POLICY.claimDays} days`, label: "To report defects" },
].filter((fact): fact is { value: string; label: string } => Boolean(fact))

/** Zig-zag feature rows: copy on one side, a small tilted UI card on the other, alternating. */
export function WhyDgPrints() {
  return (
    <section aria-labelledby="why-title" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <SectionHeading id="why-title" align="center" eyebrow="Why DG Prints" title="Printing," highlight="made simple" />

      <ul className="flex flex-col gap-16 lg:gap-24">
        {BENEFITS.map(({ icon, tone, title, body, visual }, index) => {
          const flipped = index % 2 === 1
          return (
            <li key={title} className={cn("flex flex-col items-center gap-10 lg:flex-row lg:gap-16", flipped && "lg:flex-row-reverse")}>
              <div className="flex max-w-xl flex-1 flex-col items-start">
                <IconBadge icon={icon} tone={tone} size="lg" className="mb-6" />
                <h3 className="text-2xl sm:text-3xl">{title}</h3>
                <p className="mt-3 text-lg text-muted-foreground">{body}</p>
              </div>
              <div aria-hidden className="w-full max-w-md flex-1 perspective-[1200px]">
                <div
                  className={cn(
                    "rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 p-5 transition-transform duration-500 ease-out sm:p-8 motion-reduce:transform-none",
                    flipped ? "-rotate-y-6 hover:rotate-y-0" : "rotate-y-6 hover:rotate-y-0"
                  )}
                >
                  {visual}
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {FACTS.length > 0 && (
        <dl className="mt-20 grid gap-4 sm:grid-cols-3 sm:gap-6">
          {FACTS.map((fact) => (
            <div key={fact.label} className="surface px-6 py-5 text-center">
              <dt className="text-sm text-muted-foreground">{fact.label}</dt>
              <dd className="mt-1 text-2xl font-bold tracking-tight text-brand-gradient">{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}

/* --- Visuals: tiny, decorative UI fragments (aria-hidden by the caller). --- */

const visualCard = "rounded-xl border border-white/80 bg-white p-5 shadow-lift"

function PriceVisual() {
  return (
    <div className={visualCard}>
      {["Item", "Options", "Shipping"].map((label, index) => (
        <div key={label} className="flex items-center justify-between border-b border-slate-100 py-2.5 text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className="h-2.5 rounded-full bg-slate-200" style={{ width: `${48 - index * 10}px` }} />
        </div>
      ))}
      <div className="flex items-center justify-between pt-4">
        <span className="font-semibold">Total</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          <CheckIcon className="size-3.5" />
          Shown before you pay
        </span>
      </div>
    </div>
  )
}

function PaymentVisual() {
  return (
    <div className={cn(visualCard, "flex flex-col gap-3")}>
      {[
        { type: "gcash", label: "GCash" },
        { type: "paymaya", label: "Maya" },
      ].map((method, index) => (
        <div
          key={method.type}
          className={cn(
            "flex items-center gap-3 rounded-lg border p-3",
            index === 0 ? "border-indigo-500 bg-indigo-50/60 ring-1 ring-indigo-500" : "border-slate-200"
          )}
        >
          <PaymentIcon type={method.type} />
          <span className="flex-1 text-sm font-semibold">{method.label}</span>
          <span
            className={cn(
              "flex size-5 items-center justify-center rounded-full border-2",
              index === 0 ? "border-primary bg-primary text-white" : "border-slate-300"
            )}
          >
            {index === 0 && <CheckIcon className="size-3 stroke-3" />}
          </span>
        </div>
      ))}
      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheckIcon className="size-3.5 text-success" />
        Secured by PayMongo
      </p>
    </div>
  )
}

function DeliveryVisual() {
  return (
    <div className={cn(visualCard, "flex flex-col gap-1")}>
      {REGIONS.map((region, index) => (
        <div key={region.name} className="flex items-center gap-3 py-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600">
            {index + 1}
          </span>
          <span className="flex-1 text-sm font-semibold">{region.name}</span>
          <span className="text-sm text-muted-foreground tabular-nums">{region.time}</span>
        </div>
      ))}
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full w-2/3 rounded-full bg-brand-gradient" />
      </div>
    </div>
  )
}
