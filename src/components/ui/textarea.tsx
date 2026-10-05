import * as React from "react"

import { fieldClassName } from "@/components/ui/input"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(fieldClassName, "flex field-sizing-content min-h-24 rounded-[20px] py-4", className)}
      {...props}
    />
  )
}

export { Textarea }
