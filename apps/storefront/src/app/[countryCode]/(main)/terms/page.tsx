import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms & Conditions | Jatramela",
  description: "Terms and conditions for shopping on Jatramela — Karnataka's heritage marketplace.",
}

export default function TermsPage() {
  return (
    <div style={{ background: "var(--bg-primary)" }}>
      <section style={{ background: "var(--bg-header)" }} className="py-14 text-center relative">
        <div className="temple-border absolute top-0 left-0 right-0" />
        <div className="content-container">
          <p className="section-label mb-3" style={{ color: "rgba(255,248,231,0.6)" }}>Legal</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-shimmer" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Terms & Conditions</h1>
          <p className="text-sm mt-3" style={{ color: "rgba(255,248,231,0.55)" }}>Last updated: May 2026</p>
        </div>
        <div className="temple-border absolute bottom-0 left-0 right-0" />
      </section>

      <section className="content-container py-14 max-w-3xl mx-auto">
        <div className="space-y-8 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {[
            {
              title: "1. Acceptance of Terms",
              body: `By accessing or using Jatramela (jatramela.com / jatramela.in), you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree, please do not use the platform. These terms apply to all visitors, customers, and vendors.`,
            },
            {
              title: "2. Products & Availability",
              body: `All products listed on Jatramela are subject to availability. We reserve the right to discontinue any product at any time. Product images are for illustration purposes — actual product colour and packaging may vary slightly due to photography conditions. All prices are in Indian Rupees (INR) and include GST where applicable.`,
            },
            {
              title: "3. Orders & Payment",
              body: `Orders are confirmed only after successful payment via Razorpay. We accept UPI, Visa, Mastercard, RuPay, Net Banking, and EMI. If payment fails after debiting your account, the amount will be refunded within 5–7 business days. We reserve the right to cancel any order suspected of fraud.`,
            },
            {
              title: "4. Delivery",
              body: `We ship pan-India via Shiprocket courier partners. Estimated delivery: Metro cities 2–4 days, Tier 2 cities 3–5 days, Rural areas 5–7 days. Free shipping on orders above ₹999. We are not responsible for delays caused by courier partners, natural disasters, or incorrect delivery addresses provided by the customer.`,
            },
            {
              title: "5. Returns & Refunds",
              body: `Non-food items: 7-day return from delivery date. Item must be unused, in original packaging. Food/wellness items: 3-day return only if sealed and a quality issue is reported with photographic evidence. No return accepted for personalised or made-to-order items. Refunds are processed to the original payment method within 5–7 business days. See our full Return Policy for details.`,
            },
            {
              title: "6. Intellectual Property",
              body: `All content on Jatramela — including images, text, logos, and product descriptions — is the intellectual property of Jatramela or its licensors. You may not reproduce, distribute, or use our content without written permission. Product images generated for this platform are proprietary.`,
            },
            {
              title: "7. Vendor Terms",
              body: `Vendors (farmers, weavers, artisans) who list products on Jatramela agree to: provide accurate product information and certifications; maintain quality standards as agreed during onboarding; honour orders accepted through the platform. Jatramela charges a 15% platform commission on all sales.`,
            },
            {
              title: "8. Limitation of Liability",
              body: `Jatramela shall not be liable for any indirect, incidental, or consequential damages arising from the use of our platform or products. Our maximum liability to any customer is limited to the order value paid for the specific transaction. We do not provide medical advice — Ayurvedic products are traditional wellness items, not medicines.`,
            },
            {
              title: "9. Governing Law",
              body: `These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka. We encourage resolution through direct communication before legal action.`,
            },
            {
              title: "10. Contact",
              body: `Jatramela, No. 289, 4th Cross, Maruthi Nagar, Hegganahalli, Bengaluru — 560 091. Email: hello@jatramela.in | Phone: +91 70196 91302`,
            },
          ].map(s => (
            <div key={s.title}>
              <h2 className="font-bold text-base mb-2" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--text-primary)" }}>{s.title}</h2>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex gap-4 flex-wrap">
          <Link href="/privacy"><button className="btn-outline-gold text-sm px-5 py-2">Privacy Policy →</button></Link>
          <Link href="/returns"><button className="btn-outline-gold text-sm px-5 py-2">Return Policy →</button></Link>
        </div>
      </section>
    </div>
  )
}
