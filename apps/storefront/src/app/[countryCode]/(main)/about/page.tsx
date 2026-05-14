import Image from "next/image"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us — Jatramela | Back to Karnataka Roots",
  description: "Learn about Jatramela's mission to revive Karnataka's ancient food wisdom, traditional clothing and natural living — bringing health, heritage and happiness to all Indians.",
}

const TEAM = [
  { name: "Venkatesh Narasimha", role: "Founder & CEO", location: "Bengaluru", bio: "Visionary founder on a mission to revive Karnataka's ancient heritage — connecting farmers, weavers, and artisans directly with Indian families." },
  { name: "Sharada Devi",        role: "Head of Artisans", location: "Dharwad", bio: "Works directly with 200+ weavers and craftswomen across North Karnataka." },
  { name: "Dr. Mohan B.",        role: "Wellness Advisor", location: "Udupi", bio: "Ayurvedic physician with 25 years experience in traditional Karnataka medicine." },
  { name: "Lakshmi N.",          role: "Farm Relations", location: "Hassan", bio: "Connects 500+ organic farmers in the Kaveri and Tungabhadra belts to our network." },
]

const VALUES = [
  { icon: "🌾", title: "Farm First",       desc: "Every product starts from the soil. We work with natural, traditional farming methods passed down for generations." },
  { icon: "🤝", title: "Fair Trade",       desc: "Farmers and artisans receive a minimum 60% of the sale price — 3x the typical market rate." },
  { icon: "🧬", title: "Ancient Science",  desc: "South Indian traditional medicine and nutrition science validated by modern research." },
  { icon: "♻️",  title: "Zero Plastic",    desc: "We use banana leaf, jute, clay, and recycled paper for all packaging. No single-use plastics." },
]

const TIMELINE = [
  { year: "2018", event: "Venkatesh Narasimha starts buying directly from Mysuru farmers for his family. Friends ask to join." },
  { year: "2019", event: "First farmer network formed — 23 families from Hassan and Mysuru districts." },
  { year: "2021", event: "Added Mysore Silk weavers and Channapatna artisans. First 1,000 customers served." },
  { year: "2023", event: "Launched Wellness range. Partnered with Ayurvedic practitioners from Udupi and Dharwad." },
  { year: "2024", event: "Jatramela.com launched with Razorpay payments and pan-India delivery." },
  { year: "2025", event: "2,000+ artisans and farmers empowered. Serving families across all Indian states." },
]

