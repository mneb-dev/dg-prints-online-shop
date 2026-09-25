import { useEffect } from "react"
import { CheckIcon } from "lucide-react"
import { Link, Navigate, useLocation } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart"
import type { PlacedOrder } from "@/lib/checkout"
import { formatCurrency } from "@/lib/utils"

/** Shown after checkout succeeds; the order number arrives via router state. */
export function OrderPlacedPage() {
  const placed = useLocation().state as PlacedOrder | null
  const { clear } = useCart()

  // Clear here rather than before navigating, so the checkout page never flashes an empty cart.
  useEffect(() => {
    if (placed) clear()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!placed) return <Navigate to="/" replace />

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center sm:px-6">
      <div className="mb-6 flex size-16 animate-in items-center justify-center rounded-full bg-brand-gradient text-white shadow-[var(--shadow-button)] duration-300 zoom-in-50 motion-reduce:animate-none">
        <CheckIcon className="size-8 stroke-3" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight">Order placed!</h1>
      <p className="mt-2 text-muted-foreground">Thank you for ordering from DG Prints.</p>

      <dl className="mt-8 grid w-full grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border text-left">
        <div className="bg-card p-4">
          <dt className="text-xs text-muted-foreground">Order number</dt>
          <dd className="mt-0.5 text-lg font-semibold tabular-nums">{placed.orderNumber}</dd>
        </div>
        <div className="bg-card p-4">
          <dt className="text-xs text-muted-foreground">Total</dt>
          <dd className="mt-0.5 text-lg font-semibold tabular-nums">{formatCurrency(placed.total)}</dd>
        </div>
      </dl>

      <p className="mt-6 text-sm text-muted-foreground">
        We'll message or call you to confirm your order and arrange payment. Keep your order number handy.
      </p>

      <Button variant="gradient" size="lg" className="mt-8 h-11 px-6" render={<Link to="/shop" />} nativeButton={false}>
        Continue shopping
      </Button>
    </div>
  )
}
