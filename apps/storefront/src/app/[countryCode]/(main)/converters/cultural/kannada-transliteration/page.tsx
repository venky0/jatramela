"use client"

import { useState } from "react"
import Link from "next/link"
import QuickSwitch from "../../components/quick-switch"

// Transliteration Map
const VOWELS: { [key: string]: string } = {
  a: "ಅ", aa: "ಆ", A: "ಆ", i: "ಇ", ii: "ಈ", I: "ಈ", u: "ಉ", uu: "ಊ", U: "ಊ",
  e: "ಎ", ee: "ಏ", E: "ಏ", ai: "ಐ", o: "ಒ", oo: "ಓ", O: "ಓ", au: "ಔ",
  am: "ಅಂ", aha: "ಅಃ"
}

const MATRAS: { [key: string]: string } = {
  a: "", aa: "ಾ", A: "ಾ", i: "ಿ", ii: "ೀ", I: "ೀ", u: "ು", uu: "ೂ", U: "ೂ",
  e: "ೆ", ee: "ೇ", E: "ೇ", ai: "ೈ", o: "ೊ", oo: "ೋ", O: "ೋ", au: "ೌ",
  am: "ಂ", aha: "ಃ"
}

const CONSONANTS: { [key: string]: string } = {
  k: "ಕ", kh: "ಖ", g: "ಗ", gh: "ಘ", ng: "ಙ",
  c: "ಚ", ch: "ಛ", j: "ಜ", jh: "ಝ", ny: "ಞ",
  t: "ತ", th: "ಥ", d: "ದ", dh: "ಧ", n: "ನ",
  T: "ಟ", Th: "ಠ", D: "ಡ", Dh: "ಢ", N: "ಣ",
  p: "ಪ", ph: "ಫ", b: "ಬ", bh: "ಭ", m: "ಮ",
  y: "ಯ", r: "ರ", l: "ಲ", v: "ವ", w: "ವ",
  sh: "ಶ", Sh: "ಷ", s: "ಸ", h: "ಹ", L: "ಳ",
  ksh: "ಕ್ಷ"
}

