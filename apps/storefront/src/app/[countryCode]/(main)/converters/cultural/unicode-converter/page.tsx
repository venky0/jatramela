"use client"

import { useState } from "react"
import Link from "next/link"

// Simple ASCII to Unicode replacement maps for Nudi/Baraha fonts.
// Legacy fonts use standard English ASCII values to draw Kannada glyphs.
// We map these character combinations back to standard Kannada Unicode values.
const NUDI_ASCII_MAP: { [key: string]: string } = {
  "a": "ಅ", "A": "ಆ", "i": "ಇ", "I": "ಈ", "u": "ಉ", "U": "ಊ", 
  "e": "ಎ", "E": "ಏ", "Y": "ಐ", "o": "ಒ", "O": "ಓ", "w": "ಔ",
  "M": "ಂ", "h": "ಃ", "q": "್",
  "k": "ಕ", "K": "ಖ", "g": "ಗ", "G": "ಘ", "x": "ಙ",
  "c": "ಚ", "C": "ಛ", "j": "ಜ", "J": "ಝ", "z": "ಞ",
  "t": "ತ", "T": "ಥ", "d": "ದ", "D": "ಧ", "n": "ನ",
  "p": "ಪ", "P": "ಫ", "b": "ಬ", "B": "ಭ", "m": "ಮ",
  "y": "ಯ", "r": "ರ", "l": "ಲ", "v": "ವ", "S": "ಶ",
  "s": "ಸ", "H": "ಹ", "L": "ಳ", "R": "ಋ",
  // Vattulu
  "F": "್ಕ", "V": "್ಖ", "X": "್ಗ", "Z": "್ಘ",
  "f": "್ಚ", "v": "್ಛ", "x_v": "್ಜ", "z_v": "್ಝ",
  "W": "್ಟ", "Q": "್ಠ", "u_v": "್ಡ", "U_v": "್ಢ",
  "i_v": "್ಣ", "o_v": "್ತ", "O_v": "್ಥ", "p_v": "್ದ",
  "P_v": "್ಧ", "n_v": "್ನ", "m_v": "್ಪ", "M_v": "್ಫ",
  "y_v": "್ಬ", "Y_v": "್ಭ", "r_v": "್ಮ"
}

export default function UnicodeConverterPage() {
  const [legacyText, setLegacyText] = useState<string>("")
  const [unicodeText, setUnicodeText] = useState<string>("")
  const [copyStatus, setCopyStatus] = useState<boolean>(false)

  const convertToUnicode = () => {
    if (!legacyText.trim()) return
    
    let result = ""
    let i = 0
    const len = legacyText.length
    
    while (i < len) {
      const char = legacyText[i]
      
      // Basic character mapper
      let mapped = NUDI_ASCII_MAP[char]
      
      if (mapped) {
        result += mapped
      } else {
        result += char
      }
      i++
    }
    
    setUnicodeText(result)
  }

  const copyText = () => {
    navigator.clipboard.writeText(unicodeText).then(() => {
      setCopyStatus(true)
      setTimeout(() => setCopyStatus(false), 1800)
    })
  }

  return (
    <div style={{ background: "var(--bg-primary)" }}>
      {/* ── HEADER ── */}
      <section style={{ background: "var(--bg-header)" }} className="py-12 text-center relative">
        <div className="temple-border absolute top-0 left-0 right-0" />
        <div className="content-container">
          <Link href="/converters/cultural" className="text-xs font-bold mb-2 block hover:opacity-80" style={{ color: "rgba(255,248,231,0.6)" }}>
            ← Back to Cultural Tools
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-shimmer mb-3" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            Nudi & Baraha ➔ Unicode Converter
          </h1>
          <p className="text-xs sm:text-sm max-w-lg mx-auto" style={{ color: "rgba(255,248,231,0.75)" }}>
            Translate legacy Kannada ASCII text formats typed in Nudi or Baraha fonts into standard Unicode Kannada.
          </p>
        </div>
        <div className="temple-border absolute bottom-0 left-0 right-0" />
      </section>

      <div className="content-container py-10 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Input Box */}
          <div className="heritage-card p-6 flex flex-col justify-between" style={{ minHeight: 400 }}>
            <div>
              <h3 className="font-extrabold text-sm mb-3" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Paste Legacy ASCII Text</h3>
              <textarea value={legacyText} onChange={e => setLegacyText(e.target.value)}
                placeholder="Paste Nudi or Baraha font text here... (Looks like English text before conversion)"
                className="w-full h-64 bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-sm text-neutral-300 outline-none focus:border-[#C9A84C] resize-none"
              />
            </div>
            <button onClick={convertToUnicode} disabled={!legacyText.trim()} className="w-full btn-gold py-3 text-xs mt-4">
              ⚙️ Translate to Kannada Unicode
            </button>
          </div>

          {/* Output Box */}
          <div className="heritage-card p-6 flex flex-col justify-between" style={{ minHeight: 400 }}>
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-extrabold text-sm" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Kannada Unicode Output</h3>
                {unicodeText && (
                  <button onClick={copyText} className="text-xs text-[#C9A84C] font-bold">
                    {copyStatus ? "Copied! ✓" : "📋 Copy"}
                  </button>
                )}
              </div>
              <div className="w-full h-64 bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-base text-neutral-200 overflow-y-auto leading-relaxed whitespace-pre-wrap select-all">
                {unicodeText || <span className="text-neutral-500 text-xs">Standard Kannada Unicode text will show here...</span>}
              </div>
            </div>
          </div>

        </div>

        {/* Why Converter is needed */}
        <div className="mt-8 p-6 rounded-2xl border" style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}>
          <h3 className="font-extrabold text-sm mb-2 text-gradient-red" style={{ fontFamily: "'Baloo 2', sans-serif" }}>❓ Why do I need to convert Nudi/Baraha?</h3>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Legacy fonts like Nudi and Baraha do not store letters as standard Kannada code characters. Instead, they hijack English keyboard layouts to overlay custom glyph visual shapes.
            Standard systems (like iPhones, Android, Google Search, WhatsApp) cannot read legacy font text and will display it as nonsense English letters.
            Converting it to standard <strong>Unicode</strong> translates it into official Kannada database indices, making it readable on all modern devices, indexed by search engines, and shareable on social media.
          </p>
        </div>
      </div>
    </div>
  )
}
