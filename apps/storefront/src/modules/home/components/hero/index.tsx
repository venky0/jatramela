"use client"

import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import KannadaMorphText from "./kannada-morph"
import { JATRA_DATA, type Jatra } from "@lib/data/jatras"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

// Lottie: Indian celebration animation from LottieFiles
const LOTTIE_CELEBRATION = "https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.json"

function LottieAccent() {
  const [data, setData] = useState<object|null>(null)
  useEffect(() => {
    fetch(LOTTIE_CELEBRATION).then(r => r.json()).then(setData).catch(() => {})
  }, [])
  if (!data) return null
  return (
    <div style={{ width: 160, height: 160, opacity: 0.9, pointerEvents: "none" }}>
      <Lottie animationData={data} loop autoplay />
    </div>
  )
}

// ── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: "Mysore Silk & Sarees",  emoji: "🥻", href: "/categories/clothing",    image: "/images/karnataka-clothing.png",    desc: "Authentic Mysore silk, Ilkal & Kasuti sarees" },
  { label: "Organic Foods",         emoji: "🌾", href: "/categories/organic",     image: "/images/karnataka-food.png",         desc: "Ragi, red rice, cold-pressed oils & spices" },
  { label: "Wellness & Ayurveda",   emoji: "🌿", href: "/categories/wellness",    image: "/images/karnataka-wellness.png",     desc: "Neem, sandalwood, turmeric & herbal remedies" },
  { label: "Heritage Handicrafts",  emoji: "🏺", href: "/categories/handicrafts", image: "/images/karnataka-handicrafts.png", desc: "Channapatna toys, Bidriware & wood carvings" },
]

const WHY_ITEMS = [
  { icon: "🌾", title: "100% Organic",        desc: "Zero chemicals, traditional farming methods from Karnataka's fertile lands" },
  { icon: "🤝", title: "Farm to Door",        desc: "Direct from Karnataka artisans and farmers — no middlemen, fair prices" },
  { icon: "🏡", title: "Traditional Wisdom",  desc: "Age-old South Indian knowledge curated by experts and village elders" },
  { icon: "♻️",  title: "Zero Waste Living",  desc: "Eco-conscious packaging, reusable vessels, sustainable lifestyle solutions" },
  { icon: "💊", title: "Modern Solutions",    desc: "Ancient remedies solving today's lifestyle diseases & health problems" },
  { icon: "🇮🇳", title: "Made in Karnataka",  desc: "Empowering 2,000+ local artisans and farmers across all 31 districts" },
]

const TESTIMONIALS = [
  { name: "Savitha R.",  location: "Bengaluru", text: "My family's health transformed after switching to Jatramela's ragi and red rice. My children's immunity has improved tremendously!", stars: 5 },
  { name: "Manjunath K.", location: "Mysuru",   text: "The Mysore silk saree I got for my wife's birthday was absolutely stunning. Pure quality, authentic weave. Worth every rupee!", stars: 5 },
  { name: "Padma S.",   location: "Dharwad",   text: "I replaced all my kitchen oils with cold-pressed coconut and sesame from Jatramela. My cholesterol levels dropped significantly.", stars: 5 },
]

const FEATURED_PRODUCTS = [
  { name: "Ragi Malt Mix",         price: "₹ 249",  tag: "Bestseller", emoji: "🌾", desc: "Traditional Karnataka breakfast mix with finger millet. Rich in calcium & iron." },
  { name: "Mysore Silk Saree",     price: "₹ 4,999", tag: "Premium",   emoji: "🥻", desc: "Pure Mysore silk with gold zari border. GI certified handwoven." },
  { name: "Neem Tulsi Herbal Soap", price: "₹ 89",  tag: "Natural",   emoji: "🌿", desc: "100% natural handcrafted soap. No chemicals, no parabens." },
  { name: "Cold-Pressed Coconut Oil", price: "₹ 399", tag: "Organic",  emoji: "🥥", desc: "Traditional wooden-press extraction. Retains all nutrients." },
  { name: "Channapatna Wooden Toys", price: "₹ 299", tag: "Handmade", emoji: "🪆", desc: "Safe lacquered wooden toys made in GI-tagged Channapatna, Karnataka." },
  { name: "Organic Turmeric Powder", price: "₹ 149", tag: "Pure",     emoji: "🟡", desc: "Lakadong turmeric with 7%+ curcumin. No additives." },
]

