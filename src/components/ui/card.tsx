import * as React from "react"

import { cn } from "@/lib/utils"

/** Glass-clay card: a blurred white surface floating over the background blobs. `interactive` cards
 *  float up towards the viewer on hover. Children render above any absolutely-positioned decoration. */
function Card({
  className,
  size = "default",
  interactive = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  size?: "default" | "sm"
  interactive?: boolean
}) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card relative overflow-hidden clay-panel text-sm text-card-foreground transition-[translate,box-shadow] duration-500 [--card-spacing:--spacing(6)] sm:[--card-spacing:--spacing(8)] data-[size=sm]:[--card-spacing:--spacing(4)] sm:data-[size=sm]:[--card-spacing:--spacing(5)]",
        interactive && "hover:-translate-y-2 hover:shadow-clay-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className
      )}
      {...props}
    >
      <div className="relative z-10 flex h-full flex-col gap-(--card-spacing) py-(--card-spacing) has-data-[slot=card-footer]:pb-0">
        {children}
      </div>
    </div>
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-xl leading-snug font-extrabold tracking-tight group-data-[size=sm]/card:text-lg",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm leading-relaxed font-medium text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        // In a narrow header (phones, narrow grid columns) the action drops onto its own row under
        // the title instead of squeezing it; the auto column then collapses to nothing.
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end @max-sm/card-header:col-span-full @max-sm/card-header:col-start-1 @max-sm/card-header:row-span-1 @max-sm/card-header:row-start-auto @max-sm/card-header:mt-2 @max-sm/card-header:justify-self-start",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--card-spacing)", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "m-2 flex items-center clay-well p-(--card-spacing) sm:m-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
