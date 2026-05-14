"use client"

import { useState } from "react"
import Link from "next/link"

const FAQ_DATA = [
  {
    group: "🛒 Orders & Shopping",
    items: [
      { q: "How do I place an order?", a: "Browse our store, add items to cart, and checkout with any UPI, card, or net banking via Razorpay. You'll receive an email and SMS confirmation instantly." },
      { q: "Can I buy without creating an account?", a: "Yes! You can checkout as a guest. But creating an account lets you track orders, save addresses, and access your order history." },
      { q: "What payment methods do you accept?", a: "We accept all major UPI apps (GPay, PhonePe, Paytm), Visa/Mastercard/RuPay credit & debit cards, net banking, and EMI on eligible cards via Razorpay." },
      { q: "Is my payment information safe?", a: "Absolutely. We use Razorpay — one of India's most trusted payment gateways. We never store your card details on our servers." },
      { q: "Can I modify or cancel my order?", a: "Orders can be modified or cancelled within 2 hours of placing them. After that, they enter fulfillment. Contact us at hello@jatramela.in or call us immediately." },
    ],
  },
  {
    group: "📦 Shipping & Delivery",
    items: [
      { q: "Do you deliver all across India?", a: "Yes! We deliver pan-India to all 28 states and 8 union territories via Shiprocket. Every pin code is covered." },
      { q: "How long does delivery take?", a: "Metro cities (Bengaluru, Mumbai, Delhi, etc.): 2–4 days. Tier 2 cities: 3–5 days. Rural areas: 5–7 days. We dispatch within 24 hours of order confirmation." },
      { q: "What is the shipping charge?", a: "FREE shipping on all orders above ₹999. For orders below ₹999, a flat fee of ₹69 applies." },
      { q: "Will I get a tracking number?", a: "Yes. You'll receive an SMS and email with your Shiprocket tracking link as soon as your order is dispatched." },
      { q: "Do you ship internationally?", a: "We currently ship to USA, UK, UAE, Australia, and Canada for NRI customers. International shipping charges apply. Email us at hello@jatramela.in for NRI orders." },
    ],
  },
  {
    group: "🔄 Returns & Refunds",
    items: [
      { q: "What is your return policy?", a: "We offer 7-day easy returns for all non-food items (clothing, handicrafts, wellness products) if they are unused and in original packaging." },
      { q: "Can I return food products?", a: "Food products can be returned within 3 days only if the packaging is sealed/unopened and there is a quality issue. We do not accept returns on opened food items for hygiene reasons." },
      { q: "How long does a refund take?", a: "Once we receive the returned item and verify it, refunds are processed within 3–5 business days back to your original payment method." },
      { q: "What if I receive a damaged item?", a: "Please photograph the damage and email us at returns@jatramela.in within 48 hours of delivery. We'll replace the item or issue a full refund immediately." },
    ],
  },
  {
    group: "🌿 Product Quality",
    items: [
      { q: "Are all products genuinely organic?", a: "Every food product is sourced from certified organic farms. We personally visit farms annually and maintain paperwork for all certifications. Our food products carry FSSAI certification." },
      { q: "How do you verify the Mysore Silk is authentic?", a: "Our Mysore silk sarees are sourced exclusively from the Karnataka Silk Industries Corporation (KSIC) and GI-certified weavers registered with the Silk Board. Each comes with a QR code for authenticity verification." },
      { q: "Are the Ayurvedic products safe?", a: "All wellness products are formulated by our in-house Ayurvedic physician Dr. Mohan B. (25 years experience). They contain only natural ingredients — no chemicals, preservatives, or synthetic fragrances." },
      { q: "Are the handicrafts handmade?", a: "Yes. Every handicraft is made by hand by registered Karnataka artisans. GI-certified products (Channapatna, Bidriware, Mysore Silk) come with certificates." },
    ],
  },
  {
    group: "🤝 Selling on Jatramela",
    items: [
      { q: "Can I sell my products on Jatramela?", a: "Yes! We welcome Karnataka farmers, weavers, artisans, and SHGs to list their products. We handle payment collection and delivery. Email sellers@jatramela.in to apply." },
      { q: "What is the commission structure?", a: "We charge a 15% platform commission — one of the lowest in India. You keep 85% of the sale price. No listing fee, no subscription fee." },
      { q: "I am a farmer. How do I join?", a: "Email farmers@jatramela.in with your name, location, products you grow, and an organic certification if available. Our team will contact you within 3 working days." },
      { q: "Do you provide packaging for sellers?", a: "Yes, we provide eco-friendly packaging guidelines and materials at wholesale cost. We also handle all shipping logistics through our Shiprocket account." },
    ],
  },
]

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>(null)

  return (
    <div style={{ background: "var(--bg-primary)" }}>

      {/* ── HEADER ── */}
      <section style={{ background: "var(--bg-header)" }} className="py-14 text-center relative">
        <div className="temple-border absolute top-0 left-0 right-0" />
        <div className="content-container">
          <p className="section-label mb-3" style={{ color: "rgba(255,248,231,0.6)" }}>Got Questions?</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-shimmer mb-4" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            Frequently Asked Questions
          </h1>
          <p className="text-base max-w-md mx-auto" style={{ color: "rgba(255,248,231,0.7)" }}>
            Everything you need to know about Jatramela, our products, shipping, and more.
          </p>
          <Link href="/contact">
            <button className="mt-6 btn-gold px-7 py-3">Can't find your answer? Contact Us →</button>
          </Link>
        </div>
        <div className="temple-border absolute bottom-0 left-0 right-0" />
      </section>

      {/* ── QUICK LINKS ── */}
      <div style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>
        <div className="content-container py-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-3 min-w-max">
            {FAQ_DATA.map(group => (
              <a key={group.group} href={`#${group.group.replace(/[^a-z]/gi, "-")}`}
                className="px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all hover:opacity-80"
                style={{ background: "var(--bg-card)", border: "1.5px solid var(--border)", color: "var(--text-muted)" }}>
                {group.group}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ SECTIONS ── */}
      <div className="content-container py-14 max-w-3xl mx-auto">
        {FAQ_DATA.map((group, gi) => (
          <div key={group.group} id={group.group.replace(/[^a-z]/gi, "-")} className="mb-12">
            <h2 className="text-xl font-extrabold mb-6" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--primary)" }}>
              {group.group}
            </h2>
            <div className="space-y-3">
              {group.items.map((item, ii) => {
                const key = `${gi}-${ii}`
                const isOpen = openItem === key
                return (
                  <div key={key} className="heritage-card overflow-hidden">
                    <button className="w-full text-left p-5 flex items-start gap-4"
                      onClick={() => setOpenItem(isOpen ? null : key)}>
                      <span className="text-xl flex-shrink-0 mt-0.5" style={{ color: "var(--gold)" }}>
                        {isOpen ? "−" : "+"}
                      </span>
                      <span className="font-semibold text-sm leading-snug" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--text-primary)" }}>
                        {item.q}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pl-14 animate-fade">
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{item.a}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* ── STILL NEED HELP ── */}
        <div className="rounded-2xl p-8 text-center" style={{ background: "var(--bg-section-alt)", border: "1.5px solid var(--border)" }}>
          <p className="text-3xl mb-3">🙋</p>
          <h3 className="text-xl font-extrabold mb-3" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--text-primary)" }}>
            Still Have Questions?
          </h3>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            Our team responds within 24 hours. You can also WhatsApp us for faster support.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/contact"><button className="btn-primary px-7 py-3">📧 Email Us</button></Link>
            <a href="https://wa.me/917019691302" target="_blank" rel="noreferrer">
              <button className="btn-green px-7 py-3">💬 WhatsApp Us</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
