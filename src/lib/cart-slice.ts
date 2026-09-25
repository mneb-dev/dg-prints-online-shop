import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import type { LinePricing } from "@/lib/pricing-resolver"

const CART_STORAGE_KEY = "dgprints_shop_cart"
export const MAX_LINE_QUANTITY = 9999
/** Same limit the portal enforces on order item notes. */
export const MAX_NOTE_LENGTH = 60

export type SelectedOption = { name: string; value: string }

export type CartLine = {
  /** Identity of this exact configuration — adding the same product/options/size again merges. */
  key: string
  productId: string
  productName: string
  category: string
  /** Main image at the time it was added. Optional: carts persisted before images existed lack it. */
  imageUrl?: string
  selectedOptions: SelectedOption[]
  /** null for a "price on request" product (no pricing entries) — excluded from the total. */
  pricing: LinePricing | null
  quantity: number
  /** Buyer's instructions for this item, e.g. the name to print. "" when none. */
  note: string
  addedAt: string
}

type CartState = {
  lines: CartLine[]
}

export type NewCartLine = Omit<CartLine, "key" | "addedAt">

export function cartLineKey(line: Pick<CartLine, "productId" | "selectedOptions" | "pricing">): string {
  const options = line.selectedOptions.map((option) => `${option.name}=${option.value}`).join("|")
  const pricing = line.pricing
    ? `${line.pricing.packageName ?? ""}|${line.pricing.unitPrice}|${line.pricing.width ?? ""}x${line.pricing.height ?? ""}`
    : "manual"
  return `${line.productId}::${options}::${pricing}`
}

function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 1
  return Math.min(MAX_LINE_QUANTITY, Math.max(1, Math.floor(quantity)))
}

function cleanNote(note: string): string {
  return note.trim().slice(0, MAX_NOTE_LENGTH)
}

/** Carts saved before notes existed lack `note`. */
function normalizeLine(line: CartLine): CartLine {
  // Also trims notes saved while the limit was higher, so checkout doesn't reject them.
  return { ...line, note: typeof line.note === "string" ? cleanNote(line.note) : "" }
}

function isCartLine(value: unknown): value is CartLine {
  const line = value as CartLine | null
  return (
    !!line &&
    typeof line.key === "string" &&
    typeof line.productId === "string" &&
    typeof line.productName === "string" &&
    Array.isArray(line.selectedOptions) &&
    typeof line.quantity === "number"
  )
}

function getInitialLines(): CartLine[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isCartLine).map(normalizeLine) : []
  } catch {
    // Storage blocked or corrupt — start with an empty cart.
    return []
  }
}

const initialState: CartState = {
  lines: getInitialLines(),
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    lineAdded(state, action: PayloadAction<NewCartLine>) {
      const key = cartLineKey(action.payload)
      const existing = state.lines.find((line) => line.key === key)
      if (existing) {
        existing.quantity = clampQuantity(existing.quantity + action.payload.quantity)
        // Notes aren't part of the line's identity — keep both when they differ.
        const note = cleanNote(action.payload.note)
        if (note && note !== existing.note) existing.note = cleanNote(existing.note ? `${existing.note}\n${note}` : note)
        return
      }
      state.lines.push({
        ...action.payload,
        key,
        quantity: clampQuantity(action.payload.quantity),
        note: cleanNote(action.payload.note),
        addedAt: new Date().toISOString(),
      })
    },
    lineQuantitySet(state, action: PayloadAction<{ key: string; quantity: number }>) {
      const line = state.lines.find((candidate) => candidate.key === action.payload.key)
      if (line) line.quantity = clampQuantity(action.payload.quantity)
    },
    lineNoteSet(state, action: PayloadAction<{ key: string; note: string }>) {
      const line = state.lines.find((candidate) => candidate.key === action.payload.key)
      if (line) line.note = cleanNote(action.payload.note)
    },
    lineRemoved(state, action: PayloadAction<string>) {
      state.lines = state.lines.filter((line) => line.key !== action.payload)
    },
    cartCleared(state) {
      state.lines = []
    },
  },
})

export const { lineAdded, lineQuantitySet, lineNoteSet, lineRemoved, cartCleared } = cartSlice.actions
export default cartSlice.reducer
export { CART_STORAGE_KEY }
export type { CartState }
