import type { ComponentType } from "react"
import type { LucideProps } from "lucide-react"

import { cn } from "@/lib/utils"

/** Soft tinted tile + saturated icon, per tone. */
const TONES = {
  indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
  violet: "bg-violet-50 text-violet-600 ring-violet-100",
  emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  amber: "bg-amber-50 text-amber-600 ring-amber-100",
  sky: "bg-sky-50 text-sky-600 ring-sky-100",
} as const

const SIZES = {
  sm: "size-10 rounded-lg [&_svg]:size-5",
  md: "size-12 rounded-xl [&_svg]:size-5",
  lg: "size-14 rounded-xl [&_svg]:size-6",
} as const

export type IconBadgeTone = keyof typeof TONES

/** Icon in a soft-coloured tile (bg-indigo-50 text-indigo-600 by default). `round` makes it a circle;
 *  `glow` switches to a solid gradient tile with an indigo glow, for numbered steps and highlights. */
export function IconBadge({
  icon: Icon,
  tone = "indigo",
  size = "md",
  round = false,
  glow = false,
  className,
}: {
  icon: ComponentType<LucideProps>
  tone?: IconBadgeTone
  size?: keyof typeof SIZES
  round?: boolean
  glow?: boolean
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center",
        SIZES[size],
        glow ? "bg-brand-gradient text-white shadow-glow" : cn("ring-1 ring-inset", TONES[tone]),
        round && "rounded-full",
        className
      )}
    >
      <Icon strokeWidth={2} />
    </span>
  )
}
