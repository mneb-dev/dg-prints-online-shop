import type { ReactNode } from "react"
import { Link } from "react-router-dom"

import { SectionHeading } from "@/components/landing/section-heading"
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "@/components/ui/accordion"
import { BUSINESS, POLICY } from "@/lib/business-info"

function MoreLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="mt-3 inline-flex font-bold text-primary underline-offset-4 hover:underline">
      {children} →
    </Link>
  )
}

const deliveryTimes = [
  POLICY.deliveryTime.luzon && `Luzon ${POLICY.deliveryTime.luzon}`,
  POLICY.deliveryTime.visayas && `Visayas ${POLICY.deliveryTime.visayas}`,
  POLICY.deliveryTime.mindanao && `Mindanao ${POLICY.deliveryTime.mindanao}`,
].filter(Boolean)

/** Short answers drawn from the policy pages (and the same POLICY/BUSINESS values), each linking to
 *  the full page — so this never drifts from what the policies actually say. */
const FAQS: Array<{ question: string; answer: ReactNode }> = [
  {
    question: "How do I know the price?",
    answer: (
      <>
        <p>
          Open a product and choose your size, quantity and options — the price updates as you pick. Shipping is added
          at checkout based on your region, and the total you see before paying is the full amount you'll be charged.
          Items marked “Quote” are priced on request, and we confirm the price with you before making them.
        </p>
        <MoreLink to="/terms">Read our terms of sale</MoreLink>
      </>
    ),
  },
  {
    question: "How do I pay?",
    answer: (
      <>
        <p>
          Orders with fully priced items are paid online with GCash or Maya through PayMongo, and your order is
          confirmed once payment goes through. Orders with a “Quote” item are placed without paying online — we'll
          message or call you to confirm the price and arrange payment. We never ask for your PIN or OTP.
        </p>
        <MoreLink to="/terms">Ordering and payment</MoreLink>
      </>
    ),
  },
  {
    question: "How long will my order take?",
    answer: (
      <>
        <p>
          Every item is printed for your order, so it's produced first and shipped after.
          {POLICY.productionTime && ` Production usually takes ${POLICY.productionTime}, starting once your payment is confirmed.`}
          {deliveryTimes.length > 0 && ` Delivery after shipping usually takes ${deliveryTimes.join(", ")}.`}
        </p>
        <MoreLink to="/shipping">Shipping & delivery</MoreLink>
      </>
    ),
  },
  {
    question: "Do you deliver to my area?",
    answer: (
      <>
        <p>
          We ship anywhere in the Philippines{POLICY.couriers ? ` with ${POLICY.couriers}` : ""}. The shipping fee
          depends on your delivery region and is shown at checkout before you pay.
        </p>
        <MoreLink to="/shipping">See shipping fees</MoreLink>
      </>
    ),
  },
  {
    question: "What if something's wrong with my order?",
    answer: (
      <>
        <p>
          If an item is defective, wrong or damaged in delivery, tell us within {POLICY.claimDays} days of receiving it
          with your order number and photos, and we'll reprint, replace or refund it. Because items are made just for
          you, we can't take returns for a change of mind once production has started.
        </p>
        <MoreLink to="/returns">Returns & refunds</MoreLink>
      </>
    ),
  },
  {
    question: "How can I reach you?",
    answer: (
      <>
        <p>
          {BUSINESS.email ? `Email us at ${BUSINESS.email}` : "Message us"}
          {BUSINESS.hours ? ` — we're open ${BUSINESS.hours}` : ""}. Have your order number handy if you've already
          ordered.
        </p>
        <MoreLink to="/contact">Contact us</MoreLink>
      </>
    ),
  },
]

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="mx-auto max-w-3xl scroll-mt-28 px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading
        id="faq-title"
        eyebrow="FAQ"
        title="Questions, answered"
        align="center"
      />
      <Accordion>
        {FAQS.map((faq) => (
          <AccordionItem key={faq.question}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionPanel>{faq.answer}</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
