import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import { apiClient } from "@/lib/api-client"
import { getErrorMessage } from "@/lib/api-error"
import type { ShopSettings } from "@/lib/shop-types"

type ShopSettingsState = {
  data: ShopSettings | null
  status: "idle" | "loading" | "succeeded" | "failed"
}

const initialState: ShopSettingsState = { data: null, status: "idle" }

export const fetchShopSettings = createAsyncThunk<ShopSettings, void, { rejectValue: string }>(
  "shopSettings/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get<ShopSettings>("/shop/settings")
      return data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

const shopSettingsSlice = createSlice({
  name: "shopSettings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShopSettings.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchShopSettings.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.data = action.payload
      })
      .addCase(fetchShopSettings.rejected, (state) => {
        state.status = "failed"
      })
  },
})

export default shopSettingsSlice.reducer
