import { createElement, type ReactNode } from "react"
import {
  BoxIcon,
  FlagIcon,
  IdCardIcon,
  LayersIcon,
  PrinterIcon,
  ShirtIcon,
  StickerIcon,
  type LucideIcon,
  type LucideProps,
} from "lucide-react"

import { cn } from "@/lib/utils"

// Categories are admin-managed free text (and get renamed), so match on keywords, not exact names.
const CATEGORY_ICON_RULES: Array<{ pattern: RegExp; icon: LucideIcon }> = [
  { pattern: /sticker|label|decal/i, icon: StickerIcon },
  { pattern: /tarp|banner|streamer/i, icon: FlagIcon },
  { pattern: /sintra|board|signage|acrylic/i, icon: LayersIcon },
  { pattern: /3d/i, icon: BoxIcon },
  { pattern: /shirt|dtf|apparel|merch|tote/i, icon: ShirtIcon },
  { pattern: /card|id|invitation/i, icon: IdCardIcon },
]

function categoryIcon(category: string): LucideIcon {
  return CATEGORY_ICON_RULES.find((rule) => rule.pattern.test(category))?.icon ?? PrinterIcon
}

export function CategoryIcon({ category, ...props }: { category: string } & LucideProps) {
  return createElement(categoryIcon(category), props)
}

/** Candy-shop gradient pairs (light 400 → saturated 600) — a category always lands on the same one,
 *  so a grid of mixed products gets variety while staying on-palette. */
const TILE_GRADIENTS = [
  "linear-gradient(135deg, #A78BFA, #7C3AED)",
  "linear-gradient(135deg, #F472B6, #DB2777)",
  "linear-gradient(135deg, #38BDF8, #0284C7)",
  "linear-gradient(135deg, #34D399, #059669)",
  "linear-gradient(135deg, #FBBF24, #D97706)",
]

function hash(text: string): number {
  let value = 0
  for (const char of text) value = (value * 31 + char.charCodeAt(0)) >>> 0
  return value
}

/** Fallback product visual for products without images (see ProductVisual), and the category
 *  art on the landing page: a gradient tile with the category's icon. `children` overlay it. */
export function CategoryTile({
  category,
  className,
  iconClassName,
  children,
}: {
  category: string
  className?: string
  iconClassName?: string
  children?: ReactNode
}) {
  return (
    <div
      aria-hidden
      className={cn("relative flex items-center justify-center overflow-hidden text-white", className)}
      style={{ backgroundImage: TILE_GRADIENTS[hash(category) % TILE_GRADIENTS.length] }}
    >
      {/* Soft top-left highlight + faint dot texture so the gradient reads as a moulded surface. */}
      <div className="absolute -top-1/3 -left-1/4 size-3/4 rounded-full bg-white/25 blur-2xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle,oklch(1_0_0/0.14)_1px,transparent_1px)] [background-size:14px_14px]" />
      <CategoryIcon
        category={category}
        className={cn("relative size-12 drop-shadow-md", iconClassName)}
        strokeWidth={1.75}
      />
      {children}
    </div>
  )
}
