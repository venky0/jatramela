import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Stories & Blog — Jatramela | Karnataka Heritage",
  description: "Stories of Karnataka farmers, artisans, traditional recipes, health tips, and the back-to-roots movement. Learn about organic living the South Indian way.",
}

const POSTS = [
  {
    slug: "ragi-superfood-karnataka",
    category: "Health & Nutrition",
    title: "Ragi: Karnataka's Ancient Superfood That Modern Science Finally Validates",
    excerpt: "For centuries, Karnataka farmers ate ragi (finger millet) as their staple grain. Now, research confirms it has 3x the calcium of milk, prevents diabetes, and fights obesity. Here's why you should switch today.",
    author: "Dr. Mohan B., Ayurvedic Physician",
    date: "May 10, 2026",
    readTime: "6 min",
    emoji: "🌾",
    color: "#2E6B3E",
    image: "/images/karnataka-food.png",
    tags: ["Ragi", "Superfood", "Diabetes", "Nutrition"],
  },
  {
    slug: "mysore-silk-how-its-made",
    category: "Heritage & Craft",
    title: "Inside the Mysore Silk Factory: How 100-Year-Old Looms Make India's Finest Silk",
    excerpt: "We visited the Karnataka Silk Industries Corporation in Mysuru and documented the entire process — from raw silkworm cocoon to the finished GI-certified saree. A craft story you won't forget.",
    author: "Sharada Devi, Head of Artisans",
    date: "May 5, 2026",
    readTime: "8 min",
    emoji: "🥻",
    color: "#C0392B",
    image: "/images/prod-silk.png",
    tags: ["Mysore Silk", "GI", "Handloom", "Karnataka"],
  },
  {
    slug: "copper-water-ayurveda",
    category: "Ayurveda & Wellness",
    title: "The Science Behind Copper Water: Why Your Grandmother Was Right All Along",
    excerpt: "Storing water in copper vessels overnight alkalises it, kills 99% of bacteria, boosts thyroid function, and improves joint health. Here's the science, the history, and how to use it correctly.",
    author: "Dr. Mohan B., Ayurvedic Physician",
    date: "April 28, 2026",
    readTime: "5 min",
    emoji: "🏺",
    color: "#C9A84C",
    image: "/images/karnataka-wellness.png",
    tags: ["Copper", "Ayurveda", "Water", "Health"],
  },
  {
    slug: "channapatna-toy-town",
    category: "Artisan Stories",
    title: "Channapatna: The Toy Town That Painted Karnataka's Soul in Colour",
    excerpt: "72 km from Bengaluru lies a town where 5,000 artisan families have spent 400 years perfecting the art of lacquered wooden toys. We spent a day with master craftsman Srinivas and his family.",
    author: "Venkatesh Narasimha, Founder & CEO",
    date: "April 20, 2026",
    readTime: "7 min",
    emoji: "🪆",
    color: "#C0392B",
    image: "/images/prod-toys.png",
    tags: ["Channapatna", "Handicrafts", "Artisan", "GI"],
  },
  {
    slug: "traditional-karnataka-diet",
    category: "Traditional Living",
    title: "The Traditional Karnataka Meal Plan That Kept Our Ancestors Healthy Until 90",
    excerpt: "A day's eating in traditional rural Karnataka — from morning ragi ambli to afternoon rice with sambar, evening avalakki, and night soppu saaru. No diabetes, no obesity, no mental health issues. Here's why.",
    author: "Lakshmi N., Farm Relations",
    date: "April 15, 2026",
    readTime: "9 min",
    emoji: "🍱",
    color: "#2E6B3E",
    image: "/images/karnataka-hero.png",
    tags: ["Diet", "Nutrition", "Traditional", "Karnataka"],
  },
  {
    slug: "neem-skin-hair-benefits",
    category: "Natural Beauty",
    title: "Neem: The Tree That Solved Every Skin and Hair Problem Before Chemicals Existed",
    excerpt: "Neem was India's pharmacy before pharmaceuticals. Antibacterial, antifungal, anti-inflammatory — neem tackles acne, dandruff, hair fall, skin infections, and even dental problems naturally.",
    author: "Dr. Mohan B., Ayurvedic Physician",
    date: "April 8, 2026",
    readTime: "6 min",
    emoji: "🌿",
    color: "#2E6B3E",
    image: "/images/prod-soap.png",
    tags: ["Neem", "Skin", "Hair", "Ayurveda"],
  },
]

const CATEGORIES = ["All", "Health & Nutrition", "Ayurveda & Wellness", "Heritage & Craft", "Artisan Stories", "Traditional Living", "Natural Beauty"]

