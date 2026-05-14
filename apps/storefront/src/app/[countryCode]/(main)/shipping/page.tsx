import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shipping Policy | Jatramela",
  description: "Jatramela shipping rates, delivery times, and courier information for pan-India delivery.",
}

export default function ShippingPage() {
  return (
    <div style={{ background: "var(--bg-primary)" }}>
      <section style={{ background: "var(--bg-header)" }} className="py-14 text-center relative">
        <div className="temple-border absolute top-0 left-0 right-0" />
        <div className="content-container">
          <p className="section-label mb-3" style={{ color: "rgba(255,248,231,0.6)" }}>Delivery Info</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-shimmer" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Shipping Policy</h1>
          <p className="text-sm mt-3" style={{ color: "rgba(255,248,231,0.55)" }}>Last updated: May 2026</p>
        </div>
        <div className="temple-border absolute bottom-0 left-0 right-0" />
      </section>

      <section className="content-container py-14 max-w-3xl mx-auto">
        {/* Quick Reference Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          {[
            { icon: "🚚", title: "Metro Cities", sub: "Bengaluru, Mumbai, Delhi, Chennai…", time: "2–4 Business Days" },
            { icon: "📦", title: "Tier 2 Cities", sub: "Mysuru, Hubli, Mangaluru…", time: "3–5 Business Days" },
            { icon: "🏡", title: "Rural Areas", sub: "All pincodes served", time: "5–7 Business Days" },
          ].map(c => (
            <div key={c.title} className="heritage-card p-5 text-center">
              <div className="text-3xl mb-3">{c.icon}</div>
              <p className="font-bold text-sm mb-1" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--text-primary)" }}>{c.title}</p>
              <p className="text-xs mb-2" style={{ color: "var(--text-subtle)" }}>{c.sub}</p>
              <span className="tag-gold">{c.time}</span>
            </div>
          ))}
        </div>

        <div className="space-y-7 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {[
            {
              title: "📦 Dispatch Time",
              body: `All orders are dispatched within 24 hours of payment confirmation (Mon–Sat). Orders placed after 5 PM or on Sundays are dispatched the next working day. Handcrafted/made-to-order items may require 2–3 extra days for preparation.`,
            },
            {
              title: "💰 Shipping Charges",
              body: `Free shipping on all orders above ₹999. A flat shipping fee of ₹69 applies for orders below ₹999. Bulky items (over 5 kg) may have additional charges communicated at checkout. International shipping (USA, UK, UAE, Canada, Australia) is available — please email us at hello@jatramela.in for a custom quote.`,
            },
            {
              title: "🚚 Our Courier Partners",
              body: `We ship via Shiprocket, which uses leading Indian couriers including BlueDart, Delhivery, FedEx India, Ekart, and India Post. The courier is automatically selected based on your pincode for fastest delivery.`,
            },
            {
              title: "📱 Tracking Your Order",
              body: `Once your order is shipped, you will receive an SMS and email with a tracking link from Shiprocket. You can also track your order from My Account → Orders. If you haven't received a tracking update within 48 hours of order confirmation, please contact us.`,
            },
            {
              title: "🏺 Fragile & Perishable Items",
              body: `Terracotta, copper, and Bidriware products are packed with bubble wrap and sturdy corrugated boxes. Organic food products are packed in food-grade airtight packaging. If you receive a damaged item, photograph it immediately and email returns@jatramela.in within 48 hours for a free replacement.`,
            },
            {
              title: "❌ Undeliverable Orders",
              body: `If an order is returned to us due to an incorrect address or failure to accept delivery, we will contact you to rearrange. A re-shipping fee of ₹100 will apply. If you choose not to reship, we will refund the product value (shipping charges are non-refundable).`,
            },
          ].map(s => (
            <div key={s.title}>
              <h2 className="font-bold text-base mb-2" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--text-primary)" }}>{s.title}</h2>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex gap-4 flex-wrap">
          <Link href="/returns"><button className="btn-gold text-sm px-5 py-2.5">Return Policy →</button></Link>
          <Link href="/contact"><button className="btn-ghost text-sm px-5 py-2.5">Contact Support</button></Link>
        </div>
      </section>
    </div>
  )
}