const SOLUTIONS = [
  { problem: "Diabetes & Blood Sugar", solution: "Ragi, Jowar & Bitter Gourd Products", icon: "🩸" },
  { problem: "Hair Fall & Dandruff",   solution: "Neem + Amla + Bhringraj Herbal Oils", icon: "💇" },
  { problem: "Digestive Issues",       solution: "Probiotic Buttermilk Mix & Herbal Teas", icon: "🫁" },
  { problem: "Skin Problems",         solution: "Turmeric & Sandalwood Skincare Range", icon: "✨" },
  { problem: "Stress & Anxiety",      solution: "Ashwagandha & Brahmi Formulations",    icon: "🧘" },
  { problem: "Obesity & Weight",      solution: "Traditional Millets & Low-GI Grains",  icon: "⚖️" },
]

// ── Component ─────────────────────────────────────────────────────────────────

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

function getActiveOrUpcomingJatras(): Jatra[] {
  const currentMonthIdx = new Date().getMonth() // 0-11
  const currentMonthName = MONTHS[currentMonthIdx]
  const activeJatras = JATRA_DATA.filter(j => 
    j.gregorianMonths.includes(currentMonthName)
  )
  
  if (activeJatras.length >= 3) {
    return activeJatras
  }
  
  const collected = [...activeJatras]
  const collectedIds = new Set(collected.map(c => c.id))
  
  for (let offset = 1; offset < 12; offset++) {
    const nextMonthIdx = (currentMonthIdx + offset) % 12
    const nextMonthName = MONTHS[nextMonthIdx]
    const upcoming = JATRA_DATA.filter(j => 
      j.gregorianMonths.includes(nextMonthName)
    )
    for (const j of upcoming) {
      if (!collectedIds.has(j.id)) {
        collected.push(j)
        collectedIds.add(j.id)
      }
    }
    if (collected.length >= 4) {
      break
    }
  }
  return collected.slice(0, 4)
}

const INITIAL_FALLBACK_SLIDES = JATRA_DATA.slice(0, 4)

