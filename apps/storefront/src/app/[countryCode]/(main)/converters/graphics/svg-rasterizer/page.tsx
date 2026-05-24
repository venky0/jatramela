"use client"

import { useState } from "react"
import Link from "next/link"
import QuickSwitch from "../../components/quick-switch"

export default function SVGRasterizerPage() {
  const [svgCode, setSvgCode] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [rasterUrl, setRasterUrl] = useState<string | null>(null)
  
  const [format, setFormat] = useState<"png" | "jpeg">("png")
  const [scale, setScale] = useState<number>(2)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      const file = files[0]
      const reader = new FileReader()
      reader.onload = () => {
        setSvgCode(reader.result as string)
        setRasterUrl(null)
      }
      reader.readAsText(file)
    }
  }

  const renderRaster = () => {
    if (!svgCode.trim()) return
    setIsProcessing(true)
    
    // Create Blob from SVG string
    const blob = new Blob([svgCode], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    
    const img = new Image()
    img.onload = () => {
      // Get base dimensions or default to 500
      let w = img.naturalWidth || img.width || 500
      let h = img.naturalHeight || img.height || 500
      
      // Apply scale multiplier
      const tw = w * scale
      const th = h * scale
      
      const canvas = document.createElement("canvas")
      canvas.width = tw
      canvas.height = th
      const ctx = canvas.getContext("2d")
      if (ctx) {
        // If JPEG, fill white background
        if (format === "jpeg") {
          ctx.fillStyle = "#FFFFFF"
          ctx.fillRect(0, 0, tw, th)
        }
        
        ctx.drawImage(img, 0, 0, tw, th)
        
        const mimeType = format === "png" ? "image/png" : "image/jpeg"
        const dataUrl = canvas.toDataURL(mimeType)
        setRasterUrl(dataUrl)
      }
      
      URL.revokeObjectURL(url)
      setIsProcessing(false)
    }
    img.onerror = () => {
      alert("Invalid SVG code or format structure. Please check XML tags.")
      URL.revokeObjectURL(url)
      setIsProcessing(false)
    }
    img.src = url
  }

  const downloadRaster = () => {
    if (!rasterUrl) return
    const a = document.createElement("a")
    a.href = rasterUrl
    a.download = `vector_export.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div style={{ background: "var(--bg-primary)" }}>
      {/* ── HEADER ── */}
      <section style={{ background: "var(--bg-header)" }} className="py-12 text-center relative">
        <div className="temple-border absolute top-0 left-0 right-0" />
        <div className="content-container">
          <Link href="/converters/graphics" className="text-xs font-bold mb-2 block hover:opacity-80" style={{ color: "rgba(255,248,231,0.6)" }}>
            ← Back to Graphics Tools
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-shimmer mb-3" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            SVG to Raster Converter
          </h1>
          <p className="text-xs sm:text-sm max-w-lg mx-auto" style={{ color: "rgba(255,248,231,0.75)" }}>
            Convert vector SVG code or files into high-definition raster PNG/JPEG images in-browser.
          </p>
          <QuickSwitch currentHref="/converters/graphics/svg-rasterizer" />
        </div>
        <div className="temple-border absolute bottom-0 left-0 right-0" />
      </section>

      <div className="content-container py-10 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Inputs & Settings */}
          <div className="lg:col-span-1 space-y-6">
            <div className="heritage-card p-6 space-y-6">
              <h3 className="font-extrabold text-sm border-b pb-3" style={{ fontFamily: "'Baloo 2', sans-serif", borderColor: "var(--border)" }}>
                Raster settings
              </h3>

              {/* File Uploader */}
              <div>
                <label className="field-label">Upload SVG File</label>
                <input type="file" accept=".svg" onChange={handleFileUpload}
                  className="w-full bg-[var(--bg-secondary)] border border-neutral-700 rounded-xl p-3 text-xs text-[var(--text-primary)] file:bg-neutral-800 file:text-[#C9A84C] file:border-none file:px-3 file:py-1 file:rounded file:text-[10px] file:font-bold cursor-pointer" />
              </div>

              {/* Format Select */}
              <div>
                <label className="field-label">Output Format</label>
                <div className="flex gap-2">
                  <button onClick={() => { setFormat("png"); setRasterUrl(null) }}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${format === "png" ? "bg-[#C9A84C] text-[#2C1810]" : "bg-[var(--bg-secondary)] border-neutral-700 text-[var(--text-primary)]"}`}>
                    PNG (Transparent)
                  </button>
                  <button onClick={() => { setFormat("jpeg"); setRasterUrl(null) }}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${format === "jpeg" ? "bg-[#C9A84C] text-[#2C1810]" : "bg-[var(--bg-secondary)] border-neutral-700 text-[var(--text-primary)]"}`}>
                    JPEG (Solid White)
                  </button>
                </div>
              </div>

              {/* Scale Select */}
              <div>
                <label className="field-label">HD Scale Multiplier</label>
                <select value={scale} onChange={e => { setScale(parseInt(e.target.value)); setRasterUrl(null) }}
                  className="w-full bg-[var(--bg-secondary)] border border-neutral-700 rounded-xl p-3 text-xs text-[var(--text-primary)] outline-none focus:border-amber-500">
                  <option value="1">1x Standard Res</option>
                  <option value="2">2x High Definition</option>
                  <option value="4">4x Ultra HD 4K</option>
                  <option value="8">8x Maximum Resolution</option>
                </select>
                <p className="text-[10px] mt-1 text-[var(--text-subtle)]">Multiply width/height to get super sharp PNG/JPG exports.</p>
              </div>

              <div className="pt-4 border-t border-dashed" style={{ borderColor: "var(--border)" }}>
                <button onClick={renderRaster} disabled={isProcessing || !svgCode.trim()} className="w-full btn-gold py-3 text-xs">
                  {isProcessing ? "Rendering..." : "⚙️ Render & Rasterize"}
                </button>
              </div>

              {rasterUrl && (
                <button onClick={downloadRaster} className="w-full btn-primary py-3 text-xs">
                  📥 Download {format.toUpperCase()} Image
                </button>
              )}
            </div>
          </div>

          {/* Right: Code & Preview */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Input SVG Code Area */}
            <div className="heritage-card p-6">
              <h3 className="font-extrabold text-sm mb-3" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Paste SVG Code</h3>
              <textarea value={svgCode} onChange={e => { setSvgCode(e.target.value); setRasterUrl(null) }}
                placeholder="<svg ...>\n  <path ... />\n</svg>"
                className="w-full h-44 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-4 text-xs font-mono text-amber-100 outline-none focus:border-[#C9A84C] resize-none"
              />
            </div>

            {/* Output Preview */}
            <div className="heritage-card p-6 flex flex-col items-center justify-center text-center" style={{ minHeight: 300 }}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">Raster Output Preview</h3>
              <div className="relative border border-white/5 rounded-xl overflow-hidden flex items-center justify-center p-2" 
                style={{ 
                  maxHeight: 280, 
                  width: "100%", 
                  height: 280,
                  background: format === "png" 
                    ? "repeating-conic-gradient(#202020 0% 25%, #2a2a2a 0% 50%) 50% / 16px 16px" 
                    : "#FFFFFF" 
                }}>
                {rasterUrl ? (
                  <img src={rasterUrl} alt="Raster preview" className="object-contain max-h-full max-w-full" />
                ) : (
                  <div className="text-xs text-[var(--text-subtle)] opacity-60">Paste SVG XML or Upload SVG file above, then click Render.</div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
