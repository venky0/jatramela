"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export function FooterBrand() {
  return (
    <div>
      <Link href="/" className="flex items-center gap-3 mb-5">
        <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0"
          style={{ border: "2px solid rgba(201,168,76,0.6)" }}>
          <Image src="/images/warli-logo.png" alt="Jatramela" fill className="object-cover" />
        </div>
        <div>
          <span className="font-extrabold text-lg block text-shimmer" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            JATRAMELA
          </span>
          <span className="text-[9px] tracking-widest uppercase" style={{ color: "rgba(255,248,231,0.45)" }}>
            Back to Roots · Karnataka
          </span>
        </div>
      </Link>

      <p className="text-sm leading-relaxed mb-5 max-w-xs" style={{ color: "rgba(255,248,231,0.65)" }}>
        India's heritage marketplace for organic Karnataka foods, handwoven silks,
        Ayurvedic wellness, and traditional crafts. Directly from farmer to your door. 🌾
      </p>

      {/* Social icons */}
      <div className="flex gap-2">
        {[
          { label: "Instagram", icon: "📸", href: "#" },
          { label: "Facebook",  icon: "👍", href: "#" },
          { label: "YouTube",   icon: "▶️", href: "#" },
          { label: "WhatsApp",  icon: "💬", href: "https://wa.me/917019691302" },
        ].map(s => (
          <a key={s.label} href={s.href} aria-label={s.label}
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,248,231,0.15)" }}>
            {s.icon}
          </a>
        ))}
      </div>

      {/* Certifications */}
      <div className="flex flex-wrap gap-2 mt-5">
        {["GI Certified", "Organic India", "FSSAI Licensed"].map(c => (
          <span key={c} className="px-2.5 py-1 rounded-md text-[10px] font-bold"
            style={{ background: "rgba(201,168,76,0.12)", color: "rgba(232,197,106,0.8)", border: "1px solid rgba(201,168,76,0.2)" }}>
            ✓ {c}
          </span>
        ))}
      </div>
    </div>
  )
}

export function FooterNewsletter() {
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.")
      return
    }

    setLoading(true)
    setError(null)

    const mailflowUrl = process.env.NEXT_PUBLIC_MAILFLOW_URL
    let success = false
    let lastError = "Unable to connect to the newsletter service. Make sure Mailflow is running."

    if (mailflowUrl) {
      try {
        const response = await fetch(`${mailflowUrl}/api/lists/demo-list-id/subscribe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        })

        const data = await response.json()

        if (response.ok) {
          success = true
        } else {
          lastError = data.error || "Subscription failed. Please try again."
        }
      } catch (err) {
        console.warn(`Connection to Mailflow at ${mailflowUrl} failed:`, err)
      }
    }

    if (!success) {
      const ports = [3001, 3000]
      for (const port of ports) {
        try {
          const response = await fetch(`http://localhost:${port}/api/lists/demo-list-id/subscribe`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          })

          const data = await response.json()

          if (response.ok) {
            success = true
            break
          } else {
            lastError = data.error || "Subscription failed. Please try again."
          }
        } catch (err) {
          // Silent catch to fall back to next port
          console.warn(`Connection to Mailflow on port ${port} failed, trying next port...`)
        }
      }
    }

    if (success) {
      setDone(true)
    } else {
      setError(lastError)
    }
    setLoading(false)
  }

  return (
    <div className="rounded-2xl p-6 mb-10" style={{ background: "rgba(201,168,76,0.08)", border: "1.5px solid rgba(201,168,76,0.2)" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
        <div>
          <p className="font-bold text-base mb-1" style={{ color: "var(--gold-bright)", fontFamily: "'Baloo 2', sans-serif" }}>
            🌺 Join the Back-to-Roots Movement
          </p>
          <p className="text-xs" style={{ color: "rgba(255,248,231,0.58)" }}>
            Weekly Karnataka recipes, health tips & exclusive offers.
          </p>
        </div>
        {done ? (
          <p className="font-bold text-sm text-shimmer" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            🎉 Subscribed! Dhanyavada!
          </p>
        ) : (
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-2">
              <input type="email" placeholder="your@email.com" value={email} onChange={e => { setEmail(e.target.value); setError(null); }}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none transition-opacity"
                style={{ background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,248,231,0.2)", color: "#FFF8E7", opacity: loading ? 0.6 : 1 }} />
              <button onClick={handleSubscribe}
                disabled={loading}
                className="px-5 py-2.5 rounded-full text-sm font-bold flex-shrink-0 transition-all hover:brightness-105 active:scale-95 disabled:opacity-50"
                style={{ background: "var(--gradient-gold-btn)", color: "#2C1810" }}>
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
            {error && (
              <p className="text-xs px-2" style={{ color: "#F87171" }}>
                ⚠️ {error}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