export default function BlogPage() {
  const featured = POSTS[0]
  const rest = POSTS.slice(1)

  return (
    <div style={{ background: "var(--bg-primary)" }}>

      {/* ── HEADER ── */}
      <section style={{ background: "var(--bg-header)" }} className="py-14 text-center relative">
        <div className="temple-border absolute top-0 left-0 right-0" />
        <div className="content-container">
          <p className="section-label mb-3" style={{ color: "rgba(255,248,231,0.6)" }}>Knowledge & Stories</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-shimmer mb-4" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            The Roots Journal
          </h1>
          <p className="text-base max-w-lg mx-auto" style={{ color: "rgba(255,248,231,0.7)" }}>
            Stories from Karnataka's farms, artisan workshops, and ancient health traditions.
            Learn the wisdom that kept our ancestors healthy and happy.
          </p>
        </div>
        <div className="temple-border absolute bottom-0 left-0 right-0" />
      </section>

      {/* ── CATEGORY FILTER ── */}
      <div style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>
        <div className="content-container py-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 min-w-max">
            {CATEGORIES.map((cat, i) => (
              <button key={cat} className="px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all"
                style={i === 0
                  ? { background: "var(--gradient-btn)", color: "#FFF8E7", border: "none" }
                  : { background: "transparent", color: "var(--text-muted)", border: "1.5px solid var(--border)" }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="content-container py-14">

        {/* ── FEATURED POST ── */}
        <div className="heritage-card overflow-hidden mb-12 grid grid-cols-1 lg:grid-cols-2">
          <div className="relative h-72 lg:h-auto">
            <Image src={featured.image} alt={featured.title} fill className="object-cover" />
            <div className="absolute top-4 left-4">
              <span className="tag-green">{featured.category}</span>
            </div>
          </div>
          <div className="p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{featured.emoji}</span>
              <span className="text-xs font-semibold" style={{ color: "var(--text-subtle)" }}>
                {featured.date} · {featured.readTime} read
              </span>
            </div>
            <h2 className="text-2xl font-extrabold mb-4 leading-tight" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--text-primary)" }}>
              {featured.title}
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>{featured.excerpt}</p>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold" style={{ color: "var(--text-subtle)" }}>By {featured.author}</p>
              <Link href={`/blog/${featured.slug}`}>
                <button className="btn-primary px-5 py-2 text-xs">Read Full Story →</button>
              </Link>
            </div>
          </div>
        </div>

        {/* ── GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post, i) => (
            <Link href={`/blog/${post.slug}`} key={post.slug}>
              <div className="heritage-card overflow-hidden h-full animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="relative h-44">
                  <Image src={post.image} alt={post.title} fill className="object-cover" />
                  <div className="absolute top-3 left-3">
                    <span className="tag-gold">{post.category}</span>
                  </div>
                  <div className="absolute top-3 right-3 text-2xl">{post.emoji}</div>
                </div>
                <div className="p-5">
                  <p className="text-xs mb-2" style={{ color: "var(--text-subtle)" }}>
                    {post.date} · {post.readTime} read
                  </p>
                  <h3 className="font-bold text-sm leading-snug mb-3" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--text-primary)" }}>
                    {post.title}
                  </h3>
                  <p className="text-xs leading-relaxed mb-4 line-clamp-3" style={{ color: "var(--text-muted)" }}>{post.excerpt}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.slice(0, 3).map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ background: "var(--bg-secondary)", color: "var(--text-subtle)", border: "1px solid var(--border)" }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs font-semibold" style={{ color: "var(--text-subtle)" }}>By {post.author}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── NEWSLETTER ── */}
        <div className="mt-14 text-center rounded-2xl p-10"
          style={{ background: "var(--bg-header)", border: "2px solid rgba(201,168,76,0.25)" }}>
          <div className="temple-border mb-6" />
          <p className="text-3xl mb-3">📖</p>
          <h3 className="text-xl font-extrabold text-shimmer mb-3" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            Get Stories Delivered Weekly
          </h3>
          <p className="text-sm mb-6" style={{ color: "rgba(255,248,231,0.65)" }}>
            Traditional recipes, farm stories, artisan spotlights and health tips — every Saturday morning.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto" action="/api/newsletter" method="post">
            <input type="email" placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-full text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(201,168,76,0.3)", color: "#FFF8E7" }} />
            <button type="submit" className="btn-gold px-6 py-3 rounded-full text-sm">Subscribe 🌺</button>
          </form>
          <div className="temple-border mt-6" />
        </div>
      </div>
    </div>
  )
}
