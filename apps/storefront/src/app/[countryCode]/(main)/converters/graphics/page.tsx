import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Image & Graphic Tools | Jatramela Online Converters",
  description: "Upscale, optimize, and vectorize graphics in your browser. AI vector tracing, WebP compression, SVG rasterizing, and color extraction.",
}

const TOOLS = [
  { name: "AI Vector Logo Converter", desc: "Convert PNG/JPEG raster logos to layered vector EPS & SVG files with smart curve fitting.", href: "/converters/graphics/vectorizer", icon: "📐" },
  { name: "WebP Image Optimizer", desc: "Compress and scale down images to WebP format for fast web page loading speeds.", href: "/converters/graphics/webp-optimizer", icon: "📦" },
  { name: "SVG to Raster", desc: "Convert SVG vectors to high-definition PNG/JPEG images with custom scale multipliers.", href: "/converters/graphics/svg-rasterizer", icon: "🖼️" },
  { name: "Color Palette Extractor", desc: "Upload any image to extract dominant color palettes and CSS variables using K-Means++.", href: "/converters/graphics/color-extractor", icon: "🎨" },
]

export default function GraphicsCategoryPage() {
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
            Image & Graphic Tools
          </h1>
          <p className="text-sm max-w-md mx-auto" style={{ color: "rgba(255,248,231,0.7)" }}>
            Professional browser-based graphics tools. Process files locally with 100% data privacy.
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
                  Open Converter Tool →
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
