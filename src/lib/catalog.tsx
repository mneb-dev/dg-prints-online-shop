import { useCallback } from "react"

import {
  SHOP_PAGE_SIZE,
  SHOP_SORTS,
  isShopSort,
  fetchShopCategories,
  fetchShopProduct,
  fetchShopProducts,
  type ProductQuery,
  type ShopSort,
} from "@/lib/catalog-slice"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"

export { SHOP_PAGE_SIZE, SHOP_SORTS, isShopSort, type ProductQuery, type ShopSort }

/** Facade over the catalog slice — components read shop products through this hook only. */
export function useCatalog() {
  const dispatch = useAppDispatch()
  const catalog = useAppSelector((state) => state.catalog)

  const loadProducts = useCallback((query: ProductQuery) => dispatch(fetchShopProducts(query)), [dispatch])
  const loadProduct = useCallback((id: string) => dispatch(fetchShopProduct(id)), [dispatch])
  const loadCategories = useCallback(() => dispatch(fetchShopCategories()), [dispatch])

  return {
    products: catalog.list.items,
    total: catalog.list.total,
    listStatus: catalog.list.status,
    listError: catalog.list.error,
    productsById: catalog.byId,
    detailStatus: catalog.detail.status,
    detailError: catalog.detail.error,
    categories: catalog.categories.items,
    categoriesStatus: catalog.categories.status,
    loadProducts,
    loadProduct,
    loadCategories,
  }
}
