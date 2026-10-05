import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

/** Clay recessed field, shared by Input, Textarea and the Select trigger: pressed into the surface,
 *  rising to a white face with a soft violet ring when focused. */
const fieldClassName =
  "w-full min-w-0 rounded-2xl border-0 bg-clay-well px-5 text-base text-foreground shadow-clay-pressed transition-[background-color,box-shadow] duration-200 outline-none placeholder:text-muted-foreground focus-visible:bg-card focus-visible:ring-4 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:bg-destructive/5 aria-invalid:ring-4 aria-invalid:ring-destructive/25"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        fieldClassName,
        "h-14 file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Input, fieldClassName }
