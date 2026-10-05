import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/** Shared landing section header: uppercase eyebrow, big Nunito title, optional lead and action. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  action,
  align = "start",
  id,
  className,
}: {
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  action?: ReactNode
  align?: "start" | "center"
  /** Id for the title, so the section can be `aria-labelledby` it. */
  id?: string
  className?: string
}) {
  const centered = align === "center"

  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-5 sm:mb-14",
        centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className={cn("max-w-2xl", centered && "mx-auto")}>
        <p className="mb-3 font-heading text-sm font-extrabold tracking-widest text-primary uppercase">{eyebrow}</p>
        <h2 id={id} className="text-3xl leading-[1.1] font-black tracking-tight text-balance sm:text-4xl md:text-5xl">
          {title}
        </h2>
        {lead && <p className="mt-4 text-base leading-relaxed font-medium text-pretty text-muted-foreground sm:text-lg">{lead}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
