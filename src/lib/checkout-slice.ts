import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

import { apiClient } from "@/lib/api-client"
import { getErrorMessage } from "@/lib/api-error"
import type { CartLine } from "@/lib/cart-slice"

export type ShippingRegion = "luzon" | "visayas" | "mindanao"

export type Province = { name: string; region: ShippingRegion }

/** `GET /api/shop/shipping` — fee per island group and every province with its group. */
export type ShippingInfo = {
  rates: Record<ShippingRegion, number>
  provinces: Province[]
}

export type CheckoutForm = {
  name: string
  phone: string
  /** Asked only for carts paid online — passed to PayMongo for billing and the receipt, not stored. */
  email: string
  street: string
  barangay: string
  city: string
  province: string
  zip: string
}

export type PlacedOrder = { orderNumber: string; total: number }

/** `POST /api/shop/orders`: a cart with a "Quote" line is ordered right away (pay later); any other
 *  cart is paid first on PayMongo's hosted page, and the order is only created once it's paid. */
export type PlaceOrderResult =
  | ({ kind: "order" } & PlacedOrder)
  | { kind: "payment"; checkoutId: string; checkoutUrl: string }

/** `GET /api/shop/checkouts/:id` — where a PayMongo payment stands, polled after the buyer returns. */
export type CheckoutStatus =
  | ({ status: "paid" } & PlacedOrder)
  | { status: "pending"; checkoutUrl: string; total: number }
  | { status: "expired" }
  /** The buyer cancelled on GCash/Maya, or the payment was declined. Nothing was charged. */
  | { status: "failed" }

/** `GET /api/shop/payment-methods` — the online payment options, in order (the first is the default). */
export type PaymentMethodOption = { type: string; label: string }

/** Why placing the order failed. `lineKey` points at the cart line the server rejected (removed
 *  product, changed price…), so the page can say which one to fix. */
export type PlaceOrderError = { message: string; lineKey?: string }

type LoadStatus = "idle" | "loading" | "succeeded" | "failed"

type CheckoutState = {
  shipping: { data: ShippingInfo | null; status: LoadStatus }
  paymentMethods: { data: PaymentMethodOption[]; status: LoadStatus }
  submitStatus: "idle" | "submitting"
}

const initialState: CheckoutState = {
  shipping: { data: null, status: "idle" },
  paymentMethods: { data: [], status: "idle" },
  submitStatus: "idle",
}

export const fetchPaymentMethods = createAsyncThunk<PaymentMethodOption[], void, { rejectValue: string }>(
  "checkout/fetchPaymentMethods",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get<PaymentMethodOption[]>("/shop/payment-methods")
      return data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

export const fetchShipping = createAsyncThunk<ShippingInfo, void, { rejectValue: string }>(
  "checkout/fetchShipping",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get<ShippingInfo>("/shop/shipping")
      return data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

export const placeOrder = createAsyncThunk<
  PlaceOrderResult,
  { form: CheckoutForm; lines: CartLine[]; website: string; paymentMethod?: string },
  { rejectValue: PlaceOrderError }
>("checkout/placeOrder", async ({ form, lines, website, paymentMethod }, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post<PlaceOrderResult>("/shop/orders", {
      customer: { name: form.name, phone: form.phone, email: form.email },
      address: { street: form.street, barangay: form.barangay, city: form.city, province: form.province, zip: form.zip },
      // Prices are sent only so the server can spot changes — it recalculates everything itself.
      items: lines.map((line) => ({
        productId: line.productId,
        pricingEntryId: line.pricing?.pricingEntryId,
        pricingType: line.pricing?.pricingType,
        packageName: line.pricing?.packageName,
        unitPrice: line.pricing?.unitPrice,
        width: line.pricing?.width,
        height: line.pricing?.height,
        selectedOptions: line.selectedOptions,
        quantity: line.quantity,
        note: line.note,
      })),
      paymentMethod,
      website,
    })
    return data
  } catch (error) {
    const itemIndex = axios.isAxiosError(error)
      ? (error.response?.data as { itemIndex?: number } | undefined)?.itemIndex
      : undefined
    return rejectWithValue({
      message: getErrorMessage(error),
      lineKey: typeof itemIndex === "number" ? lines[itemIndex]?.key : undefined,
    })
  }
})

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.paymentMethods.status = "loading"
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.paymentMethods = { data: action.payload, status: "succeeded" }
      })
      .addCase(fetchPaymentMethods.rejected, (state) => {
        state.paymentMethods.status = "failed"
      })
      .addCase(fetchShipping.pending, (state) => {
        state.shipping.status = "loading"
      })
      .addCase(fetchShipping.fulfilled, (state, action) => {
        state.shipping = { data: action.payload, status: "succeeded" }
      })
      .addCase(fetchShipping.rejected, (state) => {
        state.shipping.status = "failed"
      })
      .addCase(placeOrder.pending, (state) => {
        state.submitStatus = "submitting"
      })
      .addCase(placeOrder.fulfilled, (state) => {
        state.submitStatus = "idle"
      })
      .addCase(placeOrder.rejected, (state) => {
        state.submitStatus = "idle"
      })
  },
})

export default checkoutSlice.reducer
