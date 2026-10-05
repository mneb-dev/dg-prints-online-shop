import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/** Scroll to the top on page changes (not on query-string changes like filters or pagination),
 *  or to the `#section` in the URL — so the header's "FAQ" link lands on /#faq from any page. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    // The section may render a few frames after navigation (it waits on data), so keep looking briefly.
    let attempts = 0
    let frame = 0
    const scrollToHash = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (target) {
        const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches
        target.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" })
      } else if (attempts++ < 30) {
        frame = requestAnimationFrame(scrollToHash)
      }
    }
    scrollToHash()
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}
