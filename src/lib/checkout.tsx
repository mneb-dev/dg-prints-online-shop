import { useCallback, useEffect } from "react"

import {
  fetchShipping,
  placeOrder,
  type CheckoutForm,
  type PlacedOrder,
  type PlaceOrderError,
  type Province,
  type ShippingInfo,
  type ShippingRegion,
} from "@/lib/checkout-slice"
import type { CartLine } from "@/lib/cart-slice"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"

export type { CheckoutForm, PlacedOrder, PlaceOrderError, Province, ShippingInfo, ShippingRegion }

export const REGION_LABELS: Record<ShippingRegion, string> = {
  luzon: "Luzon",
  visayas: "Visayas",
  mindanao: "Mindanao",
}

const FORM_STORAGE_KEY = "dgprints_shop_checkout"

export const EMPTY_CHECKOUT_FORM: CheckoutForm = {
  name: "",
  phone: "",
  street: "",
  barangay: "",
  city: "",
  province: "",
  zip: "",
}

/** Contact + address from this device's last order, so returning buyers don't retype them. */
export function loadSavedCheckoutForm(): CheckoutForm {
  try {
    const raw = localStorage.getItem(FORM_STORAGE_KEY)
    if (!raw) return EMPTY_CHECKOUT_FORM
    const saved = JSON.parse(raw) as Partial<CheckoutForm>
    const form = { ...EMPTY_CHECKOUT_FORM }
    for (const key of Object.keys(form) as (keyof CheckoutForm)[]) {
      if (typeof saved[key] === "string") form[key] = saved[key]
    }
    return form
  } catch {
    return EMPTY_CHECKOUT_FORM
  }
}

export function saveCheckoutForm(form: CheckoutForm) {
  try {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(form))
  } catch {
    // Storage blocked — the buyer just types it again next time.
  }
}

/** Facade over the checkout slice: shipping fees/provinces (fetched once) and placing the order. */
export function useCheckout() {
  const dispatch = useAppDispatch()
  const shipping = useAppSelector((state) => state.checkout.shipping)
  const submitting = useAppSelector((state) => state.checkout.submitStatus === "submitting")

  useEffect(() => {
    if (shipping.status === "idle") void dispatch(fetchShipping())
  }, [dispatch, shipping.status])

  const submit = useCallback(
    async (form: CheckoutForm, lines: CartLine[], website: string): Promise<PlacedOrder> =>
      dispatch(placeOrder({ form, lines, website })).unwrap(),
    [dispatch]
  )

  return {
    shipping: shipping.data,
    shippingStatus: shipping.status,
    retryShipping: () => dispatch(fetchShipping()),
    submitting,
    placeOrder: submit,
  }
}
