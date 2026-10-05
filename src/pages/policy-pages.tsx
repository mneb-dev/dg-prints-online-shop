import { useState } from "react"
import { toast } from "sonner"

import { ContactDetails, PolicyLayout, PolicySection, TextLink } from "@/components/policy-layout"
import { Button } from "@/components/ui/button"
import { BUSINESS, POLICY, businessIdentity, privacyContact } from "@/lib/business-info"
import { clearSavedCheckoutForm, REGION_LABELS, useCheckout, type ShippingRegion } from "@/lib/checkout"
import { useShopSettings } from "@/lib/shop-settings"
import { formatCurrency } from "@/lib/utils"

const REGIONS: ShippingRegion[] = ["luzon", "visayas", "mindanao"]

/** 3 → "3%", 2.5 → "2.5%". */
function formatPercent(value: number): string {
  return `${Number(value.toFixed(2))}%`
}

/** "Contact us at …" — whichever contact routes are filled in, or the Contact page. */
function ReachUs() {
  return (
    <p>
      Questions or concerns? See our <TextLink to="/contact">Contact page</TextLink>
      {BUSINESS.email ? (
        <>
          {" "}
          or email{" "}
          <a href={`mailto:${BUSINESS.email}`} className="font-medium text-primary underline-offset-4 hover:underline">
            {BUSINESS.email}
          </a>
        </>
      ) : null}
      .
    </p>
  )
}

export function ContactPage() {
  return (
    <PolicyLayout
      title="Contact us"
      showUpdated={false}
      intro={<p>Questions about a product, an order or a delivery? Reach us any of these ways. Have your order number handy if you already ordered.</p>}
    >
      <ContactDetails />
      <PolicySection title="Business information">
        <p>{businessIdentity()}</p>
        {BUSINESS.address && <p>{BUSINESS.address}</p>}
      </PolicySection>
    </PolicyLayout>
  )
}

export function ShippingPolicyPage() {
  const { shipping } = useCheckout()
  const hasDeliveryTimes = REGIONS.some((region) => POLICY.deliveryTime[region])

  return (
    <PolicyLayout title="Shipping & delivery" intro={<p>We ship orders anywhere in the Philippines.</p>}>
      <PolicySection title="Shipping fees">
        <p>The fee depends on the region of your delivery address and is shown at checkout before you pay.</p>
        {shipping && (
          <dl className="grid max-w-sm grid-cols-1 gap-2">
            {REGIONS.map((region) => (
              <div key={region} className="clay-well flex items-center justify-between gap-4 px-4 py-3">
                <dt>{REGION_LABELS[region]}</dt>
                <dd className="font-heading font-black tabular-nums">{formatCurrency(shipping.rates[region])}</dd>
              </div>
            ))}
          </dl>
        )}
      </PolicySection>

      <PolicySection title="How long it takes">
        <ul>
          <li>
            Every item is printed for your order, so it's produced first and shipped after.
            {POLICY.productionTime && ` Production usually takes ${POLICY.productionTime}.`}
          </li>
          <li>
            Production starts once your payment is confirmed. For items priced on request, it starts once you've
            approved the price and paid.
          </li>
          {hasDeliveryTimes && (
            <li>
              Delivery after shipping usually takes:{" "}
              {REGIONS.filter((region) => POLICY.deliveryTime[region])
                .map((region) => `${REGION_LABELS[region]} ${POLICY.deliveryTime[region]}`)
                .join(" · ")}
              .
            </li>
          )}
          {POLICY.couriers && <li>We ship with {POLICY.couriers}.</li>}
          <li>Times are estimates. Peak seasons, holidays, weather and courier delays can add a few days.</li>
        </ul>
      </PolicySection>

      <PolicySection title="Your delivery details">
        <ul>
          <li>Please check your name, mobile number and address at checkout. The courier uses them to reach you.</li>
          <li>
            If a parcel is returned because the address was wrong or incomplete, or no one could receive it, we'll
            contact you to arrange re-delivery. The courier's fee for shipping it again may apply.
          </li>
          <li>
            If your parcel arrives damaged, take photos before opening it fully and see{" "}
            <TextLink to="/returns">Returns & refunds</TextLink>.
          </li>
        </ul>
      </PolicySection>

      <ReachUs />
    </PolicyLayout>
  )
}

