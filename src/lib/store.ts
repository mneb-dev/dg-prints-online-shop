import { configureStore } from "@reduxjs/toolkit"

import cartReducer from "@/lib/cart-slice"
import catalogReducer from "@/lib/catalog-slice"
import checkoutReducer from "@/lib/checkout-slice"
import { subscribeToLocalStorage } from "@/lib/persist-subscribe"
import shopSettingsReducer from "@/lib/shop-settings-slice"
import themeReducer from "@/lib/theme-slice"

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    catalog: catalogReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    shopSettings: shopSettingsReducer,
  },
})

subscribeToLocalStorage(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
