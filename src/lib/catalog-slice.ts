import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import { apiClient } from "@/lib/api-client"
import { getErrorMessage } from "@/lib/api-error"
import type { Paginated, ShopProduct } from "@/lib/shop-types"

export const SHOP_PAGE_SIZE = 20

type LoadStatus = "idle" | "loading" | "succeeded" | "failed"

/** Shop sort orders — only what the API can sort on (name, created_at). */
export const SHOP_SORTS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "name-desc", label: "Name, Z–A" },
] as const
export type ShopSort = (typeof SHOP_SORTS)[number]["value"]

const SORT_PARAMS: Record<ShopSort, { sortBy: "name" | "created_at"; sortDir: "asc" | "desc" }> = {
  featured: { sortBy: "name", sortDir: "asc" },
  newest: { sortBy: "created_at", sortDir: "desc" },
  "name-desc": { sortBy: "name", sortDir: "desc" },
}

export function isShopSort(value: string): value is ShopSort {
  return value in SORT_PARAMS
}

export type ProductQuery = {
  search: string
  category: string
  page: number
  sort: ShopSort
}

type CatalogState = {
  list: {
    items: ShopProduct[]
    total: number
    status: LoadStatus
    error: string | null
    /** The latest list request — the landing page and the shop share this list, so an older
     *  response arriving late must not overwrite a newer query's results. */
    requestId: string | null
  }
  /** Products fetched individually for the detail page, keyed by id. */
  byId: Record<string, ShopProduct>
  detail: { status: LoadStatus; error: string | null }
  categories: { items: string[]; status: LoadStatus }
}

const initialState: CatalogState = {
  list: { items: [], total: 0, status: "idle", error: null, requestId: null },
  byId: {},
  detail: { status: "idle", error: null },
  categories: { items: [], status: "idle" },
}

export const fetchShopProducts = createAsyncThunk<Paginated<ShopProduct>, ProductQuery, { rejectValue: string }>(
  "catalog/fetchProducts",
  async (query, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get<Paginated<ShopProduct>>("/shop/products", {
        params: {
          page: query.page,
          pageSize: SHOP_PAGE_SIZE,
          search: query.search || undefined,
          category: query.category || undefined,
          ...SORT_PARAMS[query.sort],
        },
      })
      return data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

export const fetchShopProduct = createAsyncThunk<ShopProduct, string, { rejectValue: string }>(
  "catalog/fetchProduct",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get<ShopProduct>(`/shop/products/${encodeURIComponent(id)}`)
      return data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

export const fetchShopCategories = createAsyncThunk<string[], void, { rejectValue: string }>(
  "catalog/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get<string[]>("/shop/categories")
      return data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShopProducts.pending, (state, action) => {
        state.list.requestId = action.meta.requestId
        state.list.status = "loading"
        state.list.error = null
      })
      .addCase(fetchShopProducts.fulfilled, (state, action) => {
        for (const product of action.payload.items) state.byId[product.id] = product
        if (action.meta.requestId !== state.list.requestId) return
        state.list.status = "succeeded"
        state.list.items = action.payload.items
        state.list.total = action.payload.total
      })
      .addCase(fetchShopProducts.rejected, (state, action) => {
        if (action.meta.requestId !== state.list.requestId) return
        state.list.status = "failed"
        state.list.error = action.payload ?? "Couldn't load products."
      })
      .addCase(fetchShopProduct.pending, (state) => {
        state.detail = { status: "loading", error: null }
      })
      .addCase(fetchShopProduct.fulfilled, (state, action) => {
        state.detail = { status: "succeeded", error: null }
        state.byId[action.payload.id] = action.payload
      })
      .addCase(fetchShopProduct.rejected, (state, action) => {
        state.detail = { status: "failed", error: action.payload ?? "Couldn't load this product." }
      })
      .addCase(fetchShopCategories.pending, (state) => {
        state.categories.status = "loading"
      })
      .addCase(fetchShopCategories.fulfilled, (state, action) => {
        state.categories = { items: action.payload, status: "succeeded" }
      })
      .addCase(fetchShopCategories.rejected, (state) => {
        state.categories.status = "failed"
      })
  },
})

export default catalogSlice.reducer