export function ReturnsPolicyPage() {
  return (
    <PolicyLayout
      title="Returns & refunds"
      intro={
        <p>
          Everything we sell is printed to order for you. If something's wrong with your order, we'll make it right.
          This policy doesn't limit your rights under the Consumer Act of the Philippines.
        </p>
      }
    >
      <PolicySection title="When we'll reprint or refund">
        <ul>
          <li>The item is defective, for example a misprint, smudged or faded printing, or a wrong cut.</li>
          <li>You received the wrong item, size, quantity or option compared with what you ordered.</li>
          <li>The item was damaged during delivery.</li>
        </ul>
        <p>
          Depending on the problem, we'll reprint or replace the item, or refund it. If we can't fulfil your order at
          all, we'll refund it in full.
        </p>
      </PolicySection>

      <PolicySection title="What isn't covered">
        <p>Because items are made specifically for you, we can't accept returns or exchanges for:</p>
        <ul>
          <li>a change of mind, or choosing a different design, size or option after production has started;</li>
          <li>
            mistakes in the files or text you provided, such as typos, or low-resolution images you approved for
            printing;
          </li>
          <li>small color differences between your screen and the printed item, which are normal in printing.</li>
        </ul>
      </PolicySection>

      <PolicySection title="How to make a claim">
        <ul>
          <li>
            Contact us within {POLICY.claimDays} days of receiving your order. Use the{" "}
            <TextLink to="/contact">Contact page</TextLink>.
          </li>
          <li>Include your order number, a short description of the problem, and photos of the item and its packaging.</li>
          <li>We'll review it and tell you whether it's a reprint, replacement or refund. We may ask you to send the item back. If so, we'll cover the return shipping for valid claims.</li>
        </ul>
      </PolicySection>

      <PolicySection title="How refunds are paid">
        <ul>
          <li>
            Orders paid online with GCash or Maya are refunded to the same account through our payment provider,
            PayMongo. We process approved refunds within {POLICY.refundProcessingDays} working days. When it reaches
            your account then depends on GCash or Maya.
          </li>
          <li>Orders paid another way are refunded by bank or e-wallet transfer, which we'll arrange with you.</li>
          <li>For a full order refund, the shipping fee you paid is refunded too.</li>
        </ul>
      </PolicySection>

      <PolicySection title="Cancelling an order">
        <p>
          You can cancel any time before we start producing your order, and we'll refund it in full. Once production
          has started, the order can't be cancelled because the items are made for you.
        </p>
      </PolicySection>

      <ReachUs />
    </PolicyLayout>
  )
}

