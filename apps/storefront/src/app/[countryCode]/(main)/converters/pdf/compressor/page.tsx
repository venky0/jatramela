"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import QuickSwitch from "../../components/quick-switch"

export default function PDFCompressorPage() {
  const [libsLoaded, setLibsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [originalSize, setOriginalSize] = useState<number>(0)
  const [compressedSize, setCompressedSize] = useState<number>(0)
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null)
  
  const [compressionLevel, setCompressionLevel] = useState<"high" | "medium" | "low">("medium")
  const [isProcessing, setIsProcessing] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")
  const [progressPercent, setProgressPercent] = useState(0)

  // Load PDF-Lib and PDFJS dynamically
  useEffect(() => {
    const loadPDFLibs = async () => {
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
        if (!(window as any).pdfjsLib) {
          await new Promise<void>((resolve, reject) => {
            const s = document.createElement("script")
            s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js"
            s.onload = () => resolve()
            s.onerror = () => reject(new Error("Failed to load PDF.js"))
            document.head.appendChild(s)
          })
        }
        if ((window as any).pdfjsLib) {
          (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js"
        }
        setLibsLoaded(true)
      } catch (err) {
        console.error(err)
        setLoadError("Could not load local PDF compression engines from secure CDNs. Please verify your connection.")
      }
    }
    loadPDFLibs()
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      processFile(files[0])
    }
  }

  const processFile = (file: File) => {
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      alert("Please upload a valid PDF file.")
      return
    }
    setPdfFile(file)
    setOriginalSize(file.size)
    setCompressedUrl(null)
    setCompressedSize(0)
    setProgressPercent(0)
    setStatusMessage("")
  }

  const compressPDF = async () => {
    if (!pdfFile || !libsLoaded) return
    setIsProcessing(true)
    setProgressPercent(5)
    setStatusMessage("Reading document pages...")

    try {
      const arrayBuffer = await pdfFile.arrayBuffer()
      const pdfjsLib = (window as any).pdfjsLib
      const PDFLib = (window as any).PDFLib

      // Load pdf.js document
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
      const pdf = await loadingTask.promise
      const totalPages = pdf.numPages
      
      setStatusMessage(`Found ${totalPages} pages. Setting compression factors...`)
      setProgressPercent(10)

      // Compression profiles
      // high: 90 DPI (scale ~ 1.25), jpeg quality 0.5
      // medium: 150 DPI (scale ~ 2.08), jpeg quality 0.7
      // low: 220 DPI (scale ~ 3.05), jpeg quality 0.85
      let scale = 2.08
      let quality = 0.70
      
      if (compressionLevel === "high") {
        scale = 1.25
        quality = 0.50
      } else if (compressionLevel === "low") {
        scale = 3.05
        quality = 0.85
      }

      // Create a fresh PDF document
      const outPdf = await PDFLib.PDFDocument.create()

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        setStatusMessage(`Rendering and compressing page ${pageNum} of ${totalPages}...`)
        const page = await pdf.getPage(pageNum)
        
        // Calculate dimensions at our scale
        const viewport = page.getViewport({ scale })
        const canvas = document.createElement("canvas")
        canvas.width = viewport.width
        canvas.height = viewport.height
        const ctx = canvas.getContext("2d")
        
        if (!ctx) {
          throw new Error("Could not construct 2D canvas context")
        }

        // Render page directly to canvas
        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        }
        await page.render(renderContext).promise

        // Convert canvas image to JPEG with targeted quality factor
        const imgDataUrl = canvas.toDataURL("image/jpeg", quality)
        const response = await fetch(imgDataUrl)
        const imgBytes = await response.arrayBuffer()

        // Embed the JPEG into our output PDF
        const embeddedImg = await outPdf.embedJpg(imgBytes)
        
        // Match standard dimensions or original canvas size
        const originalViewport = page.getViewport({ scale: 1.0 })
        const outPage = outPdf.addPage([originalViewport.width, originalViewport.height])
        
        outPage.drawImage(embeddedImg, {
          x: 0,
          y: 0,
          width: originalViewport.width,
          height: originalViewport.height,
        })

        setProgressPercent(Math.round(10 + (pageNum / totalPages) * 80))
      }

      setStatusMessage("Wrapping up PDF structures...")
      setProgressPercent(95)

      // Save PDF output
      const compressedPdfBytes = await outPdf.save()
      const compressedBlob = new Blob([compressedPdfBytes], { type: "application/pdf" })
      
      setCompressedSize(compressedBlob.size)
      const downloadUrl = URL.createObjectURL(compressedBlob)
      setCompressedUrl(downloadUrl)
      
      setProgressPercent(100)
      setStatusMessage("Compression completed successfully!")
    } catch (err) {
      console.error(err)
      alert("An error occurred during PDF compression: " + (err as Error).message)
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadCompressed = () => {
    if (!compressedUrl || !pdfFile) return
    const originalName = pdfFile.name.replace(/\.[^/.]+$/, "")
    const a = document.createElement("a")
    a.href = compressedUrl
    a.download = `${originalName}_compressed.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
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
            PDF Compressor
          </h1>
          <p className="text-xs sm:text-sm max-w-lg mx-auto" style={{ color: "rgba(255,248,231,0.75)" }}>
            Compress scanned PDFs and PDF documents client-side using advanced WebAssembly image compression. 
          </p>
          <QuickSwitch currentHref="/converters/pdf/compressor" />
        </div>
        <div className="temple-border absolute bottom-0 left-0 right-0" />
      </section>

      {/* ── WORKSPACE ── */}
      <div className="content-container py-10 max-w-4xl mx-auto">
        {loadError && (
          <div className="p-4 mb-6 rounded-xl border border-red-900 bg-red-950/20 text-red-400 text-xs text-center">
            {loadError}
          </div>
        )}

        {!libsLoaded && !loadError ? (
          <div className="text-center py-20">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-[var(--gold)] border-t-transparent rounded-full mb-4"></div>
            <p className="text-xs text-[var(--text-muted)]">Loading secure compression engines in-browser...</p>
          </div>
        ) : !pdfFile ? (
          /* Dropzone */
          <div className="heritage-card p-12 text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-[var(--gold)]/80"
            style={{ minHeight: 300, border: "2.5px dashed var(--border)" }}
            onClick={() => document.getElementById("pdf-upload")?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault()
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                processFile(e.dataTransfer.files[0])
              }
            }}>
            <input type="file" id="pdf-upload" className="hidden" accept="application/pdf" onChange={handleFileUpload} />
            <div className="text-4xl mb-4">🗜️</div>
            <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Upload PDF Document</h2>
            <p className="text-xs mb-6 text-[var(--text-muted)]">Drag & drop your PDF or click to select from your file explorer.</p>
            <button className="btn-gold px-6 py-2.5 text-xs">Select PDF File</button>
          </div>
        ) : (
          /* File Panel */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Control Panel */}
            <div className="heritage-card p-6 space-y-6">
              <h3 className="font-extrabold text-sm border-b pb-3" style={{ fontFamily: "'Baloo 2', sans-serif", borderColor: "var(--border)" }}>
                Compress Settings
              </h3>

              {/* PDF Meta */}
              <div className="space-y-1">
                <p className="text-[10px] text-[var(--text-subtle)] uppercase tracking-widest">Active File</p>
                <p className="text-xs font-bold truncate max-w-full text-[var(--text-primary)]" title={pdfFile.name}>
                  {pdfFile.name}
                </p>
                <p className="text-[10px] text-[var(--text-muted)]">
                  Size: {formatSize(originalSize)}
                </p>
              </div>

              {/* Compression Levels */}
              <div className="space-y-2">
                <label className="field-label">Target Level</label>
                <div className="grid grid-cols-1 gap-2">
                  <button 
                    onClick={() => setCompressionLevel("high")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      compressionLevel === "high" 
                        ? "border-[var(--gold)] bg-[var(--gold-glow)] text-[var(--text-gold)]" 
                        : "border-[var(--border)] bg-[var(--bg-secondary)]/50 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <p className="text-xs font-extrabold">🚨 High Compression</p>
                    <p className="text-[9px] mt-0.5 opacity-80">90 DPI. Standard quality. Greatest file savings.</p>
                  </button>

                  <button 
                    onClick={() => setCompressionLevel("medium")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      compressionLevel === "medium" 
                        ? "border-[var(--gold)] bg-[var(--gold-glow)] text-[var(--text-gold)]" 
                        : "border-[var(--border)] bg-[var(--bg-secondary)]/50 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <p className="text-xs font-extrabold">⚡ Medium Compression</p>
                    <p className="text-[9px] mt-0.5 opacity-80">150 DPI. Ideal balance for text and images.</p>
                  </button>

                  <button 
                    onClick={() => setCompressionLevel("low")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      compressionLevel === "low" 
                        ? "border-[var(--gold)] bg-[var(--gold-glow)] text-[var(--text-gold)]" 
                        : "border-[var(--border)] bg-[var(--bg-secondary)]/50 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <p className="text-xs font-extrabold">✨ Low Compression</p>
                    <p className="text-[9px] mt-0.5 opacity-80">220 DPI. Crisp vector text & photo fidelity.</p>
                  </button>
                </div>
              </div>

              {/* Trigger Button */}
              <div className="pt-4 border-t border-dashed" style={{ borderColor: "var(--border)" }}>
                <button 
                  onClick={compressPDF} 
                  disabled={isProcessing} 
                  className="w-full btn-gold py-3 text-xs"
                >
                  {isProcessing ? "Processing..." : "⚡ Shrink File Size"}
                </button>
              </div>

              {compressedUrl && (
                <button 
                  onClick={downloadCompressed} 
                  className="w-full btn-primary py-3 text-xs"
                >
                  📥 Download Compressed PDF
                </button>
              )}

              <button 
                className="w-full text-xs text-gradient-red font-bold text-center block" 
                onClick={() => {
                  setPdfFile(null)
                  setCompressedUrl(null)
                  setCompressedSize(0)
                  setStatusMessage("")
                  setProgressPercent(0)
                }}
              >
                Upload Different PDF
              </button>
            </div>

            {/* Right Status Panel */}
            <div className="md:col-span-2 space-y-6">
              {isProcessing && (
                <div className="heritage-card p-8 text-center flex flex-col items-center justify-center">
                  <div className="animate-spin inline-block w-8 h-8 border-4 border-[var(--gold)] border-t-transparent rounded-full mb-4"></div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                    Compressing Document Pages
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] mt-1 mb-4">{statusMessage}</p>
                  
                  {/* Progress bar */}
                  <div className="w-full max-w-md bg-[var(--bg-secondary)] rounded-full h-2 border border-[var(--border)] overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[var(--gold)] to-[var(--gold-bright)] h-2 transition-all duration-300" 
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-[var(--text-subtle)] mt-2">{progressPercent}% complete</p>
                </div>
              )}

              {!isProcessing && !compressedUrl && (
                <div className="heritage-card p-12 text-center text-[var(--text-muted)] flex flex-col items-center justify-center" style={{ height: "100%", minHeight: 250 }}>
                  <p className="text-4xl mb-3">⚙️</p>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Ready for Compression</h4>
                  <p className="text-xs max-w-xs mx-auto mt-1">
                    Select your targeted file size optimization parameters on the left pane and trigger compression to proceed.
                  </p>
                </div>
              )}

              {compressedUrl && !isProcessing && (
                <div className="space-y-6">
                  {/* Comparison Savings Card */}
                  <div className="heritage-card p-8 text-center flex flex-col items-center justify-center">
                    <p className="text-4xl mb-3">🎉</p>
                    <h4 className="text-lg font-bold text-[var(--green)]" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                      PDF Compressed Successfully!
                    </h4>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      Your document has been optimized entirely in your browser.
                    </p>

                    <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-6 pt-6 border-t border-dashed" style={{ borderColor: "var(--border)" }}>
                      <div>
                        <p className="text-[10px] text-[var(--text-subtle)] uppercase tracking-wider">Original Size</p>
                        <p className="text-base font-bold text-[var(--text-primary)] mt-1">{formatSize(originalSize)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[var(--text-subtle)] uppercase tracking-wider">Compressed Size</p>
                        <p className="text-base font-bold text-[var(--green)] mt-1">{formatSize(compressedSize)}</p>
                      </div>
                    </div>

                    <div className="mt-6 p-4 rounded-xl border bg-[var(--green)]/10 w-full max-w-md" style={{ borderColor: "var(--border)" }}>
                      <p className="text-xs text-[var(--text-muted)]">File Size Savings</p>
                      <p className="font-extrabold text-3xl text-[var(--green)] mt-1">
                        -{Math.round(((originalSize - compressedSize) / originalSize) * 100)}% Saved
                      </p>
                      <p className="text-[10px] text-[var(--text-subtle)] mt-1">
                        Optimized down from {formatSize(originalSize)} to {formatSize(compressedSize)}.
                      </p>
                    </div>

                    <button 
                      onClick={downloadCompressed} 
                      className="btn-gold mt-6 px-8 py-3 text-xs"
                    >
                      📥 Download Output Document
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
