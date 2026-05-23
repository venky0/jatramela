"use client"

import { useState } from "react"
import Link from "next/link"
import QuickSwitch from "../../components/quick-switch"

export default function Base64ConverterPage() {
  const [inputText, setInputText] = useState<string>("Welcome to Jatramela Jatra Festival!")
  const [outputText, setOutputText] = useState<string>("")
  const [mode, setMode] = useState<"text" | "file">("text")
  const [error, setError] = useState<string | null>(null)
  const [copySuccess, setCopySuccess] = useState<boolean>(false)

  // File state
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileSize, setFileSize] = useState<string | null>(null)
  const [fileBase64, setFileBase64] = useState<string>("")
  const [includePrefix, setIncludePrefix] = useState<boolean>(true)
  const [rawFileB64, setRawFileB64] = useState<string>("")

  const handleEncodeText = () => {
    try {
      setError(null)
      // Use standard btoa with UTF-8 encoding compatibility
      const encoded = btoa(encodeURIComponent(inputText).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode(parseInt(p1, 16))
      }))
      setOutputText(encoded)
    } catch (err: any) {
      setError("Failed to encode: " + err.message)
    }
  }

  const handleDecodeText = () => {
    try {
      setError(null)
      const decoded = decodeURIComponent(atob(inputText).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      setOutputText(decoded)
    } catch (err: any) {
      setError("Failed to decode: Invalid Base64 character sequence or encoding. " + err.message)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setFileSize((file.size / 1024).toFixed(1) + " KB")
    setError(null)

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      if (result) {
        const parts = result.split(",")
        const base64Data = parts[1] || parts[0]
        setRawFileB64(base64Data)
        setFileBase64(includePrefix ? result : base64Data)
      }
    }
    reader.onerror = () => {
      setError("Failed to read file.")
    }
    reader.readAsDataURL(file)
  }

  const togglePrefix = (checked: boolean) => {
    setIncludePrefix(checked)
    if (rawFileB64) {
      if (checked) {
        // Re-construct with standard prefix if we can estimate it, or just use raw data.
        // Usually file reader provides the full data URL, let's regenerate or wrap
        // We'll read it again if uploaded, or simple data uri wrapper if we know the type.
        // Standard way is to keep a reference to raw and toggle.
        const mimeType = fileName ? getMimeType(fileName) : "application/octet-stream"
        setFileBase64(`data:${mimeType};base64,${rawFileB64}`)
      } else {
        setFileBase64(rawFileB64)
      }
    }
  }

  const getMimeType = (fname: string): string => {
    const ext = fname.split(".").pop()?.toLowerCase()
    switch (ext) {
      case "png": return "image/png"
      case "jpg":
      case "jpeg": return "image/jpeg"
      case "gif": return "image/gif"
      case "webp": return "image/webp"
      case "svg": return "image/svg+xml"
      case "pdf": return "application/pdf"
      case "txt": return "text/plain"
      case "json": return "application/json"
      default: return "application/octet-stream"
    }
  }

  const copyToClipboard = (text: string) => {
    if (!text) return
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    })
  }

  return (
    <div style={{ background: "var(--bg-primary)" }} className="min-h-screen">
      {/* ── HEADER ── */}
      <section style={{ background: "var(--bg-header)" }} className="py-12 text-center relative">
        <div className="temple-border absolute top-0 left-0 right-0" />
        <div className="content-container">
          <Link href="/converters/developer" className="text-xs font-bold mb-2 block hover:opacity-80" style={{ color: "rgba(255,248,231,0.6)" }}>
            ← Back to Developer Tools
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-shimmer mb-3" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            Base64 Encoder / Decoder
          </h1>
          <p className="text-xs sm:text-sm max-w-lg mx-auto" style={{ color: "rgba(255,248,231,0.75)" }}>
            Encode text and binary files to Base64 format, or decode Base64 back into readable layouts entirely offline.
          </p>
          <QuickSwitch currentHref="/converters/developer/base64" />
        </div>
        <div className="temple-border absolute bottom-0 left-0 right-0" />
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="content-container py-10 max-w-4xl mx-auto">
        {error && (
          <div className="p-4 mb-6 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-400">
            ⚠️ {error}
          </div>
        )}

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-neutral-800 mb-8 justify-center space-x-6">
          <button
            onClick={() => { setMode("text"); setError(null); }}
            className={`pb-3 text-sm font-bold transition-colors ${
              mode === "text"
                ? "text-[#C9A84C] border-b-2 border-[#C9A84C]"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            🔤 Text Converter
          </button>
          <button
            onClick={() => { setMode("file"); setError(null); }}
            className={`pb-3 text-sm font-bold transition-colors ${
              mode === "file"
                ? "text-[#C9A84C] border-b-2 border-[#C9A84C]"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            📁 File to Base64
          </button>
        </div>

        {mode === "text" ? (
          /* Text Converter Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Input Box */}
            <div className="heritage-card p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-sm mb-3" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Input Text / Base64</h3>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type or paste content here..."
                  className="w-full h-72 bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-xs font-mono text-amber-100 outline-none focus:border-[#C9A84C] resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <button onClick={handleEncodeText} className="btn-gold py-2.5 text-xs font-bold">
                  Encode to Base64 ➔
                </button>
                <button onClick={handleDecodeText} className="btn-primary py-2.5 text-xs font-bold">
                  Decode Base64 ➔
                </button>
              </div>
            </div>

            {/* Output Box */}
            <div className="heritage-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-extrabold text-sm" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Result Output</h3>
                  {outputText && (
                    <button onClick={() => copyToClipboard(outputText)} className="text-[10px] text-[#C9A84C] font-bold">
                      {copySuccess ? "Copied! ✓" : "📋 Copy"}
                    </button>
                  )}
                </div>
                <textarea
                  readOnly
                  value={outputText}
                  placeholder="Processed output will appear here..."
                  className="w-full h-72 bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-xs font-mono text-amber-100 outline-none resize-none"
                />
              </div>
              <button
                disabled={!outputText}
                onClick={() => copyToClipboard(outputText)}
                className="w-full btn-gold py-2.5 text-xs mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Copy Result to Clipboard
              </button>
            </div>
          </div>
        ) : (
          /* File Converter UI */
          <div className="heritage-card p-8 max-w-2xl mx-auto">
            <h3 className="font-extrabold text-sm mb-4 text-center" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              Upload File for Local Base64 Conversion
            </h3>
            
            {/* Upload Area */}
            <div className="border-2 border-dashed border-neutral-800 hover:border-[#C9A84C]/50 rounded-xl p-8 text-center transition-all bg-neutral-950/50 relative">
              <input
                type="file"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-2">
                <div className="text-4xl">📥</div>
                <p className="text-xs text-neutral-400">
                  {fileName ? (
                    <span className="text-[#C9A84C] font-bold">{fileName} ({fileSize})</span>
                  ) : (
                    "Drag and drop any file here, or click to select from your device"
                  )}
                </p>
                <p className="text-[10px] text-neutral-600">
                  Images, PDFs, audio, etc. (Supported up to 10MB completely local in-browser)
                </p>
              </div>
            </div>

            {fileBase64 && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-xs text-neutral-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includePrefix}
                      onChange={(e) => togglePrefix(e.target.checked)}
                      className="rounded border-neutral-800 text-[#C9A84C] focus:ring-0 focus:ring-offset-0 bg-neutral-950"
                    />
                    <span>Include Data URI Prefix (e.g. <code className="text-[#C9A84C] text-[10px]">data:image/png;base64,...</code>)</span>
                  </label>
                  <button onClick={() => copyToClipboard(fileBase64)} className="text-xs text-[#C9A84C] font-bold">
                    {copySuccess ? "Copied! ✓" : "📋 Copy Base64 String"}
                  </button>
                </div>

                <textarea
                  readOnly
                  value={fileBase64}
                  className="w-full h-40 bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-[10px] font-mono text-amber-200/80 outline-none resize-none"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
