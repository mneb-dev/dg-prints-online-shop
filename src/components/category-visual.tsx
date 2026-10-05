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
// Each rule also carries a one-line blurb for the landing page's category cards.
const CATEGORY_ICON_RULES: Array<{ pattern: RegExp; icon: LucideIcon; blurb: string }> = [
  { pattern: /sticker|label|decal/i, icon: StickerIcon, blurb: "Labels, decals and die-cut stickers" },
  { pattern: /tarp|banner|streamer/i, icon: FlagIcon, blurb: "Tarpaulins, banners and streamers" },
  { pattern: /sintra|board|signage|acrylic/i, icon: LayersIcon, blurb: "Signage, boards and acrylic" },
  { pattern: /3d/i, icon: BoxIcon, blurb: "Custom 3D-printed pieces" },
  { pattern: /shirt|dtf|apparel|merch|tote/i, icon: ShirtIcon, blurb: "Shirts, totes and merch" },
  { pattern: /card|id|invitation/i, icon: IdCardIcon, blurb: "Cards, IDs and invitations" },
]

const DEFAULT_BLURB = "Made to order, priced upfront"

function categoryRule(category: string) {
  return CATEGORY_ICON_RULES.find((rule) => rule.pattern.test(category))
}

function categoryIcon(category: string): LucideIcon {
  return categoryRule(category)?.icon ?? PrinterIcon
}

/** A short line describing what a category covers, e.g. "Labels, decals and die-cut stickers". */
export function categoryBlurb(category: string): string {
  return categoryRule(category)?.blurb ?? DEFAULT_BLURB
}

export function CategoryIcon({ category, ...props }: { category: string } & LucideProps) {
  return createElement(categoryIcon(category), props)
}

/** Brand-spectrum gradient pairs (indigo, violet, sky, emerald) — a category always lands on the same
 *  one, so a grid of mixed products gets variety while staying on-palette. */
const TILE_GRADIENTS = [
  "linear-gradient(135deg, #6366F1, #4F46E5)",
  "linear-gradient(135deg, #8B5CF6, #6D28D9)",
  "linear-gradient(135deg, #38BDF8, #4F46E5)",
  "linear-gradient(135deg, #34D399, #0D9488)",
  "linear-gradient(135deg, #818CF8, #7C3AED)",
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
      {/* Soft top-left highlight + faint dot texture for a little depth. */}
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
