"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import QuickSwitch from "../../components/quick-switch"

interface ImageItem {
  id: string
  file: File
  previewUrl: string
}

export default function ImagesToPDFPage() {
  const [libsLoaded, setLibsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  
  const [images, setImages] = useState<ImageItem[]>([])
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progressPercent, setProgressPercent] = useState(0)
  const [statusMessage, setStatusMessage] = useState("")

  // Configuration options
  const [pageSize, setPageSize] = useState<"a4" | "letter" | "fit">("a4")
  const [orientation, setOrientation] = useState<"portrait" | "landscape" | "auto">("auto")
  const [margin, setMargin] = useState<"none" | "small" | "medium" | "large">("medium")

  // Load PDF-Lib dynamically
  useEffect(() => {
    const loadPDFLib = async () => {
      try {
        if (!(window as any).PDFLib) {
          await new Promise<void>((resolve, reject) => {
            const s = document.createElement("script")
            s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"
            s.onload = () => resolve()
            s.onerror = () => reject(new Error("Failed to load PDF-Lib"))
            document.head.appendChild(s)
          })
        }
        setLibsLoaded(true)
      } catch (err) {
        console.error(err)
        setLoadError("Could not load local PDF engines from secure CDNs. Please verify your connection.")
      }
    }
    loadPDFLib()
    
    // Cleanup previews on unmount
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.previewUrl))
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      addFiles(Array.from(files))
    }
  }

  const addFiles = (fileList: File[]) => {
    const validImages = fileList.filter(file => file.type.startsWith("image/"))
    if (validImages.length === 0) return

    const newItems: ImageItem[] = validImages.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      previewUrl: URL.createObjectURL(file)
    }))
    
    setImages(prev => [...prev, ...newItems])
    setPdfUrl(null)
  }

  const removeImage = (id: string) => {
    setImages(prev => {
      const target = prev.find(item => item.id === id)
      if (target) URL.revokeObjectURL(target.previewUrl)
      return prev.filter(item => item.id !== id)
    })
    setPdfUrl(null)
  }

  const moveImage = (index: number, direction: "left" | "right") => {
    if (direction === "left" && index === 0) return
    if (direction === "right" && index === images.length - 1) return

    const nextIndex = direction === "left" ? index - 1 : index + 1
    const updated = [...images]
    const temp = updated[index]
    updated[index] = updated[nextIndex]
    updated[nextIndex] = temp
    
    setImages(updated)
    setPdfUrl(null)
  }

  // Draw file to Canvas to convert any image (PNG/JPG/WebP/etc) into standard JPEG bytes
  const convertImageToJpgBytes = (item: ImageItem): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.naturalWidth || img.width
        canvas.height = img.naturalHeight || img.height
        const ctx = canvas.getContext("2d")
        
        if (!ctx) {
          reject(new Error("Canvas context is unavailable"))
          return
        }

        // Draw white background (prevents transparency turning black in JPEG)
        ctx.fillStyle = "#FFFFFF"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)

        canvas.toBlob(
          blob => {
            if (blob) {
              const reader = new FileReader()
              reader.onloadend = () => {
                resolve(reader.result as ArrayBuffer)
              }
              reader.readAsArrayBuffer(blob)
            } else {
              reject(new Error("Canvas export failed"))
            }
          },
          "image/jpeg",
          0.92 // high quality
        )
      }
      img.onerror = () => reject(new Error("Failed to load image resource"))
      img.src = item.previewUrl
    })
  }

  const generatePDF = async () => {
    if (images.length === 0 || !libsLoaded) return
    setIsProcessing(true)
    setProgressPercent(5)
    setStatusMessage("Initializing PDF builder...")

    try {
      const PDFLib = (window as any).PDFLib
      const pdfDoc = await PDFLib.PDFDocument.create()

      // Margin profiles in points
      let marginVal = 30
      if (margin === "none") marginVal = 0
      else if (margin === "small") marginVal = 15
      else if (margin === "large") marginVal = 50

      for (let i = 0; i < images.length; i++) {
        const item = images[i]
        setStatusMessage(`Compressing and embedding image ${i + 1} of ${images.length}...`)
        setProgressPercent(Math.round(10 + (i / images.length) * 80))

        const jpgBytes = await convertImageToJpgBytes(item)
        const embeddedImg = await pdfDoc.embedJpg(jpgBytes)

        const imgWidth = embeddedImg.width
        const imgHeight = embeddedImg.height

        // Determine page layout size (points)
        let pageW = 595.28 // A4 defaults
        let pageH = 841.89
        
        if (pageSize === "letter") {
          pageW = 612
          pageH = 792
        } else if (pageSize === "fit") {
          pageW = imgWidth + marginVal * 2
          pageH = imgHeight + marginVal * 2
        }

        // Determine orientation
        let finalPageW = pageW
        let finalPageH = pageH
        
        if (pageSize !== "fit") {
          if (orientation === "portrait") {
            finalPageW = Math.min(pageW, pageH)
            finalPageH = Math.max(pageW, pageH)
          } else if (orientation === "landscape") {
            finalPageW = Math.max(pageW, pageH)
            finalPageH = Math.min(pageW, pageH)
          } else if (orientation === "auto") {
            // Match page orientation to image orientation
            if (imgWidth > imgHeight) {
              finalPageW = Math.max(pageW, pageH)
              finalPageH = Math.min(pageW, pageH)
            } else {
              finalPageW = Math.min(pageW, pageH)
              finalPageH = Math.max(pageW, pageH)
            }
          }
        }

        const newPage = pdfDoc.addPage([finalPageW, finalPageH])

        // Calculate drawing box (subtracting margins)
        const boxW = finalPageW - marginVal * 2
        const boxH = finalPageH - marginVal * 2

        // Maintain aspect ratio scaling
        let drawW = boxW
        let drawH = boxH
        const imgRatio = imgWidth / imgHeight
        const boxRatio = boxW / boxH

        if (imgRatio > boxRatio) {
          drawH = boxW / imgRatio
        } else {
          drawW = boxH * imgRatio
        }

        // Center on the page
        const drawX = marginVal + (boxW - drawW) / 2
        const drawY = marginVal + (boxH - drawH) / 2

        newPage.drawImage(embeddedImg, {
          x: drawX,
          y: drawY,
          width: drawW,
          height: drawH
        })
      }

      setStatusMessage("Saving PDF structures...")
      setProgressPercent(95)

      const pdfBytes = await pdfDoc.save()
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(pdfBlob)
      
      setPdfUrl(url)
      setProgressPercent(100)
      setStatusMessage("PDF compiled successfully!")
    } catch (err) {
      console.error(err)
      alert("Error compiling images to PDF: " + (err as Error).message)
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadPDF = () => {
    if (!pdfUrl) return
    const a = document.createElement("a")
    a.href = pdfUrl
    a.download = "images_compilation.pdf"
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
          <Link href="/converters/pdf" className="text-xs font-bold mb-2 block hover:opacity-80" style={{ color: "rgba(255,248,231,0.6)" }}>
            ← Back to PDF & Document Tools
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-shimmer mb-3" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            Images to PDF Converter
          </h1>
          <p className="text-xs sm:text-sm max-w-lg mx-auto" style={{ color: "rgba(255,248,231,0.75)" }}>
            Compile multiple JPEG, PNG, or WebP images into a single elegant PDF document completely offline.
          </p>
          <QuickSwitch currentHref="/converters/pdf/images-to-pdf" />
        </div>
        <div className="temple-border absolute bottom-0 left-0 right-0" />
      </section>

      {/* ── WORKSPACE ── */}
      <div className="content-container py-10 max-w-5xl mx-auto">
        {loadError && (
          <div className="p-4 mb-6 rounded-xl border border-red-900 bg-red-950/20 text-red-400 text-xs text-center">
            {loadError}
          </div>
        )}

        {!libsLoaded && !loadError ? (
          <div className="text-center py-20">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-[var(--gold)] border-t-transparent rounded-full mb-4"></div>
            <p className="text-xs text-[var(--text-muted)]">Loading document builder engines...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left Options Panel */}
            <div className="lg:col-span-1 space-y-6">
              <div className="heritage-card p-5 space-y-5">
                <h3 className="font-extrabold text-sm border-b pb-2 text-[var(--text-primary)]" style={{ fontFamily: "'Baloo 2', sans-serif", borderColor: "var(--border)" }}>
                  Layout Settings
                </h3>

                <div>
                  <label className="field-label">Page Orientation</label>
                  <select 
                    value={pageOrientation}
                    onChange={e => setPageOrientation(e.target.value as any)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--gold)]"
                  >
                    <option value="portrait" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Portrait (Vertical)</option>
                    <option value="landscape" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Landscape (Horizontal)</option>
                  </select>
                </div>

                <div>
                  <label className="field-label">Page Size Standard</label>
                  <select 
                    value={pageSize}
                    onChange={e => setPageSize(e.target.value as any)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--gold)]"
                  >
                    <option value="A4" className="bg-[var(--bg-card)] text-[var(--text-primary)]">A4 (210 x 297 mm)</option>
                    <option value="LETTER" className="bg-[var(--bg-card)] text-[var(--text-primary)]">US Letter (8.5 x 11 in)</option>
                  </select>
                </div>

                <div>
                  <label className="field-label">Page Margin Width</label>
                  <select 
                    value={marginSize}
                    onChange={e => setMarginSize(e.target.value as any)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--gold)]"
                  >
                    <option value="none" className="bg-[var(--bg-card)] text-[var(--text-primary)]">No Margins (Full Bleed)</option>
                    <option value="small" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Small Margins (10mm)</option>
                    <option value="large" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Large Margins (25mm)</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-dashed" style={{ borderColor: "var(--border)" }}>
                  <button 
                    onClick={generatePDF} 
                    disabled={images.length === 0 || isProcessing}
                    className="w-full btn-gold py-3 text-xs disabled:opacity-40"
                  >
                    {isProcessing ? "Building..." : "⚡ Compile PDF"}
                  </button>
                </div>

                {pdfUrl && (
                  <button 
                    onClick={downloadPDF} 
                    className="w-full btn-primary py-3 text-xs animate-pulse"
                  >
                    📥 Download compiled PDF
                  </button>
                )}

                {images.length > 0 && (
                  <button 
                    className="w-full text-xs text-gradient-red font-bold text-center block" 
                    onClick={() => {
                      images.forEach(img => URL.revokeObjectURL(img.previewUrl))
                      setImages([])
                      setPdfUrl(null)
                    }}
                  >
                    Clear All Images
                  </button>
                )}
              </div>
            </div>

            {/* Right Editor Workspace */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Dropzone always available at the top for adding more images */}
              <div 
                className="heritage-card p-6 text-center border-dashed border-2 cursor-pointer transition-all duration-300 hover:border-[#C9A84C]/80"
                style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
                onClick={() => document.getElementById("img-upload")?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault()
                  if (e.dataTransfer.files) {
                    addFiles(Array.from(e.dataTransfer.files))
                  }
                }}
              >
                <input type="file" id="img-upload" className="hidden" accept="image/*" multiple onChange={handleFileChange} />
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">📸</span>
                  <div>
                    <p className="text-xs font-bold text-[var(--text-primary)]">Drag & drop or Click to add photo files</p>
                    <p className="text-[10px] text-[var(--text-subtle)]">Supports JPG, PNG, WebP, SVG, BMP, GIF</p>
                  </div>
                </div>
              </div>

              {/* Processor Loader */}
              {isProcessing && (
                <div className="heritage-card p-8 text-center flex flex-col items-center justify-center">
                  <div className="animate-spin inline-block w-8 h-8 border-4 border-[var(--gold)] border-t-transparent rounded-full mb-4"></div>
                  <p className="text-xs text-[var(--text-muted)]">{statusMessage}</p>
                  <div className="w-full max-w-md bg-[var(--bg-secondary)] rounded-full h-2 mt-4 overflow-hidden border border-[var(--border)]">
                    <div 
                      className="bg-[var(--gold)] h-2 transition-all duration-200" 
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Grid of uploaded images */}
              {!isProcessing && images.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <h4 className="text-xs font-bold text-[var(--text-muted)]">Rearrange Pages</h4>
                    <p className="text-[10px] text-[var(--gold)]">First thumbnail will be Page 1</p>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((item, index) => (
                      <div key={item.id} className="heritage-card relative p-2 bg-[var(--bg-secondary)] flex flex-col justify-between border-[var(--border)]">
                        {/* Badge */}
                        <div className="absolute top-2 left-2 bg-[var(--bg-primary)] text-[var(--gold)] font-extrabold text-[9px] px-2 py-0.5 rounded-full border border-[var(--border)]">
                          Page {index + 1}
                        </div>

                        {/* Remove button */}
                        <button 
                          onClick={() => removeImage(item.id)}
                          className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center bg-[var(--bg-primary)] text-[var(--primary)] rounded-full text-[10px] border border-[var(--primary)]/30 hover:bg-[var(--primary)] hover:text-[var(--bg-primary)] transition-colors"
                          title="Remove Image"
                        >
                          ✕
                        </button>

                        <div className="h-28 flex items-center justify-center p-1 bg-[var(--bg-primary)] rounded-lg overflow-hidden border border-[var(--border)]">
                          <img src={item.previewUrl} alt={`Thumbnail ${index + 1}`} className="object-contain max-h-full max-w-full rounded shadow" />
                        </div>

                        <p className="text-[9px] text-[var(--text-muted)] truncate text-center mt-2 px-1">
                          {item.file.name}
                        </p>

                        {/* Page sorters */}
                        <div className="grid grid-cols-2 gap-1 mt-2 pt-2 border-t border-[var(--border)]">
                          <button 
                            onClick={() => moveImage(index, "left")}
                            disabled={index === 0}
                            className="p-1 text-[9px] text-center font-bold bg-[var(--bg-primary)] hover:bg-[var(--bg-card-hover)] rounded-lg border border-[var(--border)] text-[var(--text-muted)] disabled:opacity-30 disabled:hover:bg-[var(--bg-primary)] transition-colors"
                          >
                            ◀ Move
                          </button>
                          <button 
                            onClick={() => moveImage(index, "right")}
                            disabled={index === images.length - 1}
                            className="p-1 text-[9px] text-center font-bold bg-[var(--bg-primary)] hover:bg-[var(--bg-card-hover)] rounded-lg border border-[var(--border)] text-[var(--text-muted)] disabled:opacity-30 disabled:hover:bg-[var(--bg-primary)] transition-colors"
                          >
                            Move ▶
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state instructions */}
              {!isProcessing && images.length === 0 && (
                <div className="heritage-card p-12 text-center text-[var(--text-muted)] flex flex-col items-center justify-center" style={{ minHeight: 300 }}>
                  <p className="text-4xl mb-2">📸</p>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]" style={{ fontFamily: "'Baloo 2', sans-serif" }}>No Images Added Yet</h4>
                  <p className="text-xs max-w-xs mx-auto mt-1 mb-4">
                    Select the graphic files or snapshots you wish to convert into a consolidated PDF.
                  </p>
                  <button className="btn-gold px-5 py-2 text-xs" onClick={() => document.getElementById("img-upload")?.click()}>
                    Add Images
                  </button>
                </div>
              )}

              {pdfUrl && !isProcessing && (
                <div className="heritage-card p-6 text-center border-[var(--green)]/20 bg-[var(--green)]/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-left">
                    <p className="text-xs font-bold text-[var(--green)]">🎉 PDF Render Completed!</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">All pages compiled and scaled to layout specifications.</p>
                  </div>
                  <div className="flex gap-3">
                    <a href={pdfUrl} target="_blank" className="btn-outline-gold px-5 py-2 text-xs">
                      👁️ Preview Document
                    </a>
                    <button onClick={downloadPDF} className="btn-gold px-5 py-2 text-xs">
                      📥 Download PDF
                    </button>
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