export default function TransliterationPage() {
  const [englishText, setEnglishText] = useState<string>("")
  const [kannadaText, setKannadaText] = useState<string>("")
  const [copyStatus, setCopyStatus] = useState<boolean>(false)

  // Phonetic Transliteration Engine
  const transliterate = (text: string): string => {
    let result = ""
    let i = 0
    const len = text.length

    while (i < len) {
      const char = text[i]

      // Check if it's whitespace or punctuation
      if (/[^a-zA-Z]/g.test(char)) {
        result += char
        i++
        continue
      }

      // 1. Identify consonant cluster length (up to 3 letters: e.g. ksh, kh, dh)
      let consKey = ""
      let step = 0
      
      if (i + 2 < len && CONSONANTS[text.substring(i, i + 3).toLowerCase()]) {
        consKey = text.substring(i, i + 3).toLowerCase()
        step = 3
      } else if (i + 1 < len && CONSONANTS[text.substring(i, i + 2).toLowerCase()]) {
        consKey = text.substring(i, i + 2).toLowerCase()
        step = 2
      } else if (CONSONANTS[char.toLowerCase()]) {
        // Handle capitalization differences (T, D, N, A)
        consKey = CONSONANTS[char] ? char : char.toLowerCase()
        step = 1
      }

      if (consKey) {
        // Consonant base glyph
        const baseGlyph = CONSONANTS[consKey]
        i += step

        // 2. Identify the trailing vowel cluster (up to 3 letters: e.g. aha, aai)
        let vowelKey = ""
        let vStep = 0

        if (i + 2 < len && MATRAS[text.substring(i, i + 3).toLowerCase()]) {
          vowelKey = text.substring(i, i + 3).toLowerCase()
          vStep = 3
        } else if (i + 1 < len && MATRAS[text.substring(i, i + 2).toLowerCase()]) {
          vowelKey = text.substring(i, i + 2).toLowerCase()
          vStep = 2
        } else if (i < len && MATRAS[text[i].toLowerCase()]) {
          const vChar = text[i]
          vowelKey = MATRAS[vChar] ? vChar : vChar.toLowerCase()
          vStep = 1
        }

        if (vStep > 0) {
          // Map to consonant + matra (e.g. ka -> ಕ, ki -> ಕಿ)
          result += baseGlyph + MATRAS[vowelKey]
          i += vStep
        } else {
          // No following vowel: add virama (halant / dead consonant, e.g. k -> ಕ್)
          result += baseGlyph + "್"
        }
      } else {
        // 3. Isolated vowel mapping (starts a word or syllable)
        let vowelKey = ""
        let vStep = 0

        if (i + 2 < len && VOWELS[text.substring(i, i + 3).toLowerCase()]) {
          vowelKey = text.substring(i, i + 3).toLowerCase()
          vStep = 3
        } else if (i + 1 < len && VOWELS[text.substring(i, i + 2).toLowerCase()]) {
          vowelKey = text.substring(i, i + 2).toLowerCase()
          vStep = 2
        } else if (VOWELS[char.toLowerCase()]) {
          const vChar = char
          vowelKey = VOWELS[vChar] ? vChar : vChar.toLowerCase()
          vStep = 1
        }

        if (vStep > 0) {
          result += VOWELS[vowelKey]
          i += vStep
        } else {
          result += char
          i++
        }
      }
    }

    // Clean up unnecessary trailing virama on spaces / punctuation
    return result
      .replace(/್ /g, " ")
      .replace(/್\n/g, "\n")
      .replace(/್([^a-zA-Z\u0C80-\u0CFF])/g, "$1")
  }

  const handleTextChange = (val: string) => {
    setEnglishText(val)
    setKannadaText(transliterate(val))
  }

  const copyText = () => {
    navigator.clipboard.writeText(kannadaText).then(() => {
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
            English ➔ Kannada Transliteration
          </h1>
          <p className="text-xs sm:text-sm max-w-lg mx-auto" style={{ color: "rgba(255,248,231,0.75)" }}>
            Type phonetically in English (e.g. <i>Namaskara</i>, <i>kannada</i>) and watch it convert to Kannada Unicode script in real-time.
          </p>
          <QuickSwitch currentHref="/converters/cultural/kannada-transliteration" />
        </div>
        <div className="temple-border absolute bottom-0 left-0 right-0" />
      </section>

      <div className="content-container py-10 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Input Box */}
          <div className="heritage-card p-6">
            <h3 className="font-extrabold text-sm mb-3" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Type in English (Phonetic)</h3>
            <textarea value={englishText} onChange={e => handleTextChange(e.target.value)}
              placeholder="Type here... (e.g., namma karnataka, shubha dinavu, devasthana)"
              className="w-full h-72 bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-sm text-amber-100 outline-none focus:border-[#C9A84C] resize-none"
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
              <div className="w-full h-72 bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-base text-neutral-200 overflow-y-auto leading-relaxed whitespace-pre-wrap select-all">
                {kannadaText || <span className="text-neutral-500 text-xs">ಕನ್ನಡ ಅನುವಾದ ಇಲ್ಲಿ ಗೋಚರಿಸುತ್ತದೆ...</span>}
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
              <ul className="space-y-1 text-neutral-400">
                <li>• a ➔ ಅ | aa / A ➔ ಆ</li>
                <li>• i ➔ ಇ | ii / I ➔ ಈ</li>
                <li>• u ➔ ಉ | uu / U ➔ ಊ</li>
                <li>• e ➔ ಎ | ee / E ➔ ಏ</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-[#C9A84C] mb-1">Consonants (ವ್ಯಂಜನಗಳು)</p>
              <ul className="space-y-1 text-neutral-400">
                <li>• k ➔ ಕ | kh ➔ ಖ</li>
                <li>• g ➔ ಗ | gh ➔ ಘ</li>
                <li>• c ➔ ಚ | ch ➔ ಛ</li>
                <li>• j ➔ ಜ | jh ➔ ಝ</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-[#C9A84C] mb-1">Retroflex (ಮೂರ್ಧನ್ಯ)</p>
              <ul className="space-y-1 text-neutral-400">
                <li>• T ➔ ಟ | Th ➔ ಠ</li>
                <li>• D ➔ ಡ | Dh ➔ ಢ</li>
                <li>• N ➔ ಣ | L ➔ ಳ</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-[#C9A84C] mb-1">Conjuncts (ಒತ್ತಕ್ಷರಗಳು)</p>
              <ul className="space-y-1 text-neutral-400">
                <li>• kka ➔ ಕ್ಕ (k + k + a)</li>
                <li>• rya ➔ ರ್ಯ (r + y + a)</li>
                <li>• shya ➔ ಶ್ಯ (sh + y + a)</li>
                <li>• ksha ➔ ಕ್ಷ (k + sh + a)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
