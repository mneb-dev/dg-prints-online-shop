import { useEffect, useRef, useState } from "react"
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  CheckIcon,
  ChevronDownIcon,
  InfoIcon,
  LockIcon,
  TruckIcon,
  UserIcon,
  WalletIcon,
  XIcon,
} from "lucide-react"
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom"

import { MobileActionBar } from "@/components/mobile-action-bar"
import { PaymentIcon, paymentHint } from "@/components/payment-logo"
import { ProductVisual } from "@/components/product-image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { lineTotal, useCart } from "@/lib/cart"
import {
  EMPTY_CHECKOUT_FORM,
  REGION_LABELS,
  clearSavedCheckoutForm,
  loadSavedCheckoutForm,
  saveCheckoutForm,
  useCheckout,
  type CheckoutForm,
  type PlaceOrderError,
  type ShippingRegion,
} from "@/lib/checkout"
import { isValidPhMobileNumber } from "@/lib/ph-phone"
import { cn, formatCurrency, pluralize } from "@/lib/utils"

type FieldKey = keyof CheckoutForm

// Order matters: it's the order errors are checked and scrolled to.
const FIELDS: FieldKey[] = ["name", "phone", "email", "street", "barangay", "city", "province", "zip"]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** `needsPayment`: the email is only asked for (and required) when the cart is paid online. */
function validate(form: CheckoutForm, needsPayment: boolean): Partial<Record<FieldKey, string>> {
  const errors: Partial<Record<FieldKey, string>> = {}
  if (!form.name.trim()) errors.name = "Enter your full name."
  else if (form.name.trim().length > 60) errors.name = "Use at most 60 characters."
  if (!form.phone.trim()) errors.phone = "Enter your mobile number."
  else if (!isValidPhMobileNumber(form.phone)) errors.phone = "Enter a valid PH mobile number, e.g. 0917 123 4567."
  if (needsPayment) {
    if (!form.email.trim()) errors.email = "Enter your email for your payment receipt."
    else if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = "Enter a valid email, e.g. juan@gmail.com."
  }
  if (!form.street.trim()) errors.street = "Enter your house number and street."
  if (!form.barangay.trim()) errors.barangay = "Enter your barangay."
  if (!form.city.trim()) errors.city = "Enter your city or municipality."
  if (!form.province) errors.province = "Choose your province."
  if (form.zip.trim() && !/^\d{4}$/.test(form.zip.trim())) errors.zip = "ZIP code is 4 digits."
  return errors
}

