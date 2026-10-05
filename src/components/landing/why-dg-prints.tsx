import { BadgeCheckIcon, TruckIcon, WalletIcon } from "lucide-react"

import { ClayOrb } from "@/components/clay-orb"
import { SectionHeading } from "@/components/landing/section-heading"
import { POLICY } from "@/lib/business-info"

const BENEFITS = [
  {
    icon: BadgeCheckIcon,
    title: "Exact price upfront",
    body: "Choose your options and the price updates right away. What you see at checkout is what you pay.",
  },
  {
    icon: WalletIcon,
    title: "Pay with GCash or Maya",
    body: "Pay securely in your e-wallet app through PayMongo. We never ask for your PIN or OTP.",
  },
  {
    icon: TruckIcon,
    title: "Shipped nationwide",
    body: POLICY.couriers
      ? `We ship anywhere in the Philippines with ${POLICY.couriers}.`
      : "We ship anywhere in the Philippines, with the fee shown before you pay.",
  },
]

/** One quiet line of facts, all from business-info — a fact whose source is empty is left out. */
const FACTS = [
  POLICY.productionTime && `Made in ${POLICY.productionTime}`,
  POLICY.deliveryTime.luzon && `Luzon delivery in ${POLICY.deliveryTime.luzon}`,
  POLICY.claimDays && `${POLICY.claimDays}-day claims on defects`,
].filter(Boolean)

export function WhyDgPrints() {
  return (
    <section aria-labelledby="why-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading id="why-title" align="center" eyebrow="Why DG Prints" title="Printing, made simple" />

      <ul className="grid gap-6 sm:gap-8 md:grid-cols-3">
        {BENEFITS.map(({ icon, title, body }) => (
          <li
            key={title}
            className="flex flex-col items-center rounded-[32px] bg-card/75 p-8 text-center shadow-clay-card backdrop-blur-xl"
          >
            <ClayOrb icon={icon} className="mb-6" />
            <h3 className="text-xl font-extrabold tracking-tight">{title}</h3>
            <p className="mt-2 leading-relaxed font-medium text-muted-foreground">{body}</p>
          </li>
        ))}
      </ul>

      {FACTS.length > 0 && (
        <p className="mt-12 text-center text-sm font-semibold text-muted-foreground sm:text-base">
          {FACTS.join(" · ")}
        </p>
      )}
    </section>
  )
}
