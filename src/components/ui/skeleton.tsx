import { cn } from "@/lib/utils"

/** A recessed clay well that pulses while content loads. */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-[20px] bg-clay-well shadow-clay-pressed motion-reduce:animate-none", className)}
      {...props}
    />
  )
}

export { Skeleton }
