"use client"

import { useState } from "react"
import Link from "next/link"

interface Pixel {
  r: number
  g: number
  b: number
  a: number
}

export default function ColorExtractorPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [extractedColors, setExtractedColors] = useState<string[]>([])
  const [colorCount, setColorCount] = useState<number>(6)
  const [copyStatus, setCopyStatus] = useState<string | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      const file = files[0]
      const url = URL.createObjectURL(file)
      setImageUrl(url)
      setExtractedColors([])
      
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = 120
        canvas.height = 120 // Small dimensions for fast K-Means
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.drawImage(img, 0, 0, 120, 120)
          const imgData = ctx.getImageData(0, 0, 120, 120)
          const pixels: Pixel[] = []
          for (let i = 0; i < imgData.data.length; i += 4) {
            pixels.push({
              r: imgData.data[i],
              g: imgData.data[i + 1],
              b: imgData.data[i + 2],
              a: imgData.data[i + 3],
            })
          }
          runColorExtraction(pixels)
        }
      }
      img.src = url
    }
  }

  const runColorExtraction = (pixels: Pixel[]) => {
    setIsProcessing(true)
    setTimeout(() => {
      // 1. Filter out transparent pixels
      const solidPixels = pixels.filter(p => p.a >= 80)
      if (solidPixels.length === 0) {
        setIsProcessing(false)
        return
      }

      // 2. K-Means++ Seeding
      const centroids: Pixel[] = []
      const firstIdx = Math.floor(Math.random() * solidPixels.length)
      centroids.push({ ...solidPixels[firstIdx] })

      for (let i = 1; i < colorCount; i++) {
        let maxDist = -1
        let furthestIdx = 0
        
        for (let j = 0; j < solidPixels.length; j += 7) { // sampled scan
          const p = solidPixels[j]
          let minDist = Infinity
          for (const c of centroids) {
            const dist = Math.hypot(p.r - c.r, p.g - c.g, p.b - c.b)
            if (dist < minDist) {
              minDist = dist
            }
          }
          if (minDist > maxDist) {
            maxDist = minDist
            furthestIdx = j
          }
        }
        centroids.push({ ...solidPixels[furthestIdx] })
      }

      // 3. Iterative clustering
      for (let iter = 0; iter < 12; iter++) {
        const clusters: Pixel[][] = Array.from({ length: colorCount }, () => [])
        for (const p of solidPixels) {
          let minDist = Infinity
          let minIdx = 0
          for (let c = 0; c < colorCount; c++) {
            const dist = Math.hypot(p.r - centroids[c].r, p.g - centroids[c].g, p.b - centroids[c].b)
            if (dist < minDist) {
              minDist = dist
              minIdx = c
            }
          }
          clusters[minIdx].push(p)
        }

        let changed = false
        for (let c = 0; c < colorCount; c++) {
          if (clusters[c].length === 0) continue
          let sumR = 0, sumG = 0, sumB = 0
          for (const p of clusters[c]) {
            sumR += p.r
            sumG += p.g
            sumB += p.b
          }
          const newCentroid = {
            r: Math.round(sumR / clusters[c].length),
            g: Math.round(sumG / clusters[c].length),
            b: Math.round(sumB / clusters[c].length),
            a: 255
          }
          const diff = Math.hypot(newCentroid.r - centroids[c].r, newCentroid.g - centroids[c].g, newCentroid.b - centroids[c].b)
          if (diff > 1.5) {
            centroids[c] = newCentroid
            changed = true
          }
        }
        if (!changed) break
      }

      const colors = centroids.map(c => rgbToHex(c.r, c.g, c.b))
      setExtractedColors(colors)
      setIsProcessing(false)
    }, 50)
  }

  const rgbToHex = (r: number, g: number, b: number): string => {
    const toHex = (c: number) => {
      const hex = Math.max(0, Math.min(255, c)).toString(16)
      return hex.length === 1 ? "0" + hex : hex
    }
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus(label)
      setTimeout(() => setCopyStatus(null), 1800)
    })
  }

  const getCssVariables = () => {
    return extractedColors.map((c, i) => `  --color-${i + 1}: ${c};`).join("\n")
  }

  const getTailwindConfig = () => {
    return extractedColors.map((c, i) => `        color${i + 1}: "${c}",`).join("\n")
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
            Color Palette Extractor
          </h1>
          <p className="text-xs sm:text-sm max-w-lg mx-auto" style={{ color: "rgba(255,248,231,0.75)" }}>
            Extract professional color schemes, CSS values, and Tailwind configs from any uploaded graphic asset.
          </p>
        </div>
        <div className="temple-border absolute bottom-0 left-0 right-0" />
      </section>

      <div className="content-container py-10 max-w-5xl mx-auto">
        {!imageUrl ? (
          /* Dropzone */
          <div className="heritage-card p-12 text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-[#C9A84C]/80"
            style={{ minHeight: 300, border: "2.5px dashed var(--border)" }}
            onClick={() => document.getElementById("file-upload")?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault()
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const url = URL.createObjectURL(e.dataTransfer.files[0])
                setImageUrl(url)
              }
            }}>
            <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleFileUpload} />
            <div className="text-4xl mb-4">🎨</div>
            <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Upload Reference Image</h2>
            <p className="text-xs mb-6 text-neutral-400">Drag & drop your file or click to select a PNG or JPG logo/photo.</p>
            <button className="btn-gold px-6 py-2.5 text-xs">Select Image</button>
          </div>
        ) : (
          /* Workspace */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left: Input preview & Slider */}
            <div className="heritage-card p-6 space-y-6">
              <h3 className="font-extrabold text-sm border-b pb-3" style={{ fontFamily: "'Baloo 2', sans-serif", borderColor: "var(--border)" }}>
                Reference Asset
              </h3>
              
              <div className="relative border border-white/5 rounded-xl overflow-hidden bg-neutral-950 p-2 flex items-center justify-center" style={{ height: 200 }}>
                <img src={imageUrl} alt="Reference" className="object-contain max-h-full max-w-full" />
              </div>

              <div>
                <label className="field-label flex justify-between">
                  <span>Number of Colors</span>
                  <span className="text-[#C9A84C] font-bold">{colorCount} Swatches</span>
                </label>
                <input type="range" min="2" max="12" value={colorCount}
                  onChange={e => setColorCount(parseInt(e.target.value))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-neutral-800"
                  style={{ accentColor: "var(--gold)" }} />
              </div>

              <button className="w-full text-xs text-gradient-red font-bold" 
                onClick={() => {
                  setImageUrl(null)
                  setExtractedColors([])
                }}>
                Upload Different File
              </button>
            </div>

            {/* Right: Colors & Outputs */}
            <div className="md:col-span-2 space-y-6">
              <div className="heritage-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-sm" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Extracted Colors</h3>
                  {isProcessing && <span className="text-xs text-amber-500 font-semibold animate-pulse">Extracting...</span>}
                </div>
                
                {extractedColors.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {extractedColors.map(color => (
                      <div key={color} className="p-3 rounded-xl border flex items-center gap-3 bg-neutral-900 border-neutral-800">
                        <div className="w-10 h-10 rounded-lg shadow border border-white/10 flex-shrink-0" style={{ backgroundColor: color }} />
                        <div className="overflow-hidden">
                          <p className="font-bold text-xs text-neutral-200">{color}</p>
                          <button onClick={() => copyToClipboard(color, color)} className="text-[10px] text-[#C9A84C] font-semibold hover:underline block mt-0.5">
                            {copyStatus === color ? "Copied! ✓" : "Copy Hex"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-neutral-500 py-6 text-center">Color centroids will show here once processed.</div>
                )}
              </div>

              {/* Developer Code Output Panels */}
              {extractedColors.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* CSS Variables */}
                  <div className="heritage-card p-5">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xs font-bold text-neutral-400">CSS Root Variables</h4>
                      <button onClick={() => copyToClipboard(getCssVariables(), "css")} className="text-[10px] text-[#C9A84C] font-bold">
                        {copyStatus === "css" ? "Copied! ✓" : "Copy Code"}
                      </button>
                    </div>
                    <pre className="p-3 bg-neutral-950 rounded-lg text-[10px] font-mono text-amber-100 overflow-x-auto">
{`:root {
${getCssVariables()}
}`}
                    </pre>
                  </div>

                  {/* Tailwind Config */}
                  <div className="heritage-card p-5">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xs font-bold text-neutral-400">Tailwind Theme Colors</h4>
                      <button onClick={() => copyToClipboard(getTailwindConfig(), "tailwind")} className="text-[10px] text-[#C9A84C] font-bold">
                        {copyStatus === "tailwind" ? "Copied! ✓" : "Copy Code"}
                      </button>
                    </div>
                    <pre className="p-3 bg-neutral-950 rounded-lg text-[10px] font-mono text-amber-100 overflow-x-auto">
{`colors: {
${getTailwindConfig()}
}`}
                    </pre>
                  </div>

                </div>
              )}

            </div>

          </div>
        )}
      </div>
    </div>
  )
}
