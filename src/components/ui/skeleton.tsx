import { cn } from "@/lib/utils"

/** A slate block that pulses while content loads. */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-lg bg-slate-200/70 motion-reduce:animate-none", className)}
      {...props}
    />
  )
}

export { Skeleton }