export default function AboutPage() {
  return (
    <div style={{ background: "var(--bg-primary)" }}>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ minHeight: 380 }}>
        <Image src="/images/karnataka-farm.png" alt="Our Karnataka Farmers" fill className="object-cover" style={{ filter: "brightness(0.75)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(44,24,16,0.85) 0%, rgba(44,24,16,0.3) 100%)" }} />
        <div className="absolute inset-0 flex items-center content-container">
          <div className="max-w-xl py-20">
            <p className="section-label mb-4">Our Story</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-5 text-shimmer" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              Back to Karnataka's<br />Ancient Roots
            </h1>
            <p className="text-base leading-relaxed" style={{ color: "rgba(255,248,231,0.82)" }}>
              A marketplace born from a simple belief: our grandmothers had all the answers.
              Traditional South Indian wisdom holds the key to healthier, happier modern lives.
            </p>
          </div>
        </div>
      </section>

      <div className="temple-border" />

      {/* ── MISSION ── */}
      <section className="content-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="section-label mb-3">Our Mission</p>
            <h2 className="section-heading text-3xl mb-6">Why Jatramela Exists</h2>
            <p className="text-base leading-relaxed mb-5" style={{ color: "var(--text-muted)" }}>
              Modern India is facing a health crisis rooted in disconnection from our food heritage.
              Diabetes, obesity, hair loss, skin disorders — most of these were rare in our grandparents'
              generation because they ate naturally, wore natural fabrics, and lived by seasonal rhythms.
            </p>
            <p className="text-base leading-relaxed mb-5" style={{ color: "var(--text-muted)" }}>
              Jatramela was founded to bridge this gap. We curate only those products that our
              great-grandmothers would recognise — organic foods, handwoven textiles, Ayurvedic wellness
              products, and traditional craft items — directly from the families that still make them.
            </p>
            <p className="text-base leading-relaxed mb-8" style={{ color: "var(--text-muted)" }}>
              Our motto: <strong style={{ color: "var(--primary)" }}>"Bere Hogi, Sari Baazhiri"</strong> (ಬೇರೆ ಹೋಗಿ, ಸರಿ ಬಾಳಿರಿ) — "Go to your roots, live right."
            </p>
            <Link href="/store"><button className="btn-primary px-8 py-3.5">Shop Our Collections</button></Link>
          </div>
          <div className="relative rounded-2xl overflow-hidden" style={{ height: 420 }}>
            <Image src="/images/karnataka-hero.png" alt="Jatramela Mission" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section style={{ background: "var(--bg-section-alt)" }}>
        <div className="temple-border-thin" />
        <div className="content-container py-16">
          <div className="text-center mb-10">
            <p className="section-label mb-3">What We Stand For</p>
            <h2 className="section-heading text-2xl sm:text-3xl">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <div key={v.title} className="heritage-card p-6 text-center animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-bold text-lg mb-3" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--primary)" }}>{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="temple-border-thin" />
      </section>

      {/* ── TIMELINE ── */}
      <section className="content-container py-16">
        <div className="text-center mb-10">
          <p className="section-label mb-3">Our Journey</p>
          <h2 className="section-heading text-2xl sm:text-3xl">How We Grew</h2>
        </div>
        <div className="max-w-2xl mx-auto">
          {TIMELINE.map((t, i) => (
            <div key={t.year} className="flex gap-5 mb-8 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                  style={{ background: "var(--gradient-btn)", color: "#FFF8E7", fontFamily: "'Baloo 2', sans-serif" }}>{t.year}</div>
                {i < TIMELINE.length - 1 && <div className="w-0.5 flex-1 mt-2" style={{ background: "var(--border)" }} />}
              </div>
              <div className="pt-3 pb-8">
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{t.event}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TEAM ── */}
      <section style={{ background: "var(--bg-header)" }}>
        <div className="temple-border" />
        <div className="content-container py-16">
          <div className="text-center mb-10">
            <p className="section-label mb-3" style={{ color: "rgba(255,248,231,0.6)" }}>The People Behind Jatramela</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-shimmer" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Meet Our Team</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((m, i) => (
              <div key={m.name} className="p-6 rounded-2xl animate-slide-up text-center" style={{
                background: "rgba(255,248,231,0.07)", border: "1.5px solid rgba(201,168,76,0.2)",
                animationDelay: `${i * 0.1}s`
              }}>
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-black"
                  style={{ background: "var(--gradient-gold-btn)", color: "var(--bg-primary)", fontFamily: "'Baloo 2', sans-serif" }}>
                  {m.name[0]}
                </div>
                <h3 className="font-bold text-base text-shimmer mb-1" style={{ fontFamily: "'Baloo 2', sans-serif" }}>{m.name}</h3>
                <p className="text-xs font-semibold mb-1" style={{ color: "rgba(255,248,231,0.5)" }}>{m.role}</p>
                <p className="text-xs mb-3" style={{ color: "rgba(255,248,231,0.4)" }}>📍 {m.location}</p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,248,231,0.65)" }}>{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="temple-border" />
      </section>

      {/* ── CTA ── */}
      <section className="content-container py-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-4" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--text-primary)" }}>
          Join the Movement 🌾
        </h2>
        <p className="text-base mb-8 max-w-lg mx-auto" style={{ color: "var(--text-muted)" }}>
          Every purchase supports a Karnataka farmer or artisan. Be part of India's heritage revival.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/store"><button className="btn-primary px-9 py-4">Shop Now</button></Link>
          <Link href="/contact"><button className="btn-gold px-9 py-4">Partner With Us</button></Link>
        </div>
      </section>

    </div>
  )
}
