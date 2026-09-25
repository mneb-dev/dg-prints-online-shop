/** "Added to cart" feedback on mobile: a thumbnail flies from the tapped button to the header's cart
 *  icon (`[data-cart-target]`), then CartButton bumps. The usual toast still confirms the add. */

export const CART_ADDED_EVENT = "dgprints:cart-added"

/** Below lg — where the shop uses the mobile action bar and add-to-cart flies to the cart. */
export function isCompactViewport(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(width < 64rem)").matches
}

/** Tells CartButton to bump as the product lands. */
export function announceCartAdded() {
  window.dispatchEvent(new Event(CART_ADDED_EVENT))
}

const SIZE = 56
const DURATION_MS = 750
// lucide "shopping-bag", for products without a photo.
const BAG_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 10a4 4 0 0 1-8 0"/><path d="M3.103 6.034h17.794"/><path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"/></svg>'

/**
 * Flies a round thumbnail from `from` to the cart icon along an arc. Resolves when it lands (or
 * immediately when there's no cart icon or the user prefers reduced motion), so the caller can add
 * the item to the cart right as it "arrives".
 */
export function flyToCart({ from, imageUrl }: { from: HTMLElement; imageUrl?: string }): Promise<void> {
  const target = document.querySelector<HTMLElement>("[data-cart-target]")
  if (!target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return Promise.resolve()

  const start = from.getBoundingClientRect()
  const end = target.getBoundingClientRect()
  const startX = start.left + start.width / 2
  const startY = start.top + start.height / 2
  const dx = end.left + end.width / 2 - startX
  const dy = end.top + end.height / 2 - startY

  const flyer = document.createElement("div")
  flyer.setAttribute("aria-hidden", "true")
  flyer.className =
    "pointer-events-none fixed z-[100] flex items-center justify-center overflow-hidden rounded-full bg-brand-gradient text-white shadow-[var(--shadow-elevated)] ring-2 ring-background"
  Object.assign(flyer.style, {
    left: `${startX - SIZE / 2}px`,
    top: `${startY - SIZE / 2}px`,
    width: `${SIZE}px`,
    height: `${SIZE}px`,
  })
  if (imageUrl) {
    const img = document.createElement("img")
    img.src = imageUrl
    img.alt = ""
    img.className = "size-full object-cover"
    flyer.append(img)
  } else {
    flyer.innerHTML = BAG_ICON
  }
  document.body.append(flyer)

  // Pops up a little, then arcs over to the cart while shrinking into it.
  const animation = flyer.animate(
    [
      { transform: "translate(0, 0) scale(0.6)", opacity: 0 },
      { transform: "translate(0, -24px) scale(1.1)", opacity: 1, offset: 0.15 },
      { transform: `translate(${dx * 0.45}px, ${dy * 0.7 - 40}px) scale(0.85)`, opacity: 1, offset: 0.6 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.2)`, opacity: 0.6 },
    ],
    { duration: DURATION_MS, easing: "cubic-bezier(0.45, 0, 0.25, 1)", fill: "forwards" }
  )

  return animation.finished.then(
    () => flyer.remove(),
    () => flyer.remove()
  )
}
