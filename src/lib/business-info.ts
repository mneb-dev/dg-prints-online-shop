/** DG Prints' business details and policy terms, shown in the footer, the Contact page and the
 * policy pages (Privacy, Terms, Returns, Shipping).
 *
 * Fill these in with the real values. An empty string hides that line everywhere — the site never
 * shows placeholder text. Philippine rules (Internet Transactions Act, Consumer Act, Data Privacy
 * Act) expect the registered name, registration number, address and a phone or email to be shown.
 */
export const BUSINESS = {
  /** Trade name used across the shop. */
  tradeName: "DG Prints",
  /** Registered business name, if different from the trade name (e.g. "Juan Dela Cruz Printing Services"). */
  registeredName: "De Guzman Prints Printing Services",
  /** e.g. "DTI Business Name No. 1234567" or "SEC Reg. No. CS201912345". */
  registration: "DTI Business Name No. 7057304",
  /** Business address, one line. */
  address: "Dizon Street, Binaritan, Morong, Bataan",
  email: "deguzmanprints@gmail.com",
  /** e.g. "0917 123 4567". */
  phone: "",
  /** e.g. "Mon–Sat, 9:00 AM – 6:00 PM". */
  hours: "Mon–Sat, 9:00 AM – 6:00 PM",
  /** Who handles personal-data requests (Data Protection Officer), and how to reach them. Falls back
   * to the email above when empty. */
  privacyContact: "",
}

/** Terms used by the policy pages. Defaults are a starting point for a custom-print shop — confirm
 * them before the pages go live. */
export const POLICY = {
  /** Last time the policy pages were changed — update whenever their wording changes. */
  lastUpdated: "October 5, 2026",
  /** Days after delivery to report a defective, wrong or damaged item. */
  claimDays: 7,
  /** Working days to process an approved refund (reaching the account then depends on GCash/Maya). */
  refundProcessingDays: 7,
  /** Production time before shipping, e.g. "2–5 working days". Empty hides the line. */
  productionTime: "2–3 working days",
  /** Delivery time after shipping, per region. Empty hides that row. */
  deliveryTime: { luzon: "2–3 days", visayas: "5–14 days", mindanao: "5–14 days" },
  /** VAT-registered seller: shop prices already include 12% VAT (stated on the Terms page). */
  pricesIncludeVat: false,
  /** Courier(s) used, e.g. "SPX Express". Empty hides the line. */
  couriers: "SPX Express (recommended) and J&T Express",
}

export const POLICY_LINKS = [
  { to: "/contact", label: "Contact us" },
  { to: "/shipping", label: "Shipping & delivery" },
  { to: "/returns", label: "Returns & refunds" },
  { to: "/terms", label: "Terms of sale" },
  { to: "/privacy", label: "Privacy policy" },
] as const

/** "DG Prints (Registered Name), DTI Business Name No. …" — only the parts that are filled in. */
export function businessIdentity(): string {
  const name =
    BUSINESS.registeredName && BUSINESS.registeredName !== BUSINESS.tradeName
      ? `${BUSINESS.tradeName} (${BUSINESS.registeredName})`
      : BUSINESS.tradeName
  return BUSINESS.registration ? `${name}, ${BUSINESS.registration}` : name
}

/** The address customers write to for personal-data requests. */
export function privacyContact(): string {
  return BUSINESS.privacyContact || BUSINESS.email
}
