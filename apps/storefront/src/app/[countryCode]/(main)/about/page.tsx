import Image from "next/image"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Jatramela — Culture, Tourism & Heritage of Karnataka",
  description:
    "Jatramela is more than a marketplace. It is a movement to revive Karnataka's culture, connect travellers to sacred heritage, empower artisans, and share creative tools freely with the world.",
}

const PILLARS = [
  {
    icon: "🛕",
    title: "Heritage & Culture",
    desc: "We preserve and promote Karnataka's ancient temples, folk arts, classical music, handloom traditions, and Kannada literature — connecting modern India to its roots.",
  },
  {
    icon: "🌄",
    title: "Authentic Tourism",
    desc: "We craft deeply immersive Karnataka experiences — from sacred pilgrimage circuits and forest treks to village homestays — so travellers feel the heartbeat of the land.",
  },
  {
    icon: "🤝",
    title: "Helping People",
    desc: "Every rupee spent on Jatramela flows back to farmers, weavers, artisans, and local guides. We run no hidden margins — community prosperity is the mission.",
  },
  {
    icon: "🛒",
    title: "Conscious Shopping",
    desc: "Only products our grandmothers would recognise — organic foods, handwoven silk, Ayurvedic wellness, and traditional crafts — sourced directly from the families that make them.",
  },
  {
    icon: "🎬",
    title: "Free Creative Tools",
    desc: "We believe creativity should be accessible to everyone. Our growing library of After Effects, Photoshop, and Premiere scripts is 100% free — no strings attached.",
  },
  {
    icon: "🌐",
    title: "Digital Inclusion",
    desc: "From Kannada transliteration to cultural calendar converters, we build free digital tools that help every Kannadiga navigate the modern world without losing their identity.",
  },
]

const VALUES = [
  { icon: "🌾", title: "Farm First",      desc: "Every product starts from the soil — natural, traditional farming methods passed down for generations." },
  { icon: "🤝", title: "Fair Trade",      desc: "Farmers and artisans receive a minimum 60% of the sale price — 3× the typical market rate." },
  { icon: "🧬", title: "Ancient Science", desc: "South Indian traditional medicine and nutrition science, validated by modern research." },
  { icon: "♻️",  title: "Zero Plastic",   desc: "Banana leaf, jute, clay, and recycled paper for all packaging. No single-use plastics." },
]

const TIMELINE = [
  { year: "2018", event: "Venkatesh starts buying directly from Mysuru farmers for his family. Friends ask to join." },
  { year: "2019", event: "First farmer network formed — 23 families from Hassan and Mysuru districts." },
  { year: "2021", event: "Added Mysore Silk weavers and Channapatna artisans. First 1,000 customers served." },
  { year: "2023", event: "Launched Wellness range. Partnered with Ayurvedic practitioners from Udupi and Dharwad." },
  { year: "2024", event: "Jatramela.com launched with 11 Karnataka Tourism packages, Converters hub, and Blog." },
  { year: "2025", event: "Creative Tools library launched — free Motion Graphics scripts for the global creator community. 2,000+ artisans empowered." },
]

