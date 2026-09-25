import { useState } from "react"
import { ArrowLeftIcon, ArrowRightIcon, InfoIcon, PencilIcon, PlusIcon, ShoppingBagIcon, Trash2Icon } from "lucide-react"
import { Link } from "react-router-dom"

import { MobileActionBar } from "@/components/mobile-action-bar"
import { ProductVisual } from "@/components/product-image"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { QuantityInput } from "@/components/ui/quantity-input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { MAX_NOTE_LENGTH, lineTotal, useCart, type CartLine } from "@/lib/cart"
import { itemDetails } from "@/lib/messenger"
import { formatCurrency, pluralize } from "@/lib/utils"

/** "Add note" link, or the saved note with an edit button; expands to a textarea that saves on blur. */
function LineNote({ line }: { line: CartLine }) {
  const { setNote } = useCart()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(line.note)

  function startEditing() {
    setDraft(line.note)
    setEditing(true)
  }

  function save() {
    setNote(line.key, draft)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="mt-2 flex flex-col gap-1.5">
        <Textarea
          autoFocus
          aria-label={`Note for ${line.productName}`}
          value={draft}
          maxLength={MAX_NOTE_LENGTH}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={save}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setDraft(line.note)
              setEditing(false)
            }
          }}
          placeholder="e.g. name to print, colors, when you need it"
          className="max-h-40 min-h-16 text-sm"
        />
        <p className="flex justify-between gap-2 text-xs text-muted-foreground">
          <span>Saved when you click away.</span>
          <span className="tabular-nums">
            {draft.length}/{MAX_NOTE_LENGTH}
          </span>
        </p>
      </div>
    )
  }

  if (line.note) {
    return (
      <div className="mt-2 flex items-start gap-1 rounded-lg bg-muted/60 px-2.5 py-1.5 text-sm">
        <p className="min-w-0 flex-1 whitespace-pre-line break-words">
          <span className="font-medium">Note: </span>
          {line.note}
        </p>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Edit note for ${line.productName}`}
          onClick={startEditing}
          className="-my-1 -mr-1.5 shrink-0 text-muted-foreground"
        >
          <PencilIcon />
        </Button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={startEditing}
      className="mt-1.5 inline-flex min-h-8 cursor-pointer items-center gap-1 rounded-md text-sm font-medium text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <PlusIcon className="size-3.5" />
      Add note
    </button>
  )
}

function CartLineItem({ line }: { line: CartLine }) {
  const { setQuantity, removeLine } = useCart()
  const total = lineTotal(line)
  const details = itemDetails(line)

  return (
    <li className="flex gap-4 py-5 first:pt-0 last:pb-0">
      <Link to={`/shop/${line.productId}`} className="shrink-0 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
        <ProductVisual
          url={line.imageUrl}
          alt={line.productName}
          category={line.category}
          className="size-20 rounded-lg sm:size-24"
          iconClassName="size-8"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Link to={`/shop/${line.productId}`} className="font-semibold hover:underline">
            {line.productName}
          </Link>
          {details.length > 0 && (
            <ul className="mt-1 flex flex-col gap-0.5 text-sm text-muted-foreground">
              {details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          )}
          {/* Plain unit price, no units. Size-priced lines skip it: a bare per-sq.ft. price would
              read as a wrong total, and the line total on the right covers it. */}
          {!line.pricing ? (
            <p className="mt-1 text-sm text-muted-foreground">Price on request</p>
          ) : (
            !line.pricing.width && (
              <p className="mt-1 text-sm text-muted-foreground tabular-nums">{formatCurrency(line.pricing.unitPrice)}</p>
            )
          )}
          <LineNote line={line} />
        </div>
        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
          <p className="order-2 font-semibold tabular-nums sm:order-1">
            {total === null ? <span className="text-sm font-medium text-muted-foreground">Quote needed</span> : formatCurrency(total)}
          </p>
          <div className="order-1 flex items-center gap-2 sm:order-2">
            <div className="w-32">
              <QuantityInput
                aria-label={`Quantity for ${line.productName}`}
                value={String(line.quantity)}
                onChange={(value) => {
                  const next = Number(value)
                  if (Number.isFinite(next) && next >= 1) setQuantity(line.key, next)
                }}
                className="h-9"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Remove ${line.productName}`}
              onClick={() => removeLine(line.key)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2Icon />
            </Button>
          </div>
        </div>
      </div>
    </li>
  )
}