export function TermsPage() {
  const { convenienceFeePercent } = useShopSettings()

  return (
    <PolicyLayout
      title="Terms of sale"
      intro={
        <p>
          These terms apply when you order from the {BUSINESS.tradeName} online shop. By placing an order, you agree to
          them, along with our <TextLink to="/shipping">Shipping & delivery</TextLink>,{" "}
          <TextLink to="/returns">Returns & refunds</TextLink> and <TextLink to="/privacy">Privacy</TextLink> policies.
        </p>
      }
    >
      <PolicySection title="Who we are">
        <p>
          The shop is run by {businessIdentity()}
          {BUSINESS.address ? `, ${BUSINESS.address}` : ""}.
        </p>
      </PolicySection>

      <PolicySection title="Products">
        <ul>
          <li>Product photos are examples. Your printed item follows the options you choose.</li>
          <li>Colors can look slightly different on screen than in print.</li>
          <li>
            If you send us a design, text or image, you confirm you have the right to use it. We can decline to print
            anything unlawful, offensive, or that infringes someone else's rights. If we do, we'll refund you.
          </li>
          <li>We may contact you to confirm your design before printing.</li>
        </ul>
      </PolicySection>

      <PolicySection title="3D printed items">
        <p>
          A 3D design file (like STL or 3MF) looks perfectly smooth on screen. A 3D printer builds the real item one thin
          layer at a time, so it will be very close to the design, but not exactly the same. This is normal, not a
          defect:
        </p>
        <ul>
          <li>You can see and feel thin lines on the surface.</li>
          <li>There may be small marks where support pieces were removed.</li>
          <li>The size may be off by about half a millimeter, and very tiny details may not show.</li>
          <li>Colors may look slightly different from photos.</li>
        </ul>
      </PolicySection>

      <PolicySection title="Prices">
        <ul>
          <li>
            Prices are in Philippine pesos (₱)
            {POLICY.pricesIncludeVat ? " and include 12% VAT" : ""}. The price shown for each item is what you pay for
            it.
          </li>
          {convenienceFeePercent > 0 && (
            <li>
              Online prices include a {formatPercent(convenienceFeePercent)} fee for processing online payments, so
              they may be slightly higher than prices in our store or on Messenger. There's no separate charge at
              checkout.
            </li>
          )}
          <li>
            Shipping is added at checkout based on your delivery region (see{" "}
            <TextLink to="/shipping">Shipping & delivery</TextLink>). The total shown before you pay is the full amount
            you'll be charged.
          </li>
          <li>
            Items marked “Quote” are priced on request. We'll confirm the price with you before producing them, and the
            order only goes ahead once you agree.
          </li>
          <li>
            If a price changes while an item is in your cart, checkout will tell you before you pay. You're always
            charged the price confirmed at checkout.
          </li>
        </ul>
      </PolicySection>

      <PolicySection title="Ordering and payment">
        <ul>
          <li>
            Orders with fully priced items are paid online with GCash or Maya through PayMongo, our payment provider.
            Your order is confirmed once your payment goes through, and you'll see your order number on screen.
          </li>
          <li>
            Orders with an item priced on request are placed without paying online. We'll message or call you to
            confirm the price and arrange payment.
          </li>
          <li>We never ask for your GCash or Maya PIN or one-time password (OTP).</li>
        </ul>
      </PolicySection>

      <PolicySection title="Cancellations, returns and refunds">
        <p>
          See <TextLink to="/returns">Returns & refunds</TextLink>.
        </p>
      </PolicySection>

      <PolicySection title="Changes to these terms">
        <p>
          We may update these terms. The version shown when you place your order applies to that order. These terms
          follow the laws of the Philippines, and nothing in them limits your rights as a consumer under Philippine law.
        </p>
      </PolicySection>

      <ReachUs />
    </PolicyLayout>
  )
}

