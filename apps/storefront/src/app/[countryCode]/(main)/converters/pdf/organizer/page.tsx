"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import QuickSwitch from "../../components/quick-switch"

interface MergeItem {
  id: string
  file: File
  size: number
  pageCount: number
}

interface PageThumbnail {
  pageNum: number
  dataUrl: string
}

export default function PDFOrganizerPage() {
  const [libsLoaded, setLibsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"merge" | "split">("merge")
  const [isProcessing, setIsProcessing] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")

  // Merge State
  const [mergeFiles, setMergeFiles] = useState<MergeItem[]>([])
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null)

  // Split State
  const [splitFile, setSplitFile] = useState<File | null>(null)
  const [splitPdfPagesCount, setSplitPdfPagesCount] = useState(0)
  const [thumbnails, setThumbnails] = useState<PageThumbnail[]>([])
  const [selectedPages, setSelectedPages] = useState<number[]>([]) // 1-indexed page numbers
  const [pageRangeText, setPageRangeText] = useState("")
  const [splitPdfUrl, setSplitPdfUrl] = useState<string | null>(null)
  const [renderingThumbnails, setRenderingThumbnails] = useState(false)

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
        setLoadError("Could not load local PDF organizing engines. Please check your network connection.")
      }
    }
    loadPDFLibs()
  }, [])

  // ────────────────── MERGE LOGIC ──────────────────
  
  const handleMergeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setIsProcessing(true)
      setStatusMessage("Reading file metadata...")
      const items: MergeItem[] = []
      
      try {
        const PDFLib = (window as any).PDFLib
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
            const arrayBuffer = await file.arrayBuffer()
            const doc = await PDFLib.PDFDocument.load(arrayBuffer, { updateMetadata: false })
            const count = doc.getPageCount()
            items.push({
              id: Math.random().toString(36).substring(2, 9),
              file,
              size: file.size,
              pageCount: count
            })
          }
        }
        setMergeFiles(prev => [...prev, ...items])
        setMergedPdfUrl(null)
      } catch (err) {
        console.error(err)
        alert("Error loading PDF metadata: " + (err as Error).message)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const removeMergeFile = (id: string) => {
    setMergeFiles(prev => prev.filter(item => item.id !== id))
    setMergedPdfUrl(null)
  }

  const moveMergeFile = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return
    if (direction === "down" && index === mergeFiles.length - 1) return

    const targetIndex = direction === "up" ? index - 1 : index + 1
    const updated = [...mergeFiles]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp
    
    setMergeFiles(updated)
    setMergedPdfUrl(null)
  }

  const runMerge = async () => {
    if (mergeFiles.length < 2) return
    setIsProcessing(true)
    setStatusMessage("Merging PDF pages...")

    try {
      const PDFLib = (window as any).PDFLib
      const mergedPdf = await PDFLib.PDFDocument.create()

      for (let i = 0; i < mergeFiles.length; i++) {
        const item = mergeFiles[i]
        setStatusMessage(`Copying pages from "${item.file.name}"...`)
        
        const arrayBuffer = await item.file.arrayBuffer()
        const srcDoc = await PDFLib.PDFDocument.load(arrayBuffer)
        const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices())
        
        copiedPages.forEach((page: any) => mergedPdf.addPage(page))
      }

      setStatusMessage("Finalizing compilation...")
      const mergedBytes = await mergedPdf.save()
      const mergedBlob = new Blob([mergedBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(mergedBlob)
      
      setMergedPdfUrl(url)
    } catch (err) {
      console.error(err)
      alert("Error merging documents: " + (err as Error).message)
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadMerged = () => {
    if (!mergedPdfUrl) return
    const a = document.createElement("a")
    a.href = mergedPdfUrl
    a.download = "merged_document.pdf"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  // ────────────────── SPLIT LOGIC ──────────────────

  const handleSplitFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      const file = files[0]
      if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
        alert("Please select a PDF file.")
        return
      }
      setSplitFile(file)
      setSplitPdfUrl(null)
      setSelectedPages([])
      setPageRangeText("")
      setThumbnails([])
      setRenderingThumbnails(true)
      
      try {
        const arrayBuffer = await file.arrayBuffer()
        const pdfjsLib = (window as any).pdfjsLib
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
        const pdf = await loadingTask.promise
        const count = pdf.numPages
        setSplitPdfPagesCount(count)

        // Render thumbnails in background
        const thumbs: PageThumbnail[] = []
        for (let i = 1; i <= Math.min(count, 30); i++) { // Render up to first 30 page thumbnails for performance
          const page = await pdf.getPage(i)
          const viewport = page.getViewport({ scale: 0.35 })
          const canvas = document.createElement("canvas")
          canvas.width = viewport.width
          canvas.height = viewport.height
          const ctx = canvas.getContext("2d")
          
          if (ctx) {
            await page.render({ canvasContext: ctx, viewport }).promise
            thumbs.push({
              pageNum: i,
              dataUrl: canvas.toDataURL()
            })
          }
        }
        setThumbnails(thumbs)
      } catch (err) {
        console.error(err)
        alert("Failed to render PDF thumbnail previews: " + (err as Error).message)
      } finally {
        setRenderingThumbnails(false)
      }
    }
  }

  const togglePageSelection = (pageNum: number) => {
    setSelectedPages(prev => {
      let next = [...prev]
      if (next.includes(pageNum)) {
        next = next.filter(p => p !== pageNum)
      } else {
        next.push(pageNum)
      }
      next.sort((a, b) => a - b)
      
      // Update text representation
      setPageRangeText(next.join(", "))
      return next
    })
    setSplitPdfUrl(null)
  }

  // Parse page range inputs (e.g. "1-3, 5, 8-10")
  const parsePageRangeText = (text: string): number[] => {
    const pages = new Set<number>()
    const parts = text.split(",")
    
    for (let part of parts) {
      part = part.trim()
      if (part.includes("-")) {
        const rangeParts = part.split("-")
        const start = parseInt(rangeParts[0])
        const end = parseInt(rangeParts[1])
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let p = start; p <= end; p++) {
            if (p >= 1 && p <= splitPdfPagesCount) pages.add(p)
          }
        }
      } else {
        const p = parseInt(part)
        if (!isNaN(p) && p >= 1 && p <= splitPdfPagesCount) {
          pages.add(p)
        }
      }
    }
    
    return Array.from(pages).sort((a, b) => a - b)
  }

  const handleRangeTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value
    setPageRangeText(text)
    const pages = parsePageRangeText(text)
    setSelectedPages(pages)
    setSplitPdfUrl(null)
  }

  const runSplit = async () => {
    if (!splitFile || selectedPages.length === 0) return
    setIsProcessing(true)
    setStatusMessage("Extracting pages...")

    try {
      const PDFLib = (window as any).PDFLib
      const originalBuffer = await splitFile.arrayBuffer()
      const srcDoc = await PDFLib.PDFDocument.load(originalBuffer)
      const splitPdf = await PDFLib.PDFDocument.create()

      // copyPages expects 0-indexed page indices
      const zeroIndexedPages = selectedPages.map(p => p - 1)
      const copiedPages = await splitPdf.copyPages(srcDoc, zeroIndexedPages)
      copiedPages.forEach((page: any) => splitPdf.addPage(page))

      const splitBytes = await splitPdf.save()
      const splitBlob = new Blob([splitBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(splitBlob)
      
      setSplitPdfUrl(url)
    } catch (err) {
      console.error(err)
      alert("Error splitting PDF: " + (err as Error).message)
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadSplit = () => {
    if (!splitPdfUrl || !splitFile) return
    const originalName = splitFile.name.replace(/\.[^/.]+$/, "")
    const a = document.createElement("a")
    a.href = splitPdfUrl
    a.download = `${originalName}_extracted.pdf`
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
            PDF Split & Merge Organizer
          </h1>
          <p className="text-xs sm:text-sm max-w-lg mx-auto" style={{ color: "rgba(255,248,231,0.75)" }}>
            Rearrange, compile, and slice document pages locally inside your tab. 
          </p>
          <QuickSwitch currentHref="/converters/pdf/organizer" />
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
            <p className="text-xs text-[var(--text-muted)]">Loading document organizing engines...</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Tab Selector */}
            <div className="flex border-b" style={{ borderColor: "var(--border)" }}>
              <button 
                onClick={() => { setActiveTab("merge"); setStatusMessage(""); setIsProcessing(false); }}
                className={`py-3 px-6 text-sm font-extrabold transition-all border-b-2 ${
                  activeTab === "merge" 
                    ? "border-[var(--gold)] text-[var(--text-gold)]" 
                    : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
                style={{ fontFamily: "'Baloo 2', sans-serif" }}
              >
                📂 Merge Multiple PDFs
              </button>
              <button 
                onClick={() => { setActiveTab("split"); setStatusMessage(""); setIsProcessing(false); }}
                className={`py-3 px-6 text-sm font-extrabold transition-all border-b-2 ${
                  activeTab === "split" 
                    ? "border-[var(--gold)] text-[var(--text-gold)]" 
                    : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
                style={{ fontFamily: "'Baloo 2', sans-serif" }}
              >
                ✂️ Split & Extract Pages
              </button>
            </div>

            {/* Tab Contents */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Tab 1: MERGE PANEL */}
              {activeTab === "merge" && (
                <>
                  {/* Left Controls */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="heritage-card p-5 space-y-5">
                      <h3 className="font-extrabold text-sm border-b pb-2 text-[var(--text-primary)]" style={{ fontFamily: "'Baloo 2', sans-serif", borderColor: "var(--border)" }}>
                        Merge Settings
                      </h3>
                      
                      <div className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                        Upload two or more PDF files. You can arrange the files in the editor. First file will form the initial pages of the output.
                      </div>

                      <div className="pt-4 border-t border-dashed" style={{ borderColor: "var(--border)" }}>
                        <button 
                          onClick={runMerge} 
                          disabled={mergeFiles.length < 2 || isProcessing}
                          className="w-full btn-gold py-3 text-xs disabled:opacity-40"
                        >
                          {isProcessing ? "Merging..." : "⚡ Merge Documents"}
                        </button>
                      </div>

                      {mergedPdfUrl && (
                        <button 
                          onClick={downloadMerged} 
                          className="w-full btn-primary py-3 text-xs"
                        >
                          📥 Download Merged PDF
                        </button>
                      )}

                      {mergeFiles.length > 0 && (
                        <button 
                          className="w-full text-xs text-gradient-red font-bold text-center block" 
                          onClick={() => { setMergeFiles([]); setMergedPdfUrl(null); }}
                        >
                          Clear All Files
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right Editor Workspace */}
                  <div className="lg:col-span-3 space-y-6">
                    {/* Merge Dropzone */}
                    <div 
                      className="heritage-card p-6 text-center border-dashed border-2 cursor-pointer transition-all duration-300 hover:border-[#C9A84C]/80"
                      style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
                      onClick={() => document.getElementById("merge-upload")?.click()}
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => {
                        e.preventDefault()
                        if (e.dataTransfer.files) {
                          const eFake = { target: { files: e.dataTransfer.files } }
                          handleMergeFileUpload(eFake as any)
                        }
                      }}
                    >
                      <input type="file" id="merge-upload" className="hidden" accept="application/pdf" multiple onChange={handleMergeFileUpload} />
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl">📂</span>
                        <div>
                          <p className="text-xs font-bold text-[var(--text-primary)]">Drag & drop or Click to add PDF files</p>
                          <p className="text-[10px] text-[var(--text-subtle)]">Add two or more files to combine them</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress indicators */}
                    {isProcessing && (
                      <div className="heritage-card p-8 text-center flex flex-col items-center justify-center">
                        <div className="animate-spin inline-block w-8 h-8 border-4 border-[var(--gold)] border-t-transparent rounded-full mb-4"></div>
                        <p className="text-xs text-[var(--text-muted)]">{statusMessage}</p>
                      </div>
                    )}

                    {/* Merge List */}
                    {!isProcessing && mergeFiles.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-[var(--text-muted)] px-1">Document Order</h4>
                        <div className="space-y-2">
                          {mergeFiles.map((item, index) => (
                            <div key={item.id} className="heritage-card p-4 flex items-center justify-between bg-[var(--bg-secondary)]/40 border-[var(--border)]">
                              <div className="flex items-center gap-4 truncate">
                                <div className="w-7 h-7 flex items-center justify-center bg-[var(--bg-primary)] text-[var(--text-gold)] text-[10px] font-extrabold rounded-full border border-[var(--border)]">
                                  {index + 1}
                                </div>
                                <div className="truncate">
                                  <p className="text-xs font-bold text-[var(--text-primary)] truncate max-w-xs sm:max-w-md">{item.file.name}</p>
                                  <p className="text-[10px] text-[var(--text-subtle)]">
                                    {item.pageCount} Pages • {formatSize(item.size)}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => moveMergeFile(index, "up")}
                                  disabled={index === 0}
                                  className="w-7 h-7 flex items-center justify-center bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-muted)] rounded-lg text-xs hover:text-[var(--text-primary)] disabled:opacity-20 transition-colors"
                                  title="Move Up"
                                >
                                  ▲
                                </button>
                                <button 
                                  onClick={() => moveMergeFile(index, "down")}
                                  disabled={index === mergeFiles.length - 1}
                                  className="w-7 h-7 flex items-center justify-center bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-muted)] rounded-lg text-xs hover:text-[var(--text-primary)] disabled:opacity-20 transition-colors"
                                  title="Move Down"
                                >
                                  ▼
                                </button>
                                <button 
                                  onClick={() => removeMergeFile(item.id)}
                                  className="w-7 h-7 flex items-center justify-center bg-[var(--bg-primary)] border border-[var(--primary)]/30 text-[var(--primary)] rounded-lg text-xs hover:bg-[var(--primary)] hover:text-[var(--bg-primary)] transition-colors"
                                  title="Delete"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Empty State */}
                    {!isProcessing && mergeFiles.length === 0 && (
                      <div className="heritage-card p-12 text-center text-[var(--text-muted)] flex flex-col items-center justify-center" style={{ minHeight: 250 }}>
                        <p className="text-4xl mb-2">📂</p>
                        <h4 className="text-xs font-bold text-[var(--text-primary)]" style={{ fontFamily: "'Baloo 2', sans-serif" }}>No Documents Added</h4>
                        <p className="text-xs max-w-xs mx-auto mt-1 mb-4">
                          Select the document files that you want to bind. You can upload multiple PDFs at once.
                        </p>
                        <button className="btn-gold px-5 py-2 text-xs" onClick={() => document.getElementById("merge-upload")?.click()}>
                          Add PDF Files
                        </button>
                      </div>
                    )}

                    {mergedPdfUrl && !isProcessing && (
                      <div className="heritage-card p-6 text-center border-[var(--green)]/20 bg-[var(--green)]/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-left">
                          <p className="text-xs font-bold text-[var(--green)]">🎉 PDF Merge Completed!</p>
                          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">All files concatenated in designated sequence.</p>
                        </div>
                        <div className="flex gap-3">
                          <a href={mergedPdfUrl} target="_blank" className="btn-outline-gold px-5 py-2 text-xs">
                            👁️ Open Document
                          </a>
                          <button onClick={downloadMerged} className="btn-gold px-5 py-2 text-xs">
                            📥 Download PDF
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Tab 2: SPLIT PANEL */}
              {activeTab === "split" && (
                <>
                  {/* Left Controls */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="heritage-card p-5 space-y-5">
                      <h3 className="font-extrabold text-sm border-b pb-2 text-[var(--text-primary)]" style={{ fontFamily: "'Baloo 2', sans-serif", borderColor: "var(--border)" }}>
                        Split Settings
                      </h3>

                      {splitFile && (
                        <div className="space-y-1 text-xs">
                          <p className="text-[10px] text-[var(--text-subtle)] uppercase tracking-widest">Active File</p>
                          <p className="font-bold text-[var(--text-primary)] truncate">{splitFile.name}</p>
                          <p className="text-[var(--text-muted)]">{splitPdfPagesCount} Pages • {formatSize(splitFile.size)}</p>
                        </div>
                      )}

                      {/* Manual Range Input */}
                      <div>
                        <label className="field-label">Target Page Range</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 1-3, 5, 7" 
                          value={pageRangeText}
                          onChange={handleRangeTextChange}
                          disabled={!splitFile}
                          className="field-input text-xs disabled:opacity-40" 
                        />
                        <p className="text-[9px] text-[var(--text-subtle)] mt-1 leading-normal">
                          Type ranges (e.g. 1-4) or single pages separated by commas. Or select thumbnails directly in the workspace.
                        </p>
                      </div>

                      {/* Split Button */}
                      <div className="pt-4 border-t border-dashed" style={{ borderColor: "var(--border)" }}>
                        <button 
                          onClick={runSplit} 
                          disabled={!splitFile || selectedPages.length === 0 || isProcessing}
                          className="w-full btn-gold py-3 text-xs disabled:opacity-40"
                        >
                          {isProcessing ? "Extracting..." : "⚡ Extract Selected Pages"}
                        </button>
                      </div>

                      {splitPdfUrl && (
                        <button 
                          onClick={downloadSplit} 
                          className="w-full btn-primary py-3 text-xs"
                        >
                          📥 Download Extracted PDF
                        </button>
                      )}

                      {splitFile && (
                        <button 
                          className="w-full text-xs text-gradient-red font-bold text-center block" 
                          onClick={() => {
                            setSplitFile(null);
                            setSplitPdfUrl(null);
                            setSelectedPages([]);
                            setPageRangeText("");
                            setThumbnails([]);
                          }}
                        >
                          Change PDF File
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right Editor Workspace */}
                  <div className="lg:col-span-3 space-y-6">
                    {/* Split Dropzone */}
                    {!splitFile && (
                      <div 
                        className="heritage-card p-12 text-center border-dashed border-2 cursor-pointer transition-all duration-300 hover:border-[#C9A84C]/80"
                        style={{ borderColor: "var(--border)", background: "var(--bg-secondary)", minHeight: 250 }}
                        onClick={() => document.getElementById("split-upload")?.click()}
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => {
                          e.preventDefault()
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            const eFake = { target: { files: e.dataTransfer.files } }
                            handleSplitFileUpload(eFake as any)
                          }
                        }}
                      >
                        <input type="file" id="split-upload" className="hidden" accept="application/pdf" onChange={handleSplitFileUpload} />
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-4xl mb-3">✂️</span>
                          <h4 className="text-xs font-bold text-[var(--text-primary)]">Upload PDF to Split Pages</h4>
                          <p className="text-[10px] text-[var(--text-subtle)] mt-1 max-w-xs">
                            Select a document to render pages visually. Click pages to select them for extraction.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Rendering indicator */}
                    {renderingThumbnails && (
                      <div className="heritage-card p-10 text-center flex flex-col items-center justify-center border-[var(--border)]">
                        <div className="animate-spin inline-block w-6 h-6 border-2 border-[var(--gold)] border-t-transparent rounded-full mb-3"></div>
                        <p className="text-xs text-[var(--text-muted)]">Rendering visual page thumbnails...</p>
                      </div>
                    )}

                    {/* Extraction Progress indicator */}
                    {isProcessing && (
                      <div className="heritage-card p-10 text-center flex flex-col items-center justify-center border-[var(--border)]">
                        <div className="animate-spin inline-block w-8 h-8 border-4 border-[var(--gold)] border-t-transparent rounded-full mb-4"></div>
                        <p className="text-xs text-[var(--text-muted)]">{statusMessage}</p>
                      </div>
                    )}

                    {/* Split Page Previews */}
                    {!renderingThumbnails && !isProcessing && splitFile && thumbnails.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                          <h4 className="text-xs font-bold text-[var(--text-muted)]">
                            Select Pages ({selectedPages.length} Selected)
                          </h4>
                          {splitPdfPagesCount > thumbnails.length && (
                            <p className="text-[9px] text-[var(--text-subtle)]">Showing first {thumbnails.length} page previews</p>
                          )}
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                          {thumbnails.map(thumb => {
                            const isSelected = selectedPages.includes(thumb.pageNum)
                            return (
                              <div 
                                key={thumb.pageNum} 
                                onClick={() => togglePageSelection(thumb.pageNum)}
                                className={`heritage-card p-2 bg-[var(--bg-secondary)] relative flex flex-col items-center cursor-pointer transition-all duration-200 border border-[var(--border)] ${
                                  isSelected ? "ring-2 ring-[var(--gold)] border-transparent" : "opacity-85 hover:opacity-100"
                                }`}
                              >
                                {/* Checkbox Indicator */}
                                <div className={`absolute top-2 right-2 w-4 h-4 flex items-center justify-center rounded border text-[9px] font-extrabold transition-all ${
                                  isSelected 
                                    ? "bg-[var(--gold)] border-[var(--gold)] text-[var(--bg-primary)]" 
                                    : "bg-[var(--bg-primary)] border-[var(--border)] text-transparent"
                                }`}>
                                  ✓
                                </div>

                                <div className="h-28 w-full flex items-center justify-center bg-white rounded overflow-hidden border border-neutral-200">
                                  <img src={thumb.dataUrl} alt={`Page ${thumb.pageNum}`} className="object-contain max-h-full max-w-full shadow-inner" />
                                </div>

                                <p className={`text-[10px] mt-2 font-bold ${isSelected ? "text-[var(--text-gold)]" : "text-[var(--text-muted)]"}`}>
                                  Page {thumb.pageNum}
                                </p>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {splitPdfUrl && !isProcessing && (
                      <div className="heritage-card p-6 text-center border-[var(--green)]/20 bg-[var(--green)]/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-left">
                          <p className="text-xs font-bold text-[var(--green)]">🎉 PDF Split Completed!</p>
                          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Selected pages extracted into a separate PDF.</p>
                        </div>
                        <div className="flex gap-3">
                          <a href={splitPdfUrl} target="_blank" className="btn-outline-gold px-5 py-2 text-xs">
                            👁️ Open PDF
                          </a>
                          <button onClick={downloadSplit} className="btn-gold px-5 py-2 text-xs">
                            📥 Download PDF
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  )
}
