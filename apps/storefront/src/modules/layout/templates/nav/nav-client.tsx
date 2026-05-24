"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import SearchModal from "@modules/layout/components/search-modal"
import { ThemeToggle } from "@modules/layout/components/theme-toggle"

// ── Jatramela Design Tokens (Karnataka Heritage Theme) ──────────────────────
// Primary gold: #C9A84C | Dark bg: #1a0a00 | Text: #FFF8E7
// Font: Baloo 2 (brand), Inter (body)

export const SHOPPING_LINKS = [
  { label: "Shop All",     href: "/store",               emoji: "🛒" },
  { label: "Clothing",     href: "/categories/clothing", emoji: "🥻" },
  { label: "Organic Food", href: "/categories/organic",  emoji: "🌾" },
  { label: "Wellness",     href: "/categories/wellness", emoji: "🌿" },
  { label: "Handicrafts",  href: "/categories/handicrafts", emoji: "🪔" },
]

export const NAV_LINKS = [
  { label: "Jatras",      href: "/jatras",              emoji: "🛕" },
  { label: "Converters",  href: "/converters",          emoji: "⚡" },
  { label: "Blog",        href: "/blog",                emoji: "📖" },
  { label: "FAQ",         href: "/faq",                 emoji: "💬" },
  { label: "About",       href: "/about",               emoji: "🌺" },
]

export function NavLogo() {
  return (
    <Link href="/" className="flex items-center gap-3 flex-shrink-0" data-testid="nav-store-link">
      <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden"
        style={{ border: "2px solid rgba(201,168,76,0.7)", boxShadow: "0 2px 8px rgba(201,168,76,0.3)" }}>
        <Image src="/images/warli-logo.png" alt="Jatramela" fill className="object-cover" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-extrabold text-lg tracking-tight" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--gold-bright)", letterSpacing: "-0.01em" }}>
          JATRAMELA
        </span>
        <span className="text-[9px] tracking-widest font-semibold uppercase" style={{ color: "rgba(255,248,231,0.55)" }}>
          Back to Roots · Karnataka
        </span>
      </div>
    </Link>
  )
}

export function NavLinks() {
  const [isShoppingOpen, setIsShoppingOpen] = useState(false)

  return (
    <nav className="hidden xl:flex items-center gap-0.5">
      {/* Home */}
      <Link href="/" className="nav-link px-3 py-1.5 rounded-full transition-all duration-200 hover:bg-white/10">
        Home
      </Link>

      {/* Shopping Dropdown */}
      <div 
        className="relative py-1.5"
        onMouseEnter={() => setIsShoppingOpen(true)}
        onMouseLeave={() => setIsShoppingOpen(false)}
      >
        <button 
          className="nav-link px-3 py-1.5 rounded-full transition-all duration-200 hover:bg-white/10 flex items-center gap-1.5 outline-none cursor-pointer"
          style={{ color: "var(--text-on-header)", fontFamily: "'Baloo 2', sans-serif" }}
        >
          <span>Shopping</span>
          <svg 
            width="10" 
            height="10" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3"
            className={`transition-transform duration-200 ${isShoppingOpen ? "rotate-180" : ""}`}
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>

        {/* Dropdown Menu */}
        <div 
          className={`absolute left-1/2 -translate-x-1/2 top-full w-52 rounded-2xl border p-1.5 shadow-2xl transition-all duration-200 z-50 ${
            isShoppingOpen 
              ? "opacity-100 translate-y-1 pointer-events-auto" 
              : "opacity-0 -translate-y-1 pointer-events-none"
          }`}
          style={{ 
            background: "var(--bg-glass, rgba(38,20,8,0.95))", 
            backdropFilter: "blur(16px) saturate(160%)",
            borderColor: "var(--border, rgba(232,197,106,0.2))",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
          }}
        >
          {SHOPPING_LINKS.map(link => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 hover:bg-white/5 group/item"
              style={{ color: "var(--text-on-header, #FFF8E7)", fontFamily: "'Baloo 2', sans-serif" }}
            >
              <span className="text-sm">{link.emoji}</span>
              <span className="text-xs font-extrabold group-hover/item:text-[#C9A84C] transition-colors">
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Nav Links */}
      {NAV_LINKS.map(link => (
        <Link key={link.href} href={link.href} className="nav-link px-3 py-1.5 rounded-full transition-all duration-200 hover:bg-white/10">
          {link.label}
        </Link>
      ))}
    </nav>
  )
}

export function NavSearchBtn() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsSearchOpen(true)
      }
      if (e.key === "Escape") setIsSearchOpen(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      <button 
        onClick={() => setIsSearchOpen(true)}
        className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all duration-300"
        style={{ 
          background: "rgba(255,255,255,0.06)", 
          border: "1px solid rgba(255,248,231,0.12)", 
          color: "rgba(255,248,231,0.7)" 
        }}
        onMouseEnter={e => { 
          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.4)"
        }}
        onMouseLeave={e => { 
          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,248,231,0.12)"
        }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <span>Search</span>
        <span className="ml-2 text-[9px] opacity-40 px-1.5 py-0.5 rounded border border-white/10">⌘K</span>
      </button>
      
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}

export { ThemeToggle }
