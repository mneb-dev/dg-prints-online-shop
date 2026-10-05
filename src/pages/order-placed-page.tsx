import { useEffect } from "react"
import { CheckIcon } from "lucide-react"
import { Link, Navigate, useLocation } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart"
import type { PlacedOrder } from "@/lib/checkout"
import { formatCurrency } from "@/lib/utils"

/** The "thank you" view: after a pay-later order, or (`paid`) once a PayMongo payment is confirmed. */
export function OrderConfirmation({ orderNumber, total, paid = false }: PlacedOrder & { paid?: boolean }) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center sm:px-6">
      <div className="mb-6 flex size-16 animate-in items-center justify-center rounded-full bg-brand-gradient text-white shadow-[var(--shadow-button)] duration-300 zoom-in-50 motion-reduce:animate-none">
        <CheckIcon className="size-8 stroke-3" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight">{paid ? "Payment received!" : "Order placed!"}</h1>
      <p className="mt-2 text-muted-foreground">Thank you for ordering from DG Prints.</p>

      <dl className="mt-8 grid w-full grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border text-left">
        <div className="bg-card p-4">
          <dt className="text-xs text-muted-foreground">Order number</dt>
          <dd className="mt-0.5 text-lg font-semibold tabular-nums">{orderNumber}</dd>
        </div>
        <div className="bg-card p-4">
          <dt className="text-xs text-muted-foreground">{paid ? "Amount paid" : "Total"}</dt>
          <dd className="mt-0.5 text-lg font-semibold tabular-nums">{formatCurrency(total)}</dd>
        </div>
      </dl>

      <p className="mt-6 text-sm text-muted-foreground">
        {paid
          ? "Your order is paid and in our queue. We'll message or call you about your order — keep your order number handy."
          : "We'll message or call you to confirm your order and arrange payment. Keep your order number handy."}
      </p>

      <Button variant="clay" size="clay-sm" className="mt-8 px-6" render={<Link to="/shop" />} nativeButton={false}>
        Continue shopping
      </Button>
    </div>
  )
}

/** Shown after a pay-later checkout succeeds; the order number arrives via router state. */
export function OrderPlacedPage() {
  const placed = useLocation().state as PlacedOrder | null
  const { clear } = useCart()

  // Clear here rather than before navigating, so the checkout page never flashes an empty cart.
  useEffect(() => {
    if (placed) clear()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!placed) return <Navigate to="/" replace />

  return <OrderConfirmation orderNumber={placed.orderNumber} total={placed.total} />
}
