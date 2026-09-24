import { ArrowLeftIcon, InfoIcon, ShoppingBagIcon, Trash2Icon } from "lucide-react"
import { Link } from "react-router-dom"

import { CategoryTile } from "@/components/category-visual"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { QuantityInput } from "@/components/ui/quantity-input"
import { Separator } from "@/components/ui/separator"
import { lineTotal, useCart, type CartLine } from "@/lib/cart"
import { unitSuffix } from "@/lib/pricing-resolver"
import { formatCurrency, pluralize } from "@/lib/utils"

function lineDetails(line: CartLine): string[] {
  const details = line.selectedOptions.map((option) => `${option.name}: ${option.value}`)
  if (line.pricing?.packageName && !line.selectedOptions.some((option) => option.value === line.pricing?.packageName)) {
    details.push(`Package: ${line.pricing.packageName}`)
  }
  if (line.pricing?.width && line.pricing.height) {
    details.push(`Size: ${line.pricing.width} × ${line.pricing.height} ft`)
  }
  return details
}

function CartLineItem({ line }: { line: CartLine }) {
  const { setQuantity, removeLine } = useCart()
  const total = lineTotal(line)
  const details = lineDetails(line)

  return (
    <li className="flex gap-4 py-5 first:pt-0 last:pb-0">
      <Link to={`/shop/${line.productId}`} className="shrink-0 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
        <CategoryTile category={line.category} className="size-20 rounded-lg sm:size-24" iconClassName="size-8" />
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
          <p className="mt-1 text-sm text-muted-foreground tabular-nums">
            {line.pricing ? (
              <>
                {formatCurrency(line.pricing.unitPrice)}
                {unitSuffix(line.pricing)}
              </>
            ) : (
              "Price on request"
            )}
          </p>
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
        <Button variant="outline" size="lg" className="h-11" render={<Link to="/shop" />} nativeButton={false}>
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
      </div>
    </div>
  )
}