function OrderSummary() {
  const { subtotal, itemCount, quoteLineCount, clear } = useCart()

  return (
    <aside className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] lg:sticky lg:top-24">
      <h2 className="text-lg font-semibold">Order summary</h2>
      <dl className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Items</dt>
          <dd className="tabular-nums">{itemCount}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd className="tabular-nums">{formatCurrency(subtotal)}</dd>
        </div>
        {quoteLineCount > 0 && (
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Price on request</dt>
            <dd className="tabular-nums">{pluralize(quoteLineCount, "item")}</dd>
          </div>
        )}
      </dl>
      <Separator />
      <div className="flex items-baseline justify-between">
        <span className="font-semibold">Estimated total</span>
        <span className="text-2xl font-bold tracking-tight tabular-nums">{formatCurrency(subtotal)}</span>
      </div>
      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <InfoIcon className="mt-px size-3.5 shrink-0" />
        {quoteLineCount > 0
          ? "Items marked “Quote needed” aren't included. We'll confirm the final price with you."
          : "Final price is confirmed by DG Prints when your order is processed."}
      </p>
      <div className="flex flex-col gap-2">
        {/* Below lg this button lives in MobileCheckoutBar instead. */}
        <Button variant="gradient" size="lg" className="hidden h-11 lg:inline-flex" render={<Link to="/checkout" />} nativeButton={false}>
          Proceed to checkout
          <ArrowRightIcon />
        </Button>
        <Button variant="ghost" size="lg" className="h-11" render={<Link to="/shop" />} nativeButton={false}>
          <ArrowLeftIcon />
          Continue shopping
        </Button>
        <Button variant="ghost" size="lg" className="h-11 text-muted-foreground hover:text-destructive" onClick={clear}>
          <Trash2Icon />
          Clear cart
        </Button>
      </div>
    </aside>
  )
}

/** Estimated total + checkout, pinned to the bottom of the screen on mobile. */
function MobileCheckoutBar() {
  const { subtotal, itemCount, quoteLineCount } = useCart()

  return (
    <MobileActionBar>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">
          Estimated total · {pluralize(itemCount, "item")}
          {quoteLineCount > 0 && " + quote"}
        </p>
        <p className="text-lg leading-tight font-bold tracking-tight tabular-nums">{formatCurrency(subtotal)}</p>
      </div>
      <Button variant="gradient" size="lg" className="h-12 gap-2 px-5" render={<Link to="/checkout" />} nativeButton={false}>
        Checkout
        <ArrowRightIcon />
      </Button>
    </MobileActionBar>
  )
}

export function CartPage() {
  const { lines, lineCount } = useCart()

  if (lineCount === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Empty className="border border-border bg-card py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShoppingBagIcon />
            </EmptyMedia>
            <EmptyTitle>Your cart is empty</EmptyTitle>
            <EmptyDescription>Browse the shop and add products to build your order.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="gradient" size="lg" className="h-11 px-5" render={<Link to="/shop" />} nativeButton={false}>
              Shop now
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Your cart</h1>
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8">
        <section aria-label="Cart items" className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:p-6">
          <ul className="divide-y divide-border">
            {lines.map((line) => (
              <CartLineItem key={line.key} line={line} />
            ))}
          </ul>
        </section>
        <OrderSummary />
        <MobileCheckoutBar />
      </div>
    </div>
  )
}
