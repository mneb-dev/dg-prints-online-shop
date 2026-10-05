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
  moreUrl: "https://www.facebook.com/share/p/1FdJYgcXEP/",
  /** Average of the ratings listed here, e.g. "★ 4.9 · from 6 customer reviews" (needs 2+ entries). */
  showAverage: true,
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Julito Yosoya Jr.",
    quote: "Nag try nga po ako sa ibang pagawa ng sticker kaso puro anlalabo, sainyo lang ung nakita namin quality talaga mas makulay at mas malinaw pag kaka print ninyo ❤👌",
    rating: 5,
    product: "Sticker Label",
    location: "Caloocan City",
    postUrl: "https://www.facebook.com/photo.php?fbid=122181655034792327&set=pb.61573769812248.-2207520000&type=3",
    photoUrl: "https://scontent.fcrk1-4.fna.fbcdn.net/v/t39.30808-6/763847758_4356956277948189_4505353451824505079_n.jpg?stp=dst-jpg_tt6&cstp=mx1344x1344&ctp=s1344x1344&_nc_cat=103&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFJQdwbsNedB4u79ZAswFPoehMFHFNjHVZ6EwUcU2MdVuoRnZc_VbXwjR9BAKXFwlXpHUaRlKZN0AQIsAXFrz5q&_nc_ohc=e1EdhF2WWAsQ7kNvwHwPOpe&_nc_oc=AdrCULrkM81_rMdLFGDptq-DdoaigoXUoiVV5SJzHRITrzE-LSfOHqygsLAVyoXfhAg&_nc_zt=23&_nc_ht=scontent.fcrk1-4.fna&_nc_gid=x_-2ryE4cZlZOreDDm3i5g&_nc_ss=7b2a8&oh=00_AQMEIX0Unf22VCUCEZmv3nn89abzUp0u_wDKvJL4DSM0og&oe=6AC9C5BF",
  },
  {
    name: "Karen Espirito",
    quote: "Opo super saya namin kse nkaka 3 printers na kme.. d mkuha ung pgkalinaw. Sobraaang ganda po. Salamat ng mdame mam",
    rating: 5,
    product: "Sticker Label",
    location: "Bulacan",
    postUrl: "https://www.facebook.com/photo?fbid=122181655412792327&set=pcb.122181655742792327",
    photoUrl: "https://scontent.fcrk1-2.fna.fbcdn.net/v/t39.30808-1/446804451_7802298836476088_234526992212163575_n.jpg?stp=cp0_dst-jpg_s60x60_tt6&_nc_cat=111&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeG-fkpIeSVJs2ODFyc5MjGSwvQUPHv8DXXC9BQ8e_wNdSIx_PugS3QEbfWmYaiRoaW0TM6Lp6mfX7Ang5PYlrCy&_nc_ohc=MQE4UHjgcagQ7kNvwHabaI7&_nc_oc=AdpSV5cc4Z59CdjCZjwPjaV2gwGvdZWX9xEHIP_HPlyflw3aWHJK1vGMnf8gikli4TA&_nc_zt=24&_nc_ht=scontent.fcrk1-2.fna&_nc_gid=fC6ewi5IAhVitN3mVyGigg&_nc_ss=7b2a8&oh=00_AQMXa6CzxcHnHcXesgGhrpAoyqzZoSiG1O6XZ84fxuB3jQ&oe=6AC9D92E",
  },
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
