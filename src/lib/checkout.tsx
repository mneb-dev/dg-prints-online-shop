import { useCallback, useEffect } from "react"

import { apiClient } from "@/lib/api-client"
import {
  fetchPaymentMethods,
  fetchShipping,
  placeOrder,
  type CheckoutForm,
  type CheckoutStatus,
  type PaymentMethodOption,
  type PlacedOrder,
  type PlaceOrderResult,
  type PlaceOrderError,
  type Province,
  type ShippingInfo,
  type ShippingRegion,
} from "@/lib/checkout-slice"
import type { CartLine } from "@/lib/cart-slice"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"

export type {
  CheckoutForm,
  CheckoutStatus,
  PaymentMethodOption,
  PlacedOrder,
  PlaceOrderError,
  PlaceOrderResult,
  Province,
  ShippingInfo,
  ShippingRegion,
}

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

/** "Forget my details": removes the saved contact + address from this device (shared phones). */
export function clearSavedCheckoutForm() {
  try {
    localStorage.removeItem(FORM_STORAGE_KEY)
  } catch {
    // Storage blocked — nothing was saved to begin with.
  }
}

/** Facade over the checkout slice: shipping fees/provinces (fetched once) and placing the order. */
export function useCheckout() {
  const dispatch = useAppDispatch()
  const shipping = useAppSelector((state) => state.checkout.shipping)
  const paymentMethods = useAppSelector((state) => state.checkout.paymentMethods)
  const submitting = useAppSelector((state) => state.checkout.submitStatus === "submitting")

  useEffect(() => {
    if (shipping.status === "idle") void dispatch(fetchShipping())
  }, [dispatch, shipping.status])

  useEffect(() => {
    if (paymentMethods.status === "idle") void dispatch(fetchPaymentMethods())
  }, [dispatch, paymentMethods.status])

  const submit = useCallback(
    async (form: CheckoutForm, lines: CartLine[], website: string, paymentMethod?: string): Promise<PlaceOrderResult> =>
      dispatch(placeOrder({ form, lines, website, paymentMethod })).unwrap(),
    [dispatch]
  )

  return {
    shipping: shipping.data,
    shippingStatus: shipping.status,
    retryShipping: () => dispatch(fetchShipping()),
    paymentMethods: paymentMethods.data,
    paymentMethodsStatus: paymentMethods.status,
    retryPaymentMethods: () => dispatch(fetchPaymentMethods()),
    submitting,
    placeOrder: submit,
  }
}

/** Where a PayMongo checkout stands (paid → the order exists). */
export async function fetchCheckoutStatus(checkoutId: string): Promise<CheckoutStatus> {
  const { data } = await apiClient.get<CheckoutStatus>(`/shop/checkouts/${encodeURIComponent(checkoutId)}`)
  return data
}
