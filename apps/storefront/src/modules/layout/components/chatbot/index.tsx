"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"

// ── Knowledge Base ────────────────────────────────────────────────────────────
const KB: Record<string, { answer: string; links?: { label: string; href: string }[] }> = {
  // Greetings
  "hello|hi|namaste|vanakkam|namaskara": {
    answer: "Namaskara! 🙏 Welcome to Jatramela — Karnataka's heritage marketplace. I'm your shopping assistant. Ask me about our products, shipping, returns, or anything else!",
  },
  // Products
  "ragi|millet|finger millet": {
    answer: "🌾 Our **Ragi Malt Powder** (₹249) is stone-ground finger millet from Hassan district — 3x the calcium of milk, ideal for diabetes and weight management.",
    links: [{ label: "Shop Organic Food →", href: "/categories/organic" }],
  },
  "silk|saree|mysore silk|ilkal": {
    answer: "🥻 We carry **GI-certified Mysore Silk sarees** (from ₹4,999) and **Ilkal weaves** (₹2,499) — sourced directly from KSIC-certified weavers with QR code verification.",
    links: [{ label: "Shop Clothing →", href: "/categories/clothing" }],
  },
  "honey|forest honey": {
    answer: "🍯 Our **Forest Raw Honey** (₹549) is hand-harvested by tribal communities from Western Ghats forests — raw, unfiltered, never heated. 500g ceramic jar.",
    links: [{ label: "Shop Organic Food →", href: "/categories/organic" }],
  },
  "ashwagandha|stress|sleep|anxiety": {
    answer: "🌿 Our **Ashwagandha Root Powder** (₹299) has 5%+ withanolides — reduces cortisol, improves sleep quality, and boosts immunity. Pure, no additives.",
    links: [{ label: "Shop Wellness →", href: "/categories/wellness" }],
  },
  "neem|soap|skin|acne": {
    answer: "🧼 Our **Neem & Turmeric Herbal Soap** (₹89) is handcrafted with cold-process technique. No SLS or parabens. Treats acne, fungal infections, and pigmentation naturally.",
    links: [{ label: "Shop Wellness →", href: "/categories/wellness" }],
  },
  "toy|channapatna|wooden|craft|handicraft": {
    answer: "🪆 Our **Channapatna Wooden Toy Set** (₹349) is GI-certified lacquerware from Karnataka's toy town — non-toxic natural dyes, safe for children 3+.",
    links: [{ label: "Shop Handicrafts →", href: "/categories/handicrafts" }],
  },
  "coconut oil|cold pressed|oil": {
    answer: "🥥 Our **Cold-Pressed Virgin Coconut Oil** (₹399) is wooden-press extracted — zero heat, retains all MCTs and lauric acid. 500ml glass bottle.",
    links: [{ label: "Shop Organic Food →", href: "/categories/organic" }],
  },
  // Shipping
  "shipping|delivery|how long|deliver|courier": {
    answer: "📦 We deliver pan-India via Shiprocket:\n• Metro cities: 2–4 days\n• Tier 2 cities: 3–5 days\n• Rural areas: 5–7 days\n\nFREE shipping on orders above ₹999 (₹69 below).",
  },
  "track|tracking|where is my order": {
    answer: "🔍 Track your order at: My Account → Orders. You also receive an SMS + email with Shiprocket tracking link once dispatched.",
    links: [{ label: "My Account →", href: "/account" }],
  },
  "international|nri|abroad|usa|uk|uae|australia": {
    answer: "✈️ Yes! We ship to USA, UK, UAE, Canada & Australia for NRI customers. Email **hello@jatramela.in** with your address for an international shipping quote.",
  },
  // Returns
  "return|refund|exchange|cancel": {
    answer: "🔄 Returns policy:\n• Non-food items: 7-day easy return (unused, original packaging)\n• Food items: 3-day return only if sealed & quality issue\n• Refunds processed in 3–5 business days",
    links: [{ label: "Contact Us →", href: "/contact" }],
  },
  // Payment
  "payment|pay|upi|razorpay|credit card|debit card": {
    answer: "💳 We accept all major payments via Razorpay:\n• UPI (GPay, PhonePe, Paytm)\n• Visa / Mastercard / RuPay\n• Net banking\n• EMI on eligible cards",
  },
  // Organic / certification
  "organic|fssai|certified|genuine|real": {
    answer: "✅ All our food products are from certified organic farms with FSSAI certification. Silk sarees carry GI certification. We personally visit farms annually for verification.",
  },
  // Sell
  "sell|seller|farmer|artisan|list|vendor": {
    answer: "🌾 We welcome Karnataka farmers, weavers & artisans to sell on Jatramela:\n• 0 listing fee\n• We handle payments & delivery\n• 85% revenue to you (15% platform commission)\n\nEmail: sellers@jatramela.in",
    links: [{ label: "Contact Us →", href: "/contact" }],
  },
  // Wholesale / corporate
  "wholesale|bulk|corporate|gift|hamper": {
    answer: "🎁 We offer:\n• Corporate gift hampers from ₹1,500–₹5,000\n• Wholesale pricing for bulk orders\n• Custom branded packaging\n\nEmail: wholesale@jatramela.in",
    links: [{ label: "Contact Us →", href: "/contact" }],
  },
  // Diabetes / health
  "diabetes|blood sugar|diabetic|sugar": {
    answer: "🩺 For diabetes management, we recommend:\n1. **Ragi Malt Powder** — low GI grain\n2. **Jowar Flour** — gluten-free, low GI\n3. **Horse Gram** — proven to lower blood sugar\n4. **Ashwagandha** — reduces cortisol",
    links: [{ label: "Shop Organic Food →", href: "/categories/organic" }],
  },
  "hair|hair fall|dandruff|hair loss": {
    answer: "💆 For hair care, we recommend:\n1. **Brahmi Hair Oil** (₹249) — prevents hair fall\n2. **Neem & Turmeric Soap** — treats dandruff\n3. **Cold-Pressed Coconut Oil** — deep conditioning",
    links: [{ label: "Shop Wellness →", href: "/categories/wellness" }],
  },
}

