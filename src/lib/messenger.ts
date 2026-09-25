import type { CartLine } from "@/lib/cart-slice"

/** Option / package / size lines shown under a cart item. */
export function itemDetails(item: Pick<CartLine, "selectedOptions" | "pricing">): string[] {
  const { selectedOptions, pricing } = item
  const details = selectedOptions.map((option) => `${option.name}: ${option.value}`)
  if (pricing?.packageName && !selectedOptions.some((option) => option.value === pricing.packageName)) {
    details.push(`Package: ${pricing.packageName}`)
  }
  if (pricing?.width && pricing.height) details.push(`Size: ${pricing.width} × ${pricing.height} ft`)
  return details
}

/** Opening message for a made-to-order product; the details are worked out in the chat. */
export function buildMadeToOrderMessage(productName: string): string {
  return `Hi DG Prints! I'd like to order a ${productName}.`
}

/** Opens the Messenger conversation in a new tab with the text prefilled where Messenger supports
 *  it, and copies the text as a fallback. Resolves to whether the copy worked. */
export async function openMessenger(messengerUrl: string, text: string): Promise<boolean> {
  const url = new URL(messengerUrl)
  url.searchParams.set("text", text)
  // Open synchronously inside the click so popup blockers allow it.
  window.open(url.toString(), "_blank", "noopener,noreferrer")
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
