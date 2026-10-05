import { useEffect, type ReactNode } from "react"
import { MailIcon, MapPinIcon, MessageCircleIcon, PhoneIcon, ClockIcon } from "lucide-react"
import { Link, NavLink } from "react-router-dom"

import { BUSINESS, POLICY, POLICY_LINKS } from "@/lib/business-info"
import { useShopSettings } from "@/lib/shop-settings"
import { cn } from "@/lib/utils"

/** Shared frame for the policy pages: title, last-updated date, the policy nav, and readable prose. */
export function PolicyLayout({
  title,
  intro,
  showUpdated = true,
  children,
}: {
  title: string
  intro?: ReactNode
  showUpdated?: boolean
  children: ReactNode
}) {
  useEffect(() => {
    document.title = `${title} · ${BUSINESS.tradeName}`
    return () => {
      document.title = BUSINESS.tradeName
    }
  }, [title])

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 sm:py-14 md:grid-cols-[13rem_minmax(0,1fr)]">
      <nav aria-label="Policies" className="md:sticky md:top-24 md:self-start">
        <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pt-1 pb-3 md:mx-0 md:flex-col md:overflow-visible md:px-0">
          {POLICY_LINKS.map((link) => (
            <li key={link.to} className="shrink-0">
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "block rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap text-slate-600 transition-colors duration-200 outline-none hover:bg-white hover:text-primary focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                    isActive && "bg-indigo-50 font-semibold text-indigo-700 ring-1 ring-indigo-100 ring-inset hover:bg-indigo-50 hover:text-indigo-700"
                  )
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <article className="surface min-w-0 p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl">{title}</h1>
        {showUpdated && <p className="mt-2 text-sm font-medium text-muted-foreground">Last updated {POLICY.lastUpdated}</p>}
        {intro && <div className="mt-5 text-lg leading-relaxed font-medium text-muted-foreground">{intro}</div>}
        <div className="mt-10 flex flex-col gap-10">{children}</div>
      </article>
    </div>
  )
}

/** One titled section of a policy page. */
export function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 text-[0.95rem] leading-relaxed [&_li]:pl-1 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:pl-5">
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
      {children}
    </section>
  )
}

/** Inline link to another shop page, styled for prose. */
export function TextLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="font-medium text-primary underline-offset-4 hover:underline">
      {children}
    </Link>
  )
}

/** Every way to reach DG Prints that's been filled in — Messenger, phone, email, address, hours. */
export function ContactDetails({ className }: { className?: string }) {
  const { messengerUrl } = useShopSettings()

  const rows: { icon: typeof MailIcon; label: string; value: ReactNode }[] = []
  if (messengerUrl) {
    rows.push({
      icon: MessageCircleIcon,
      label: "Facebook Messenger",
      value: (
        <a
          href={messengerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Message us on Facebook
        </a>
      ),
    })
  }
  if (BUSINESS.phone) {
    rows.push({
      icon: PhoneIcon,
      label: "Phone",
      value: (
        <a href={`tel:${BUSINESS.phone.replace(/[^\d+]/g, "")}`} className="font-medium text-primary underline-offset-4 hover:underline">
          {BUSINESS.phone}
        </a>
      ),
    })
  }
  if (BUSINESS.email) {
    rows.push({
      icon: MailIcon,
      label: "Email",
      value: (
        <a href={`mailto:${BUSINESS.email}`} className="font-medium text-primary underline-offset-4 hover:underline">
          {BUSINESS.email}
        </a>
      ),
    })
  }
  if (BUSINESS.address) rows.push({ icon: MapPinIcon, label: "Address", value: BUSINESS.address })
  if (BUSINESS.hours) rows.push({ icon: ClockIcon, label: "Hours", value: BUSINESS.hours })

  if (rows.length === 0) return null

  return (
    <dl className={cn("grid grid-cols-1 gap-3", className)}>
      {rows.map((row) => (
        <div key={row.label} className="surface-muted flex items-start gap-3 p-4">
          <row.icon aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
          <div className="min-w-0">
            <dt className="text-xs text-muted-foreground">{row.label}</dt>
            <dd className="mt-0.5 break-words">{row.value}</dd>
          </div>
        </div>
      ))}
    </dl>
  )
}
