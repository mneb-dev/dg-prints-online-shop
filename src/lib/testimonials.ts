/** Customer testimonials for the landing page's "What customers say" section.
 *
 * To add one: copy the example at the bottom of TESTIMONIALS, paste the customer's words exactly as
 * they wrote them, and link the Facebook post or review they came from. The section appears by
 * itself once the list has an entry, and stays hidden while it's empty — the site never shows
 * placeholder reviews. Only use real feedback: made-up or edited reviews break PH consumer rules.
 *
 * Photos: right-click the customer's profile picture on Facebook → "Copy image address" and paste it
 * as `photoUrl`. Facebook image links (…fbcdn.net…) expire after a while; the card then shows the
 * customer's initials instead. For a photo that never breaks, save it to `public/testimonials/` and
 * use its path, e.g. "/testimonials/ana.jpg".
 */

export type Testimonial = {
  /** As the customer wrote it, e.g. "Ana R." */
  name: string
  /** Their words, verbatim. Keep it short — it's shown in full (about 280 characters max). */
  quote: string
  rating: 1 | 2 | 3 | 4 | 5
  /** What they ordered, e.g. "Name Clicker" or "Stickers". Empty hides it. */
  product?: string
  /** e.g. "Balanga, Bataan". Empty hides it. */
  location?: string
  /** The Facebook post or review it came from. Makes the card clickable (Facebook links only). */
  postUrl?: string
  /** Profile photo: a copied Facebook image address, or a local path like "/testimonials/ana.jpg". */
  photoUrl?: string
}

export const TESTIMONIALS_SECTION = {
  /** false hides the section even when there are testimonials. */
  enabled: true,
  eyebrow: "What customers say",
  /** The title; `highlight` is appended in the brand gradient. */
  title: "Loved by",
  highlight: "our customers",
  /** Optional line under the title. Ignored when the rating summary is shown. */
  lead: "",
  /** Optional link to all reviews on the Facebook page, shown as a button under the cards. */
  moreUrl: "",
  /** Average of the ratings listed here, e.g. "★ 4.9 · from 6 customer reviews" (needs 2+ entries). */
  showAverage: true,
}

export const TESTIMONIALS: Testimonial[] = [
  // {
  //   name: "Ana R.",
  //   quote: "Paste the customer's words here, exactly as written.",
  //   rating: 5,
  //   product: "Name Clicker",
  //   location: "Balanga, Bataan",
  //   postUrl: "https://www.facebook.com/…",
  //   photoUrl: "https://scontent….fbcdn.net/…",
  // },
]

const FACEBOOK_HOSTS = ["facebook.com", "www.facebook.com", "m.facebook.com", "web.facebook.com", "fb.com", "www.fb.com", "fb.watch"]

/** True only for https Facebook links, so a typo can never send customers to some other site. */
export function isFacebookUrl(url: string | undefined): url is string {
  if (!url) return false
  try {
    const parsed = new URL(url)
    return parsed.protocol === "https:" && FACEBOOK_HOSTS.includes(parsed.hostname)
  } catch {
    return false
  }
}

/** Mean rating rounded to one decimal, e.g. 4.8. */
export function averageRating(list: Testimonial[]): number {
  if (list.length === 0) return 0
  return Math.round((list.reduce((sum, item) => sum + item.rating, 0) / list.length) * 10) / 10
}
