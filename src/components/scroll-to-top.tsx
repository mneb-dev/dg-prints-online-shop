import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/** Scroll to the top on page changes (not on query-string changes like filters or pagination). */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