export default function AboutPage() {
  return (
    <div style={{ background: "var(--bg-primary)" }}>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ minHeight: 420 }}>
        <Image
          src="/images/karnataka-farm.png"
          alt="Karnataka Heritage — Jatramela"
          fill
          className="object-cover"
          style={{ filter: "brightness(0.65)" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(14,7,3,0.92) 0%, rgba(44,24,16,0.25) 100%)" }} />
        <div className="absolute inset-0 flex items-center content-container">
          <div className="max-w-2xl py-24">
            <p className="section-label mb-4">Our Story</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-shimmer" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              More Than a Marketplace.<br />
              A Movement.
            </h1>
            <p className="text-base leading-relaxed mb-3" style={{ color: "rgba(255,248,231,0.82)" }}>
              Jatramela was born from a simple belief — Karnataka's greatest treasures are its people, its land, its stories, and its creativity.
            </p>
            <p className="text-base leading-relaxed" style={{ color: "rgba(255,248,231,0.7)" }}>
              We are a platform for culture, tourism, community commerce, and free creative tools — all woven together by one vision:
              a Karnataka that the world rediscovers, and its own people never forget.
            </p>
          </div>
        </div>
      </section>

      <div className="temple-border" />

      {/* ── WHAT WE DO ── */}
      <section className="content-container py-16">
        <div className="text-center mb-12">
          <p className="section-label mb-3">What We Do</p>
          <h2 className="section-heading text-3xl sm:text-4xl mb-4">Six Pillars of Jatramela</h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
            We are not just a shop. We are a living ecosystem that serves travellers, creators, farmers, artisans, and curious minds equally.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map((p, i) => (
            <div key={p.title} className="heritage-card p-7 animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="text-4xl mb-4">{p.icon}</div>
              <h3 className="font-bold text-lg mb-3" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--primary)" }}>{p.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MISSION ── */}
      <section style={{ background: "var(--bg-section-alt)" }}>
        <div className="temple-border-thin" />
        <div className="content-container py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden" style={{ height: 440 }}>
              <Image src="/images/karnataka-hero.png" alt="Jatramela Mission" fill className="object-cover" />
            </div>
            <div>
              <p className="section-label mb-3">Our Mission</p>
              <h2 className="section-heading text-3xl mb-6">Why Jatramela Exists</h2>
              <p className="text-base leading-relaxed mb-5" style={{ color: "var(--text-muted)" }}>
                Modern India is facing a quiet identity crisis — disconnected from its food, its language, its festivals, its art forms, and its land.
                Meanwhile, Karnataka alone holds one of the richest civilisational stories on the planet.
              </p>
              <p className="text-base leading-relaxed mb-5" style={{ color: "var(--text-muted)" }}>
                Jatramela was founded to bridge this gap. We are a platform that makes it easy to live by Karnataka's wisdom — whether you are buying clean organic food, booking a temple circuit, creating a video, or learning Kannada typography.
              </p>
              <p className="text-base leading-relaxed mb-8" style={{ color: "var(--text-muted)" }}>
                Our motto: <strong style={{ color: "var(--primary)" }}>"Bere Hogi, Sari Baazhiri"</strong> (ಬೇರೆ ಹೋಗಿ, ಸರಿ ಬಾಳಿರಿ) — <em>"Go to your roots, live right."</em>
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/tourism"><button className="btn-primary px-7 py-3.5">Explore Tourism</button></Link>
                <Link href="/store"><button className="btn-gold px-7 py-3.5">Shop Karnataka</button></Link>
                <Link href="/creative-tools"><button className="btn-outline px-7 py-3.5">Free Creative Tools</button></Link>
              </div>
            </div>
          </div>
        </div>
        <div className="temple-border-thin" />
      </section>

      {/* ── FOUNDER ── */}
      <section className="content-container py-16">
        <div className="text-center mb-12">
          <p className="section-label mb-3">The Visionary Behind Jatramela</p>
          <h2 className="section-heading text-3xl sm:text-4xl">Meet Venkatesh Narasimha</h2>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="heritage-card p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div
                  className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-black"
                  style={{ background: "var(--gradient-gold-btn)", color: "var(--bg-primary)", fontFamily: "'Baloo 2', sans-serif" }}
                >
                  V
                </div>
                <p className="text-center mt-3 text-xs font-bold" style={{ color: "var(--primary)" }}>Bengaluru, Karnataka</p>
              </div>
              {/* Bio */}
              <div className="flex-1">
                <h3 className="text-2xl font-extrabold mb-1 text-shimmer" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                  Venkatesh Narasimha
                </h3>
                <p className="text-sm font-semibold mb-5" style={{ color: "var(--text-muted)" }}>
                  Founder & CEO · Motion Graphics Designer · Entrepreneur
                </p>
                <p className="text-base leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
                  Venkatesh Narasimha is a <strong style={{ color: "var(--primary)" }}>visionary motion graphics designer and entrepreneur</strong> who
                  is widely recognised for his mastery of visual storytelling and editing. With a career spanning broadcast media, digital content creation,
                  and brand filmmaking, Venkatesh built a reputation for producing cinematic-quality motion content that communicates culture, emotion, and identity.
                </p>
                <p className="text-base leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
                  His editing skills are not just technical — they are rooted in a deep understanding of Karnataka's visual vocabulary: temple architecture,
                  Yakshagana colours, Mysuru Dasara grandeur, and Halegannada script aesthetics. This visual sensibility flows through everything Jatramela creates —
                  from its product photography to its tourism films.
                </p>
                <p className="text-base leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>
                  In 2018, frustrated by the lack of a trustworthy platform connecting Karnataka's farmers and artisans with urban families, he began sourcing
                  food and handloom directly from local communities. That personal mission grew into Jatramela — a platform that now serves tourism, creative education,
                  cultural preservation, and community commerce under one roof.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Motion Graphics", "Video Editing", "Brand Filmmaking", "Karnataka Culture", "Entrepreneurship", "Community Commerce"].map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: "rgba(201,168,76,0.15)", color: "var(--primary)", border: "1px solid rgba(201,168,76,0.3)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
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
          <h2 className="section-heading text-2xl sm:text-3xl">How Jatramela Grew</h2>
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

      {/* ── CTA ── */}
      <section style={{ background: "var(--bg-header)" }}>
        <div className="temple-border" />
        <div className="content-container py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-5 text-shimmer" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            Join the Jatramela Movement 🌾
          </h2>
          <p className="text-base mb-10 max-w-xl mx-auto" style={{ color: "rgba(255,248,231,0.72)" }}>
            Whether you are a traveller, a creator, a conscious shopper, or someone who just loves Karnataka —
            there is a place for you here.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/tourism"><button className="btn-primary px-9 py-4">Plan a Trip</button></Link>
            <Link href="/creative-tools"><button className="btn-gold px-9 py-4">Get Free Tools</button></Link>
            <Link href="/store"><button className="btn-outline px-9 py-4" style={{ borderColor: "rgba(255,248,231,0.3)", color: "#FFF8E7" }}>Shop Now</button></Link>
          </div>
        </div>
        <div className="temple-border" />
      </section>

    </div>
  )
}