function FormField({
  id,
  label,
  optional,
  error,
  className,
  children,
}: {
  id: string
  label: string
  optional?: boolean
  error?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id}>
        {label}
        {optional && <span className="font-normal text-muted-foreground">(optional)</span>}
      </Label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

function Section({ icon: Icon, title, children }: { icon: typeof UserIcon; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:p-6">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <Icon className="size-5 text-primary" />
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </section>
  )
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const { lines, lineCount, subtotal, quoteLineCount } = useCart()
  const {
    shipping,
    shippingStatus,
    retryShipping,
    paymentMethods,
    paymentMethodsStatus,
    retryPaymentMethods,
    submitting,
    placeOrder,
  } = useCheckout()
  // The buyer's pick; until they pick, the first offered method (GCash) is used.
  const [pickedMethod, setPickedMethod] = useState("")
  const [form, setForm] = useState<CheckoutForm>(loadSavedCheckoutForm)
  // Prefilled from this device's last order — offer to forget it (shared phones/computers).
  const [hasSavedDetails, setHasSavedDetails] = useState(() => Object.values(form).some(Boolean))
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({})
  const [submitError, setSubmitError] = useState<PlaceOrderError | null>(null)
  const honeypotRef = useRef<HTMLInputElement>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const paymentCancelled = searchParams.get("payment") === "cancelled"
  const [redirecting, setRedirecting] = useState(false)
  // A cart with a "Quote" item has no final total, so it's ordered without paying (staff quote it).
  const needsPayment = quoteLineCount === 0

  // Coming back from PayMongo with the browser's Back button can restore this page from the
  // back/forward cache with the button still stuck on "Redirecting…".
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setRedirecting(false)
    }
    window.addEventListener("pageshow", onPageShow)
    return () => window.removeEventListener("pageshow", onPageShow)
  }, [])

  if (lineCount === 0) return <Navigate to="/cart" replace />

  const errors = validate(form, needsPayment)
  const visibleError = (key: FieldKey) => (touched[key] ? errors[key] : undefined)
  const region: ShippingRegion | undefined = shipping?.provinces.find((p) => p.name === form.province)?.region
  const shippingFee = region && shipping ? shipping.rates[region] : null
  const total = subtotal + (shippingFee ?? 0)
  const conflictLine = submitError?.lineKey ? lines.find((line) => line.key === submitError.lineKey) : undefined
  const paymentMethod = paymentMethods.find((method) => method.type === pickedMethod) ?? paymentMethods[0]

  function set(key: FieldKey, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const fieldProps = (key: FieldKey) => ({
    id: `checkout-${key}`,
    name: key,
    value: form[key],
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => set(key, event.target.value),
    onBlur: () => setTouched((prev) => ({ ...prev, [key]: true })),
    "aria-invalid": !!visibleError(key) || undefined,
    "aria-describedby": visibleError(key) ? `checkout-${key}-error` : undefined,
    className: "h-11",
  })

  async function handleSubmit(event?: React.FormEvent) {
    event?.preventDefault()
    if (busy) return
    setTouched(Object.fromEntries(FIELDS.map((key) => [key, true])))
    const firstError = FIELDS.find((key) => errors[key])
    if (firstError) {
      const el = document.getElementById(`checkout-${firstError}`)
      el?.scrollIntoView({ behavior: "smooth", block: "center" })
      el?.focus({ preventScroll: true })
      return
    }
    if (shippingFee === null) return
    setSubmitError(null)
    try {
      const trimmed = Object.fromEntries(FIELDS.map((key) => [key, form[key].trim()])) as CheckoutForm
      const result = await placeOrder(trimmed, lines, honeypotRef.current?.value ?? "", paymentMethod?.type)
      saveCheckoutForm(trimmed)
      if (result.kind === "payment") {
        // Straight to GCash/Maya. The cart stays until the payment is confirmed, so cancelling there
        // loses nothing.
        setRedirecting(true)
        window.location.assign(result.checkoutUrl)
        return
      }
      navigate("/checkout/success", { replace: true, state: { orderNumber: result.orderNumber, total: result.total } })
    } catch (err) {
      setSubmitError(err as PlaceOrderError)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // Clickable before everything is filled in, so a tap shows what's missing instead of doing nothing.
  const busy = submitting || redirecting
  const canSubmit = !!shipping && !busy && (!needsPayment || !!paymentMethod)
  const submitLabel = needsPayment
    ? busy
      ? `Redirecting to ${paymentMethod?.label ?? "payment"}…`
      : paymentMethod
        ? `Pay with ${paymentMethod.label}`
        : "Continue to payment"
    : busy
      ? "Placing order…"
      : "Place order"

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        to="/cart"
        className="mb-4 inline-flex min-h-10 items-center gap-1.5 rounded-md text-sm font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <ArrowLeftIcon className="size-4" />
        Back to cart
      </Link>
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Checkout</h1>

      {paymentCancelled && !submitError && (
        <div role="status" className="mb-6 flex items-start gap-3 rounded-xl border border-border bg-muted/50 p-4 text-sm">
          <InfoIcon className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="flex-1">
            <span className="font-medium">Payment cancelled.</span>{" "}
            <span className="text-muted-foreground">Your cart is still here — no order was placed.</span>
          </p>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setSearchParams({}, { replace: true })}
            className="-m-1 rounded-md p-1 text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <XIcon className="size-4" />
          </button>
        </div>
      )}

      {submitError && (
        <div role="alert" className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <AlertCircleIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
          <div className="flex flex-col gap-1">
            <p className="font-medium">{submitError.message}</p>
            {conflictLine && (
              <p className="text-muted-foreground">
                Please update {conflictLine.productName} in your{" "}
                <Link to="/cart" className="font-medium text-primary underline-offset-4 hover:underline">
                  cart
                </Link>{" "}
                and try again.
              </p>
            )}
          </div>
        </div>
      )}

      <form
        noValidate
        onSubmit={handleSubmit}
        className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8"
      >
        <div className="flex flex-col gap-6">
          <Section icon={UserIcon} title="Contact">
            <FormField id="checkout-name" label="Full name" error={visibleError("name")} className="sm:col-span-2">
              <Input {...fieldProps("name")} autoComplete="name" maxLength={60} />
            </FormField>
            <FormField id="checkout-phone" label="Mobile number" error={visibleError("phone")} className="sm:col-span-2">
              <Input {...fieldProps("phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder="0917 123 4567" maxLength={16} />
            </FormField>
            {needsPayment && (
              <FormField id="checkout-email" label="Email" error={visibleError("email")} className="sm:col-span-2">
                <Input
                  {...fieldProps("email")}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="juan@gmail.com"
                  maxLength={254}
                />
                {!visibleError("email") && (
                  <p className="text-xs text-muted-foreground">For your payment receipt from PayMongo.</p>
                )}
              </FormField>
            )}
            <p className="text-xs text-muted-foreground sm:col-span-2">
              {hasSavedDetails ? "Filled in from your last order on this device. " : "Saved on this device for your next order. "}
              {hasSavedDetails && (
                <button
                  type="button"
                  onClick={() => {
                    clearSavedCheckoutForm()
                    setForm(EMPTY_CHECKOUT_FORM)
                    setTouched({})
                    setHasSavedDetails(false)
                  }}
                  className="font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  Forget my details
                </button>
              )}
            </p>
          </Section>

          <Section icon={TruckIcon} title="Shipping address">
            <FormField id="checkout-street" label="House no. & street" error={visibleError("street")} className="sm:col-span-2">
              <Input {...fieldProps("street")} autoComplete="address-line1" placeholder="e.g. 12 Rizal St" maxLength={120} />
            </FormField>
            <FormField id="checkout-barangay" label="Barangay" error={visibleError("barangay")}>
              <Input {...fieldProps("barangay")} placeholder="e.g. San Isidro" maxLength={60} />
            </FormField>
            <FormField id="checkout-city" label="City / Municipality" error={visibleError("city")}>
              <Input {...fieldProps("city")} autoComplete="address-level2" placeholder="e.g. Quezon City" maxLength={60} />
            </FormField>
            <FormField id="checkout-province" label="Province" error={visibleError("province")}>
              <div className="relative">
                <select
                  id="checkout-province"
                  name="province"
                  autoComplete="address-level1"
                  value={form.province}
                  disabled={!shipping}
                  onChange={(event) => {
                    set("province", event.target.value)
                    setTouched((prev) => ({ ...prev, province: true }))
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, province: true }))}
                  aria-invalid={!!visibleError("province") || undefined}
                  aria-describedby={visibleError("province") ? "checkout-province-error" : undefined}
                  className={cn(
                    "h-11 w-full cursor-pointer appearance-none rounded-lg border border-input bg-transparent pr-9 pl-2.5 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30",
                    !form.province && "text-muted-foreground"
                  )}
                >
                  <option value="" disabled>
                    {shipping ? "Choose province" : "Loading…"}
                  </option>
                  {(["luzon", "visayas", "mindanao"] as const).map((group) => (
                    <optgroup key={group} label={REGION_LABELS[group]}>
                      {shipping?.provinces
                        .filter((province) => province.region === group)
                        .map((province) => (
                          <option key={province.name} value={province.name} className="text-foreground">
                            {province.name}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </FormField>
            <FormField id="checkout-zip" label="ZIP code" optional error={visibleError("zip")}>
              <Input {...fieldProps("zip")} inputMode="numeric" autoComplete="postal-code" placeholder="e.g. 1100" maxLength={4} />
            </FormField>
          </Section>

          {needsPayment && (
            <Section icon={WalletIcon} title="Payment method">
              {/* Radio cards: the whole card is the click target, a native radio (visually hidden) keeps
                  keyboard/screen-reader behaviour, and the selected card gets the primary border + check. */}
              <div role="radiogroup" aria-label="Payment method" className="grid grid-cols-1 gap-3 sm:col-span-2 sm:grid-cols-2">
                {paymentMethods.map((method) => {
                  const checked = method.type === paymentMethod?.type
                  return (
                    <label
                      key={method.type}
                      className={cn(
                        "flex min-h-16 cursor-pointer items-center gap-3 rounded-xl border border-input bg-card p-3 transition-colors hover:border-primary/50 has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
                        checked && "border-primary bg-primary/5 ring-1 ring-primary hover:border-primary"
                      )}
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value={method.type}
                        checked={checked}
                        onChange={() => setPickedMethod(method.type)}
                        className="sr-only"
                      />
                      <PaymentIcon type={method.type} />
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="font-medium">{method.label}</span>
                        <span className="text-xs text-muted-foreground">{paymentHint(method.type)}</span>
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                          checked ? "border-primary bg-primary text-primary-foreground" : "border-input"
                        )}
                      >
                        {checked && <CheckIcon className="size-3 stroke-3" />}
                      </span>
                    </label>
                  )
                })}
                {paymentMethods.length === 0 &&
                  (paymentMethodsStatus === "failed" ? (
                    <button
                      type="button"
                      onClick={() => retryPaymentMethods()}
                      className="self-start text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Couldn't load payment options · Retry
                    </button>
                  ) : paymentMethodsStatus === "succeeded" ? (
                    <p className="text-sm text-muted-foreground">Online payment isn't available right now.</p>
                  ) : (
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Spinner /> Loading payment options…
                    </p>
                  ))}
              </div>
            </Section>
          )}

          {/* Honeypot: hidden from people and screen readers; bots that fill every field give themselves away. */}
          <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="checkout-website">Website</label>
            <input ref={honeypotRef} id="checkout-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>
        </div>

        <aside className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <ul className="flex flex-col gap-3">
            {lines.map((line) => {
              const lineAmount = lineTotal(line)
              return (
                <li
                  key={line.key}
                  className={cn(
                    "flex items-center gap-3 rounded-lg",
                    line.key === submitError?.lineKey && "ring-2 ring-destructive/50 ring-offset-4 ring-offset-card"
                  )}
                >
                  <ProductVisual
                    url={line.imageUrl}
                    alt={line.productName}
                    category={line.category}
                    className="size-12 shrink-0 rounded-lg"
                    iconClassName="size-5"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{line.productName}</p>
                    <p className="text-xs text-muted-foreground">Qty {line.quantity}</p>
                  </div>
                  <p className="text-sm font-medium tabular-nums">
                    {lineAmount === null ? <span className="text-xs text-muted-foreground">Quote</span> : formatCurrency(lineAmount)}
                  </p>
                </li>
              )
            })}
          </ul>
          <Separator />
          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal · {pluralize(lines.reduce((n, l) => n + l.quantity, 0), "item")}</dt>
              <dd className="tabular-nums">{formatCurrency(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Shipping{region && ` · ${REGION_LABELS[region]}`}</dt>
              <dd className="text-right tabular-nums">
                {shippingFee !== null ? (
                  formatCurrency(shippingFee)
                ) : shippingStatus === "failed" ? (
                  <button type="button" onClick={() => retryShipping()} className="font-medium text-primary underline-offset-4 hover:underline">
                    Couldn't load · Retry
                  </button>
                ) : (
                  <span className="text-muted-foreground">Choose a province</span>
                )}
              </dd>
            </div>
          </dl>
          <Separator />
          <div className="flex items-baseline justify-between">
            <span className="font-semibold">Total</span>
            <span className="text-2xl font-bold tracking-tight tabular-nums">{formatCurrency(total)}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {quoteLineCount > 0
              ? "Items marked “Quote” aren't included — we'll confirm their price with you. "
              : ""}
            {needsPayment
              ? "You'll pay securely online through PayMongo."
              : "No payment now: we'll message or call you to confirm your order and payment."}
          </p>
          <p className="text-xs text-muted-foreground">
            By placing your order, you agree to our{" "}
            <Link to="/terms" className="font-medium text-foreground underline-offset-4 hover:underline">
              Terms of sale
            </Link>{" "}
            and{" "}
            <Link to="/returns" className="font-medium text-foreground underline-offset-4 hover:underline">
              Returns policy
            </Link>
            . We use your details only for this order, as described in our{" "}
            <Link to="/privacy" className="font-medium text-foreground underline-offset-4 hover:underline">
              Privacy policy
            </Link>
            .
          </p>
          <Button type="submit" variant="clay" size="clay-sm" className="hidden h-12 gap-2 lg:inline-flex" disabled={!canSubmit}>
            {busy ? <Spinner /> : <LockIcon />}
            {submitLabel}
          </Button>
        </aside>

        <MobileActionBar>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">{shippingFee === null ? "Total before shipping" : "Total"}</p>
            <p className="text-lg leading-tight font-bold tracking-tight tabular-nums">{formatCurrency(total)}</p>
          </div>
          <Button type="submit" variant="clay" size="clay-sm" className="h-12 gap-2 px-5" disabled={!canSubmit}>
            {busy ? <Spinner /> : <LockIcon />}
            {submitLabel}
          </Button>
        </MobileActionBar>
      </form>
    </div>
  )
}
