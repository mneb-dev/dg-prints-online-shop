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

const focusRing = "outline-none focus-visible:ring-4 focus-visible:ring-primary/30"

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
          "relative inline-flex size-11 items-center justify-center rounded-full bg-card text-foreground shadow-clay-card transition-[translate,box-shadow,scale] duration-200 hover:-translate-y-0.5 hover:shadow-clay-card-hover active:scale-[0.92] active:shadow-clay-pressed motion-reduce:hover:translate-y-0 sm:size-12",
          focusRing,
          // On the cart page the button stays pressed in.
          isActive && "bg-clay-well text-primary shadow-clay-pressed hover:translate-y-0 hover:shadow-clay-pressed"
        )
      }
    >
      <ShoppingBagIcon key={bump} className={cn("size-5", bump > 0 && "animate-cart-bump motion-reduce:animate-none")} />
      {itemCount > 0 && (
        <span
          key={itemCount}
          className="absolute -top-1 -right-1 flex h-5.5 min-w-5.5 animate-in items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-pink-600 px-1 font-heading text-[0.7rem] font-black text-white tabular-nums shadow-clay-button duration-200 zoom-in-50 motion-reduce:animate-none"
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </NavLink>
  )
}

function ShopHeader() {
  return (
    <header className="sticky top-3 z-40 px-3 sm:top-4 sm:px-6">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 rounded-[32px] bg-card/75 pr-2.5 pl-4 shadow-clay-card backdrop-blur-xl sm:h-20 sm:gap-4 sm:rounded-[40px] sm:pr-4 sm:pl-7">
        <Link to="/" className={cn("shrink-0 rounded-full", focusRing)}>
          <Logo className="h-9 w-auto sm:h-11" />
        </Link>
        <nav aria-label="Main" className="ml-1 flex items-center gap-1 sm:ml-3">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "inline-flex h-11 items-center rounded-full px-4 font-heading text-[0.95rem] font-extrabold text-muted-foreground transition-[background-color,color,box-shadow] duration-200 hover:bg-primary/10 hover:text-primary",
                  focusRing,
                  // FAQ is a landing extra: on phones "Shop" alone keeps the bar uncluttered.
                  link.anchor && "hidden md:inline-flex",
                  isActive && !link.anchor && "bg-clay-well text-primary shadow-clay-pressed hover:bg-clay-well"
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
    <footer className="mt-20 px-3 pb-3 sm:mt-28 sm:px-6 sm:pb-6">
      <div className="mx-auto max-w-7xl rounded-[40px] bg-card/75 px-6 py-10 text-sm shadow-clay-card backdrop-blur-xl sm:rounded-[48px] sm:px-12 sm:py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="flex flex-col items-start gap-4">
            <Logo className="h-11 w-auto" />
            <p className="max-w-xs leading-relaxed font-medium text-muted-foreground">
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
        <div className="mt-10 flex flex-col gap-1 rounded-[24px] bg-clay-well px-5 py-4 text-xs leading-relaxed font-medium text-muted-foreground shadow-clay-pressed sm:px-7">
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
      <h2 className="mb-3 text-sm font-black tracking-widest text-foreground uppercase">{title}</h2>
      <ul className="flex flex-col gap-0.5">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className={cn(
                "inline-flex min-h-10 items-center rounded-full font-medium text-muted-foreground transition-colors hover:text-primary",
                focusRing
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
