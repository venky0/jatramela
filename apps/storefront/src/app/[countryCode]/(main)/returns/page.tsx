import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Return & Refund Policy | Jatramela",
  description: "Easy 7-day returns on Jatramela — Karnataka's heritage marketplace. Learn our refund process.",
}

export default function ReturnsPage() {
  return (
    <div style={{ background: "var(--bg-primary)" }}>
      <section style={{ background: "var(--bg-header)" }} className="py-14 text-center relative">
        <div className="temple-border absolute top-0 left-0 right-0" />
        <div className="content-container">
          <p className="section-label mb-3" style={{ color: "rgba(255,248,231,0.6)" }}>Customer Care</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-shimmer" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Return & Refund Policy</h1>
          <p className="text-sm mt-3" style={{ color: "rgba(255,248,231,0.55)" }}>Last updated: May 2026</p>
        </div>
        <div className="temple-border absolute bottom-0 left-0 right-0" />
      </section>

      <section className="content-container py-14 max-w-3xl mx-auto">
        {/* Quick summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          {[
            { icon: "🔄", title: "Non-Food Items", window: "7 Days", note: "Unused, original packaging" },
            { icon: "🥗", title: "Food & Wellness", window: "3 Days", note: "Sealed + quality issue only" },
            { icon: "💸", title: "Refund Speed",   window: "5–7 Days", note: "Back to original payment method" },
          ].map(c => (
            <div key={c.title} className="heritage-card p-5 text-center">
              <div className="text-3xl mb-3">{c.icon}</div>
              <p className="font-bold text-sm mb-1" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--text-primary)" }}>{c.title}</p>
              <span className="tag-gold mb-2 inline-block">{c.window} Return Window</span>
              <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>{c.note}</p>
            </div>
          ))}
        </div>

        <div className="space-y-7 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {[
            {
              title: "✅ What Can Be Returned",
              body: `Non-food items (clothing, handicrafts, copper vessels, etc.) can be returned within 7 days of delivery if: the item is unused and in its original packaging; the return is initiated via email to returns@jatramela.in with your order number and reason. Food, wellness powders, and Ayurvedic products can be returned within 3 days only if the product is sealed/unopened AND a genuine quality issue exists (wrong product sent, damaged packaging, expired item).`,
            },
            {
              title: "❌ What Cannot Be Returned",
              body: `Items that are opened, used, or damaged by the customer; Personalised or custom-made items; Digital products; Items without original packaging; Products where the 7-day (or 3-day) window has lapsed; Items purchased during final sale / clearance events.`,
            },
            {
              title: "📸 How to Initiate a Return",
              body: `Step 1: Email returns@jatramela.in within the return window with: (a) your Order ID, (b) reason for return, (c) clear photographs of the item and packaging.\n\nStep 2: Our team will review and respond within 24 hours with a Return Merchandise Authorisation (RMA) number.\n\nStep 3: Pack the item securely and hand it to our courier agent (we arrange pickup — no cost to you for quality issues).\n\nStep 4: Once received and inspected, your refund is processed within 5–7 business days.`,
            },
            {
              title: "💰 Refund Method",
              body: `Refunds are credited to the original payment method: UPI → original UPI account within 3–5 days; Card payments → card statement within 5–7 days; Net banking → bank account within 3–5 days. Shipping charges are non-refundable unless the return is due to our error (wrong or damaged item sent).`,
            },
            {
              title: "🔁 Exchange Policy",
              body: `We offer free size/colour exchanges for clothing items within 7 days. Contact returns@jatramela.in with your order ID and preferred size. For handicraft and wellness items, we do not offer exchanges — only returns and refunds.`,
            },
            {
              title: "🏺 Damaged in Transit",
              body: `If your product arrived damaged during shipping, please: photograph the damage and the outer packaging immediately; email returns@jatramela.in within 48 hours of delivery. We will send a free replacement at no cost to you. We do not require you to return transit-damaged items.`,
            },
          ].map(s => (
            <div key={s.title}>
              <h2 className="font-bold text-base mb-2" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--text-primary)" }}>{s.title}</h2>
              <p style={{ whiteSpace: "pre-line" }}>{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 heritage-card p-6" style={{ borderLeft: "4px solid var(--green)" }}>
          <p className="font-bold text-base mb-2" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--green)" }}>📞 Need Help?</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Email: <strong>returns@jatramela.in</strong> | WhatsApp: <strong>+91 70196 91302</strong><br />
            Available Mon–Sat, 9 AM to 7 PM IST. We aim to resolve all return queries within 24 hours.
          </p>
        </div>

        <div className="mt-8 flex gap-4 flex-wrap">
          <Link href="/shipping"><button className="btn-gold text-sm px-5 py-2.5">Shipping Policy →</button></Link>
          <Link href="/contact"><button className="btn-ghost text-sm px-5 py-2.5">Contact Support</button></Link>
        </div>
      </section>
    </div>
  )
}
