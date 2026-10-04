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
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 sm:py-12 md:grid-cols-[12rem_minmax(0,1fr)]">
      <nav aria-label="Policies" className="md:sticky md:top-24 md:self-start">
        <ul className="flex gap-1 overflow-x-auto pb-1 md:flex-col md:overflow-visible">
          {POLICY_LINKS.map((link) => (
            <li key={link.to} className="shrink-0">
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
                    isActive && "bg-accent text-accent-foreground hover:bg-accent"
                  )
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <article className="min-w-0">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {showUpdated && <p className="mt-1 text-sm text-muted-foreground">Last updated {POLICY.lastUpdated}</p>}
        {intro && <div className="mt-4 text-muted-foreground">{intro}</div>}
        <div className="mt-8 flex flex-col gap-8">{children}</div>
      </article>
    </div>
  )
}

/** One titled section of a policy page. */
export function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 text-[0.95rem] leading-relaxed [&_li]:pl-1 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:pl-5">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
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
    <dl className={cn("grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border", className)}>
      {rows.map((row) => (
        <div key={row.label} className="flex items-start gap-3 bg-card p-4">
          <row.icon aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <dt className="text-xs text-muted-foreground">{row.label}</dt>
            <dd className="mt-0.5 break-words">{row.value}</dd>
          </div>
        </div>
      ))}
    </dl>
  )
}
