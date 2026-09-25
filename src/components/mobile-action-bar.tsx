import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/** Action bar pinned to the bottom of the screen below \`lg\`, keeping the page's main button in
 *  thumb reach. While one is mounted, \`body:has([data-mobile-action-bar])\` in index.css pads the
 *  page so nothing (including the footer) ends up hidden behind it. */
export function MobileActionBar({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      data-mobile-action-bar
      className="fixed inset-x-0 bottom-0 z-40 animate-in border-t border-border/70 bg-background/90 shadow-[0_-4px_16px_-8px_rgb(0_0_0/0.15)] backdrop-blur-md duration-300 slide-in-from-bottom-4 fade-in-0 supports-[backdrop-filter]:bg-background/80 motion-reduce:animate-none lg:hidden"
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center gap-3 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}
