"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

const ThemeContext = createContext<{
  theme: Theme
  toggleTheme: () => void
}>({ theme: "light", toggleTheme: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = (localStorage.getItem("jatramela-theme") as Theme) || "light"
    setTheme(saved)
    document.documentElement.setAttribute("data-theme", saved)
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : "light"
    setTheme(next)
    localStorage.setItem("jatramela-theme", next)
    document.documentElement.setAttribute("data-theme", next)
  }

  // Avoid flash of wrong theme
  if (!mounted) {
    return (
      <div style={{ visibility: "hidden" }} suppressHydrationWarning>
        {children}
      </div>
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
