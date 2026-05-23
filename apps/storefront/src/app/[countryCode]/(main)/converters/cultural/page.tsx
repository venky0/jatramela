import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Local Script & Cultural Tools | Jatramela Online Converters",
  description: "Type phonetically in Kannada, translate legacy Nudi ASCII fonts to standard Unicode, and calculate Hindu Panchanga dates.",
}

const TOOLS = [
  { name: "English ➔ Kannada Phonetic", desc: "Type in phonetic English (e.g. namaskara) and watch it convert to Kannada Unicode script in real-time.", href: "/converters/cultural/kannada-transliteration", icon: "⌨️" },
  { name: "Nudi/Baraha ➔ Unicode", desc: "Instantly translate legacy ASCII text formats typed in Nudi or Baraha fonts to modern standard Unicode text.", href: "/converters/cultural/unicode-converter", icon: "✍️" },
  { name: "Gregorian ➔ Hindu Calendar", desc: "Calculate tithi, paksha, lunar months, nakshatras, and active festivals for any Gregorian calendar date.", href: "/converters/cultural/hindu-calendar", icon: "📅" },
]

export default function CulturalCategoryPage() {
  return (
    <div style={{ background: "var(--bg-primary)" }}>
      {/* ── HEADER ── */}
      <section style={{ background: "var(--bg-header)" }} className="py-12 text-center relative">
        <div className="temple-border absolute top-0 left-0 right-0" />
        <div className="content-container">
          <Link href="/converters" className="text-xs font-bold mb-2 block hover:opacity-80" style={{ color: "rgba(255,248,231,0.6)" }}>
            ← Back to All Converters
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-shimmer mb-3" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            Local Script & Cultural Tools
          </h1>
          <p className="text-sm max-w-md mx-auto" style={{ color: "rgba(255,248,231,0.7)" }}>
            Traditional script transliterators and cultural date calculators.
          </p>
        </div>
        <div className="temple-border absolute bottom-0 left-0 right-0" />
      </section>

      {/* ── TOOLS GRID ── */}
      <div className="content-container py-14 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TOOLS.map(tool => (
            <div key={tool.href} className="heritage-card p-6 flex flex-col justify-between">
              <div>
                <div className="text-3xl mb-4">{tool.icon}</div>
                <h2 className="text-lg font-extrabold mb-2" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--primary)" }}>
                  {tool.name}
                </h2>
                <p className="text-xs mb-6 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {tool.desc}
                </p>
              </div>
              <Link href={tool.href}>
                <button className="w-full btn-gold py-2.5 text-xs">
                  Open Tool →
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