export default function Hero() {
  const [slides, setSlides] = useState<Jatra[]>(INITIAL_FALLBACK_SLIDES)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [updates, setUpdates] = useState<Record<string, any>>({})

  useEffect(() => {
    setSlides(getActiveOrUpcomingJatras())
    
    // Fetch live updates from API
    fetch("/api/jatra-updates")
      .then((res) => res.json())
      .then((data) => setUpdates(data))
      .catch((err) => console.error("Error fetching live updates:", err))
  }, [])

  useEffect(() => {
    if (slides.length === 0) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <div style={{ background: "var(--bg-primary)" }}>

      {/* ══ HERO BANNER ══════════════════════════════════════════════════════ */}
      <section className="hero-banner relative w-full overflow-hidden" style={{ minHeight: "min(700px, 100svh)" }}>
        
        {/* Carousel Slides */}
        {slides.map((jatra, idx) => {
          const update = updates[jatra.id]
          const isActive = idx === currentSlide
          const currentMonthName = MONTHS[new Date().getMonth()]
          const isJatraActiveThisMonth = jatra.gregorianMonths.includes(currentMonthName)
          
          return (
            <div
              key={jatra.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                isActive ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              {/* Background Image */}
              <Image
                src={jatra.image}
                alt={jatra.title}
                fill
                priority={idx === 0}
                className="object-cover object-center transition-transform duration-[8000ms] ease-linear"
                style={{ 
                  filter: "brightness(0.35) contrast(1.05)",
                  transform: isActive ? "scale(1.08)" : "scale(1.0)"
                }}
              />
              
              {/* Devotional Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#120500] via-[#120500]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1E0900]/90 via-[#1E0900]/40 to-transparent" />

              {/* Slide Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="content-container w-full">
                  <div className="max-w-3xl py-10 sm:py-20 relative z-10 px-4">
                    
                    {/* Badge showing Active or Upcoming Status */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      {isJatraActiveThisMonth ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white border border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse">
                          <span>✨</span> ACTIVE JATRA OF THE MONTH ({currentMonthName})
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-amber-600/60 to-yellow-500/60 text-[#FFF8E7] border border-amber-500/40 backdrop-blur-sm">
                          <span>📅</span> UPCOMING JATRA — {jatra.gregorianMonths.join(" / ")}
                        </span>
                      )}
                      
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-black/40 border border-[#C9A84C]/30 text-[#FFD700]">
                        📍 {jatra.place}
                      </span>
                    </div>

                    {/* Kannada Title (Traditional glow) */}
                    <p className="text-xl sm:text-3xl text-amber-400 font-bold mb-3 tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] filter brightness-110" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                      {jatra.titleKannada}
                    </p>

                    {/* Main English Title */}
                    <h1 className="font-extrabold leading-tight mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFEBB3] to-[#FF8C00] drop-shadow-[0_4px_12px_rgba(255,140,0,0.35)]"
                      style={{ 
                        fontFamily: "'Baloo 2', sans-serif", 
                        fontSize: "clamp(1.8rem, 5.5vw, 3.8rem)", 
                        lineHeight: 1.15
                      }}>
                      {jatra.title}
                    </h1>

                    {/* Summary / Description */}
                    <p className="text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 text-[#FFF8E7]/90 max-w-xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
                      style={{ fontFamily: "'Hind', sans-serif" }}>
                      {jatra.summary}
                    </p>

                    {/* 🔱 Dynamic Live Updates Box (Important Alerts on Main Banner) */}
                    <div className="mb-6 sm:mb-8 max-w-xl rounded-2xl border border-[#FF8C00]/40 bg-gradient-to-br from-[#2D0F00]/95 to-[#1A0600]/95 p-4 sm:p-5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5),_0_0_15px_rgba(255,111,0,0.15)] transform transition-all duration-500 hover:scale-[1.01] hover:border-[#FF8C00]/70">
                      <div className="flex items-center justify-between mb-3 border-b border-[#C9A84C]/20 pb-2">
                        <span className="flex items-center gap-2 text-[#FF8C00] font-bold text-xs sm:text-sm tracking-wider uppercase">
                          <span className="animate-spin text-sm" style={{ animationDuration: "3s" }}>🔱</span> 
                          {update?.isActive === false ? "DEVOTIONAL FEED OFFLINE" : "LIVE DEVOTIONAL UPDATES"}
                        </span>
                        {update?.lastUpdated && (
                          <span className="text-[10px] text-amber-200/50">
                            Updated: {new Date(update.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      
                      {update ? (
                        update.isActive === false ? (
                          <div className="text-xs sm:text-sm text-[#FFF8E7]/90 space-y-2">
                            <div className="flex items-center gap-2 text-orange-400 font-bold">
                              <span>🔔</span> Temple Darshana Open (No Live Festival)
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div>
                                <p className="mb-1">
                                  <span className="text-[#FFD700]">📅 Next Festival:</span>{" "}
                                  <span className="text-orange-300 font-semibold">{update.nextEvent}</span>
                                </p>
                                <p>
                                  <span className="text-[#FFD700]">🕒 Timings:</span>{" "}
                                  <span>6:00 AM - 9:00 PM</span>
                                </p>
                              </div>
                              <div>
                                <p className="mb-1">
                                  <span className="text-[#FFD700]">☁️ Weather:</span> {update.weather}
                                </p>
                                <p className="line-clamp-1">
                                  <span className="text-[#FFD700]">🚨 Status:</span> <span className="text-amber-200/70">{update.liveAlert}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#FFF8E7]/90">
                            <div className="space-y-2">
                              <p className="flex items-center gap-2">
                                <span className="text-[#FFD700]">👥 Crowd:</span>
                                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  update.crowdStatus === 'Peak' || update.crowdStatus === 'VVIP'
                                    ? 'bg-red-950/80 text-red-400 border border-red-800'
                                    : 'bg-green-950/80 text-green-400 border border-green-800'
                                }`}>
                                  {update.crowdStatus}
                                </span>
                              </p>
                              <p className="line-clamp-1"><span className="text-[#FFD700]">🙏 Ritual:</span> {update.currentRitual}</p>
                            </div>
                            <div className="space-y-2">
                              <p className="line-clamp-1"><span className="text-[#FFD700]">☁️ Weather:</span> {update.weather}</p>
                              <p className="line-clamp-1"><span className="text-[#FFD700]">🚨 Alert:</span> <span className="text-orange-300 font-medium">{update.liveAlert || update.parkingAlert}</span></p>
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="flex items-center justify-center py-2 text-xs text-amber-200/40">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#FF8C00]" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Connecting to temple live feeds...
                        </div>
                      )}
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-4">
                      <LocalizedClientLink href={`/jatras/${jatra.handle}`}>
                        <button className="btn-gold px-8 py-3.5 text-base shadow-[0_4px_20px_rgba(201,168,76,0.35)] font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                          <span>🛕 View Sacred Details</span>
                          <span className="text-[14px]">→</span>
                        </button>
                      </LocalizedClientLink>
                      
                      <LocalizedClientLink href="/jatras">
                        <button className="btn-ghost px-8 py-3.5 text-base border border-[#C9A84C]/50 hover:bg-[#C9A84C]/10 text-[#FFF8E7] backdrop-blur-sm hover:scale-105 transition-transform">
                          Explore All Fairs
                        </button>
                      </LocalizedClientLink>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          )
        })}

        {/* Carousel Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? "bg-[#FF8C00] w-8 shadow-[0_0_8px_#FF8C00]" : "bg-white/30"
              }`}
            />
          ))}
        </div>

        {/* Lottie decoration */}
        <div className="absolute bottom-4 right-6 hidden lg:block z-20">
          <LottieAccent />
        </div>
      </section>

      {/* Temple border */}
      <div className="temple-border" />

      {/* ══ STATS BAR ══════════════════════════════════════════════════════ */}
      <div style={{ background: "var(--bg-header)" }}>
        <div className="content-container py-4 sm:py-5">
          <div className="stats-bar-grid grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
            {[
              { n: "2,000+", l: "Artisans Empowered" },
              { n: "500+",   l: "Organic Products" },
              { n: "31",     l: "Karnataka Districts" },
              { n: "₹0",     l: "Platform Fee" },
            ].map(s => (
              <div key={s.l}>
                <div className="text-2xl font-black text-shimmer" style={{ fontFamily: "'Baloo 2', sans-serif" }}>{s.n}</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(255,248,231,0.65)", fontFamily: "'Hind', sans-serif" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="temple-border" />
      </div>

      {/* ══ CATEGORIES ══════════════════════════════════════════════════════ */}
      <section className="content-container py-16">
        <div className="text-center mb-12">
          <p className="section-label mb-3">What We Offer</p>
          <h2 className="section-heading text-3xl sm:text-4xl">Karnataka's Finest Collections</h2>
          <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: "var(--text-muted)" }}>
            Carefully curated from the heart of Karnataka — everything your ancestors used and loved.
          </p>
        </div>

        <div className="categories-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((cat, i) => (
            <Link href={cat.href} key={cat.label}>
              <div className="category-card animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="relative h-52 overflow-hidden">
                  <Image src={cat.image} alt={cat.label} fill className="object-cover transition-transform duration-500 hover:scale-110" />
                </div>
                <div className="category-overlay">
                  <div>
                    <p className="font-extrabold text-base mb-1" style={{ color: "#FFF8E7", fontFamily: "'Baloo 2', sans-serif" }}>
                      {cat.emoji} {cat.label}
                    </p>
                    <p className="text-xs" style={{ color: "rgba(255,248,231,0.75)" }}>{cat.desc}</p>
                    <span className="inline-block mt-2 text-xs font-bold" style={{ color: "var(--gold-bright)" }}>Explore →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══ MODERN SOLUTIONS ════════════════════════════════════════════════ */}
      <section style={{ background: "var(--bg-section-alt)" }}>
        <div className="temple-border-thin" />
        <div className="content-container py-16">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Ancient Wisdom, Modern Solutions</p>
            <h2 className="section-heading text-3xl sm:text-4xl">Solutions to Today's Health Problems</h2>
            <p className="mt-4 text-base max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
              Our ancestors had natural solutions to every modern problem. Let's rediscover them together.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SOLUTIONS.map((s, i) => (
              <div key={s.problem} className="heritage-card p-6 animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="text-3xl mb-3">{s.icon}</div>
                <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "var(--text-subtle)" }}>PROBLEM</p>
                <p className="font-bold mb-2" style={{ color: "var(--primary)", fontFamily: "'Baloo 2', sans-serif" }}>{s.problem}</p>
                <div style={{ height: "1px", background: "var(--border)", margin: "10px 0" }} />
                <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "var(--text-subtle)" }}>OUR SOLUTION</p>
                <p className="text-sm font-semibold" style={{ color: "var(--green)" }}>{s.solution}</p>
                <Link href="/store">
                  <button className="mt-4 btn-green text-xs px-5 py-2">Shop Solution →</button>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="temple-border-thin" />
      </section>

      {/* ══ FEATURED PRODUCTS ════════════════════════════════════════════════ */}
      <section className="content-container py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-label mb-2">Handpicked for You</p>
            <h2 className="section-heading text-2xl sm:text-3xl">Featured Products</h2>
          </div>
          <Link href="/store"><button className="btn-outline-gold text-sm px-5 py-2">View All →</button></Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_PRODUCTS.map((p, i) => (
            <div key={p.name} className="heritage-card p-6 animate-slide-up" style={{ animationDelay: `${i * 0.09}s` }}>
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{p.emoji}</div>
                <span className={`tag-${p.tag === 'Bestseller' ? 'red' : p.tag === 'Premium' ? 'gold' : 'green'}`}>{p.tag}</span>
              </div>
              <h3 className="font-bold text-base mb-1" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--text-primary)" }}>{p.name}</h3>
              <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>{p.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-black" style={{ color: "var(--primary)", fontFamily: "'Baloo 2', sans-serif" }}>{p.price}</span>
                <Link href="/store"><button className="btn-primary text-xs px-4 py-2">Add to Cart</button></Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ WHY JATRAMELA ═════════════════════════════════════════════════ */}
      <section style={{ background: "var(--bg-header)" }}>
        <div className="temple-border" />
        <div className="content-container py-16">
          <div className="text-center mb-12">
            <p className="section-label mb-3" style={{ color: "rgba(255,248,231,0.6)" }}>Why Choose Us</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-shimmer" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              The Jatramela Promise
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_ITEMS.map((w, i) => (
              <div key={w.title} className="p-6 rounded-2xl animate-slide-up" style={{
                background: "rgba(255,248,231,0.07)", border: "1.5px solid rgba(201,168,76,0.2)",
                animationDelay: `${i * 0.1}s`
              }}>
                <div className="text-3xl mb-3">{w.icon}</div>
                <h3 className="font-bold text-base mb-2 text-shimmer" style={{ fontFamily: "'Baloo 2', sans-serif" }}>{w.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,248,231,0.72)" }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="temple-border" />
      </section>

      {/* ══ ABOUT SNIPPET ════════════════════════════════════════════════════ */}
      <section className="content-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-2xl overflow-hidden about-image-wrapper" style={{ height: 380 }}>
            <Image src="/images/karnataka-farm.png" alt="Karnataka Organic Farm" fill className="object-cover" />
            <div className="absolute inset-0 rounded-2xl" style={{ border: "3px solid var(--gold)", opacity: 0.5 }} />
            <div className="absolute bottom-4 left-4 right-4 px-5 py-3 rounded-xl"
              style={{ background: "rgba(44,24,16,0.85)", backdropFilter: "blur(8px)" }}>
              <p className="text-xs font-bold" style={{ color: "var(--gold-bright)", fontFamily: "'Baloo 2', sans-serif" }}>
                🌾 Our Farmers, Kaveri basin, Karnataka
              </p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,248,231,0.75)" }}>
                Practicing organic farming for 3+ generations
              </p>
            </div>
          </div>
          <div className="animate-slide-up delay-200">
            <p className="section-label mb-3">Our Story</p>
            <h2 className="section-heading text-3xl mb-6">Preserving Karnataka's Ancient Food Wisdom</h2>
            <p className="text-base leading-relaxed mb-5" style={{ color: "var(--text-muted)" }}>
              Our grandmothers knew the secrets to a healthy life. They cooked in brass vessels, used turmeric
              daily, wore natural cotton, and ate only what the land gave. We are on a mission to bring
              those age-old practices back to every Indian household.
            </p>
            <p className="text-base leading-relaxed mb-8" style={{ color: "var(--text-muted)" }}>
              Started in Mysuru, Jatramela connects Karnataka's farmers and artisans directly with families
              across India — cutting out middlemen, ensuring fair pay to producers, and delivering the purest
              products to your doorstep.
            </p>
            <div className="flex gap-4">
              <Link href="/about"><button className="btn-primary px-7 py-3">Read Our Story</button></Link>
              <Link href="/store"><button className="btn-gold px-7 py-3">Shop Now</button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ════════════════════════════════════════════════════ */}
      <section style={{ background: "var(--bg-section-alt)" }}>
        <div className="temple-border-thin" />
        <div className="content-container py-16">
          <div className="text-center mb-10">
            <p className="section-label mb-3">Customer Love</p>
            <h2 className="section-heading text-2xl sm:text-3xl">What Our Customers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className="testimonial-card animate-slide-up" style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="flex gap-1 mb-3">
                  {Array(t.stars).fill(0).map((_, j) => <span key={j} style={{ color: "var(--gold)" }}>★</span>)}
                </div>
                <p className="text-sm leading-relaxed mb-5 italic" style={{ color: "var(--text-muted)" }}>"{t.text}"</p>
                <div>
                  <p className="font-bold text-sm" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--text-primary)" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-subtle)" }}>📍 {t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="temple-border-thin" />
      </section>

      {/* ══ NEWSLETTER CTA ══════════════════════════════════════════════════ */}
      <section className="content-container py-16">
        <div className="relative rounded-2xl overflow-hidden p-10 text-center"
          style={{ background: "var(--bg-header)", border: "2px solid rgba(201,168,76,0.3)" }}>
          <div className="temple-border absolute top-0 left-0 right-0" />
          <p className="section-label mb-3" style={{ color: "rgba(255,248,231,0.6)" }}>Stay Connected</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-shimmer mb-3" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            Join the Back-to-Roots Movement
          </h2>
          <p className="text-sm mb-8 max-w-xl mx-auto" style={{ color: "rgba(255,248,231,0.7)" }}>
            Get weekly recipes, health tips rooted in Karnataka tradition, exclusive offers and
            new product launches — delivered to your inbox. 100% free.
          </p>
          <form className="newsletter-form flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="your@email.com" className="flex-1 min-w-0 px-5 py-3 rounded-full text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(201,168,76,0.4)", color: "#FFF8E7" }} />
            <button type="submit" className="btn-gold px-7 py-3 rounded-full">Subscribe 🌺</button>
          </form>
          <div className="temple-border absolute bottom-0 left-0 right-0" />
        </div>
      </section>

    </div>
  )
}
