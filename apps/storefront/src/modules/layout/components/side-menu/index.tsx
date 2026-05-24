"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import useToggleState from "@lib/hooks/use-toggle-state"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Fragment } from "react"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { Locale } from "@lib/data/locales"

const MENU_SECTIONS = [
  {
    label: "Shop",
    items: [
      { name: "Shop All",     href: "/store",                   icon: "🛒" },
      { name: "Clothing",     href: "/categories/clothing",     icon: "🥻" },
      { name: "Organic Food", href: "/categories/organic",      icon: "🌾" },
      { name: "Wellness",     href: "/categories/wellness",     icon: "🌿" },
      { name: "Handicrafts",  href: "/categories/handicrafts",  icon: "🪔" },
    ],
  },
  {
    label: "Explore",
    items: [
      { name: "Tourism",    href: "/tourism",    icon: "🌾" },
      { name: "Converters", href: "/converters", icon: "⚡" },
      { name: "Blog",    href: "/blog",    icon: "📖" },
      { name: "FAQ",     href: "/faq",     icon: "💬" },
      { name: "About",   href: "/about",   icon: "🌺" },
    ],
  },
  {
    label: "Account",
    items: [
      { name: "My Account",  href: "/account",  icon: "👤" },
      { name: "My Cart",     href: "/cart",      icon: "🛍️" },
    ],
  },
]

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

const SideMenu = ({ regions, locales, currentLocale }: SideMenuProps) => {
  const countryToggleState  = useToggleState()
  const languageToggleState = useToggleState()

  return (
    <div className="xl:hidden flex items-center">
      <div className="flex items-center">
        <Popover className="flex">
          {({ open, close }) => (
            <>
              <div className="relative flex">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative h-9 flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 focus:outline-none"
                  style={{
                    background: open ? "rgba(201,168,76,0.18)" : "rgba(255,255,255,0.08)",
                    border: `1px solid ${open ? "rgba(201,168,76,0.6)" : "rgba(255,248,231,0.18)"}`,
                    color: open ? "#C9A84C" : "var(--text-on-header, #FFF8E7)",
                  }}
                >
                  {/* Hamburger → X animation */}
                  <span className="flex flex-col justify-center gap-[4px] w-4" aria-hidden>
                    <span className="block h-[1.5px] rounded-full bg-current transition-all duration-200"
                      style={{ width: open ? "100%" : "100%", transform: open ? "translateY(5.5px) rotate(45deg)" : "none" }} />
                    <span className="block h-[1.5px] rounded-full bg-current transition-all duration-200"
                      style={{ opacity: open ? 0 : 1 }} />
                    <span className="block h-[1.5px] rounded-full bg-current transition-all duration-200"
                      style={{ transform: open ? "translateY(-5.5px) rotate(-45deg)" : "none" }} />
                  </span>
                  <span className="text-xs font-semibold tracking-wide hidden sm:inline">Menu</span>
                </Popover.Button>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[50] pointer-events-auto"
                  style={{ background: "rgba(10,5,0,0.55)", backdropFilter: "blur(2px)" }}
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-250"
                enterFrom="opacity-0 -translate-x-6"
                enterTo="opacity-100 translate-x-0"
                leave="transition ease-in duration-180"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 -translate-x-6"
              >
                <PopoverPanel
                  className="flex flex-col fixed top-0 left-0 h-screen w-[310px] z-[51]"
                  data-testid="nav-menu-popup"
                  style={{
                    background: "linear-gradient(165deg, #1a0a00 0%, #2d1200 60%, #1a0a00 100%)",
                    borderRight: "1px solid rgba(201,168,76,0.25)",
                    boxShadow: "8px 0 40px rgba(0,0,0,0.6)",
                  }}
                >
                  {/* Top bar */}
                  <div className="flex items-center justify-between px-6 py-5"
                    style={{ borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-base tracking-tight"
                        style={{ color: "#C9A84C", fontFamily: "'Baloo 2', sans-serif" }}>
                        JATRAMELA
                      </span>
                      <span className="text-[9px] tracking-widest font-medium uppercase"
                        style={{ color: "rgba(255,248,231,0.45)" }}>
                        Back to Roots · Karnataka
                      </span>
                    </div>
                    <button
                      data-testid="close-menu-button"
                      onClick={close}
                      className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,248,231,0.12)", color: "rgba(255,248,231,0.7)" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M18 6 6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>

                  {/* Scrollable nav */}
                  <div className="flex-1 overflow-y-auto py-4 px-4">
                    {MENU_SECTIONS.map((section) => (
                      <div key={section.label} className="mb-6">
                        <p className="text-[10px] font-bold tracking-[0.15em] uppercase px-3 mb-2"
                          style={{ color: "rgba(201,168,76,0.55)" }}>
                          {section.label}
                        </p>
                        <ul className="flex flex-col gap-0.5">
                          {section.items.map(({ name, href, icon }) => (
                            <li key={name}>
                              <LocalizedClientLink
                                href={href}
                                onClick={close}
                                data-testid={`${name.toLowerCase().replace(/\s+/g, "-")}-link`}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group"
                                style={{
                                  color: "rgba(255,248,231,0.85)",
                                  border: "1px solid transparent",
                                }}
                                onMouseEnter={e => {
                                  (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.12)"
                                  ;(e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.25)"
                                  ;(e.currentTarget as HTMLElement).style.color = "#C9A84C"
                                }}
                                onMouseLeave={e => {
                                  (e.currentTarget as HTMLElement).style.background = "transparent"
                                  ;(e.currentTarget as HTMLElement).style.borderColor = "transparent"
                                  ;(e.currentTarget as HTMLElement).style.color = "rgba(255,248,231,0.85)"
                                }}
                              >
                                <span className="text-lg leading-none w-7 text-center flex-shrink-0">{icon}</span>
                                <span className="text-sm font-medium">{name}</span>
                                <svg className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" width="14" height="14"
                                  viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2">
                                  <path d="M9 18l6-6-6-6"/>
                                </svg>
                              </LocalizedClientLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Bottom section */}
                  <div className="px-4 py-5 space-y-3"
                    style={{ borderTop: "1px solid rgba(201,168,76,0.15)" }}>

                    {!!locales?.length && (
                      <div className="flex justify-between items-center"
                        onMouseEnter={languageToggleState.open}
                        onMouseLeave={languageToggleState.close}>
                        <LanguageSelect
                          toggleState={languageToggleState}
                          locales={locales}
                          currentLocale={currentLocale}
                        />
                      </div>
                    )}

                    {regions && (
                      <div className="flex justify-between items-center"
                        onMouseEnter={countryToggleState.open}
                        onMouseLeave={countryToggleState.close}>
                        <CountrySelect
                          toggleState={countryToggleState}
                          regions={regions}
                        />
                      </div>
                    )}

                    {/* Tagline */}
                    <div className="pt-1 pb-1">
                      <p className="text-[10px] text-center font-medium"
                        style={{ color: "rgba(255,248,231,0.3)" }}>
                        🌾 © {new Date().getFullYear()} Jatramela — Preserving Karnataka&apos;s Heritage
                      </p>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
