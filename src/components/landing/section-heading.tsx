import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/** Shared section header: an indigo eyebrow pill, a bold title whose `highlight` tail is set in the
 *  brand gradient, and an optional lead and action. */
export function SectionHeading({
  eyebrow,
  title,
  highlight,
  lead,
  action,
  align = "start",
  id,
  className,
}: {
  eyebrow: string
  title: ReactNode
  /** Trailing words rendered in gradient text, e.g. title "Printing," highlight "made simple". */
  highlight?: string
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
      <div className={cn("max-w-2xl", centered && "mx-auto flex flex-col items-center")}>
        <p className="mb-4 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-700 uppercase ring-1 ring-indigo-100 ring-inset">
          {eyebrow}
        </p>
        <h2 id={id} className="text-3xl sm:text-4xl lg:text-5xl">
          {title}
          {highlight && (
            <>
              {" "}
              <span className="text-brand-gradient">{highlight}</span>
            </>
          )}
        </h2>
        {lead && <p className="mt-4 max-w-xl text-base text-pretty text-muted-foreground sm:text-lg">{lead}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
