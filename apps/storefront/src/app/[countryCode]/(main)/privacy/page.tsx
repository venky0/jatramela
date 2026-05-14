import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Jatramela",
  description: "How Jatramela collects, uses, and protects your personal information.",
}

export default function PrivacyPage() {
  return (
    <div style={{ background: "var(--bg-primary)" }}>
      <section style={{ background: "var(--bg-header)" }} className="py-14 text-center relative">
        <div className="temple-border absolute top-0 left-0 right-0" />
        <div className="content-container">
          <p className="section-label mb-3" style={{ color: "rgba(255,248,231,0.6)" }}>Legal</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-shimmer" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Privacy Policy</h1>
          <p className="text-sm mt-3" style={{ color: "rgba(255,248,231,0.55)" }}>Last updated: May 2026</p>
        </div>
        <div className="temple-border absolute bottom-0 left-0 right-0" />
      </section>

      <section className="content-container py-14 max-w-3xl mx-auto">
        <div className="space-y-8 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>

          {[
            {
              title: "1. Information We Collect",
              body: `When you place an order or create an account on Jatramela, we collect your name, email address, phone number, delivery address, and payment details. Payment card information is processed securely by Razorpay and is never stored on our servers. We also collect browsing data (pages visited, products viewed) to improve your shopping experience.`,
            },
            {
              title: "2. How We Use Your Information",
              body: `We use your information to: process and deliver your orders; send order confirmation and shipping updates via email/SMS; respond to customer service enquiries; improve our website and product catalogue; send you relevant offers (only if you opt in). We do not sell or share your personal data with third parties for marketing purposes.`,
            },
            {
              title: "3. Data Sharing",
              body: `We share your data only with: (a) Shiprocket — for order delivery logistics; (b) Razorpay — for payment processing; (c) Email providers (Resend/SendGrid) — for transactional emails. All partners are bound by their own privacy policies and applicable Indian data protection laws.`,
            },
            {
              title: "4. Cookies",
              body: `Jatramela uses essential cookies for session management and cart persistence. We use analytics cookies (Google Analytics) to understand site usage. You can disable non-essential cookies in your browser settings without affecting your ability to shop.`,
            },
            {
              title: "5. Data Retention",
              body: `We retain your order history for 7 years as required by Indian tax laws. Account data is kept as long as your account is active. You may request deletion of your account and personal data by emailing hello@jatramela.in — we will respond within 30 days.`,
            },
            {
              title: "6. Security",
              body: `All data is transmitted over HTTPS (TLS 1.3). Payment processing is handled by Razorpay's PCI-DSS compliant infrastructure. We conduct regular security audits of our systems.`,
            },
            {
              title: "7. Your Rights",
              body: `Under India's Digital Personal Data Protection Act 2023, you have the right to: access your personal data; correct inaccurate information; request erasure; withdraw consent for marketing communications. Contact us at hello@jatramela.in to exercise any of these rights.`,
            },
            {
              title: "8. Contact Us",
              body: `For privacy-related queries: Jatramela, No. 289, 4th Cross, Maruthi Nagar, Hegganahalli, Bengaluru — 560 091. Email: hello@jatramela.in | Phone: +91 70196 91302`,
            },
          ].map(s => (
            <div key={s.title}>
              <h2 className="font-bold text-base mb-2" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--text-primary)" }}>{s.title}</h2>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex gap-4 flex-wrap">
          <Link href="/terms"><button className="btn-outline-gold text-sm px-5 py-2">Terms of Service →</button></Link>
          <Link href="/contact"><button className="btn-ghost text-sm px-5 py-2">Contact Us</button></Link>
        </div>
      </section>
    </div>
  )
}
