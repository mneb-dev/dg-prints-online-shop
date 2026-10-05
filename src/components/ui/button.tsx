import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Corporate Trust buttons: crisp rounded-lg, a gradient primary that lifts on hover, and white
// secondaries with a hairline border. Every size meets the 44px touch target. Pass `rounded-full`
// for pill CTAs (hero, final CTA).
const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-clip-padding font-semibold whitespace-nowrap transition-all duration-200 ease-out outline-none select-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-2 aria-invalid:ring-destructive/40 motion-reduce:transition-colors [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4.5",
  {
    variants: {
      variant: {
        default:
          "bg-brand-gradient text-primary-foreground shadow-cta hover:-translate-y-0.5 hover:shadow-cta-hover motion-reduce:hover:translate-y-0",
        secondary:
          "border-slate-200 bg-card text-slate-700 shadow-xs hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 aria-expanded:border-slate-300 aria-expanded:bg-slate-50",
        outline:
          "border-indigo-200 bg-transparent text-primary hover:border-indigo-300 hover:bg-indigo-50 aria-expanded:bg-indigo-50",
        ghost:
          "text-slate-600 hover:bg-indigo-50 hover:text-primary aria-expanded:bg-indigo-50 aria-expanded:text-primary",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/15 focus-visible:ring-destructive/40",
      },
      size: {
        sm: "h-11 gap-1.5 px-4 text-sm [&_svg:not([class*='size-'])]:size-4",
        default: "h-12 gap-2 px-6 text-[0.95rem]",
        lg: "h-14 gap-2 px-8 text-base",
        icon: "size-11 rounded-full",
        "icon-sm": "size-11 [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
