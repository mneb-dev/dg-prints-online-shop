import { cn } from "@/lib/utils"

/** Shared looks for things you pick from a set (category filters, product options, payment methods),
 *  so every selectable control in the shop reads the same. Pair with `aria-pressed` / a radio input. */

const focus = "outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"

/** Pill chip: white with a hairline border; the picked one takes the brand gradient. */
export function chipClassName(selected: boolean, className?: string) {
  return cn(
    "inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-4 text-sm font-semibold whitespace-nowrap transition-all duration-200 ease-out",
    focus,
    selected
      ? "border-transparent bg-brand-gradient text-white shadow-cta"
      : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-primary",
    className
  )
}

/** Option card: a bordered tile; the picked one gets an indigo outline and wash. */
export function optionCardClassName(selected: boolean, className?: string) {
  return cn(
    "cursor-pointer rounded-lg border p-4 text-left transition-all duration-200 ease-out",
    focus,
    selected
      ? "border-indigo-500 bg-indigo-50/60 ring-1 ring-indigo-500"
      : "border-slate-200 bg-white hover:border-indigo-200 hover:shadow-soft",
    className
  )
}
