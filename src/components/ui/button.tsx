import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Clay buttons: chunky, super-rounded, lift on hover and squish when pressed. Every variant shares
// the physics; only the surface changes. All sizes meet the 44px touch target.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-[20px] border border-transparent bg-clip-padding font-bold tracking-wide whitespace-nowrap transition-[translate,scale,box-shadow,background-color,color,border-color] duration-200 outline-none select-none hover:-translate-y-1 focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.92] active:not-aria-[haspopup]:translate-y-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-4 aria-invalid:ring-destructive/25 motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default:
          "bg-brand-gradient text-primary-foreground shadow-clay-button hover:shadow-clay-button-hover active:shadow-clay-pressed",
        secondary:
          "bg-card text-foreground shadow-clay-card hover:shadow-clay-card-hover active:shadow-clay-pressed aria-expanded:bg-clay-well aria-expanded:shadow-clay-pressed",
        outline:
          "border-2 border-primary/20 bg-transparent text-primary hover:border-primary hover:bg-primary/5 aria-expanded:border-primary aria-expanded:bg-primary/5",
        ghost:
          "text-foreground hover:bg-primary/10 hover:text-primary aria-expanded:bg-primary/10 aria-expanded:text-primary",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/15 focus-visible:ring-destructive/25 active:shadow-clay-pressed",
      },
      size: {
        sm: "h-11 gap-2 px-5 text-sm [&_svg:not([class*='size-'])]:size-4",
        default: "h-14 gap-2 px-7 text-base",
        lg: "h-16 gap-2.5 px-8 text-lg",
        icon: "size-11 rounded-full",
        "icon-sm": "size-11 rounded-2xl [&_svg:not([class*='size-'])]:size-4",
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
