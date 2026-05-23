"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import QuickSwitch from "../../components/quick-switch"

// ── VOWELS, MATRAS, AND CONSONANTS TRANSLITERATION MATRIX ────────────────────
const VOWELS: { [key: string]: string } = {
  a: "ಅ", aa: "ಆ", A: "ಆ", i: "ಇ", ii: "ಈ", I: "ಈ", u: "ಉ", uu: "ಊ", U: "ಊ",
  e: "ಎ", ee: "ಏ", E: "ಏ", ai: "ಐ", o: "ಒ", oo: "ಓ", O: "ಓ", au: "ಔ",
  am: "ಅಂ", aha: "ಅಃ", ru: "ಋ", R: "ಋ"
}

const MATRAS: { [key: string]: string } = {
  a: "", aa: "ಾ", A: "ಾ", i: "ಿ", ii: "ೀ", I: "ೀ", u: "ು", uu: "ೂ", U: "ೂ",
  e: "ೆ", ee: "ೇ", E: "ೇ", ai: "ೈ", o: "ೊ", oo: "ೋ", O: "ೋ", au: "ೌ",
  am: "ಂ", aha: "ಃ", ru: "ೃ", R: "ೃ"
}

const CONSONANTS: { [key: string]: string } = {
  k: "ಕ", kh: "ಖ", g: "ಗ", gh: "ಘ", ng: "ಙ",
  c: "ಚ", ch: "ಚ", chh: "ಛ", j: "ಜ", jh: "ಝ", ny: "ಞ",
  t: "ತ", th: "ಥ", d: "ದ", dh: "ಧ", n: "ನ",
  T: "ಟ", Th: "ಠ", D: "ಡ", Dh: "ಢ", N: "ಣ",
  p: "ಪ", ph: "ಫ", f: "ಫ", b: "ಬ", bh: "ಭ", m: "ಮ",
  y: "ಯ", r: "ರ", l: "ಲ", v: "ವ", w: "ವ",
  sh: "ಶ", Sh: "ಷ", s: "ಸ", h: "ಹ", L: "ಳ",
  ksh: "ಕ್ಷ", jn: "ಜ್ಞ"
}

// ── HERITAGE DICTIONARY FOR CULTURAL WORD OVERRIDES ──────────────────────────
const KANNADA_DICTIONARY: { [key: string]: string[] } = {
  "namaskara": ["ನಮಸ್ಕಾರ", "ನಮಸ್ಕಾರಗಳು", "ನಮಸ್ತೆ"],
  "namaskaraa": ["ನಮಸ್ಕಾರ", "ನಮಸ್ಕಾರಗಳು", "ನಮಸ್ತೆ"],
  "kannada": ["ಕನ್ನಡ", "ಕನ್ನಡದ", "ಕನ್ನಡಿಗ"],
  "karnataka": ["ಕರ್ನಾಟಕ", "ಕರ್ನಾಟಕದ", "ಕರ್ನಾಟಕದಲ್ಲಿ"],
  "jatra": ["ಜಾತ್ರೆ", "ಜಾತ್ರಾ", "ಯಾತ್ರೆ"],
  "jaatre": ["ಜಾತ್ರೆ", "ಜಾತ್ರಾ", "ಯಾತ್ರೆ"],
  "utsava": ["ಉತ್ಸವ", "ಉತ್ಸವಗಳು", "ಹಬ್ಬ"],
  "siddheshwara": ["ಸಿದ್ಧೇಶ್ವರ", "ಸಿದ್ದೇಶ್ವರ", "ಸಿದ್ಧೇಶ್ವರಸ್ವಾಮಿ"],
  "veerabhadreshwara": ["ವೀರಭದ್ರೇಶ್ವರ", "ವೀರಭದ್ರ", "ವೀರಭದ್ರೇಶ್ವರಸ್ವಾಮಿ"],
  "huskur": ["ಹುಸ್ಕೂರು", "ಹುಸ್ಕೂರ್", "ಉಸ್ಕೂರು"],
  "madduramma": ["ಮದ್ದೂರಮ್ಮ", "ಮದ್ದೂರಮ್ಮನ", "ಮದ್ದೂರು"],
  "bengaluru": ["ಬೆಂಗಳೂರು", "ಬೆಂಗಳೂರ್", "ಬೆಂಗಳೂರಿನ"],
  "shiva": ["ಶಿವ", "ಶಿವನ", "ಶಿವಾಯ"],
  "temple": ["ದೇವಸ್ಥಾನ", "ದೇವಾಲಯ", "ಗುಡಿ"],
  "swamy": ["ಸ್ವಾಮಿ", "ಸ್ವಾಮಿಗಳು", "ಸ್ವಾಮಿಯೇ"],
  "kambala": ["ಕಂಬಳ", "ಕಂಬಳದ", "ಕಂಬಳವು"],
  "karaga": ["ಕರಗ", "ಕರಗದ", "ಕರಗವು"],
  "dasara": ["ದಸರಾ", "ದಸರೆ", "ಮೈಸೂರು ದಸರಾ"],
  "panchanga": ["ಪಂಚಾಂಗ", "ಪಂಚಾಂಗದ", "ಪಂಚಾಂಗವು"],
  "tithi": ["ತಿಥಿ", "ತಿಥಿಗಳು", "ತಿಥಿಯ"],
  "sharanabasaveshwara": ["ಶರಣಬಸವೇಶ್ವರ", "ಶರಣಬಸವ", "ಶರಣಬಸವೇಶ್ವರಸ್ವಾಮಿ"]
}

