import { useEffect, useState } from "react"
import { ShoppingBagIcon } from "lucide-react"
import { Link, NavLink, Outlet } from "react-router-dom"

import { BackgroundBlobs } from "@/components/background-blobs"
import { Logo } from "@/components/logo"
import { TooltipProvider } from "@/components/ui/tooltip"
import { BUSINESS, businessIdentity, POLICY_LINKS } from "@/lib/business-info"
import { useCart } from "@/lib/cart"
import { useCatalog } from "@/lib/catalog"
import { CART_ADDED_EVENT } from "@/lib/fly-to-cart"
import { cn } from "@/lib/utils"

/** Header links. FAQ is a landing-page anchor, so it works from any page (see ScrollToTop). */
const NAV_LINKS = [
  { to: "/shop", label: "Shop", anchor: false },
  { to: "/#faq", label: "FAQ", anchor: true },
] as const

const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"

function CartButton() {
  const { itemCount } = useCart()
  const label = itemCount === 0 ? "Cart, empty" : `Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`
  // Bumped when a mobile add-to-cart lands (see lib/fly-to-cart); the key restarts the animation.
  const [bump, setBump] = useState(0)

  useEffect(() => {
    const onAdded = () => setBump(Date.now())
    window.addEventListener(CART_ADDED_EVENT, onAdded)
    return () => window.removeEventListener(CART_ADDED_EVENT, onAdded)
  }, [])

  return (
    <NavLink
      to="/cart"
      aria-label={label}
      data-cart-target
      className={({ isActive }) =>
        cn(
          "relative inline-flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs transition-all duration-200 ease-out hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900",
          focusRing,
          isActive && "border-indigo-200 bg-indigo-50 text-primary hover:border-indigo-200 hover:bg-indigo-50 hover:text-primary"
        )
      }
    >
      <ShoppingBagIcon key={bump} className={cn("size-5", bump > 0 && "animate-cart-bump motion-reduce:animate-none")} />
      {itemCount > 0 && (
        <span
          key={itemCount}
          className="absolute -top-1.5 -right-1.5 flex h-5.5 min-w-5.5 animate-in items-center justify-center rounded-full bg-primary px-1 text-[0.7rem] font-bold text-white tabular-nums shadow-glow ring-2 ring-white duration-200 zoom-in-50 motion-reduce:animate-none"
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </NavLink>
  )
}

function ShopHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:h-18 sm:gap-6 sm:px-6">
        <Link to="/" className={cn("shrink-0 rounded-md", focusRing)}>
          <Logo className="h-9 w-auto sm:h-10" />
        </Link>
        <nav aria-label="Main" className="ml-2 flex h-full items-center gap-1 sm:ml-4">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "relative inline-flex h-11 items-center rounded-md px-3 text-[0.95rem] font-medium text-slate-600 transition-colors duration-200 hover:text-primary",
                  focusRing,
                  // FAQ is a landing extra: on phones "Shop" alone keeps the bar uncluttered.
                  link.anchor && "hidden md:inline-flex",
                  // Active page: indigo text with a gradient bar resting on the header's bottom border.
                  isActive &&
                    !link.anchor &&
                    "text-primary after:absolute after:inset-x-3 after:-bottom-[11px] after:h-0.5 after:rounded-full after:bg-brand-gradient sm:after:-bottom-[15px]"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center">
          <CartButton />
        </div>
      </div>
    </header>
  )
}

function ShopFooter() {
  const { categories, categoriesStatus, loadCategories } = useCatalog()

  useEffect(() => {
    if (categoriesStatus === "idle") void loadCategories()
  }, [categoriesStatus, loadCategories])

  return (
    <footer className="mt-20 bg-slate-950 text-sm text-slate-400 sm:mt-24">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
          <div className="flex flex-col items-start gap-4 sm:col-span-2 lg:col-span-1">
            <Logo onDark className="h-11 w-auto" />
            <p className="max-w-xs leading-relaxed">
              Custom prints made in-house in Morong, Bataan. Priced upfront, paid online, delivered nationwide.
            </p>
          </div>
          {categories.length > 0 && (
            <FooterLinks
              title="Shop"
              links={categories.slice(0, 6).map((category) => ({
                to: `/shop?category=${encodeURIComponent(category)}`,
                label: category,
              }))}
            />
          )}
          <FooterLinks title="Help" links={POLICY_LINKS} />
        </div>

        {/* Seller identity, as Philippine e-commerce rules expect — only the details that are filled in. */}
        <div className="mt-12 flex flex-col gap-1 border-t border-slate-800 pt-6 text-xs leading-relaxed text-slate-500">
          <p>{businessIdentity()}</p>
          {(BUSINESS.address || BUSINESS.phone || BUSINESS.email) && (
            <p>{[BUSINESS.address, BUSINESS.phone, BUSINESS.email].filter(Boolean).join(" · ")}</p>
          )}
          <p>© {new Date().getFullYear()} {BUSINESS.tradeName}. Custom printing, made simple.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterLinks({ title, links }: { title: string; links: ReadonlyArray<{ to: string; label: string }> }) {
  return (
    <nav aria-label={title}>
      <h2 className="mb-3 text-xs font-semibold tracking-wider text-white uppercase">{title}</h2>
      <ul className="flex flex-col">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className={cn(
                "inline-flex min-h-10 items-center rounded-sm text-slate-400 transition-colors duration-200 hover:text-indigo-400",
                focusRing,
                "focus-visible:ring-offset-slate-950"
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function ShopLayout() {
  return (
    <TooltipProvider>
      <BackgroundBlobs />
      <div className="flex min-h-svh flex-col">
        <ShopHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <ShopFooter />
      </div>
    </TooltipProvider>
  )
}