const SUGGESTIONS = [
  "Show me organic products 🌾",
  "What silk sarees do you have? 🥻",
  "How long does delivery take? 📦",
  "I have diabetes, what to buy?",
  "Can I return a product?",
  "Do you ship internationally? ✈️",
]

function findAnswer(msg: string): { answer: string; links?: { label: string; href: string }[] } | null {
  const lower = msg.toLowerCase()
  for (const [pattern, response] of Object.entries(KB)) {
    const keywords = pattern.split("|")
    if (keywords.some(kw => lower.includes(kw))) {
      return response
    }
  }
  return null
}

function formatAnswer(text: string) {
  return text.split("\n").map((line, i) => (
    <span key={i}>{line}{i < text.split("\n").length - 1 && <br />}</span>
  ))
}

type Message = {
  role: "user" | "bot"
  text: string
  links?: { label: string; href: string }[]
  time: string
}

export default function ChatBot() {
  const [open, setOpen]       = useState(false)
  const [input, setInput]     = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Namaskara! 🙏 I'm Kaveri, your Jatramela assistant. Ask me about products, shipping, returns, or anything else! How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
  ])
  const [typing, setTyping]   = useState(false)
  const [unread, setUnread]   = useState(1)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setUnread(0)
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [open, messages])

  const sendMessage = (text?: string) => {
    const userText = text || input.trim()
    if (!userText) return
    setInput("")

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    const userMsg: Message = { role: "user", text: userText, time: now }
    setMessages(prev => [...prev, userMsg])
    setTyping(true)

    setTimeout(() => {
      const found = findAnswer(userText)
      const botMsg: Message = {
        role: "bot",
        text: found
          ? found.answer
          : "I'm not sure about that, but our team can help! 😊 You can:\n• Email: hello@jatramela.in\n• WhatsApp: +91 70196 91302\n• Or check our FAQ page",
        links: found?.links,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages(prev => [...prev, botMsg])
      setTyping(false)
      if (!open) setUnread(u => u + 1)
    }, 800)
  }

  return (
    <>
      {/* ── Floating Button ── */}
      <button
        onClick={() => setOpen(o => !o)}
        className="chatbot-btn fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300"
        style={{
          background: "var(--gradient-btn)",
          border: "2px solid rgba(201,168,76,0.5)",
          transform: open ? "scale(0.9)" : "scale(1)",
        }}
        aria-label="Open chat"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFF8E7" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
        ) : (
          <>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFF8E7" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-black flex items-center justify-center"
                style={{ background: "#C0392B", color: "white" }}>{unread}</span>
            )}
          </>
        )}
      </button>

      {/* ── Chat Window ── */}
      {open && (
        <div className="chatbot-window fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          style={{
            background: "var(--bg-primary)",
            border: "1.5px solid rgba(201,168,76,0.3)",
            maxHeight: "520px",
          }}>

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3" style={{ background: "var(--bg-header)" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: "var(--gradient-gold-btn)" }}>🌺</div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-shimmer" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Kaveri — Jatramela Assistant</p>
              <p className="text-xs" style={{ color: "rgba(255,248,231,0.5)" }}>🟢 Online · Replies instantly</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ maxHeight: 320 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[85%]">
                  <div className="px-3 py-2 rounded-2xl text-xs leading-relaxed"
                    style={msg.role === "user"
                      ? { background: "var(--primary)", color: "#FFF8E7", borderBottomRightRadius: 4 }
                      : { background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)", borderBottomLeftRadius: 4 }}>
                    {formatAnswer(msg.text)}
                  </div>
                  {msg.links && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {msg.links.map(l => (
                        <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                          <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold"
                            style={{ background: "var(--gradient-btn)", color: "#FFF8E7" }}>{l.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                  <p className="text-[9px] mt-1 px-1" style={{ color: "var(--text-subtle)" }}>{msg.time}</p>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="px-3 py-2.5 rounded-2xl" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                  <div className="flex gap-1 items-center">
                    {[0,1,2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{ background: "var(--gold)", animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all"
                  style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 flex gap-2" style={{ borderTop: "1px solid var(--border)" }}>
            <input
              type="text"
              placeholder="Ask anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              className="flex-1 px-3 py-2 rounded-full text-xs outline-none"
              style={{ background: "var(--bg-secondary)", border: "1.5px solid var(--border)", color: "var(--text-primary)" }}
            />
            <button onClick={() => sendMessage()}
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
              style={{ background: "var(--gradient-btn)", border: "none" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFF8E7" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
