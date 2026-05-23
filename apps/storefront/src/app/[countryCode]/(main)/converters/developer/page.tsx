import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Developer & Data Tools | Jatramela Online Converters",
  description: "Parse, format, and convert developer data layouts instantly in-browser. JSON, YAML, CSV, Base64, and Markdown parsing.",
}

const TOOLS = [
  { name: "JSON ➔ YAML / YAML ➔ JSON", desc: "Format, validate, and convert configuration files dynamically.", href: "/converters/developer/json-yaml", icon: "⚙️" },
  { name: "CSV ➔ JSON / JSON ➔ CSV", desc: "Parse spreadsheets, tabulations, and tables into structured array objects.", href: "/converters/developer/csv-json", icon: "📊" },
  { name: "Base64 Encoder/Decoder", desc: "Encode or decode strings and files into Base64 format locally in-browser.", href: "/converters/developer/base64", icon: "🔒" },
  { name: "Markdown ➔ HTML", desc: "Convert text notes styled with Markdown into structured HTML tags instantly.", href: "/converters/developer/markdown-html", icon: "💻" },
]

export default function DeveloperCategoryPage() {
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
            Developer & Data Tools
          </h1>
          <p className="text-sm max-w-md mx-auto" style={{ color: "rgba(255,248,231,0.7)" }}>
            Frictionless data structure formatters and text parsers. Processing runs entirely local to your tab.
          </p>
        </div>
        <div className="temple-border absolute bottom-0 left-0 right-0" />
      </section>

      {/* ── TOOLS GRID ── */}
      <div className="content-container py-14 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  Open Utility Tool →
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
