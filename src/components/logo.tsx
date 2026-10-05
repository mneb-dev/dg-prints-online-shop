import dgPrintsLogo from "@/assets/images/dg-prints-logo.png"
import dgPrintsLogoDark from "@/assets/images/dg-prints-logo-dark.png"
import { cn } from "@/lib/utils"

/** The "DG Prints" logo mark (gradient DG monogram + PRINTS wordmark, baked into one image).
 * `onDark` swaps in the light-wordmark version for dark sections. Sized by the caller via `className`. */
export function Logo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return <img src={onDark ? dgPrintsLogoDark : dgPrintsLogo} alt="DG Prints" className={cn("object-contain", className)} />
}
