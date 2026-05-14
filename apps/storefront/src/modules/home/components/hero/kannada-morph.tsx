"use client"

import { useEffect, useRef } from "react"

// Kannada words that morph in the hero — each with English meaning
const WORDS = [
  { kannada: "ಜಾತ್ರ",    meaning: "The Journey" },
  { kannada: "ನೆಲ",      meaning: "The Land" },
  { kannada: "ಸಂಸ್ಕೃತಿ", meaning: "The Culture" },
  { kannada: "ಬೇರು",     meaning: "The Roots" },
  { kannada: "ಆರೋಗ್ಯ",  meaning: "The Wellness" },
  { kannada: "ಪ್ರಕೃತಿ",  meaning: "The Nature" },
]

export default function KannadaMorphText() {
  const wordRef    = useRef<HTMLSpanElement>(null)
  const meaningRef = useRef<HTMLSpanElement>(null)
  const idxRef     = useRef(0)

  useEffect(() => {
    const el  = wordRef.current
    const mel = meaningRef.current
    if (!el || !mel) return

    const tick = () => {
      // Fade out
      el.style.opacity  = "0"
      el.style.transform = "translateY(-8px)"
      mel.style.opacity = "0"

      setTimeout(() => {
        idxRef.current = (idxRef.current + 1) % WORDS.length
        const { kannada, meaning } = WORDS[idxRef.current]
        el.textContent  = kannada
        mel.textContent = meaning
        // Fade in
        el.style.opacity  = "1"
        el.style.transform = "translateY(0)"
        mel.style.opacity = "1"
      }, 400)
    }

    const timer = setInterval(tick, 2800)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center gap-3 mb-4 select-none" aria-hidden>
      <div className="flex flex-col items-start">
        <span
          ref={wordRef}
          className="font-extrabold leading-none"
          style={{
            fontFamily: "'Noto Sans Kannada', 'Baloo 2', sans-serif",
            fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
            color: "#C9A84C",
            transition: "opacity 0.4s ease, transform 0.4s ease",
            display: "inline-block",
          }}
        >
          {WORDS[0].kannada}
        </span>
        <span
          ref={meaningRef}
          className="text-[10px] tracking-widest font-semibold uppercase"
          style={{
            color: "rgba(255,248,231,0.5)",
            transition: "opacity 0.4s ease",
            marginTop: "2px",
            letterSpacing: "0.18em",
          }}
        >
          {WORDS[0].meaning}
        </span>
      </div>
      <div style={{ width: 1, height: 44, background: "rgba(201,168,76,0.35)" }} />
    </div>
  )
}
