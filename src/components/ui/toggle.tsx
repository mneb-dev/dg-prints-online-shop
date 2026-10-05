import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"

import { cn } from "@/lib/utils"

function Toggle({ className, ...props }: TogglePrimitive.Props<string>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(
        "inline-flex h-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium whitespace-nowrap text-slate-700 transition-all duration-200 ease-out outline-none select-none hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 data-[pressed]:border-indigo-500 data-[pressed]:bg-indigo-50 data-[pressed]:font-semibold data-[pressed]:text-indigo-700 data-[pressed]:ring-1 data-[pressed]:ring-indigo-500",
        className
      )}
      {...props}
    />
  )
}

export { Toggle }
