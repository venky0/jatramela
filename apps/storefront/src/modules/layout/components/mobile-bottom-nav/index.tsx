"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { usePathname } from "next/navigation"

const NAV_ITEMS = [
  {
    label: "Home",
    href: "/",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "#C9A84C" : "none"}
        stroke={active ? "#C9A84C" : "currentColor"} strokeWidth="1.8">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    label: "Shop",
    href: "/store",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "#C9A84C" : "none"}
        stroke={active ? "#C9A84C" : "currentColor"} strokeWidth="1.8">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
  },
  {
    label: "Organic",
    href: "/categories/organic",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "#C9A84C" : "none"}
        stroke={active ? "#C9A84C" : "currentColor"} strokeWidth="1.8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    label: "Cart",
    href: "/cart",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "#C9A84C" : "none"}
        stroke={active ? "#C9A84C" : "currentColor"} strokeWidth="1.8">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
  },
  {
    label: "Account",
    href: "/account",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "#C9A84C" : "none"}
        stroke={active ? "#C9A84C" : "currentColor"} strokeWidth="1.8">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  // Strip the country code prefix (e.g. /in/store → /store)
  const normalizedPath = pathname.replace(/^\/[a-z]{2}/, "") || "/"

  const isActive = (href: string) =>
    href === "/" ? normalizedPath === "/" : normalizedPath.startsWith(href)

  return (
    <nav
      className="xl:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-2 safe-area-pb"
      style={{
        background: "linear-gradient(0deg, #1a0a00 0%, rgba(26,10,0,0.97) 100%)",
        borderTop: "1px solid rgba(201,168,76,0.2)",
        boxShadow: "0 -8px 32px rgba(0,0,0,0.4)",
        paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))",
      }}
    >
      {NAV_ITEMS.map(({ label, href, icon }) => {
        const active = isActive(href)
        return (
          <LocalizedClientLink
            key={href}
            href={href}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[52px]"
            style={{
              background: active ? "rgba(201,168,76,0.15)" : "transparent",
              color: active ? "#C9A84C" : "rgba(255,248,231,0.5)",
            }}
          >
            {icon(active)}
            <span
              className="text-[10px] font-medium leading-none"
              style={{ color: active ? "#C9A84C" : "rgba(255,248,231,0.45)" }}
            >
              {label}
            </span>
          </LocalizedClientLink>
        )
      })}
    </nav>
  )
}
