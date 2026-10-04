import { useEffect, useState } from "react"
import { ShoppingBagIcon } from "lucide-react"
import { Link, NavLink, Outlet } from "react-router-dom"

import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { TooltipProvider } from "@/components/ui/tooltip"
import { BUSINESS, businessIdentity, POLICY_LINKS } from "@/lib/business-info"
import { useCart } from "@/lib/cart"
import { CART_ADDED_EVENT } from "@/lib/fly-to-cart"
import { cn } from "@/lib/utils"

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
          "relative inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
          isActive && "bg-accent text-accent-foreground"
        )
      }
    >
      <ShoppingBagIcon key={bump} className={cn("size-5", bump > 0 && "animate-cart-bump motion-reduce:animate-none")} />
      {itemCount > 0 && (
        <span
          key={itemCount}
          className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 animate-in items-center justify-center rounded-full bg-brand-gradient px-1 text-[0.7rem] font-semibold text-primary-foreground tabular-nums shadow-[var(--shadow-button)] duration-200 zoom-in-50 motion-reduce:animate-none"
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </NavLink>
  )
}

export function ShopLayout() {
  return (
    <TooltipProvider>
      <div className="flex min-h-svh flex-col">
        <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
          <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
            <Link to="/" className="shrink-0 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
              <Logo className="h-10 w-auto" />
            </Link>
            <nav className="ml-2 flex items-center gap-1">
              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  cn(
                    "inline-flex h-10 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
                    isActive && "text-foreground"
                  )
                }
              >
                Shop
              </NavLink>
            </nav>
            <div className="ml-auto flex items-center gap-1">
              <ThemeToggle className="size-10" />
              <CartButton />
            </div>
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>

        <footer className="border-t border-border bg-card/50">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 text-sm text-muted-foreground sm:px-6">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <Logo className="h-7 w-auto opacity-80" />
              <nav aria-label="Shop information">
                <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
                  {POLICY_LINKS.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="rounded-sm outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            {/* Seller identity, as Philippine e-commerce rules expect — only the details that are filled in. */}
            <div className="flex flex-col items-center gap-1 text-center text-xs sm:items-start sm:text-left">
              <p>{businessIdentity()}</p>
              {(BUSINESS.address || BUSINESS.phone || BUSINESS.email) && (
                <p>{[BUSINESS.address, BUSINESS.phone, BUSINESS.email].filter(Boolean).join(" · ")}</p>
              )}
              <p>© {new Date().getFullYear()} {BUSINESS.tradeName}. Custom printing, made simple.</p>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  )
}
