import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Rounded pills: semibold, on soft tinted backgrounds.
const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full px-2.5 text-xs font-semibold whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&>svg]:pointer-events-none [&>svg]:size-3.5!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        soft: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100 ring-inset",
        ink: "bg-slate-900 text-white",
        glass: "bg-white/90 text-slate-700 shadow-soft ring-1 ring-slate-200/70 backdrop-blur-md ring-inset",
        success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 ring-inset",
        warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-100 ring-inset",
        plain: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
