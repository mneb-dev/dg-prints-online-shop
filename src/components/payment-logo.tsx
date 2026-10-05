import { useState } from "react"
import { WalletIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Per payment option (keyed by PayMongo type): its icon in `public/payment-logos/<type>-icon.svg` —
 * square crops of the official marks from Wikimedia Commons (see ATTRIBUTION.txt there) — the tile
 * colour it sits on (fixed, so it reads the same in light and dark mode), and a one-line hint.
 */
const PAYMENT_META: Record<string, { tile: string; hint: string }> = {
  gcash: { tile: "#ffffff", hint: "Pay with your GCash app" },
  paymaya: { tile: "#000000", hint: "Pay with your Maya app" },
}

export function paymentHint(type: string): string {
  return PAYMENT_META[type]?.hint ?? "Pay online through PayMongo"
}

/** A payment option's small icon tile, so buyers spot GCash/Maya at a glance. A wallet icon stands
 *  in for options without one (or if the file fails to load). */
export function PaymentIcon({ type, className }: { type: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  const meta = PAYMENT_META[type]
  const tile = cn("flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-clay-card", className)

  if (!meta || failed) {
    return (
      <span aria-hidden className={cn(tile, "bg-muted text-muted-foreground")}>
        <WalletIcon className="size-5" />
      </span>
    )
  }

  return (
    <span aria-hidden className={tile} style={{ backgroundColor: meta.tile }}>
      <img src={`/payment-logos/${type}-icon.svg`} alt="" className="size-7 object-contain" onError={() => setFailed(true)} />
    </span>
  )
}
