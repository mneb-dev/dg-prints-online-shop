import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

/** White field with a hairline slate border, shared by Input, Textarea and the Select trigger.
 *  Focus draws an indigo border and ring. */
const fieldClassName =
  "w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3.5 text-base text-foreground shadow-xs transition-[border-color,box-shadow] duration-200 outline-none placeholder:text-slate-400 hover:border-slate-300 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/25"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        fieldClassName,
        "h-12 file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Input, fieldClassName }
