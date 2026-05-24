import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "PDF & Document Tools | Jatramela Online Converters",
  description: "Compress PDFs, compile images into PDF files, and split or merge document pages entirely in your browser with 100% data privacy.",
}

const TOOLS = [
  { 
    name: "PDF Compressor", 
    desc: "Shrink the size of PDF documents by downscaling and compressing embedded images. Ideal for online form submissions.", 
    href: "/converters/pdf/compressor", 
    icon: "🗜️" 
  },
  { 
    name: "Images to PDF Converter", 
    desc: "Assemble JPEG, PNG, or WebP images into a single professional PDF. Adjust orientation, margins, and paper size.", 
    href: "/converters/pdf/images-to-pdf", 
    icon: "📸" 
  },
  { 
    name: "PDF Split & Merge Organizer", 
    desc: "Merge multiple documents into a single PDF, or extract specific page ranges to split documents apart.", 
    href: "/converters/pdf/organizer", 
    icon: "📁" 
  },
]

export default function PDFCategoryPage() {
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
            PDF & Document Tools
          </h1>
          <p className="text-base max-w-md mx-auto" style={{ color: "rgba(255,248,231,0.7)" }}>
            Perform advanced PDF adjustments client-side. Your files never leave your browser, ensuring complete privacy.
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
                <h2 className="text-xl font-extrabold mb-2" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--primary)" }}>
                  {tool.name}
                </h2>
                <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {tool.desc}
                </p>
              </div>
              <Link href={tool.href}>
                <button className="w-full btn-gold py-2.5 text-sm">
                  Open PDF Tool →
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
