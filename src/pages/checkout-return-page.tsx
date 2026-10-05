import { useCallback, useEffect, useRef, useState } from "react"
import { ClockIcon, XCircleIcon } from "lucide-react"
import { Link, Navigate, useSearchParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { getErrorMessage } from "@/lib/api-error"
import { useCart } from "@/lib/cart"
import { fetchCheckoutStatus, type CheckoutStatus } from "@/lib/checkout"
import { OrderConfirmation } from "@/pages/order-placed-page"

const POLL_INTERVAL_MS = 2000
// PayMongo usually confirms within seconds; after this, stop polling and let the buyer refresh.
const POLL_TIMEOUT_MS = 30_000

type View = { kind: "checking" } | { kind: "error"; message: string } | ({ kind: "status" } & CheckoutStatus)

/** PayMongo sends the buyer here (`/checkout/return?id=<checkoutId>`) after paying. */
export function CheckoutReturnPage() {
  const checkoutId = useSearchParams()[0].get("id")
  const { clear } = useCart()
  // `clear` is a new function every render; keep it out of `check`'s deps so polling doesn't restart.
  const clearRef = useRef(clear)
  useEffect(() => {
    clearRef.current = clear
  })
  const [view, setView] = useState<View>({ kind: "checking" })
  const [polling, setPolling] = useState(true)
  const startedAt = useRef(Date.now())

  const check = useCallback(async () => {
    if (!checkoutId) return
    try {
      const status = await fetchCheckoutStatus(checkoutId)
      setView({ kind: "status", ...status })
      if (status.status === "paid") clearRef.current()
      if (status.status !== "pending" || Date.now() - startedAt.current > POLL_TIMEOUT_MS) setPolling(false)
    } catch (error) {
      setView({ kind: "error", message: getErrorMessage(error) })
      setPolling(false)
    }
  }, [checkoutId])

  useEffect(() => {
    if (!polling) return
    void check()
    const timer = window.setInterval(() => void check(), POLL_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [polling, check])

  function checkAgain() {
    startedAt.current = Date.now()
    setView({ kind: "checking" })
    setPolling(true)
  }

  if (!checkoutId) return <Navigate to="/" replace />

  if (view.kind === "status" && view.status === "paid") {
    return <OrderConfirmation orderNumber={view.orderNumber} total={view.total} paid />
  }

  const stillChecking = view.kind === "checking" || (view.kind === "status" && view.status === "pending" && polling)

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center sm:px-6">
      {stillChecking ? (
        <>
          <Spinner className="mb-6 size-10 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Confirming your payment…</h1>
          <p className="mt-2 text-muted-foreground">This only takes a few seconds. Please don't close this page.</p>
        </>
      ) : view.kind === "status" && view.status === "pending" ? (
        <>
          <ClockIcon className="mb-6 size-12 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">We haven't received your payment yet</h1>
          <p className="mt-2 text-muted-foreground">
            If you already paid, it can take a moment to come through — check again shortly. Otherwise you can go
            back and finish paying.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button variant="clay" size="clay-sm" className="px-6" onClick={checkAgain}>
              Check again
            </Button>
            <Button variant="clay-secondary" size="clay-sm" className="px-6" render={<a href={view.checkoutUrl} />} nativeButton={false}>
              Return to payment
            </Button>
          </div>
        </>
      ) : view.kind === "status" && view.status === "failed" ? (
        <>
          <XCircleIcon className="mb-6 size-12 text-destructive" />
          <h1 className="text-2xl font-bold tracking-tight">Payment wasn't completed</h1>
          <p className="mt-2 text-muted-foreground">
            The payment was cancelled or didn't go through, so you weren't charged and no order was placed. Your cart
            is still here — you can try again.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button variant="clay" size="clay-sm" className="px-6" render={<Link to="/checkout" />} nativeButton={false}>
              Back to checkout
            </Button>
          </div>
        </>
      ) : (
        <>
          <XCircleIcon className="mb-6 size-12 text-destructive" />
          <h1 className="text-2xl font-bold tracking-tight">
            {view.kind === "error" ? "Couldn't check your payment" : "This payment link has expired"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {view.kind === "error"
              ? view.message
              : "No order was placed and you weren't charged. Your cart is still saved — check out again to pay."}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {view.kind === "error" && (
              <Button variant="clay" size="clay-sm" className="px-6" onClick={checkAgain}>
                Try again
              </Button>
            )}
            <Button
              variant={view.kind === "error" ? "clay-secondary" : "clay"}
              size="clay-sm"
              className="px-6"
              render={<Link to="/cart" />}
              nativeButton={false}
            >
              Back to cart
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
