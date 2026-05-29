"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"
import { JATRA_DATA, type Jatra } from "@lib/data/jatras"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Section, Column, Widget } from "@lib/default-layout"

const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

const LOTTIE_CELEBRATION = "https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.json"

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

function getActiveOrUpcomingJatras(): Jatra[] {
  const currentMonthIdx = new Date().getMonth()
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

function getStyles(style: Record<string, any> = {}): React.CSSProperties {
  const styles: React.CSSProperties = {}
  if (style.textColor) styles.color = style.textColor
  if (style.backgroundColor) styles.backgroundColor = style.backgroundColor
  if (style.fontSize) styles.fontSize = style.fontSize
  if (style.fontWeight) styles.fontWeight = style.fontWeight as any
  if (style.alignment) styles.textAlign = style.alignment as any
  if (style.lineHeight) styles.lineHeight = style.lineHeight
  if (style.letterSpacing) styles.letterSpacing = style.letterSpacing
  if (style.textTransform) styles.textTransform = style.textTransform as any
  if (style.marginTop) styles.marginTop = style.marginTop
  if (style.marginBottom) styles.marginBottom = style.marginBottom
  if (style.marginLeft) styles.marginLeft = style.marginLeft
  if (style.marginRight) styles.marginRight = style.marginRight
  if (style.paddingTop) styles.paddingTop = style.paddingTop
  if (style.paddingBottom) styles.paddingBottom = style.paddingBottom
  if (style.paddingLeft) styles.paddingLeft = style.paddingLeft
  if (style.paddingRight) styles.paddingRight = style.paddingRight
  if (style.borderRadius) styles.borderRadius = style.borderRadius
  if (style.borderWidth) styles.borderWidth = style.borderWidth
  if (style.borderColor) styles.borderColor = style.borderColor
  if (style.borderStyle) styles.borderStyle = style.borderStyle
  if (style.boxShadow) styles.boxShadow = style.boxShadow
  if (style.maxWidth) styles.maxWidth = style.maxWidth
  if (style.height) styles.height = style.height
  return styles
}

export type DynamicRendererProps = {
  layout: Section[]
  isEditing?: boolean
  selectedId?: string | null
  onSelectElement?: (id: string, type: "section" | "column" | "widget") => void
  onInlineEdit?: (widgetId: string, field: string, value: string) => void
}

export default function DynamicRenderer({
  layout,
  isEditing = false,
  selectedId = null,
  onSelectElement,
  onInlineEdit,
}: DynamicRendererProps) {
  const [slides, setSlides] = useState<Jatra[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [updates, setUpdates] = useState<Record<string, any>>({})
  const [lottieData, setLottieData] = useState<object | null>(null)

  useEffect(() => {
    setSlides(getActiveOrUpcomingJatras())
    
    // Fetch live updates
    fetch("/api/jatra-updates")
      .then(res => res.json())
      .then(data => setUpdates(data))
      .catch(err => console.error("Error fetching live updates:", err))

    // Fetch Lottie
    fetch(LOTTIE_CELEBRATION)
      .then(r => r.json())
      .then(setLottieData)
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (slides.length === 0) return
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [slides.length])

  // Prevent link navigation if editing
  const handleLinkClick = (e: React.MouseEvent) => {
    if (isEditing) {
      e.preventDefault()
    }
  }

  // Render Widget
  const renderWidget = (widget: Widget, columnId: string) => {
    const { type, content, style, advanced } = widget
    const isSelected = selectedId === widget.id
    const widgetStyles = getStyles(style)
    const animationClass = advanced?.animation ? advanced.animation : ""

    const widgetWrapperProps = {
      id: widget.id,
      className: `widget-container relative group/widget transition-all ${animationClass} ${
        isEditing ? "hover:outline hover:outline-2 hover:outline-pink-500/50 cursor-pointer" : ""
      } ${isSelected ? "outline outline-2 outline-pink-500 z-10" : ""}`,
      onClick: (e: React.MouseEvent) => {
        if (isEditing && onSelectElement) {
          e.stopPropagation()
          onSelectElement(widget.id, "widget")
        }
      },
    }

    // Double click inline edit trigger
    const handleInlineBlur = (field: string) => (e: React.FocusEvent<HTMLDivElement>) => {
      if (isEditing && onInlineEdit) {
        onInlineEdit(widget.id, field, e.target.innerText)
      }
    }

    const inlineEditProps = (field: string) => ({
      contentEditable: isEditing,
      suppressContentEditableWarning: true,
      onBlur: handleInlineBlur(field),
      className: isEditing ? "focus:outline-none focus:bg-white/10 px-1 rounded border border-dashed border-zinc-500/30" : "",
    })

    switch (type) {
      case "heading": {
        const Tag = (content.tag || "h2") as keyof JSX.IntrinsicElements
        const headingText = content.text || "Heading Title"
        let headingClass = ""
        if (style.hasBottomBorder) headingClass += " section-heading"
        if (style.hasShimmerEffect) headingClass += " text-shimmer"

        return (
          <div {...widgetWrapperProps}>
            <Tag style={{ ...widgetStyles, fontFamily: "'Baloo 2', sans-serif" }} className={headingClass}>
              <span {...inlineEditProps("text")}>{headingText}</span>
            </Tag>
          </div>
        )
      }

      case "text-editor": {
        const text = content.text || "Text paragraph content here."
        return (
          <div {...widgetWrapperProps}>
            <div style={widgetStyles} className="leading-relaxed">
              <p {...inlineEditProps("text")}>{text}</p>
            </div>
          </div>
        )
      }

      case "button-group": {
        const buttons = content.buttons || []
        const gap = style.gap || "16px"
        return (
          <div {...widgetWrapperProps}>
            <div className="flex flex-wrap items-center" style={{ gap }}>
              {buttons.map((btn: any, idx: number) => {
                const btnClass = `btn-${btn.type || "primary"}`
                const isInternal = btn.link && btn.link.startsWith("/")
                
                const ButtonContent = () => (
                  <button 
                    disabled={isEditing}
                    className={`${btnClass} px-7 py-3 font-bold flex items-center gap-2 hover:scale-105 transition-transform`}
                  >
                    {btn.text}
                  </button>
                )

                if (isEditing) {
                  return (
                    <div key={idx} onClick={handleLinkClick}>
                      <ButtonContent />
                    </div>
                  )
                }

                return isInternal ? (
                  <LocalizedClientLink href={btn.link} key={idx}>
                    <ButtonContent />
                  </LocalizedClientLink>
                ) : (
                  <a href={btn.link || "#"} target="_blank" rel="noopener noreferrer" key={idx}>
                    <ButtonContent />
                  </a>
                )
              })}
            </div>
          </div>
        )
      }

      case "image": {
        const src = content.src || "/images/karnataka-farm.png"
        const alt = content.alt || "Farm Image"
        const hasOverlayBadge = !!content.badgeText
        const imgStyles = {
          borderRadius: style.borderRadius || "16px",
          borderWidth: style.borderWidth || "0px",
          borderColor: style.borderColor || "transparent",
          borderStyle: style.borderStyle || "none",
          width: "100%",
          height: style.height || "380px",
          position: "relative" as const,
        }

        return (
          <div {...widgetWrapperProps}>
            <div className="relative overflow-hidden about-image-wrapper" style={imgStyles}>
              <Image src={src} alt={alt} fill className="object-cover" />
              {hasOverlayBadge && (
                <div 
                  className="absolute bottom-4 left-4 right-4 px-5 py-3 rounded-xl"
                  style={{ background: "rgba(44,24,16,0.85)", backdropFilter: "blur(8px)" }}
                >
                  <p className="text-xs font-bold text-gradient-gold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                    {content.badgeText}
                  </p>
                  {content.badgeSubtext && (
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,248,231,0.75)" }}>
                      {content.badgeSubtext}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      }

      case "stats": {
        const statsItems = content.items || []
        const containerBg = style.backgroundColor || "var(--bg-header)"
        const numColor = style.numberColor || "var(--gold-bright)"
        const lblColor = style.textColor || "rgba(255,248,231,0.65)"

        return (
          <div {...widgetWrapperProps} style={{ background: containerBg }}>
            <div className="content-container py-4 sm:py-5">
              <div className="stats-bar-grid grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
                {statsItems.map((s: any, i: number) => (
                  <div key={i}>
                    <div className="text-2xl font-black" style={{ color: numColor, fontFamily: "'Baloo 2', sans-serif" }}>
                      {s.number}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: lblColor, fontFamily: "'Hind', sans-serif" }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      }

      case "categories-grid": {
        const categories = content.items || []
        return (
          <div {...widgetWrapperProps}>
            <div className="categories-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {categories.map((cat: any, i: number) => (
                <div key={i} onClick={handleLinkClick}>
                  <div className="category-card relative overflow-hidden rounded-2xl cursor-pointer border border-[#C9A84C]/30 h-52">
                    <div className="relative h-full w-full overflow-hidden">
                      <Image src={cat.image} alt={cat.label} fill className="object-cover transition-transform duration-500 hover:scale-110" />
                    </div>
                    <div className="category-overlay absolute inset-0 flex items-end p-5 bg-gradient-to-t from-black/80 to-transparent">
                      <div>
                        <p className="font-extrabold text-base mb-1" style={{ color: "#FFF8E7", fontFamily: "'Baloo 2', sans-serif" }}>
                          {cat.emoji} {cat.label}
                        </p>
                        <p className="text-xs text-white/70">{cat.desc}</p>
                        <span className="inline-block mt-2 text-xs font-bold" style={{ color: "var(--gold-bright)" }}>Explore →</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      }

      case "solutions": {
        const items = content.items || []
        return (
          <div {...widgetWrapperProps}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((s: any, i: number) => (
                <div key={i} className="heritage-card p-6 bg-white dark:bg-[#33190A] border border-[#C9A84C]/30 rounded-2xl shadow-md">
                  <div className="text-3xl mb-3">{s.icon}</div>
                  <p className="text-xs font-bold tracking-widest uppercase mb-1 text-zinc-500">PROBLEM</p>
                  <p className="font-bold mb-2 text-[#C0392B]" style={{ fontFamily: "'Baloo 2', sans-serif" }}>{s.problem}</p>
                  <div style={{ height: "1px", background: "rgba(201,168,76,0.2)", margin: "10px 0" }} />
                  <p className="text-xs font-bold tracking-widest uppercase mb-1 text-zinc-500">OUR SOLUTION</p>
                  <p className="text-sm font-semibold text-[#2E6B3E]">{s.solution}</p>
                  <button disabled={isEditing} className="mt-4 btn-green text-xs px-5 py-2">Shop Solution →</button>
                </div>
              ))}
            </div>
          </div>
        )
      }

      case "featured-products": {
        const items = content.items || []
        return (
          <div {...widgetWrapperProps}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((p: any, i: number) => (
                <div key={i} className="heritage-card p-6 bg-white dark:bg-[#33190A] border border-[#C9A84C]/30 rounded-2xl shadow-md">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{p.emoji}</div>
                    <span className={`tag-${p.tag === 'Bestseller' ? 'red' : p.tag === 'Premium' ? 'gold' : 'green'}`}>{p.tag}</span>
                  </div>
                  <h3 className="font-bold text-base mb-1" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--text-primary)" }}>{p.name}</h3>
                  <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>{p.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black" style={{ color: "var(--primary)", fontFamily: "'Baloo 2', sans-serif" }}>{p.price}</span>
                    <button disabled={isEditing} className="btn-primary text-xs px-4 py-2">Add to Cart</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      }

      case "promise": {
        const items = content.items || []
        return (
          <div {...widgetWrapperProps}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((w: any, i: number) => (
                <div key={i} className="p-6 rounded-2xl border border-amber-500/20" style={{ background: "rgba(255,248,231,0.07)" }}>
                  <div className="text-3xl mb-3">{w.icon}</div>
                  <h3 className="font-bold text-base mb-2 text-shimmer" style={{ fontFamily: "'Baloo 2', sans-serif" }}>{w.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-300">{w.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )
      }

      case "testimonials": {
        const items = content.items || []
        return (
          <div {...widgetWrapperProps}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {items.map((t: any, i: number) => (
                <div key={i} className="testimonial-card p-6 bg-white border border-[#C9A84C]/30 border-l-4 border-l-[#C9A84C] rounded-2xl shadow-md">
                  <div className="flex gap-1 mb-3">
                    {Array(t.stars).fill(0).map((_, j) => <span key={j} style={{ color: "var(--gold)" }}>★</span>)}
                  </div>
                  <p className="text-sm leading-relaxed mb-5 italic text-[#6B3A20]">"{t.text}"</p>
                  <div>
                    <p className="font-bold text-sm" style={{ fontFamily: "'Baloo 2', sans-serif", color: "var(--text-primary)" }}>{t.name}</p>
                    <p className="text-xs text-zinc-500">📍 {t.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      }

      case "newsletter": {
        const cardBg = style.backgroundColor || "var(--bg-header)"
        const cardBorder = style.borderColor || "rgba(201,168,76,0.3)"
        const cardBorderWidth = style.borderWidth || "2px"

        return (
          <div {...widgetWrapperProps}>
            <div 
              className="relative rounded-2xl overflow-hidden p-10 text-center border"
              style={{ background: cardBg, borderColor: cardBorder, borderWidth: cardBorderWidth }}
            >
              <div className="temple-border absolute top-0 left-0 right-0" />
              <p className="section-label mb-3" style={{ color: "rgba(255,248,231,0.6)" }}>{content.label}</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-shimmer mb-3" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                {content.title}
              </h2>
              <p className="text-sm mb-8 max-w-xl mx-auto text-zinc-200">
                {content.subtitle}
              </p>
              <div className="newsletter-form flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  disabled 
                  placeholder={content.placeholder} 
                  className="flex-1 min-w-0 px-5 py-3 rounded-full text-sm outline-none bg-white/10 border border-[#C9A84C]/40 text-[#FFF8E7]" 
                />
                <button disabled className="btn-gold px-7 py-3 rounded-full">{content.buttonText}</button>
              </div>
              <div className="temple-border absolute bottom-0 left-0 right-0" />
            </div>
          </div>
        )
      }

      case "jatra-carousel": {
        if (slides.length === 0) {
          return (
            <div className="relative w-full h-[500px] bg-zinc-950 flex items-center justify-center text-zinc-500">
              Loading sacred fair details...
            </div>
          )
        }

        const jatra = slides[currentSlide] || slides[0]
        if (!jatra) return null

        const update = updates[jatra.id]
        const currentMonthName = MONTHS[new Date().getMonth()]
        const isJatraActiveThisMonth = jatra.gregorianMonths.includes(currentMonthName)

        return (
          <div {...widgetWrapperProps}>
            <section className="hero-banner relative w-full overflow-hidden" style={{ minHeight: "min(700px, 100svh)" }}>
              {/* Slide Background */}
              <div className="absolute inset-0 transition-all duration-1000 ease-in-out">
                <Image
                  src={jatra.image}
                  alt={jatra.title}
                  fill
                  priority
                  className="object-cover object-center filter brightness-35 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120500] via-[#120500]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1E0900]/90 via-[#1E0900]/40 to-transparent" />
              </div>

              {/* Slider content */}
              <div className="absolute inset-0 flex items-center z-10">
                <div className="content-container w-full">
                  <div className="max-w-3xl py-10 sm:py-20 relative px-4">
                    {/* Badge */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      {isJatraActiveThisMonth ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white border border-red-400 animate-pulse">
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

                    {/* Kannada glow */}
                    <p className="text-xl sm:text-3xl text-amber-400 font-bold mb-3 tracking-wide" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                      {jatra.titleKannada}
                    </p>

                    {/* English Title */}
                    <h1 
                      className="font-extrabold leading-tight mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFEBB3] to-[#FF8C00]"
                      style={{ 
                        fontFamily: "'Baloo 2', sans-serif", 
                        fontSize: "clamp(1.8rem, 5.5vw, 3.8rem)", 
                        lineHeight: 1.15
                      }}
                    >
                      {jatra.title}
                    </h1>

                    {/* Summary */}
                    <p className="text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 text-[#FFF8E7]/90 max-w-xl" style={{ fontFamily: "'Hind', sans-serif" }}>
                      {jatra.summary}
                    </p>

                    {/* Live update dashboard feed */}
                    <div className="mb-6 sm:mb-8 max-w-xl rounded-2xl border border-[#FF8C00]/40 bg-gradient-to-br from-[#2D0F00]/95 to-[#1A0600]/95 p-4 sm:p-5 backdrop-blur-md">
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
                                  <span className="text-[#FFD700]">📅 Next Festival:</span> <span className="text-orange-300 font-semibold">{update.nextEvent}</span>
                                </p>
                                <p>
                                  <span className="text-[#FFD700]">🕒 Timings:</span> <span>6:00 AM - 9:00 PM</span>
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
                                  update.crowdStatus === 'Peak' || update.crowdStatus === 'VVIP' ? 'bg-red-950/80 text-red-400 border border-red-800' : 'bg-green-950/80 text-green-400 border border-green-800'
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
                          Connecting to temple live feeds...
                        </div>
                      )}
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-4">
                      <button onClick={handleLinkClick} className="btn-gold px-8 py-3.5 text-base font-bold flex items-center gap-2">
                        <span>🛕 View Sacred Details</span>
                        <span className="text-[14px]">→</span>
                      </button>
                      <button onClick={handleLinkClick} className="btn-ghost px-8 py-3.5 text-base border border-[#C9A84C]/50 hover:bg-[#C9A84C]/10 text-[#FFF8E7] backdrop-blur-sm">
                        Explore All Fairs
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slide dots */}
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

              {/* Lottie celebration element */}
              {lottieData && (
                <div className="absolute bottom-4 right-6 hidden lg:block z-20" style={{ width: 160, height: 160, opacity: 0.9, pointerEvents: "none" }}>
                  <Lottie animationData={lottieData} loop autoplay />
                </div>
              )}
            </section>
            
            {/* Temple border line */}
            <div className="temple-border" />
          </div>
        )
      }

      default:
        return (
          <div className="p-4 border border-red-500 rounded text-center text-red-500 bg-red-100">
            Unknown Widget Type: {type}
          </div>
        )
    }
  }

  return (
    <div className="dynamic-visual-layout w-full min-h-screen">
      {layout.map((section: Section) => {
        const isSecSelected = selectedId === section.id
        const sectionStyles = getStyles(section.style)
        const secAnimationClass = section.advanced?.animation ? section.advanced.animation : ""

        return (
          <section
            key={section.id}
            id={section.id}
            style={sectionStyles}
            onClick={(e: React.MouseEvent) => {
              if (isEditing && onSelectElement) {
                e.stopPropagation()
                onSelectElement(section.id, "section")
              }
            }}
            className={`visual-section relative transition-all ${secAnimationClass} ${
              isEditing ? "hover:outline hover:outline-2 hover:outline-blue-500/50" : ""
            } ${isSecSelected ? "outline outline-3 outline-blue-500 z-10" : ""}`}
          >
            {/* Section Controls Toolbar inside Visual Editor */}
            {isEditing && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden group-hover/section:flex items-center gap-1.5 px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-bold shadow-lg z-30">
                <span>Section</span>
              </div>
            )}

            <div className="content-container">
              <div className="flex flex-col md:flex-row w-full items-stretch">
                {section.columns.map((column: Column) => {
                  const isColSelected = selectedId === column.id
                  const colStyles = getStyles(column.style)
                  const widthStyle = { width: `${column.width}%` }

                  return (
                    <div
                      key={column.id}
                      id={column.id}
                      style={{ ...colStyles, ...widthStyle }}
                      onClick={(e: React.MouseEvent) => {
                        if (isEditing && onSelectElement) {
                          e.stopPropagation()
                          onSelectElement(column.id, "column")
                        }
                      }}
                      className={`visual-column relative flex flex-col justify-start transition-all ${
                        isEditing ? "hover:outline hover:outline-2 hover:outline-sky-400/50" : ""
                      } ${isColSelected ? "outline outline-2 outline-sky-400 z-10" : ""}`}
                    >
                      {column.widgets.map((widget: Widget) => (
                        <div key={widget.id} className="w-full">
                          {renderWidget(widget, column.id)}
                        </div>
                      ))}

                      {/* Drag drop mockup area in Column */}
                      {isEditing && column.widgets.length === 0 && (
                        <div className="p-8 border border-dashed border-zinc-500/30 rounded-xl flex flex-col items-center justify-center text-zinc-500 text-xs gap-1 min-h-[100px] hover:bg-zinc-500/5 transition-all">
                          <span className="text-xl">➕</span>
                          <span>Drag widgets here</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
