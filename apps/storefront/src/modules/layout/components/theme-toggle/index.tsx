"use client"

import { useTheme } from "@lib/context/theme-provider"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <button onClick={toggleTheme} aria-label={isDark ? "Switch to day mode" : "Switch to night mode"}
      title={isDark ? "Day Mode" : "Night Mode"}
      className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 flex-shrink-0"
      style={{
        background: "rgba(255,255,255,0.1)",
        border: "1.5px solid rgba(255,248,231,0.2)",
        color: "var(--text-on-header)",
        animation: "spin-toggle 0.3s ease-out",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.background = "var(--gold)"
        el.style.borderColor = "var(--gold)"
        el.style.color = "#2C1810"
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.background = "rgba(255,255,255,0.1)"
        el.style.borderColor = "rgba(255,248,231,0.2)"
        el.style.color = "var(--text-on-header)"
      }}>
      {isDark ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  )
}
