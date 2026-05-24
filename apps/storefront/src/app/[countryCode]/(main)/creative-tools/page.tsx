"use client"

import { useState } from "react"
import Link from "next/link"

// ─── Tool Data ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "all",           label: "All Tools",       emoji: "✨" },
  { id: "aftereffects",  label: "After Effects",   emoji: "🎬" },
  { id: "photoshop",     label: "Photoshop",       emoji: "🖼️" },
  { id: "premiere",      label: "Premiere Pro",    emoji: "🎞️" },
  { id: "templates",     label: "Templates",       emoji: "📐" },
]

const TOOLS = [
  // ─ AFTER EFFECTS ─
  {
    id: "ae-auto-text",
    category: "aftereffects",
    title: "Auto Text Animator",
    desc: "Instantly animates any text layer with 30+ preset movements — kinetic type, bounce, glitch, and reveal effects. One click. Zero keyframes.",
    tags: ["Typography", "Motion", "Automation"],
    format: ".jsx Script",
    size: "12 KB",
    emoji: "✍️",
    badge: "Popular",
    badgeColor: "#2E6B3E",
    downloadUrl: "/downloads/ae-auto-text.zip",
  },
  {
    id: "ae-color-grade",
    category: "aftereffects",
    title: "Karnataka Colour Grader",
    desc: "LUT-based colour grading script inspired by Mysuru's golden hour, Coorg's emerald forests, and Hampi's ochre ruins. 15 unique Karnataka-inspired looks.",
    tags: ["Color", "LUT", "Cinematic"],
    format: ".jsx Script + LUTs",
    size: "2.4 MB",
    emoji: "🎨",
    badge: "New",
    badgeColor: "#8B2500",
    downloadUrl: "/downloads/ae-color-grade.zip",
  },
  {
    id: "ae-loop-machine",
    category: "aftereffects",
    title: "Loop Machine",
    desc: "Select any layer, choose loop type (ping-pong, cycle, continue), and the script handles loopOut expressions automatically — no expression knowledge needed.",
    tags: ["Expressions", "Loop", "Animation"],
    format: ".jsx Script",
    size: "8 KB",
    emoji: "🔁",
    badge: null,
    badgeColor: null,
    downloadUrl: "/downloads/ae-loop-machine.zip",
  },
  {
    id: "ae-render-q",
    category: "aftereffects",
    title: "Smart Render Queue",
    desc: "Batch-exports your composition in multiple formats (MP4, GIF, WebP, ProRes) with single-click preset management. Saves hours on delivery workflows.",
    tags: ["Export", "Batch", "Workflow"],
    format: ".jsx Script",
    size: "15 KB",
    emoji: "📤",
    badge: "Editor's Pick",
    badgeColor: "#5C3A00",
    downloadUrl: "/downloads/ae-render-q.zip",
  },
  {
    id: "ae-particle-temple",
    category: "aftereffects",
    title: "Temple Particle Pack",
    desc: "60 pre-built particle compositions — diyas, petals, gold dust, rangoli particles, and incense smoke. Drag-and-drop into any comp. Perfect for cultural content.",
    tags: ["Particles", "Culture", "VFX"],
    format: ".aep Project",
    size: "180 MB",
    emoji: "🪔",
    badge: "Free Pack",
    badgeColor: "#7B4F00",
    downloadUrl: "/downloads/ae-particle-temple.zip",
  },

  // ─ PHOTOSHOP ─
  {
    id: "ps-batch-resize",
    category: "photoshop",
    title: "Social Media Batch Resizer",
    desc: "Select a folder of images — this script auto-resizes and exports for Instagram (1:1, 4:5, 16:9), YouTube thumbnail (1280×720), Facebook cover, and WhatsApp status in one go.",
    tags: ["Batch", "Social Media", "Export"],
    format: ".jsx Script",
    size: "9 KB",
    emoji: "📱",
    badge: "Popular",
    badgeColor: "#2E6B3E",
    downloadUrl: "/downloads/ps-batch-resize.zip",
  },
  {
    id: "ps-layer-organiser",
    category: "photoshop",
    title: "Layer Auto-Organiser",
    desc: "Scans your document and auto-groups layers by naming convention (bg_, txt_, icon_). Creates colour-coded group folders and labels. Saves enormous time on complex PSDs.",
    tags: ["Layers", "Organisation", "Workflow"],
    format: ".jsx Script",
    size: "11 KB",
    emoji: "📂",
    badge: null,
    badgeColor: null,
    downloadUrl: "/downloads/ps-layer-organiser.zip",
  },
  {
    id: "ps-kannadafont",
    category: "photoshop",
    title: "Kannada Typography Kit",
    desc: "A curated set of Kannada font pairings with matching character styles pre-installed in Photoshop. Includes brand guidelines for Kannada–English mixed typesetting.",
    tags: ["Typography", "Kannada", "Fonts"],
    format: ".jsx + .ase Swatches",
    size: "4.2 MB",
    emoji: "ಕ",
    badge: "Exclusive",
    badgeColor: "#8B2500",
    downloadUrl: "/downloads/ps-kannadafont.zip",
  },
  {
    id: "ps-watermark",
    category: "photoshop",
    title: "Smart Watermark Stamper",
    desc: "Batch-stamp your logo or text watermark onto hundreds of photos at once. Supports position control, opacity, and size scaling relative to image dimensions.",
    tags: ["Watermark", "Batch", "Branding"],
    format: ".jsx Script",
    size: "7 KB",
    emoji: "©️",
    badge: null,
    badgeColor: null,
    downloadUrl: "/downloads/ps-watermark.zip",
  },

  // ─ PREMIERE PRO ─
  {
    id: "pr-auto-captions",
    category: "premiere",
    title: "Auto Caption Animator",
    desc: "Converts your Premiere captions track into animated subtitle graphics — word-by-word highlight, karaoke style, or full-line popups. Synced to audio automatically.",
    tags: ["Captions", "Subtitles", "Animation"],
    format: ".jsx Script",
    size: "18 KB",
    emoji: "💬",
    badge: "Editor's Pick",
    badgeColor: "#5C3A00",
    downloadUrl: "/downloads/pr-auto-captions.zip",
  },
  {
    id: "pr-multicam-sync",
    category: "premiere",
    title: "Multi-Cam Audio Sync",
    desc: "Analyses audio waveforms across multiple clips and syncs them to a reference track automatically. Saves hours in wedding and event editing workflows.",
    tags: ["Multicam", "Audio", "Sync"],
    format: ".jsx Script",
    size: "22 KB",
    emoji: "🎙️",
    badge: "New",
    badgeColor: "#8B2500",
    downloadUrl: "/downloads/pr-multicam-sync.zip",
  },
  {
    id: "pr-cut-to-beat",
    category: "premiere",
    title: "Cut to Beat",
    desc: "Analyses the BPM of your audio track and auto-creates markers at every beat. Then trim your clips to those markers. Perfect for reels, music videos, and trailers.",
    tags: ["Beats", "Music", "Auto-Edit"],
    format: ".jsx Script",
    size: "14 KB",
    emoji: "🥁",
    badge: "Popular",
    badgeColor: "#2E6B3E",
    downloadUrl: "/downloads/pr-cut-to-beat.zip",
  },

  // ─ TEMPLATES ─
  {
    id: "tpl-karnataka-reel",
    category: "templates",
    title: "Karnataka Reel Template Pack",
    desc: "10 fully-customisable After Effects reel templates inspired by Karnataka's landmarks — Hampi ruins, Coorg fog, Jog Falls cascade, and Belur temple. 9:16 and 16:9 versions included.",
    tags: ["Reels", "Karnataka", "Social"],
    format: ".aep Project",
    size: "420 MB",
    emoji: "📽️",
    badge: "Free Pack",
    badgeColor: "#7B4F00",
    downloadUrl: "/downloads/tpl-karnataka-reel.zip",
  },
  {
    id: "tpl-youtube-kit",
    category: "templates",
    title: "YouTube Channel Kit",
    desc: "Complete Premiere Pro project template for a YouTube channel — intro animation, lower thirds, end screen, social outro, and thumbnail Photoshop templates in one bundle.",
    tags: ["YouTube", "Branding", "Kit"],
    format: ".prproj + .psd",
    size: "280 MB",
    emoji: "📺",
    badge: "Editor's Pick",
    badgeColor: "#5C3A00",
    downloadUrl: "/downloads/tpl-youtube-kit.zip",
  },
  {
    id: "tpl-wedding-pack",
    category: "templates",
    title: "South Indian Wedding Pack",
    desc: "Beautiful South Indian wedding film template — ceremony reveal, pre-wedding montage, Mehendi and Sangeeth sequences, with Carnatic music-sync markers. Traditional + modern aesthetic.",
    tags: ["Wedding", "South Indian", "Film"],
    format: ".prproj + .aep",
    size: "1.1 GB",
    emoji: "💍",
    badge: "Exclusive",
    badgeColor: "#8B2500",
    downloadUrl: "/downloads/tpl-wedding-pack.zip",
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function CreativeToolsPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [search, setSearch] = useState("")

  const filtered = TOOLS.filter(t => {
    const matchCat = activeCategory === "all" || t.category === activeCategory
    const matchSearch = search === "" ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.desc.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    return matchCat && matchSearch
  })

  return (
    <div style={{ background: "var(--bg-primary)" }}>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ minHeight: 360 }}>
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, #0a0500 0%, #1a0900 40%, #2d1500 100%)"
        }} />
        {/* Animated grid pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 25% 25%, rgba(201,168,76,0.08) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(201,168,76,0.05) 0%, transparent 50%)",
        }} />
        <div className="absolute inset-0 flex items-center content-container">
          <div className="max-w-2xl py-20">
            <div className="flex items-center gap-3 mb-5">
              <span className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: "rgba(201,168,76,0.2)", color: "var(--primary)", border: "1px solid rgba(201,168,76,0.4)" }}>
                🎬 100% FREE · Always
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-shimmer" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              Free Creative Tools<br />
              by Venkatesh Narasimha
            </h1>
            <p className="text-base leading-relaxed mb-3" style={{ color: "rgba(255,248,231,0.82)" }}>
              Scripts, presets, and project templates for After Effects, Photoshop, and Premiere Pro —
              crafted by a professional motion graphics designer and given to the world, completely free.
            </p>
            <p className="text-sm" style={{ color: "rgba(255,248,231,0.5)" }}>
              No sign-up. No email wall. No watermarks. Just download and create.
            </p>
          </div>
        </div>
      </section>

      <div className="temple-border" />

      {/* ── STATS ── */}
      <section style={{ background: "var(--bg-section-alt)" }}>
        <div className="content-container py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { num: "15+", label: "Scripts & Tools" },
              { num: "3", label: "Software Platforms" },
              { num: "₹0", label: "Cost — Always Free" },
              { num: "∞", label: "Commercial Use OK" },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl sm:text-4xl font-extrabold text-shimmer" style={{ fontFamily: "'Baloo 2', sans-serif" }}>{s.num}</p>
                <p className="text-xs mt-1 font-semibold" style={{ color: "var(--text-muted)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FILTERS + SEARCH ── */}
      <section className="content-container py-10">
        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search scripts, effects, tools…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-5 py-3.5 rounded-2xl text-sm font-medium outline-none transition-all"
              style={{
                background: "var(--bg-card)",
                border: "1.5px solid var(--border)",
                color: "var(--text-primary)",
              }}
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2.5 justify-center mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200"
              style={{
                background: activeCategory === cat.id ? "var(--gradient-btn)" : "var(--bg-card)",
                color: activeCategory === cat.id ? "#FFF8E7" : "var(--text-muted)",
                border: `1.5px solid ${activeCategory === cat.id ? "transparent" : "var(--border)"}`,
                boxShadow: activeCategory === cat.id ? "0 4px 16px rgba(201,168,76,0.3)" : "none",
              }}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="font-bold text-lg" style={{ color: "var(--text-muted)" }}>No tools match your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((tool, i) => (
              <div
                key={tool.id}
                className="heritage-card p-7 flex flex-col animate-slide-up relative overflow-hidden"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                {/* Badge */}
                {tool.badge && (
                  <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black text-white"
                    style={{ background: tool.badgeColor ?? "#5C3A00" }}>
                    {tool.badge}
                  </span>
                )}

                {/* Icon + title */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-3xl flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.2)" }}>
                    {tool.emoji}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base leading-snug" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--text-primary)" }}>
                      {tool.title}
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {tool.format} · {tool.size}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: "var(--text-muted)" }}>
                  {tool.desc}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {tool.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                      style={{ background: "rgba(201,168,76,0.1)", color: "var(--primary)" }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Download CTA */}
                <a
                  href={tool.downloadUrl}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all duration-200"
                  style={{
                    background: "var(--gradient-btn)",
                    color: "#FFF8E7",
                    boxShadow: "0 4px 14px rgba(201,168,76,0.25)",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(201,168,76,0.4)" }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 14px rgba(201,168,76,0.25)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download Free
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── HOW TO USE ── */}
      <section style={{ background: "var(--bg-section-alt)" }}>
        <div className="temple-border-thin" />
        <div className="content-container py-16">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Getting Started</p>
            <h2 className="section-heading text-2xl sm:text-3xl">How to Use These Scripts</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { step: "01", title: "Download the Script", desc: "Click 'Download Free' — no sign-up needed. You'll get a .jsx, .aep, .prproj, or .psd file." },
              { step: "02", title: "Place in Scripts Folder", desc: "For .jsx scripts: in AE/Premiere go to File → Scripts → Browse… and navigate to the downloaded file. Or place in the /Scripts/ folder of your application." },
              { step: "03", title: "Run & Create", desc: "Open your project and run the script. Each script has inline instructions. Start creating — completely free, forever." },
            ].map(s => (
              <div key={s.step} className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-black mx-auto mb-4"
                  style={{ background: "var(--gradient-gold-btn)", color: "var(--bg-primary)", fontFamily: "'Baloo 2', sans-serif" }}>
                  {s.step}
                </div>
                <h3 className="font-bold text-base mb-2" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--text-primary)" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="temple-border-thin" />
      </section>

      {/* ── LICENSE NOTE ── */}
      <section className="content-container py-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="heritage-card p-8">
            <p className="text-3xl mb-4">🕊️</p>
            <h3 className="font-extrabold text-xl mb-3" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--primary)" }}>
              Free to Use. Free to Share.
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              All scripts and templates on this page are released under the <strong style={{ color: "var(--text-primary)" }}>Creative Commons CC0 licence</strong>. 
              You can use them personally, commercially, modify them, and share them — with zero attribution required.
              <br /><br />
              This is Venkatesh Narasimha's gift to the global creator community.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="content-container py-12 text-center">
        <h2 className="text-2xl font-extrabold mb-4" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--text-primary)" }}>
          Want to Contribute a Script?
        </h2>
        <p className="text-base mb-6 max-w-lg mx-auto" style={{ color: "var(--text-muted)" }}>
          If you have an After Effects, Photoshop, or Premiere script that you'd like to share with the community, reach out and we'll feature it here for free.
        </p>
        <Link href="/contact">
          <button className="btn-primary px-8 py-3.5">Get in Touch</button>
        </Link>
      </section>

    </div>
  )
}
