import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return <AccordionPrimitive.Root data-slot="accordion" className={cn("flex flex-col gap-4", className)} {...props} />
}

/** A raised clay card that presses into the surface while it's open. */
function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "rounded-[24px] bg-card/80 shadow-clay-card backdrop-blur-xl transition-[background-color,box-shadow] duration-300 data-open:bg-clay-well data-open:shadow-clay-pressed motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

function AccordionTrigger({ className, children, ...props }: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger flex min-h-16 flex-1 cursor-pointer items-center justify-between gap-4 rounded-[24px] px-5 py-4 text-left font-heading text-base font-extrabold text-foreground outline-none focus-visible:ring-4 focus-visible:ring-primary/30 sm:px-7 sm:text-lg",
          className
        )}
        {...props}
      >
        {children}
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-card text-primary shadow-clay-card transition-transform duration-300 group-data-panel-open/accordion-trigger:rotate-180 motion-reduce:transition-none">
          <ChevronDownIcon className="size-5" aria-hidden />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionPanel({ className, children, ...props }: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-panel"
      className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-300 ease-out data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none"
      {...props}
    >
      <div className={cn("px-5 pb-6 leading-relaxed font-medium text-muted-foreground sm:px-7", className)}>{children}</div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionPanel }
