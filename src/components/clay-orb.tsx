import type { ComponentType } from "react"
import type { LucideProps } from "lucide-react"

import { cn } from "@/lib/utils"

/** Candy-shop gradients for icon orbs: a light 400 into a saturated 600 of the same hue. */
const ORB_HUES = {
  violet: "from-violet-400 to-violet-600",
  pink: "from-pink-400 to-pink-600",
  sky: "from-sky-400 to-sky-600",
  emerald: "from-emerald-400 to-emerald-600",
  amber: "from-amber-400 to-amber-600",
  blue: "from-blue-400 to-blue-600",
} as const

export type OrbHue = keyof typeof ORB_HUES

/** A bulging clay icon container. Square (rounded-2xl) by default, or a circle with `round`. */
export function ClayOrb({
  icon: Icon,
  hue = "violet",
  round = false,
  className,
  iconClassName,
}: {
  icon: ComponentType<LucideProps>
  hue?: OrbHue
  round?: boolean
  className?: string
  iconClassName?: string
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-14 shrink-0 items-center justify-center bg-gradient-to-br text-white shadow-clay-button",
        round ? "rounded-full" : "rounded-2xl",
        ORB_HUES[hue],
        className
      )}
    >
      <Icon className={cn("size-6 drop-shadow-sm", iconClassName)} strokeWidth={2.25} />
    </span>
  )
}
