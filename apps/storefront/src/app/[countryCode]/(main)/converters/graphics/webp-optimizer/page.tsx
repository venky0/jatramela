"use client"

import { useState } from "react"
import Link from "next/link"

export default function WebPOptimizerPage() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [optimizedUrl, setOptimizedUrl] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState<number>(0)
  const [optimizedSize, setOptimizedSize] = useState<number>(0)
  
  const [quality, setQuality] = useState<number>(0.8)
  const [maxDimension, setMaxDimension] = useState<string>("original")

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      processFile(files[0])
    }
  }

  const processFile = (file: File) => {
    setImageFile(file)
    setOriginalSize(file.size)
    setOptimizedUrl(null)
    
    const url = URL.createObjectURL(file)
    setImageUrl(url)
  }

  const optimizeImage = () => {
    if (!imageUrl) return
    setIsProcessing(true)
    
    const img = new Image()
    img.onload = () => {
      let w = img.naturalWidth || img.width
      let h = img.naturalHeight || img.height
      
      const maxDimVal = maxDimension === "original" ? Infinity : parseInt(maxDimension)
      if (w > maxDimVal || h > maxDimVal) {
        if (w > h) {
          h = Math.round((h * maxDimVal) / w)
          w = maxDimVal
        } else {
          w = Math.round((w * maxDimVal) / h)
          h = maxDimVal
        }
      }
      
      const canvas = document.createElement("canvas")
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(img, 0, 0, w, h)
        
        // Export to WebP with target quality
        canvas.toBlob(
          blob => {
            if (blob) {
              setOptimizedSize(blob.size)
              const optUrl = URL.createObjectURL(blob)
              setOptimizedUrl(optUrl)
            }
            setIsProcessing(false)
          },
          "image/webp",
          quality
        )
      } else {
        setIsProcessing(false)
      }
    }
    img.src = imageUrl
  }

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const downloadOptimized = () => {
    if (!optimizedUrl || !imageFile) return
    const name = imageFile.name.replace(/\.[^/.]+$/, "")
    const a = document.createElement("a")
    a.href = optimizedUrl
    a.download = `${name}_optimized.webp`
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
            WebP Image Optimizer
          </h1>
          <p className="text-xs sm:text-sm max-w-lg mx-auto" style={{ color: "rgba(255,248,231,0.75)" }}>
            Compress, resize, and optimize PNG or JPEG images to WebP format entirely in your browser.
          </p>
        </div>
        <div className="temple-border absolute bottom-0 left-0 right-0" />
      </section>

      <div className="content-container py-10 max-w-4xl mx-auto">
        {!imageUrl ? (
          /* Dropzone */
          <div className="heritage-card p-12 text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-[#C9A84C]/80"
            style={{ minHeight: 300, border: "2.5px dashed var(--border)" }}
            onClick={() => document.getElementById("file-upload")?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault()
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                processFile(e.dataTransfer.files[0])
              }
            }}>
            <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleFileUpload} />
            <div className="text-4xl mb-4">📦</div>
            <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Upload JPG or PNG Image</h2>
            <p className="text-xs mb-6 text-neutral-400">Drag & drop your image or click to select from your file explorer.</p>
            <button className="btn-gold px-6 py-2.5 text-xs">Select Image</button>
          </div>
        ) : (
          /* Workspace */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left: Controls */}
            <div className="heritage-card p-6 space-y-6">
              <h3 className="font-extrabold text-sm border-b pb-3" style={{ fontFamily: "'Baloo 2', sans-serif", borderColor: "var(--border)" }}>
                Optimization Controls
              </h3>
              
              {/* Slider: Quality */}
              <div>
                <label className="field-label flex justify-between">
                  <span>WebP Quality</span>
                  <span className="text-[#C9A84C] font-bold">{Math.round(quality * 100)}%</span>
                </label>
                <input type="range" min="0.1" max="1.0" step="0.05" value={quality}
                  onChange={e => setQuality(parseFloat(e.target.value))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-neutral-800"
                  style={{ accentColor: "var(--gold)" }} />
              </div>

              {/* Selector: Max Dimension */}
              <div>
                <label className="field-label">Max Rescale Dimension</label>
                <select value={maxDimension} onChange={e => setMaxDimension(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-3 text-xs text-neutral-200 outline-none focus:border-amber-500">
                  <option value="original">Keep Original Size</option>
                  <option value="3840">UHD 4K (3840px)</option>
                  <option value="1920">Full HD (1920px)</option>
                  <option value="1280">Standard (1280px)</option>
                  <option value="800">Web Medium (800px)</option>
                  <option value="500">Thumbnail (500px)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-dashed" style={{ borderColor: "var(--border)" }}>
                <button onClick={optimizeImage} disabled={isProcessing} className="w-full btn-gold py-3 text-xs">
                  {isProcessing ? "Optimizing..." : "⚡ Compress & Resize"}
                </button>
              </div>

              {optimizedUrl && (
                <button onClick={downloadOptimized} className="w-full btn-primary py-3 text-xs">
                  📥 Download WebP Image
                </button>
              )}

              <button className="w-full text-xs text-gradient-red font-bold" 
                onClick={() => {
                  setImageFile(null)
                  setImageUrl(null)
                  setOptimizedUrl(null)
                }}>
                Upload Different File
              </button>
            </div>

            {/* Right: Previews */}
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Original Preview */}
                <div className="heritage-card p-4 flex flex-col items-center justify-center text-center">
                  <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Original Image</h4>
                  <div className="relative border border-white/5 rounded-lg overflow-hidden bg-neutral-950 p-2 flex items-center justify-center" style={{ height: 220, width: "100%" }}>
                    <img src={imageUrl} alt="Original" className="object-contain max-h-full max-w-full" />
                  </div>
                  <p className="text-xs font-bold mt-3" style={{ color: "var(--text-muted)" }}>
                    Size: {formatSize(originalSize)}
                  </p>
                </div>

                {/* Optimized Preview */}
                <div className="heritage-card p-4 flex flex-col items-center justify-center text-center">
                  <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Optimized WebP</h4>
                  <div className="relative border border-white/5 rounded-lg overflow-hidden bg-neutral-950 p-2 flex items-center justify-center" style={{ height: 220, width: "100%" }}>
                    {optimizedUrl ? (
                      <img src={optimizedUrl} alt="Optimized" className="object-contain max-h-full max-w-full" />
                    ) : (
                      <div className="text-xs text-neutral-500 opacity-60">Click 'Compress & Resize' to generate WebP</div>
                    )}
                  </div>
                  <p className="text-xs font-bold mt-3" style={{ color: "var(--text-muted)" }}>
                    Size: {optimizedUrl ? formatSize(optimizedSize) : "N/A"}
                  </p>
                </div>

              </div>

              {/* Stats Savings Card */}
              {optimizedUrl && (
                <div className="p-4 rounded-xl border text-center" style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}>
                  <p className="text-xs" style={{ color: "var(--text-subtle)" }}>File Size Savings</p>
                  <p className="font-extrabold text-2xl text-green-500 mt-1">
                    -{Math.round(((originalSize - optimizedSize) / originalSize) * 100)}% Size Saved
                  </p>
                  <p className="text-[10px] mt-1" style={{ color: "var(--text-subtle)" }}>
                    Optimized from {formatSize(originalSize)} down to {formatSize(optimizedSize)}.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
