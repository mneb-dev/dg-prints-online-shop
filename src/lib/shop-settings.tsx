import { useEffect } from "react"

import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchShopSettings } from "@/lib/shop-settings-slice"

/** Facade over the shop settings slice — fetched once per visit. `messengerUrl` is "" until
 *  loaded or when DG Prints hasn't set one, which hides the "Message us on Facebook" button. */
export function useShopSettings() {
  const dispatch = useAppDispatch()
  const data = useAppSelector((state) => state.shopSettings.data)
  const status = useAppSelector((state) => state.shopSettings.status)

  useEffect(() => {
    if (status === "idle") void dispatch(fetchShopSettings())
  }, [dispatch, status])

  return {
    messengerUrl: data?.messengerUrl ?? "",
    /** 0 until loaded or when off — the Terms page only mentions the fee when it's above 0. */
    convenienceFeePercent: Math.max(0, Number(data?.convenienceFeePercent) || 0),
    isLoading: status === "idle" || status === "loading",
  }
}
