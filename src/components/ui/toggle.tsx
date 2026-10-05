import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"

import { cn } from "@/lib/utils"

function Toggle({ className, ...props }: TogglePrimitive.Props<string>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(
        "inline-flex h-11 shrink-0 cursor-pointer items-center justify-center rounded-[20px] bg-card px-5 text-sm font-bold whitespace-nowrap shadow-clay-card transition-[translate,scale,box-shadow,background-color,color] duration-200 outline-none select-none hover:-translate-y-0.5 hover:shadow-clay-card-hover focus-visible:ring-4 focus-visible:ring-primary/30 active:scale-[0.92] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 data-[pressed]:translate-y-0 data-[pressed]:bg-clay-well data-[pressed]:text-primary data-[pressed]:shadow-clay-pressed motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100",
        className
      )}
      {...props}
    />
  )
}

export { Toggle }
