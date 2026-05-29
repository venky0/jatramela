import { Suspense } from "react"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import { NavLogo, NavLinks, NavSearchBtn, ThemeToggle } from "./nav-client"
import { getCMSConfig } from "@lib/data/portal-actions"

const GoldBorder = () => (
  <div className="temple-border" />
)

export default async function Nav() {
  const [regions, locales, currentLocale, cmsConfig] = await Promise.all([
    listRegions().then((r: StoreRegion[]) => r),
    listLocales(),
    getLocale(),
    getCMSConfig(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      {/* Theme Variable Injection */}
      {cmsConfig.theme?.primaryColor && (
        <style dangerouslySetInnerHTML={{__html: `
          :root {
            ${cmsConfig.theme.primaryColor === 'gold' ? `
              --primary: #D4AF37;
              --primary-dark: #AA8418;
              --bg-header: #111111;
              --bg-primary: #0D0D0D;
              --bg-secondary: #161616;
              --bg-card: #1c1c1c;
              --text-primary: #FFF3D6;
              --gold: #D4AF37;
              --border: rgba(212,175,55,0.25);
              --gradient-btn: linear-gradient(135deg, #D4AF37 0%, #AA8418 100%);
              --gradient-gold-btn: linear-gradient(135deg, #D4AF37 0%, #AA8418 100%);
            ` : ''}
            ${cmsConfig.theme.primaryColor === 'default' ? `
              --primary: #2E6B3E;
              --primary-dark: #1b4325;
              --bg-header: #1b4325;
              --gradient-btn: linear-gradient(135deg, #2E6B3E 0%, #1b4325 100%);
            ` : ''}
          }
        `}} />
      )}

      {/* Announcement Bar */}
      {cmsConfig.announcement?.enabled && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-amber-500 text-zinc-950 text-xs font-bold text-center py-2 px-4 select-none relative z-50 flex items-center justify-center gap-2 shadow-[inset_0_-1px_0_rgba(0,0,0,0.1)]">
          <span>{cmsConfig.announcement.text}</span>
        </div>
      )}

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
