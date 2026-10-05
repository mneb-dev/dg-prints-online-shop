import type { Store } from "@reduxjs/toolkit"

import { CART_STORAGE_KEY, type CartState } from "@/lib/cart-slice"

type PersistedState = {
  cart: CartState
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
    prev = state
  })
}
