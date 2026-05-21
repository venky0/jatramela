import { Suspense } from "react"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import { NavLogo, NavLinks, NavSearchBtn, ThemeToggle } from "./nav-client"
import DasaraTheme from "@modules/layout/components/dasara-theme"

const GoldBorder = () => (
  <div className="temple-border" />
)

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((r: StoreRegion[]) => r),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <GoldBorder />
      <header style={{ background: "var(--bg-header)", boxShadow: "var(--shadow-header)" }}>
        <nav className="content-container flex items-center gap-4 h-16">
          {/* Mobile menu */}
          <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />

          {/* Logo */}
          <NavLogo />

          {/* Center nav links */}
          <div className="flex-1 flex justify-center">
            <NavLinks />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <NavSearchBtn />
            <ThemeToggle />

            {/* Account */}
            <LocalizedClientLink href="/account" data-testid="nav-account-link"
              className="hidden md:flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,248,231,0.2)", color: "var(--text-on-header)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </LocalizedClientLink>

            {/* Cart */}
            <Suspense fallback={
              <LocalizedClientLink href="/cart" data-testid="nav-cart-link"
                className="flex items-center justify-center w-9 h-9 rounded-full transition-all"
                style={{ background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,248,231,0.2)", color: "var(--text-on-header)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
              </LocalizedClientLink>
            }>
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
      <GoldBorder />
    </div>
  )
}
