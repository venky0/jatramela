"use client"

import { useState } from "react"
import Link from "next/link"

const FAQ = [
  { q: "Do you deliver all across India?",          a: "Yes! We deliver pan-India via Shiprocket. Delivery takes 3–7 business days depending on your location. Free shipping on orders above ₹999." },
  { q: "Are all products genuinely organic?",        a: "Every food product comes with organic certification from the farming cooperative. We personally visit farms and verify before onboarding." },
  { q: "How are the silk sarees verified?",          a: "Our silk sarees are GI (Geographical Indication) certified Mysore silk, woven by registered Silk Board weavers. Each piece includes a QR code for verification." },
  { q: "Can I return a product if not satisfied?",   a: "Absolutely. 7-day easy returns for unused products. For food items, return within 3 days if sealed and unopened." },
  { q: "Do you accept bulk/wholesale orders?",       a: "Yes! Contact us at wholesale@jatramela.in for bulk pricing for businesses, gifting, and corporate wellness programs." },
  { q: "How can farmers/artisans list their products?", a: "Email us at sellers@jatramela.in or use the form below. We verify quality, provide packaging guidelines and handle delivery for you." },
]

const CONTACT_INFO = [
  { icon: "📍", label: "Address",   value: "No. 289, 4th Cross, Maruthi Nagar, Hegganahalli, Bengaluru — 560 091, Karnataka" },
  { icon: "📞", label: "Phone",     value: "+91 70196 91302 (Mon–Sat, 9am–7pm)" },
  { icon: "💬", label: "WhatsApp",  value: "wa.me/917019691302" },
  { icon: "📧", label: "Email",     value: "hello@jatramela.in" },
  { icon: "🛒", label: "Sellers",   value: "sellers@jatramela.in" },
  { icon: "📦", label: "Wholesale", value: "wholesale@jatramela.in" },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" })
  const [sent, setSent] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div style={{ background: "var(--bg-primary)" }}>

      {/* ── HERO ── */}
      <section style={{ background: "var(--bg-header)" }} className="py-16 text-center relative">
        <div className="temple-border absolute top-0 left-0 right-0" />
        <div className="content-container">
          <p className="section-label mb-3" style={{ color: "rgba(255,248,231,0.6)" }}>Reach Out</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-shimmer mb-4" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            Contact Us
          </h1>
          <p className="text-base max-w-lg mx-auto" style={{ color: "rgba(255,248,231,0.72)" }}>
            We're a team of passionate people who care about Karnataka's heritage. Write to us,
            we respond within 24 hours.
          </p>
        </div>
        <div className="temple-border absolute bottom-0 left-0 right-0" />
      </section>

      {/* ── MAIN GRID ── */}
      <section className="content-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left — Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="section-heading text-xl mb-6">Get in Touch</h2>
              {CONTACT_INFO.map(c => (
                <div key={c.label} className="flex items-start gap-4 mb-5">
                  <div className="text-2xl mt-0.5">{c.icon}</div>
                  <div>
                    <p className="font-bold text-xs mb-0.5" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--gold)" }}>{c.label}</p>
                    {c.label === "WhatsApp" ? (
                      <a href={`https://${c.value}`} target="_blank" rel="noreferrer" className="text-sm hover:underline" style={{ color: "var(--green)" }}>
                        +91 70196 91302 (Chat with us)
                      </a>
                    ) : (
                      <p className="text-sm" style={{ color: "var(--text-muted)" }}>{c.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Sell with us */}
            <div className="heritage-card p-6" style={{ borderLeft: "4px solid var(--green)" }}>
              <h3 className="font-bold text-base mb-2" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--green)" }}>
                🌾 Sell With Us
              </h3>
              <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                Are you a Karnataka farmer, weaver, or artisan? List your products on Jatramela —
                zero listing fee, we handle delivery and payments.
              </p>
              <Link href="mailto:sellers@jatramela.in">
                <button className="btn-green text-sm px-5 py-2">Become a Seller →</button>
              </Link>
            </div>
          </div>

          {/* Right — Contact Form */}
          <div className="lg:col-span-2">
            <div className="heritage-card p-8">
              {sent ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🌺</div>
                  <h3 className="text-2xl font-extrabold mb-3" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--primary)" }}>
                    Thank You!
                  </h3>
                  <p className="text-base mb-6" style={{ color: "var(--text-muted)" }}>
                    We've received your message and will respond within 24 hours. Dhanyavada! 🙏
                  </p>
                  <button onClick={() => setSent(false)} className="btn-gold px-7 py-3">Send Another</button>
                </div>
              ) : (
                <>
                  <h2 className="section-heading text-xl mb-8">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="field-label">Your Name *</label>
                        <input type="text" required placeholder="Ramesh Kumar" className="field-input"
                          value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                      </div>
                      <div>
                        <label className="field-label">Phone Number</label>
                        <input type="tel" placeholder="+91 70196 91302" className="field-input"
                          value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                      </div>
                    </div>
                    <div>
                      <label className="field-label">Email Address *</label>
                      <input type="email" required placeholder="ramesh@email.com" className="field-input"
                        value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                    </div>
                    <div>
                      <label className="field-label">Subject</label>
                      <select className="field-input" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}>
                        <option value="">Select a topic</option>
                        <option>Order / Delivery Issue</option>
                        <option>Product Quality</option>
                        <option>Become a Seller / Partner</option>
                        <option>Wholesale Enquiry</option>
                        <option>Media / Press</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="field-label">Message *</label>
                      <textarea required rows={5} placeholder="Write your message here..." className="field-input resize-none"
                        value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
                    </div>
                    <button type="submit" className="btn-primary w-full py-4 text-base">
                      🌺 Send Message
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: "var(--bg-section-alt)" }}>
        <div className="temple-border-thin" />
        <div className="content-container py-16 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="section-label mb-3">Got Questions?</p>
            <h2 className="section-heading text-2xl sm:text-3xl">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {FAQ.map((f, i) => (
              <div key={i} className="heritage-card overflow-hidden">
                <button className="w-full text-left p-5 flex items-center justify-between gap-4"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-semibold text-sm" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--text-primary)" }}>{f.q}</span>
                  <span className="text-lg flex-shrink-0 transition-transform duration-200"
                    style={{ color: "var(--gold)", transform: openFaq === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 animate-fade">
                    <div style={{ height: "1px", background: "var(--border)", marginBottom: 16 }} />
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="temple-border-thin" />
      </section>

    </div>
  )
}
