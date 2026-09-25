import { useMemo } from "react"

import {
  MAX_LINE_QUANTITY,
  MAX_NOTE_LENGTH,
  cartCleared,
  lineAdded,
  lineNoteSet,
  lineQuantitySet,
  lineRemoved,
  type CartLine,
  type NewCartLine,
  type SelectedOption,
} from "@/lib/cart-slice"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { computeLineTotal } from "@/lib/pricing-resolver"

export { MAX_LINE_QUANTITY, MAX_NOTE_LENGTH, type CartLine, type NewCartLine, type SelectedOption }

/** null for a price-on-request line. */
export function lineTotal(line: CartLine): number | null {
  return line.pricing ? computeLineTotal(line.pricing, line.quantity) : null
}

/** Facade over the cart slice — the only way components read or change the cart. */
export function useCart() {
  const dispatch = useAppDispatch()
  const lines = useAppSelector((state) => state.cart.lines)

  const summary = useMemo(() => {
    let subtotal = 0
    let itemCount = 0
    let quoteLineCount = 0
    for (const line of lines) {
      itemCount += line.quantity
      const total = lineTotal(line)
      if (total === null) quoteLineCount += 1
      else subtotal += total
    }
    return { subtotal, itemCount, lineCount: lines.length, quoteLineCount }
  }, [lines])

  return {
    lines,
    ...summary,
    addLine: (line: NewCartLine) => dispatch(lineAdded(line)),
    setQuantity: (key: string, quantity: number) => dispatch(lineQuantitySet({ key, quantity })),
    setNote: (key: string, note: string) => dispatch(lineNoteSet({ key, note })),
    removeLine: (key: string) => dispatch(lineRemoved(key)),
    clear: () => dispatch(cartCleared()),
  }
}
