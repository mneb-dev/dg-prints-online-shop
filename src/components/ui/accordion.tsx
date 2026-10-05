import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return <AccordionPrimitive.Root data-slot="accordion" className={cn("flex flex-col divide-y divide-slate-100 overflow-hidden surface", className)} {...props} />
}

/** A row in the accordion surface; open rows get a faint indigo wash. */
function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "transition-colors duration-200 data-open:bg-indigo-50/40",
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
          "group/accordion-trigger flex min-h-16 flex-1 cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-foreground transition-colors outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset sm:px-6",
          className
        )}
        {...props}
      >
        {children}
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-primary transition-transform duration-300 group-data-panel-open/accordion-trigger:rotate-180 motion-reduce:transition-none">
          <ChevronDownIcon className="size-4" aria-hidden />
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
      <div className={cn("max-w-2xl px-5 pb-5 leading-relaxed text-muted-foreground sm:px-6", className)}>{children}</div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionPanel }
