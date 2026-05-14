"use client"

import { useEffect, useState } from "react"

// Dasara Festival Theme — October 1 to November 15
function isDasaraSeason(): boolean {
  const now   = new Date()
  const month = now.getMonth() + 1  // 1-indexed
  const day   = now.getDate()
  return (month === 10) || (month === 11 && day <= 15)
}

// Applied via CSS class on <html> / root div
const DASARA_CSS = `
  :root {
    --bg-header:      #4a0a0a !important;
    --bg-primary:     #1a0505 !important;
    --bg-secondary:   #2d0a0a !important;
    --primary:        #C0392B !important;
    --gold:           #E8C56A !important;
    --gold-bright:    #FFD700 !important;
    --gold-primary:   #FFD700 !important;
  }
  body::before {
    content: "🪔 Happy Dasara! Celebrating Karnataka's Grand Festival";
    display: block;
    background: linear-gradient(90deg, #4a0a0a, #8B0000, #4a0a0a);
    color: #FFD700;
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.08em;
    padding: 8px;
    border-bottom: 1px solid rgba(255,215,0,0.3);
  }
`

export default function DasaraTheme() {
  const [active, setActive]     = useState(false)
  const [season, setSeason]     = useState(false)
  const [mounted, setMounted]   = useState(false)

  useEffect(() => {
    setMounted(true)
    setSeason(isDasaraSeason())
    // Check localStorage for manual override
    const stored = localStorage.getItem("jatramela-dasara-theme")
    if (stored === "on" || (stored === null && isDasaraSeason())) {
      setActive(true)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    // Toggle the style tag
    const id = "dasara-theme-style"
    const existing = document.getElementById(id)
    if (active) {
      if (!existing) {
        const style = document.createElement("style")
        style.id = id
        style.textContent = DASARA_CSS
        document.head.appendChild(style)
      }
      document.documentElement.classList.add("dasara-theme")
      localStorage.setItem("jatramela-dasara-theme", "on")
    } else {
      existing?.remove()
      document.documentElement.classList.remove("dasara-theme")
      localStorage.setItem("jatramela-dasara-theme", "off")
    }
  }, [active, mounted])

  if (!mounted) return null

  return (
    <div className="flex items-center gap-2">
      {/* Dasara toggle button in the nav */}
      <button
        onClick={() => setActive(a => !a)}
        title={active ? "Switch off Dasara theme" : "Switch on Dasara theme 🪔"}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-200"
        style={{
          background: active
            ? "linear-gradient(135deg, #8B0000 0%, #4a0a0a 100%)"
            : "rgba(255,255,255,0.08)",
          border: active
            ? "1px solid rgba(255,215,0,0.5)"
            : "1px solid rgba(255,248,231,0.15)",
          color: active ? "#FFD700" : "rgba(255,248,231,0.6)",
          boxShadow: active ? "0 2px 12px rgba(139,0,0,0.4)" : "none",
        }}
      >
        <span style={{ fontSize: "14px" }}>🪔</span>
        <span className="hidden sm:inline">
          {active ? "Dasara" : season ? "Dasara ON?" : "Festival"}
        </span>
      </button>
    </div>
  )
}
