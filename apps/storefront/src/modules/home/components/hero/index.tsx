"use client"

import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import KannadaMorphText from "./kannada-morph"

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

const HERO_IMAGES = [
  { src: "/images/hero/silk.png",        alt: "Mysore Silk Weaving" },
  { src: "/images/hero/farming.png",     alt: "Karnataka Organic Farming" },
  { src: "/images/hero/ayurveda.png",    alt: "Ayurvedic Heritage" },
  { src: "/images/hero/handicrafts.png", alt: "Channapatna Handicrafts" },
  { src: "/images/hero/temple.png",      alt: "Hoysala Temple Architecture" },
]

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{ background: "var(--bg-primary)" }}>

      {/* ══ HERO BANNER ══════════════════════════════════════════════════════ */}
      <section className="hero-banner relative w-full overflow-hidden" style={{ minHeight: "min(650px, 100svh)" }}>
        
        {/* Carousel Images */}
        {HERO_IMAGES.map((img, idx) => (
          <div
            key={img.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentImage ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={idx === 0}
              className="object-cover object-center"
              style={{ filter: "brightness(0.65)" }}
            />
          </div>
        ))}

        {/* Enhanced Overlays for Visibility */}
        <div className="absolute inset-0 bg-black/30 lg:bg-transparent" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(26,10,0,0.9) 0%, rgba(26,10,0,0.4) 50%, transparent 100%)" }} />

        <div className="absolute inset-0 flex items-center">
          <div className="content-container w-full">
            <div className="max-w-2xl py-10 sm:py-20 relative z-10 px-1">

              {/* Kannada morphing text */}
              <div className="mb-6">
                <KannadaMorphText />
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="section-label" style={{ background: "rgba(201,168,76,0.25)", backdropFilter: "blur(4px)" }}>
                  🌺 Karnataka Heritage Marketplace
                </span>
              </div>

              <h1 className="hero-title font-extrabold leading-tight mb-4 sm:mb-6 text-shimmer"
                style={{ 
                  fontFamily: "'Baloo 2', sans-serif", 
                  fontSize: "clamp(1.8rem, 6vw, 4.2rem)", 
                  textShadow: "0 4px 12px rgba(0,0,0,0.5)",
                  lineHeight: 1.1
                }}>
                Go Back to Your<br />Roots. Live Better.
              </h1>

              <p className="hero-body text-sm sm:text-xl leading-relaxed mb-6 sm:mb-10"
                style={{ 
                  color: "rgba(255,248,231,0.95)", 
                  maxWidth: 540, 
                  fontFamily: "'Hind', sans-serif",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)"
                }}>
                Discover the ancient wisdom of Karnataka — organic superfoods, handwoven silks,
                Ayurvedic remedies and heritage crafts.
                <strong style={{ color: "var(--gold-bright)", marginLeft: "6px" }}>Straight from farmer to your door.</strong>
              </p>

              {/* HERO SEARCH BAR */}
              <div className="w-full max-w-md mb-6 sm:mb-10">
                <form action="/store" method="GET" className="relative flex items-center">
                  <input 
                    type="text" 
                    name="q"
                    placeholder="Search products..." 
                    className="hero-search-input w-full pl-10 pr-24 py-3.5 rounded-xl text-sm outline-none transition-all duration-300"
                    style={{ 
                      background: "rgba(255,255,255,0.1)", 
                      backdropFilter: "blur(12px)",
                      border: "2px solid rgba(201,168,76,0.3)",
                      color: "#FFF8E7"
                    }}
                  />
                  <div className="absolute left-3 pointer-events-none">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2.5">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                  </div>
                  <button type="submit" className="absolute right-2 btn-gold px-3 py-2 text-xs rounded-lg">
                    Search
                  </button>
                </form>
                <div className="mt-2 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {["Silk", "Ragi", "Honey", "Ayurveda"].map(tag => (
                    <Link key={tag} href={`/store?q=${tag.toLowerCase()}`} 
                      className="flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded bg-white/5 border border-white/10 text-white/60 hover:text-gold transition-colors">
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="hero-cta-row flex flex-wrap gap-3">
                <Link href="/store" className="flex-shrink-0"><button className="btn-gold w-full sm:w-auto px-8 py-3.5 text-base shadow-lg">🛍️ Shop Now</button></Link>
                <Link href="/about" className="flex-shrink-0"><button className="btn-ghost w-full sm:w-auto px-8 py-3.5 text-base backdrop-blur-sm">Our Story →</button></Link>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {HERO_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImage(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentImage ? "bg-gold w-6" : "bg-white/30"
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