export function PrivacyPage() {
  const [forgotten, setForgotten] = useState(false)
  const contact = privacyContact()

  function forgetDetails() {
    clearSavedCheckoutForm()
    setForgotten(true)
    toast.success("Your saved details were removed from this device.")
  }

  return (
    <PolicyLayout
      title="Privacy policy"
      intro={
        <p>
          This explains what personal information {BUSINESS.tradeName} collects through this online shop, why, and what
          you can do about it, in line with the Data Privacy Act of 2012 (Republic Act No. 10173). The shop is run by{" "}
          {businessIdentity()}
          {BUSINESS.address ? `, ${BUSINESS.address}` : ""}.
        </p>
      }
    >
      <PolicySection title="What we collect">
        <ul>
          <li>
            <strong>When you order:</strong> your full name, mobile number and delivery address (house no. and street,
            barangay, city or municipality, province, and ZIP code), the items you order, and any notes you add.
          </li>
          <li>
            <strong>When you pay online:</strong> your email address. We pass it to PayMongo, together with your name
            and mobile number, for your payment and so PayMongo can send you a receipt. We don't keep your email
            ourselves. Your payment is made on GCash or Maya through PayMongo. We receive the payment status and
            reference, and we never see your PIN, one-time password (OTP), or account balance.
          </li>
          <li>
            <strong>When you message us on Facebook:</strong> whatever you send us in Messenger. Meta's own privacy
            policy also applies there.
          </li>
        </ul>
        <p>We don't use tracking or advertising cookies, and we don't collect sensitive personal information.</p>
      </PolicySection>

      <PolicySection title="Why we use it">
        <ul>
          <li>To process, produce and deliver your order, and to contact you about it by text, call or Messenger.</li>
          <li>To confirm your payment and handle refunds.</li>
          <li>To keep the sales and accounting records the law requires.</li>
          <li>To respond to your questions, claims and complaints.</li>
        </ul>
        <p>
          We use your information because it's needed to fulfil your order and to meet our legal obligations. We don't
          sell it, and we don't use it for advertising.
        </p>
      </PolicySection>

      <PolicySection title="Who we share it with">
        <ul>
          <li>PayMongo, and GCash or Maya: your name, mobile number and email, to process your payment and send your receipt.</li>
          <li>Our courier: your name, mobile number and address, so they can deliver your order.</li>
          <li>
            The service providers that host our website and order database. Their servers may be outside the
            Philippines. They store the data for us and may not use it for anything else.
          </li>
          <li>Government authorities, only when the law requires it.</li>
        </ul>
      </PolicySection>

      <PolicySection title="What's saved on your device">
        <p>
          This shop uses your browser's storage, not cookies, to remember your cart. After
          you place an order, it also remembers your name, mobile number, email and address on this device, so you don't have
          to type them again next time. This stays on your device and isn't sent anywhere until you place another
          order. On a shared phone or computer, you can remove it:
        </p>
        <div>
          <Button variant="secondary" size="sm" onClick={forgetDetails} disabled={forgotten}>
            {forgotten ? "Saved details removed" : "Forget my details on this device"}
          </Button>
        </div>
      </PolicySection>

      <PolicySection title="How long we keep it">
        <p>
          We keep order records, including your name, contact number and address, for as long as we need them to
          complete your order and handle any claims, and for as long as tax and accounting laws require us to keep
          sales records. After that, we delete them.
        </p>
      </PolicySection>

      <PolicySection title="How we protect it">
        <p>
          The shop uses encrypted connections (HTTPS). Only staff who handle orders can see order details, through our
          password-protected order system.
        </p>
      </PolicySection>

      <PolicySection title="Your rights">
        <p>Under the Data Privacy Act, you have the right to:</p>
        <ul>
          <li>be informed about how your personal information is used;</li>
          <li>access it, and get a copy;</li>
          <li>have wrong or outdated information corrected;</li>
          <li>object to its use, or have it deleted or blocked, unless we must keep it by law;</li>
          <li>be compensated for damages from its misuse;</li>
          <li>
            file a complaint with the National Privacy Commission (
            <a href="https://privacy.gov.ph" target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline-offset-4 hover:underline">
              privacy.gov.ph
            </a>
            ).
          </li>
        </ul>
        <p>
          To use any of these rights, contact us
          {contact ? (
            <>
              {" "}
              at{" "}
              {contact.includes("@") ? (
                <a href={`mailto:${contact}`} className="font-medium text-primary underline-offset-4 hover:underline">
                  {contact}
                </a>
              ) : (
                contact
              )}
            </>
          ) : (
            <>
              {" "}
              through our <TextLink to="/contact">Contact page</TextLink>
            </>
          )}
          . We'll reply within a reasonable time and may ask you to confirm your identity first.
        </p>
      </PolicySection>

      <PolicySection title="Changes to this policy">
        <p>If we change this policy, we'll update it here and change the date at the top.</p>
      </PolicySection>
    </PolicyLayout>
  )
}
