"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import QuickSwitch from "../../components/quick-switch"

import {
  transliterateDocument,
  generateSuggestions
} from "@lib/kannada-transliteration"

export default function TransliterationPage() {
  const [englishText, setEnglishText] = useState<string>("")
  const [kannadaText, setKannadaText] = useState<string>("")
  const [activeWord, setActiveWord] = useState<string>("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [overrides, setOverrides] = useState<{ [key: string]: string }>({})
  const [copyStatus, setCopyStatus] = useState<boolean>(false)

  // ── ON TEXT CHANGE HANDLER ────────────────────────────────────────────────
  const handleTextChange = (val: string) => {
    setEnglishText(val)
    
    // Find active (last typed) word
    const words = val.trim().split(/[^a-zA-Z]+/)
    const lastWord = words[words.length - 1] || ""
    setActiveWord(lastWord)
    setSuggestions(generateSuggestions(lastWord, overrides))
  }

  // Update document whenever input or overrides change
  useEffect(() => {
    setKannadaText(transliterateDocument(englishText, overrides))
  }, [englishText, overrides])

  const selectSuggestion = (option: string) => {
    if (!activeWord) return
    const key = activeWord.toLowerCase()
    
    // Set override mapping for this typing session
    setOverrides(prev => ({
      ...prev,
      [key]: option
    }))
  }

  const copyText = () => {
    navigator.clipboard.writeText(kannadaText).then(() => {
      setCopyStatus(true)
      setTimeout(() => setCopyStatus(false), 1800)
    })
  }

  return (
    <div style={{ background: "var(--bg-primary)" }} className="min-h-screen">
      {/* ── HEADER ── */}
      <section style={{ background: "var(--bg-header)" }} className="py-12 text-center relative">
        <div className="temple-border absolute top-0 left-0 right-0" />
        <div className="content-container">
          <Link href="/converters/cultural" className="text-xs font-bold mb-2 block hover:opacity-80" style={{ color: "rgba(255,248,231,0.6)" }}>
            ← Back to Cultural Tools
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-shimmer mb-3" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            English ➔ Kannada Transliteration
          </h1>
          <p className="text-xs sm:text-sm max-w-lg mx-auto" style={{ color: "rgba(255,248,231,0.75)" }}>
            Type phonetically in English (e.g. <i>Namaskara</i>, <i>kannada</i>) and watch it convert to Kannada Unicode script in real-time.
          </p>
          <QuickSwitch currentHref="/converters/cultural/kannada-transliteration" />
        </div>
        <div className="temple-border absolute bottom-0 left-0 right-0" />
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="content-container py-10 max-w-4xl mx-auto">
        
        {/* Dynamic 3-Option Suggestion Bar */}
        {activeWord && suggestions.length > 0 && (
          <div className="mb-6 p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 bg-[var(--bg-primary)]/80" style={{ borderColor: "rgba(201,168,76,0.3)" }}>
            <div className="text-xs">
              <span className="text-[var(--text-muted)]">Variations for </span>
              <strong className="text-[#C9A84C]">"{activeWord}"</strong>:
            </div>
            <div className="flex gap-2 flex-wrap">
              {suggestions.map((option, idx) => {
                const isSelected = overrides[activeWord.toLowerCase()] === option || (!overrides[activeWord.toLowerCase()] && idx === 0)
                return (
                  <button
                    key={idx}
                    onClick={() => selectSuggestion(option)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all duration-150 ${
                      isSelected
                        ? "bg-[#C9A84C] text-[#2C1810] border-[#C9A84C] shadow-lg scale-105"
                        : "bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-primary)] hover:border-neutral-700"
                    }`}
                    style={{ fontFamily: "'Baloo 2', sans-serif" }}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Box */}
          <div className="heritage-card p-6">
            <h3 className="font-extrabold text-sm mb-3" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Type in English (Phonetic)</h3>
            <textarea
              value={englishText}
              onChange={e => handleTextChange(e.target.value)}
              placeholder="Type here... (e.g., namma karnataka, shubha dinavu, devasthana, jatra)"
              className="w-full h-72 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-4 text-sm text-amber-100 outline-none focus:border-[#C9A84C] resize-none"
            />
          </div>

          {/* Output Box */}
          <div className="heritage-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-extrabold text-sm" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Kannada Text Output</h3>
                {kannadaText && (
                  <button onClick={copyText} className="text-xs text-[#C9A84C] font-bold">
                    {copyStatus ? "Copied! ✓" : "📋 Copy"}
                  </button>
                )}
              </div>
              <div className="w-full h-72 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-base text-[var(--text-primary)] overflow-y-auto leading-relaxed whitespace-pre-wrap select-all">
                {kannadaText || <span className="text-[var(--text-subtle)] text-xs">ಕನ್ನಡ ಅನುವಾದ ಇಲ್ಲಿ ಗೋಚರಿಸುತ್ತದೆ...</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Translation Key Guide */}
        <div className="mt-8 p-6 rounded-2xl border" style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}>
          <h3 className="font-extrabold text-sm mb-3 text-gradient-red" style={{ fontFamily: "'Baloo 2', sans-serif" }}>⌨️ Transliteration Guide Key</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <p className="font-bold text-[#C9A84C] mb-1">Vowels (ಸ್ವರಗಳು)</p>
              <ul className="space-y-1 text-[var(--text-muted)]">
                <li>• a ➔ ಅ | aa / A ➔ ಆ</li>
                <li>• i ➔ ಇ | ii / I ➔ ಈ</li>
                <li>• u ➔ ಉ | uu / U ➔ ಊ</li>
                <li>• e ➔ ಎ | ee / E ➔ ಏ</li>
                <li>• ru / R ➔ ಋ</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-[#C9A84C] mb-1">Consonants (ವ್ಯಂಜನಗಳು)</p>
              <ul className="space-y-1 text-[var(--text-muted)]">
                <li>• k ➔ ಕ | kh ➔ ಖ</li>
                <li>• g ➔ ಗ | gh ➔ ಘ</li>
                <li>• c / ch ➔ ಚ | chh ➔ ಛ</li>
                <li>• j ➔ ಜ | jh ➔ ಝ</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-[#C9A84C] mb-1">Retroflex (ಮೂರ್ಧನ್ಯ)</p>
              <ul className="space-y-1 text-[var(--text-muted)]">
                <li>• T ➔ ಟ | Th ➔ ಠ</li>
                <li>• D ➔ ಡ | Dh ➔ ಢ</li>
                <li>• N ➔ ಣ | L ➔ ಳ</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-[#C9A84C] mb-1">Conjuncts (ಒತ್ತಕ್ಷರಗಳು)</p>
              <ul className="space-y-1 text-[var(--text-muted)]">
                <li>• kka ➔ ಕ್ಕ (k + k + a)</li>
                <li>• rya ➔ ರ್ಯ (r + y + a)</li>
                <li>• jn ➔ ಜ್ಞ (j + n)</li>
                <li>• ksha ➔ ಕ್ಷ (k + sh + a)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
