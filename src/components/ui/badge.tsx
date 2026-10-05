import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Clay pills: always fully round, Nunito, and bold enough to read at badge size.
const badgeVariants = cva(
  "group/badge inline-flex h-7 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full px-3 font-heading text-xs font-extrabold whitespace-nowrap transition-[background-color,box-shadow] outline-none focus-visible:ring-4 focus-visible:ring-primary/30 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&>svg]:pointer-events-none [&>svg]:size-3.5!",
  {
    variants: {
      variant: {
        default: "bg-brand-gradient text-primary-foreground shadow-clay-button",
        soft: "bg-accent text-accent-foreground",
        ink: "bg-foreground text-background",
        glass: "bg-card/90 text-foreground backdrop-blur-md",
        success: "bg-clay-emerald/15 text-emerald-700",
        warning: "bg-clay-amber/15 text-amber-700",
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
