"use client"

import Link from "next/link"

const CATEGORIES = [
  {
    id: "graphics",
    name: "🎨 Image & Graphic Tools",
    desc: "Scale up, optimize, and vectorize graphics entirely in your browser.",
    href: "/converters/graphics",
    tools: [
      { name: "AI Vector Logo Converter", desc: "Raster (PNG/JPG) to layered EPS/SVG vector curves.", href: "/converters/graphics/vectorizer" },
      { name: "WebP Image Optimizer", desc: "Compress and resize images to WebP format for fast web pages.", href: "/converters/graphics/webp-optimizer" },
      { name: "SVG to Raster", desc: "Convert SVG vectors to high-res PNG/JPEG with scaling factors.", href: "/converters/graphics/svg-rasterizer" },
      { name: "Color Palette Extractor", desc: "Extract dominant color swatches and CSS variables using K-Means++.", href: "/converters/graphics/color-extractor" },
    ]
  },
  {
    id: "pdf",
    name: "📄 PDF & Document Tools",
    desc: "Compress, merge, split, and convert images to PDF completely locally.",
    href: "/converters/pdf",
    tools: [
      { name: "PDF Compressor", desc: "Reduce PDF file sizes by compressing and downscaling page images.", href: "/converters/pdf/compressor" },
      { name: "Images to PDF Converter", desc: "Convert multiple PNG/JPG/WebP images into a single clean PDF.", href: "/converters/pdf/images-to-pdf" },
      { name: "PDF Split & Merge Organizer", desc: "Merge multiple documents or extract select pages from a PDF.", href: "/converters/pdf/organizer" },
    ]
  },
  {
    id: "cultural",
    name: "🛕 Local Script & Cultural Tools",
    desc: "Transliterate Kannada script, convert legacy fonts, and calculate Panchanga dates.",
    href: "/converters/cultural",
    tools: [
      { name: "English ➔ Kannada Phonetic", desc: "Phonetic English typing converts to Kannada Unicode in real-time.", href: "/converters/cultural/kannada-transliteration" },
      { name: "Nudi/Baraha ➔ Unicode", desc: "Translate legacy Kannada ASCII text into standard Unicode.", href: "/converters/cultural/unicode-converter" },
      { name: "Gregorian ➔ Hindu Calendar", desc: "Calculate tithi, paksha, lunar months, and panchanga indicators.", href: "/converters/cultural/hindu-calendar" },
    ]
  },
  {
    id: "developer",
    name: "⚡ Developer & Data Tools",
    desc: "Format, convert, and parse developer data layouts instantly.",
    href: "/converters/developer",
    tools: [
      { name: "JSON ➔ YAML / YAML ➔ JSON", desc: "Format and translate configuration files instantly.", href: "/converters/developer/json-yaml" },
      { name: "CSV ➔ JSON / JSON ➔ CSV", desc: "Convert spreadsheet rows to structured data arrays.", href: "/converters/developer/csv-json" },
      { name: "Base64 Encoder/Decoder", desc: "Encode or decode strings and files into Base64 format.", href: "/converters/developer/base64" },
      { name: "Markdown ➔ HTML", desc: "Translate formatted markdown notes into styled HTML tags.", href: "/converters/developer/markdown-html" },
    ]
  }
]

export default function ConvertersDashboard() {
  return (
    <div style={{ background: "var(--bg-primary)" }}>
      {/* ── HEADER ── */}
      <section style={{ background: "var(--bg-header)" }} className="py-14 text-center relative">
        <div className="temple-border absolute top-0 left-0 right-0" />
        <div className="content-container">
          <p className="section-label mb-3" style={{ color: "rgba(255,248,231,0.6)" }}>Online Utility Suite</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-shimmer mb-4" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            Jatramela Online Converters
          </h1>
          <p className="text-base max-w-lg mx-auto leading-relaxed" style={{ color: "rgba(255,248,231,0.75)" }}>
            High-fidelity client-side utility apps. All operations happen directly inside your browser for 100% privacy and sub-second speed.
          </p>
        </div>
        <div className="temple-border absolute bottom-0 left-0 right-0" />
      </section>

      {/* ── DASHBOARD GRID ── */}
      <div className="content-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CATEGORIES.map(category => (
            <div key={category.id} className="heritage-card p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-extrabold mb-3 text-gradient-red" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                  {category.name}
                </h2>
                <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {category.desc}
                </p>

                {/* Tools List */}
                <div className="space-y-4">
                  {category.tools.map(tool => (
                    <Link key={tool.href} href={tool.href} className="block group">
                      <div className="p-3.5 rounded-xl border transition-all duration-200 hover:border-[#C9A84C] hover:bg-white/5"
                        style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}>
                        <p className="font-extrabold text-sm group-hover:text-[#C9A84C] transition-colors" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                          {tool.name} →
                        </p>
                        <p className="text-xs mt-1.5 leading-normal" style={{ color: "var(--text-subtle)" }}>
                          {tool.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t" style={{ borderColor: "var(--border)" }}>
                <Link href={category.href}>
                  <button className="w-full btn-gold py-2.5 text-sm">
                    View Category Page
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Security / Privacy Banner */}
        <div className="mt-12 p-8 rounded-2xl border text-center max-w-2xl mx-auto" style={{ background: "var(--bg-section-alt)", borderColor: "var(--border)" }}>
          <p className="text-3xl mb-3">🛡️</p>
          <h3 className="text-xl font-extrabold mb-2" style={{ fontFamily: "'Baloo 2', sans-serif" }}>100% In-Browser Privacy Guard</h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            None of your files, images, texts, or documents are ever uploaded to a server. 
            All conversion computations are done directly inside your local browser tab using advanced WebAssembly, Canvas API, and JavaScript engines.
          </p>
        </div>
      </div>
    </div>
  )
}