export default function TransliterationPage() {
  const [englishText, setEnglishText] = useState<string>("")
  const [kannadaText, setKannadaText] = useState<string>("")
  const [activeWord, setActiveWord] = useState<string>("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [overrides, setOverrides] = useState<{ [key: string]: string }>({})
  const [copyStatus, setCopyStatus] = useState<boolean>(false)

  // ── CORE PHONETIC TRANSLITERATION ENGINE ──────────────────────────────────
  const transliterateWord = (word: string): string => {
    if (!word) return ""
    const lowerWord = word.toLowerCase()
    
    // Check if user has explicitly chosen an override for this word
    if (overrides[lowerWord]) {
      return overrides[lowerWord]
    }
    
    // Fallback to first dictionary entry if available
    if (KANNADA_DICTIONARY[lowerWord]) {
      return KANNADA_DICTIONARY[lowerWord][0]
    }

    let result = ""
    let i = 0
    const len = word.length

    while (i < len) {
      const char = word[i]

      // Skip non-alphabetic chars
      if (/[^a-zA-Z]/g.test(char)) {
        result += char
        i++
        continue
      }

      // 1. Identify consonant cluster length (up to 3 characters)
      let consKey = ""
      let step = 0
      
      if (i + 2 < len && CONSONANTS[word.substring(i, i + 3).toLowerCase()]) {
        consKey = word.substring(i, i + 3).toLowerCase()
        step = 3
      } else if (i + 1 < len && CONSONANTS[word.substring(i, i + 2).toLowerCase()]) {
        consKey = word.substring(i, i + 2).toLowerCase()
        step = 2
      } else if (CONSONANTS[char]) {
        consKey = char // Capital letters (T, D, N, L, S, Sh)
        step = 1
      } else if (CONSONANTS[char.toLowerCase()]) {
        consKey = char.toLowerCase()
        step = 1
      }

      if (consKey) {
        const baseGlyph = CONSONANTS[consKey]
        i += step

        // 2. Identify the following vowel matra
        let vowelKey = ""
        let vStep = 0

        if (i + 2 < len && MATRAS[word.substring(i, i + 3).toLowerCase()]) {
          vowelKey = word.substring(i, i + 3).toLowerCase()
          vStep = 3
        } else if (i + 1 < len && MATRAS[word.substring(i, i + 2).toLowerCase()]) {
          vowelKey = word.substring(i, i + 2).toLowerCase()
          vStep = 2
        } else if (i < len && MATRAS[word[i]]) {
          vowelKey = word[i] // Case sensitive
          vStep = 1
        } else if (i < len && MATRAS[word[i].toLowerCase()]) {
          vowelKey = word[i].toLowerCase()
          vStep = 1
        }

        if (vStep > 0) {
          result += baseGlyph + MATRAS[vowelKey]
          i += vStep
        } else {
          // No vowel following: add Virama (್) to form conjunct/half-letter
          result += baseGlyph + "್"
        }
      } else {
        // 3. Isolated vowel mapping (starts a word or syllable)
        let vowelKey = ""
        let vStep = 0

        if (i + 2 < len && VOWELS[word.substring(i, i + 3).toLowerCase()]) {
          vowelKey = word.substring(i, i + 3).toLowerCase()
          vStep = 3
        } else if (i + 1 < len && VOWELS[word.substring(i, i + 2).toLowerCase()]) {
          vowelKey = word.substring(i, i + 2).toLowerCase()
          vStep = 2
        } else if (VOWELS[char]) {
          vowelKey = char // Case sensitive
          vStep = 1
        } else if (VOWELS[char.toLowerCase()]) {
          vowelKey = char.toLowerCase()
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

    // Clean up trailing halant/virama on word boundaries
    return result.replace(/್$/, "")
  }

  // ── TRANSLITERATE ENTIRE DOCUMENT ──────────────────────────────────────────
  const transliterateDocument = (text: string, currentOverrides: { [key: string]: string }) => {
    // Regex splits words preserving spaces and punctuation
    const tokens = text.split(/([a-zA-Z]+)/)
    const translatedTokens = tokens.map(token => {
      if (/^[a-zA-Z]+$/.test(token)) {
        return overrides[token.toLowerCase()] 
          ? overrides[token.toLowerCase()] 
          : transliterateWord(token)
      }
      return token
    })
    return translatedTokens.join("")
  }

  // ── DYNAMIC SUGGESTIONS GENERATOR ──────────────────────────────────────────
  const generateSuggestions = (word: string) => {
    if (!word || !/^[a-zA-Z]+$/.test(word)) {
      setSuggestions([])
      return
    }

    const lower = word.toLowerCase()
    const options: string[] = []

    // 1. Check dictionary first
    if (KANNADA_DICTIONARY[lower]) {
      setSuggestions(KANNADA_DICTIONARY[lower].slice(0, 3))
      return
    }

    // 2. Generate phonetic options dynamically
    // Option A: Raw phonetic output
    const optA = transliterateWord(word)
    options.push(optA)

    // Option B: Trailing long vowel variation
    let optB = ""
    if (lower.endsWith("a")) {
      // e.g. namaskara ➔ namaskaara
      const modified = word.slice(0, -1) + "aa"
      optB = transliterateWord(modified)
    } else if (lower.endsWith("i")) {
      const modified = word.slice(0, -1) + "ee"
      optB = transliterateWord(modified)
    } else {
      optB = transliterateWord(word + "a")
    }
    if (optB && optB !== optA) options.push(optB)

    // Option C: Soft vs. hard consonant modifications
    let optC = ""
    if (lower.includes("d")) {
      optC = transliterateWord(word.replace(/d/gi, "dh"))
    } else if (lower.includes("t")) {
      optC = transliterateWord(word.replace(/t/gi, "th"))
    } else if (lower.includes("n")) {
      optC = transliterateWord(word.replace(/n/gi, "N"))
    } else {
      optC = optA + "ಂ" // Anusvara modifier
    }
    if (optC && optC !== optA && optC !== optB) options.push(optC)

    // Fill up to 3 options with slight suffix variations
    if (options.length < 3) {
      options.push(optA + "ಾ")
    }

    setSuggestions(options.slice(0, 3))
  }

  // ── ON TEXT CHANGE HANDLER ────────────────────────────────────────────────
  const handleTextChange = (val: string) => {
    setEnglishText(val)
    
    // Find active (last typed) word
    const words = val.trim().split(/[^a-zA-Z]+/)
    const lastWord = words[words.length - 1] || ""
    setActiveWord(lastWord)
    generateSuggestions(lastWord)
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
          <div className="mb-6 p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-950/80" style={{ borderColor: "rgba(201,168,76,0.3)" }}>
            <div className="text-xs">
              <span className="text-neutral-400">Variations for </span>
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
                        : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700"
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
                <li>• ru / R ➔ ಋ</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-[#C9A84C] mb-1">Consonants (ವ್ಯಂಜನಗಳು)</p>
              <ul className="space-y-1 text-neutral-400">
                <li>• k ➔ ಕ | kh ➔ ಖ</li>
                <li>• g ➔ ಗ | gh ➔ ಘ</li>
                <li>• c / ch ➔ ಚ | chh ➔ ಛ</li>
                <li>• j ➔ ಜ | jh ➔ ಝ</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-[#C9A84C] mb-1">Retroflex (ಮೂರ್ಧನ್ಯ)</p>
              <ul className="space-y-1 text-neutral-400">
                <li>• T ➔ ಟ | Th ➔ ಠ</li>
                <li>• D ➔ ด | Dh ➔ ಢ</li>
                <li>• N ➔ ಣ | L ➔ ಳ</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-[#C9A84C] mb-1">Conjuncts (ಒತ್ತಕ್ಷರಗಳು)</p>
              <ul className="space-y-1 text-neutral-400">
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
