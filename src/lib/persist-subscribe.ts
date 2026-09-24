import type { Store } from "@reduxjs/toolkit"

import { CART_STORAGE_KEY, type CartState } from "@/lib/cart-slice"
import { THEME_STORAGE_KEY, type ThemeState } from "@/lib/theme-slice"

type PersistedState = {
  cart: CartState
  theme: ThemeState
}

function safeWrite(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Storage full or blocked — the in-memory state still works for this visit.
  }
}

export function subscribeToLocalStorage(store: Store<PersistedState>) {
  let prev = store.getState()

  store.subscribe(() => {
    const state = store.getState()
    if (state.cart !== prev.cart) safeWrite(CART_STORAGE_KEY, JSON.stringify(state.cart.lines))
    if (state.theme !== prev.theme) safeWrite(THEME_STORAGE_KEY, state.theme.theme)
    prev = state
  })
}
