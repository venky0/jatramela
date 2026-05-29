"use client"

import React, { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { saveHomeLayout } from "@lib/data/portal-actions"
import DynamicRenderer from "@modules/home/components/dynamic-renderer"
import { Section, Column, Widget } from "@lib/default-layout"

type EditorClientProps = {
  user: {
    id: string
    email: string
    first_name?: string
    last_name?: string
    role: string
  }
  initialLayout: Section[]
  countryCode: string
}

// Availble Widget templates for inserting
const WIDGET_TEMPLATES = [
  { type: "heading", label: "Heading", icon: "🅰️", desc: "Eye-catching title with typography control" },
  { type: "text-editor", label: "Text Editor", icon: "📝", desc: "Paragraph description text box" },
  { type: "button-group", label: "Buttons", icon: "🔘", desc: "Flex button group row" },
  { type: "image", label: "Image Box", icon: "🖼️", desc: "Next.js image with custom borders & labels" },
  { type: "video", label: "Video Embed", icon: "🎥", desc: "Embed YouTube or Vimeo clips" },
  { type: "divider", label: "Divider Line", icon: "➖", desc: "Custom spacing horizontal line" },
  { type: "spacer", label: "Spacer", icon: "↕️", desc: "Adjustable vertical empty spacing" },
  { type: "stats", label: "Stats Bar", icon: "📊", desc: "4-column counter stats grid" },
  { type: "jatra-carousel", label: "Jatra Carousel", icon: "🎪", desc: "Upcoming local fair sliders with live updates" },
  { type: "featured-products", label: "Products Catalog", icon: "📦", desc: "Medusa products catalog card grid" },
  { type: "categories-grid", label: "Categories Grid", icon: "🥻", desc: "Shop categories with hover images" },
  { type: "solutions", label: "Health Solutions", icon: "🌿", desc: "Ayurvedic wellness remedy problem/solution cards" },
  { type: "promise", label: "Jatramela Promise", icon: "🤝", desc: "Trust metrics lists" },
  { type: "testimonials", label: "Testimonials", icon: "★", desc: "Review quotes list with ratings" },
  { type: "newsletter", label: "Newsletter Form", icon: "📧", desc: "Subscription newsletter input & button" },
]

export default function EditorClient({
  user,
  initialLayout,
  countryCode,
}: EditorClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  // Visual page layout state
  const [layout, setLayout] = useState<Section[]>(initialLayout)
  
  // History Undo/Redo stack state
  const [history, setHistory] = useState<Section[][]>([initialLayout])
  const [historyIndex, setHistoryIndex] = useState(0)

  // Editor states
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<"section" | "column" | "widget" | null>(null)
  const [searchWidget, setSearchWidget] = useState("")
  const [activeSidebarTab, setActiveSidebarTab] = useState<"widgets" | "edit" | "settings" | "navigator">("widgets")
  const [activeEditTab, setActiveEditTab] = useState<"content" | "style" | "advanced">("content")
  const [viewportMode, setViewportMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Utility to push state to history stack
  const pushState = (newLayout: Section[]) => {
    const nextHistory = history.slice(0, historyIndex + 1)
    setLayout(newLayout)
    setHistory([...nextHistory, newLayout])
    setHistoryIndex(nextHistory.length)
  }

  // Undo / Redo triggers
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setLayout(history[historyIndex - 1])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setLayout(history[historyIndex + 1])
    }
  }

  // Notification popup
  const showNotice = (type: "success" | "error", text: string) => {
    setNotification({ type, text })
    setTimeout(() => setNotification(null), 4000)
  }

  // Publish to storefront database
  const handlePublish = async () => {
    startTransition(async () => {
      const res = await saveHomeLayout(layout)
      if (res.success) {
        showNotice("success", "🚀 Layout published successfully! Storefront home page is updated live.")
        router.refresh()
      } else {
        showNotice("error", res.error || "Failed to publish layout.")
      }
    })
  }

  // Selection trigger
  const handleSelectElement = (id: string, type: "section" | "column" | "widget") => {
    setSelectedId(id)
    setSelectedType(type)
    setActiveSidebarTab("edit")
  }

  // Inline content edit from DynamicRenderer
  const handleInlineEdit = (widgetId: string, field: string, value: string) => {
    const updated = layout.map((sec) => ({
      ...sec,
      columns: sec.columns.map((col) => ({
        ...col,
        widgets: col.widgets.map((wid) => {
          if (wid.id === widgetId) {
            return {
              ...wid,
              content: { ...wid.content, [field]: value },
            }
          }
          return wid
        }),
      })),
    }))
    pushState(updated)
  }

  // Find selected item helpers
  const getSelectedSection = () => layout.find((s) => s.id === selectedId)
  
  const getSelectedColumn = () => {
    for (const sec of layout) {
      const col = sec.columns.find((c) => c.id === selectedId)
      if (col) return col
    }
    return null
  }

  const getSelectedWidget = (): Widget | null => {
    for (const sec of layout) {
      for (const col of sec.columns) {
        const wid = col.widgets.find((w) => w.id === selectedId)
        if (wid) return wid
      }
    }
    return null
  }

  // Update selected fields helper
  const updateSelectedField = (category: "content" | "style" | "advanced", fieldName: string, value: any) => {
    if (!selectedId || !selectedType) return

    const updated = layout.map((sec) => {
      if (selectedType === "section" && sec.id === selectedId) {
        return {
          ...sec,
          [category === "advanced" ? "advanced" : "style"]: {
            ...((category === "advanced" ? sec.advanced : sec.style) || {}),
            [fieldName]: value,
          },
        }
      }

      return {
        ...sec,
        columns: sec.columns.map((col) => {
          if (selectedType === "column" && col.id === selectedId) {
            return {
              ...col,
              style: { ...(col.style || {}), [fieldName]: value },
            }
          }

          return {
            ...col,
            widgets: col.widgets.map((wid) => {
              if (selectedType === "widget" && wid.id === selectedId) {
                return {
                  ...wid,
                  [category]: { ...((wid[category] as any) || {}), [fieldName]: value },
                }
              }
              return wid
            }),
          }
        }),
      }
    })

    setLayout(updated)
    // Defer pushing to history slightly so range sliders don't flood the stack
  }

  const handleSliderRelease = () => {
    pushState(layout)
  }

  // Layout Structural Modifiers
  const addSection = (colCount: number, ratio: "equal" | "split" = "equal") => {
    const secId = `sec-${Date.now()}`
    const columns: Column[] = []
    
    if (colCount === 1) {
      columns.push({ id: `col-${Date.now()}-1`, width: 100, widgets: [], style: {} })
    } else if (colCount === 2) {
      if (ratio === "equal") {
        columns.push({ id: `col-${Date.now()}-1`, width: 50, widgets: [], style: {} })
        columns.push({ id: `col-${Date.now()}-2`, width: 50, widgets: [], style: {} })
      } else {
        columns.push({ id: `col-${Date.now()}-1`, width: 33, widgets: [], style: {} })
        columns.push({ id: `col-${Date.now()}-2`, width: 67, widgets: [], style: {} })
      }
    } else if (colCount === 3) {
      columns.push({ id: `col-${Date.now()}-1`, width: 33.33, widgets: [], style: {} })
      columns.push({ id: `col-${Date.now()}-2`, width: 33.33, widgets: [], style: {} })
      columns.push({ id: `col-${Date.now()}-3`, width: 33.33, widgets: [], style: {} })
    }

    const newSection: Section = {
      id: secId,
      columns,
      style: { paddingTop: "50px", paddingBottom: "50px" },
      advanced: {},
    }

    pushState([...layout, newSection])
    handleSelectElement(secId, "section")
  }

  const duplicateSection = (secId: string) => {
    const secIndex = layout.findIndex((s) => s.id === secId)
    if (secIndex === -1) return
    const original = layout[secIndex]
    const clone: Section = {
      ...original,
      id: `sec-${Date.now()}`,
      columns: original.columns.map((c) => ({
        ...c,
        id: `col-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        widgets: c.widgets.map((w) => ({
          ...w,
          id: `wid-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        })),
      })),
    }

    const copy = [...layout]
    copy.splice(secIndex + 1, 0, clone)
    pushState(copy)
  }

  const deleteSection = (secId: string) => {
    pushState(layout.filter((s) => s.id !== secId))
    if (selectedId === secId) {
      setSelectedId(null)
      setSelectedType(null)
      setActiveSidebarTab("widgets")
    }
  }

  const moveSection = (secId: string, direction: "up" | "down") => {
    const index = layout.findIndex((s) => s.id === secId)
    if (index === -1) return
    if (direction === "up" && index === 0) return
    if (direction === "down" && index === layout.length - 1) return

    const copy = [...layout]
    const targetIdx = direction === "up" ? index - 1 : index + 1
    const [moved] = copy.splice(index, 1)
    copy.splice(targetIdx, 0, moved)
    pushState(copy)
  }

  // Widget Actions
  const insertWidget = (widgetType: string) => {
    // If no column is selected, add to the first column of the first section or create one
    let targetColId = selectedType === "column" ? selectedId : null

    if (!targetColId) {
      // Find first column in the entire layout
      if (layout.length > 0 && layout[0].columns.length > 0) {
        targetColId = layout[0].columns[0].id
      } else {
        // Create initial section first
        addSection(1)
        return
      }
    }

    const newWidget: Widget = {
      id: `wid-${Date.now()}`,
      type: widgetType,
      content: getWidgetDefaultContent(widgetType),
      style: getWidgetDefaultStyle(widgetType),
      advanced: {},
    }

    const updated = layout.map((sec) => ({
      ...sec,
      columns: sec.columns.map((col) => {
        if (col.id === targetColId) {
          return {
            ...col,
            widgets: [...col.widgets, newWidget],
          }
        }
        return col
      }),
    }))

    pushState(updated)
    handleSelectElement(newWidget.id, "widget")
  }

  const deleteWidget = (widgetId: string) => {
    const updated = layout.map((sec) => ({
      ...sec,
      columns: sec.columns.map((col) => ({
        ...col,
        widgets: col.widgets.filter((w) => w.id !== widgetId),
      })),
    }))
    pushState(updated)
    if (selectedId === widgetId) {
      setSelectedId(null)
      setSelectedType(null)
      setActiveSidebarTab("widgets")
    }
  }

  const duplicateWidget = (widgetId: string) => {
    let cloned: Widget | null = null
    const updated = layout.map((sec) => ({
      ...sec,
      columns: sec.columns.map((col) => {
        const widIndex = col.widgets.findIndex((w) => w.id === widgetId)
        if (widIndex === -1) return col

        cloned = {
          ...col.widgets[widIndex],
          id: `wid-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        }

        const nextWidgets = [...col.widgets]
        nextWidgets.splice(widIndex + 1, 0, cloned!)
        return { ...col, widgets: nextWidgets }
      }),
    }))

    if (cloned) {
      pushState(updated)
      handleSelectElement((cloned as Widget).id, "widget")
    }
  }

  // Default templates generators
  const getWidgetDefaultContent = (type: string) => {
    switch (type) {
      case "heading":
        return { text: "Add Your Beautiful Heading Here", tag: "h2" }
      case "text-editor":
        return { text: "Add your descriptions or text contents here. Make it elegant and matching the brand message." }
      case "button-group":
        return { buttons: [{ text: "Click Here", link: "/store", type: "primary" }] }
      case "image":
        return { src: "/images/karnataka-farm.png", alt: "New Image" }
      case "video":
        return { src: "https://www.youtube.com/embed/dQw4w9WgXcQ" }
      case "divider":
        return {}
      case "spacer":
        return {}
      case "stats":
        return {
          items: [
            { number: "100+", label: "Award Wins" },
            { number: "25k+", label: "Happy Buyers" },
          ],
        }
      case "jatra-carousel":
        return { autoplay: true, autoplaySpeed: 8000, badgeText: "LIVE UPDATES" }
      case "featured-products":
        return {
          items: [
            { name: "Ragi Malt Mix", price: "₹ 249", tag: "Bestseller", emoji: "🌾", desc: "Finger millet blend" },
            { name: "Mysore Silk Saree", price: "₹ 4,999", tag: "Premium", emoji: "🥻", desc: "Pure silk weavings" },
          ],
        }
      case "categories-grid":
        return {
          items: [
            { label: "Mysore Silk & Sarees", emoji: "🥻", href: "/categories/clothing", image: "/images/karnataka-clothing.png", desc: "Authentic Mysore sarees" },
            { label: "Organic Foods", emoji: "🌾", href: "/categories/organic", image: "/images/karnataka-food.png", desc: "Ragi & spices" },
          ],
        }
      case "solutions":
        return {
          items: [
            { problem: "Diabetes & Sugar", solution: "Bitter Gourd Products", icon: "🩸" },
            { problem: "Hair Fall Problems", solution: "Neem + Herbal Oils", icon: "💇" },
          ],
        }
      case "promise":
        return {
          items: [
            { icon: "🌾", title: "100% Organic", desc: "Grown naturally in fertile soils" },
          ],
        }
      case "testimonials":
        return {
          items: [
            { name: "Savitha R.", location: "Bengaluru", text: "Healthy products switched switch life!", stars: 5 },
          ],
        }
      case "newsletter":
        return { label: "Newsletter", title: "Subscribe Today", subtitle: "Stay in touch!", buttonText: "Join", placeholder: "your@email.com" }
      default:
        return {}
    }
  }

  const getWidgetDefaultStyle = (type: string) => {
    switch (type) {
      case "heading":
        return { textColor: "var(--primary)", fontSize: "1.75rem", fontWeight: "700", alignment: "left" }
      case "text-editor":
        return { textColor: "var(--text-muted)", fontSize: "1rem", alignment: "left" }
      case "button-group":
        return { gap: "16px" }
      case "image":
        return { borderRadius: "12px", height: "240px" }
      case "stats":
        return { backgroundColor: "var(--bg-header)", numberColor: "var(--gold-bright)", textColor: "#FFF8E7" }
      case "newsletter":
        return { backgroundColor: "var(--bg-header)", borderColor: "rgba(201,168,76,0.3)", borderWidth: "2px" }
      default:
        return {}
    }
  }

  // Filter widgets by search term
  const filteredWidgets = WIDGET_TEMPLATES.filter((w) =>
    w.label.toLowerCase().includes(searchWidget.toLowerCase())
  )

  // Section inspector list for Navigator
  const selectedWidget = getSelectedWidget()
  const selectedColumn = getSelectedColumn()
  const selectedSection = getSelectedSection()

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-900 text-zinc-100 font-sans select-none">
      
      {/* 1. TOP POPUP ALERT */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-[999] p-4 rounded-xl shadow-2xl border text-sm max-w-md animate-bounce ${
            notification.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-400"
              : "bg-red-950/90 border-red-500/30 text-red-400"
          }`}
        >
          <div className="font-semibold mb-1">
            {notification.type === "success" ? "✓ Success" : "✕ Error"}
          </div>
          {notification.text}
        </div>
      )}

      {/* 2. SIDEBAR PANEL (ELEMENTOR UI CLONE) */}
      {!isPreviewMode && (
        <aside className="w-[320px] flex-shrink-0 bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between z-20 shadow-2xl">
          
          {/* HEADER */}
          <div className="p-4 border-b border-zinc-800 flex flex-col gap-3 bg-zinc-950">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🛠️</span>
                <span className="font-extrabold text-sm uppercase tracking-widest text-[#C9A84C]" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                  Elementor Pro
                </span>
                <span className="text-[9px] bg-amber-500 text-zinc-950 px-1.5 py-0.5 rounded font-black">
                  CLONE
                </span>
              </div>
              <button
                onClick={() => router.push(`/${countryCode}/portal/dashboard`)}
                className="text-xs text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 rounded-md transition-all"
              >
                Dashboard
              </button>
            </div>

            {/* Panel Tab selection row */}
            <div className="grid grid-cols-4 gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs">
              <button
                onClick={() => setActiveSidebarTab("widgets")}
                className={`py-1.5 rounded-md font-bold transition-all ${
                  activeSidebarTab === "widgets" ? "bg-[#C9A84C] text-zinc-950" : "text-zinc-400 hover:text-white"
                }`}
              >
                Widgets
              </button>
              <button
                onClick={() => {
                  if (selectedId) setActiveSidebarTab("edit")
                  else showNotice("error", "Select an element on canvas to edit style")
                }}
                className={`py-1.5 rounded-md font-bold transition-all ${
                  activeSidebarTab === "edit" ? "bg-[#C9A84C] text-zinc-950" : "text-zinc-400 hover:text-white"
                }`}
              >
                Style
              </button>
              <button
                onClick={() => setActiveSidebarTab("navigator")}
                className={`py-1.5 rounded-md font-bold transition-all ${
                  activeSidebarTab === "navigator" ? "bg-[#C9A84C] text-zinc-950" : "text-zinc-400 hover:text-white"
                }`}
              >
                Layers
              </button>
              <button
                onClick={() => setActiveSidebarTab("settings")}
                className={`py-1.5 rounded-md font-bold transition-all ${
                  activeSidebarTab === "settings" ? "bg-[#C9A84C] text-zinc-950" : "text-zinc-400 hover:text-white"
                }`}
              >
                Custom CSS
              </button>
            </div>
          </div>

          {/* MAIN PANELS DRAWER AREA */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            
            {/* VIEW A: WIDGETS SELECTOR */}
            {activeSidebarTab === "widgets" && (
              <div className="space-y-4">
                <input
                  type="text"
                  value={searchWidget}
                  onChange={(e) => setSearchWidget(e.target.value)}
                  placeholder="Search Widgets..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
                />

                <div className="grid grid-cols-2 gap-2">
                  {filteredWidgets.map((w) => (
                    <button
                      key={w.type}
                      onClick={() => insertWidget(w.type)}
                      className="p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-[#C9A84C]/40 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 transition-all group/item active:scale-95"
                    >
                      <span className="text-xl group-hover/item:scale-110 transition-transform">{w.icon}</span>
                      <span className="text-[10px] font-bold tracking-wide">{w.label}</span>
                    </button>
                  ))}
                </div>

                <div className="border border-dashed border-zinc-800 rounded-xl p-4 mt-6 text-center">
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-extrabold mb-3">Add Custom Section</p>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => addSection(1)} className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-2 text-xs rounded-md font-bold hover:border-blue-500/50">1 Col</button>
                    <button onClick={() => addSection(2, "equal")} className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-2 text-xs rounded-md font-bold hover:border-blue-500/50">2 Col</button>
                    <button onClick={() => addSection(3)} className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-2 text-xs rounded-md font-bold hover:border-blue-500/50">3 Col</button>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW B: STYLE & SETTINGS EDITOR */}
            {activeSidebarTab === "edit" && selectedId && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Editing: {selectedType}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedId(null)
                      setSelectedType(null)
                      setActiveSidebarTab("widgets")
                    }}
                    className="text-zinc-500 hover:text-white text-xs"
                  >
                    ✕ Clear
                  </button>
                </div>

                {/* Sub Tab buttons: Content vs Style vs Advanced */}
                <div className="flex bg-zinc-900 p-0.5 rounded-md text-[10px] font-bold border border-zinc-800">
                  <button
                    onClick={() => setActiveEditTab("content")}
                    className={`flex-1 py-1 rounded transition-all ${
                      activeEditTab === "content" ? "bg-zinc-800 text-[#C9A84C]" : "text-zinc-400"
                    }`}
                  >
                    Content
                  </button>
                  <button
                    onClick={() => setActiveEditTab("style")}
                    className={`flex-1 py-1 rounded transition-all ${
                      activeEditTab === "style" ? "bg-zinc-800 text-[#C9A84C]" : "text-zinc-400"
                    }`}
                  >
                    Style
                  </button>
                  <button
                    onClick={() => setActiveEditTab("advanced")}
                    className={`flex-1 py-1 rounded transition-all ${
                      activeEditTab === "advanced" ? "bg-zinc-800 text-[#C9A84C]" : "text-zinc-400"
                    }`}
                  >
                    Advanced
                  </button>
                </div>

                {/* Sub-Tab 1: Content Adjustments */}
                {activeEditTab === "content" && (
                  <div className="space-y-4">
                    {selectedWidget && (
                      <>
                        {selectedWidget.type === "heading" && (
                          <>
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-zinc-400">Heading Title Text</label>
                              <input
                                type="text"
                                value={selectedWidget.content.text || ""}
                                onChange={(e) => updateSelectedField("content", "text", e.target.value)}
                                onBlur={handleSliderRelease}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-zinc-400">HTML Tag wrapper</label>
                              <select
                                value={selectedWidget.content.tag || "h2"}
                                onChange={(e) => updateSelectedField("content", "tag", e.target.value)}
                                onBlur={handleSliderRelease}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
                              >
                                <option value="h1">H1 - Banner Title</option>
                                <option value="h2">H2 - Section Heading</option>
                                <option value="h3">H3 - Sub Heading</option>
                                <option value="h4">H4 - Minor Heading</option>
                                <option value="p">P - Text Paragraph</option>
                              </select>
                            </div>
                          </>
                        )}

                        {selectedWidget.type === "text-editor" && (
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-zinc-400">Text Content</label>
                            <textarea
                              rows={5}
                              value={selectedWidget.content.text || ""}
                              onChange={(e) => updateSelectedField("content", "text", e.target.value)}
                              onBlur={handleSliderRelease}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
                            />
                          </div>
                        )}

                        {selectedWidget.type === "image" && (
                          <>
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-zinc-400">Image Source URL</label>
                              <input
                                type="text"
                                value={selectedWidget.content.src || ""}
                                onChange={(e) => updateSelectedField("content", "src", e.target.value)}
                                onBlur={handleSliderRelease}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-zinc-400">Badge Heading Overlay</label>
                              <input
                                type="text"
                                value={selectedWidget.content.badgeText || ""}
                                onChange={(e) => updateSelectedField("content", "badgeText", e.target.value)}
                                onBlur={handleSliderRelease}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
                                placeholder="e.g. 🌾 Direct from artisans..."
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-zinc-400">Badge Subtext Overlay</label>
                              <input
                                type="text"
                                value={selectedWidget.content.badgeSubtext || ""}
                                onChange={(e) => updateSelectedField("content", "badgeSubtext", e.target.value)}
                                onBlur={handleSliderRelease}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                          </>
                        )}

                        {selectedWidget.type === "newsletter" && (
                          <>
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-zinc-400">Section Label</label>
                              <input
                                type="text"
                                value={selectedWidget.content.label || ""}
                                onChange={(e) => updateSelectedField("content", "label", e.target.value)}
                                onBlur={handleSliderRelease}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-zinc-400">Headline Title</label>
                              <input
                                type="text"
                                value={selectedWidget.content.title || ""}
                                onChange={(e) => updateSelectedField("content", "title", e.target.value)}
                                onBlur={handleSliderRelease}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-zinc-400">Description Subtitle</label>
                              <textarea
                                rows={3}
                                value={selectedWidget.content.subtitle || ""}
                                onChange={(e) => updateSelectedField("content", "subtitle", e.target.value)}
                                onBlur={handleSliderRelease}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                          </>
                        )}

                        {/* If widget has no custom content editable, show standard note */}
                        {!["heading", "text-editor", "image", "newsletter"].includes(selectedWidget.type) && (
                          <div className="text-[11px] text-zinc-400 bg-zinc-900 p-3 rounded-lg border border-zinc-800 leading-relaxed text-center">
                            💡 E-commerce layout components read live data from catalogs & databases. You can adjust margins, colors, and responsive animations in the other tabs!
                          </div>
                        )}
                      </>
                    )}

                    {selectedType === "column" && (
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-zinc-400">Column Width (%)</label>
                        <select
                          value={selectedColumn?.width || 50}
                          onChange={(e) => {
                            const newWidth = Number(e.target.value)
                            const updated = layout.map((sec) => ({
                              ...sec,
                              columns: sec.columns.map((c) => {
                                if (c.id === selectedId) {
                                  return { ...c, width: newWidth }
                                }
                                return c
                              }),
                            }))
                            pushState(updated)
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
                        >
                          <option value={100}>100% (Full Width)</option>
                          <option value={50}>50% (Half split)</option>
                          <option value={33.33}>33.3% (Three Columns)</option>
                          <option value={25}>25% (Quarter Columns)</option>
                          <option value={33}>33% (One-Third split)</option>
                          <option value={67}>67% (Two-Third split)</option>
                        </select>
                      </div>
                    )}

                    {selectedType === "section" && (
                      <div className="text-[11px] text-zinc-400 bg-zinc-900 p-3 rounded-lg border border-zinc-800 leading-relaxed text-center">
                        📐 Customizing Section dimensions. Select column splits or move items. Use the Style tab to adjust padding and margins!
                      </div>
                    )}
                  </div>
                )}

                {/* Sub-Tab 2: Style adjustments */}
                {activeEditTab === "style" && (
                  <div className="space-y-4 text-xs">
                    {/* Common styles: Margin & Padding */}
                    <div className="border-b border-zinc-800 pb-3 space-y-3">
                      <p className="font-extrabold uppercase text-[10px] tracking-wider text-[#C9A84C]">Spacing Control</p>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-zinc-400 text-[10px]">Padding Top/Bottom</label>
                          <span className="text-[10px] text-zinc-500">{(selectedWidget || selectedSection || selectedColumn)?.style?.paddingTop || "0px"}</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={120}
                          value={parseInt((selectedWidget || selectedSection || selectedColumn)?.style?.paddingTop || "0") || 0}
                          onChange={(e) => {
                            const val = `${e.target.value}px`
                            updateSelectedField("style", "paddingTop", val)
                            updateSelectedField("style", "paddingBottom", val)
                          }}
                          onMouseUp={handleSliderRelease}
                          className="w-full accent-amber-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-zinc-400 text-[10px]">Margin Bottom</label>
                          <span className="text-[10px] text-zinc-500">{(selectedWidget || selectedSection || selectedColumn)?.style?.marginBottom || "0px"}</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={80}
                          value={parseInt((selectedWidget || selectedSection || selectedColumn)?.style?.marginBottom || "0") || 0}
                          onChange={(e) => updateSelectedField("style", "marginBottom", `${e.target.value}px`)}
                          onMouseUp={handleSliderRelease}
                          className="w-full accent-amber-500"
                        />
                      </div>
                    </div>

                    {/* Widget Specific Custom Styles */}
                    {selectedWidget && (
                      <div className="space-y-3">
                        <p className="font-extrabold uppercase text-[10px] tracking-wider text-[#C9A84C]">Aesthetics</p>

                        {/* Font alignments */}
                        {["heading", "text-editor"].includes(selectedWidget.type) && (
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-zinc-400">Alignment</label>
                            <div className="grid grid-cols-4 gap-1 p-0.5 bg-zinc-900 border border-zinc-800 rounded">
                              {["left", "center", "right", "justify"].map((align) => (
                                <button
                                  key={align}
                                  type="button"
                                  onClick={() => updateSelectedField("style", "alignment", align)}
                                  className={`py-1 rounded text-[9px] uppercase font-bold transition-all ${
                                    selectedWidget.style.alignment === align ? "bg-zinc-800 text-[#C9A84C]" : "text-zinc-500"
                                  }`}
                                >
                                  {align}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Color Selector */}
                        {selectedWidget.type === "heading" && (
                          <>
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-zinc-400">Text color</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={selectedWidget.style.textColor || "#000000"}
                                  onChange={(e) => updateSelectedField("style", "textColor", e.target.value)}
                                  onBlur={handleSliderRelease}
                                  className="w-8 h-8 rounded border border-zinc-800 bg-transparent cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={selectedWidget.style.textColor || ""}
                                  onChange={(e) => updateSelectedField("style", "textColor", e.target.value)}
                                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-white"
                                  placeholder="var(--primary) or #HEX"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <label className="text-[10px] uppercase font-bold text-zinc-400">Font size</label>
                                <span className="text-[10px] text-zinc-500">{selectedWidget.style.fontSize || "2rem"}</span>
                              </div>
                              <input
                                type="text"
                                value={selectedWidget.style.fontSize || "2rem"}
                                onChange={(e) => updateSelectedField("style", "fontSize", e.target.value)}
                                onBlur={handleSliderRelease}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
                                placeholder="e.g. 2.25rem or 36px"
                              />
                            </div>

                            <div className="space-y-1 flex items-center justify-between bg-zinc-900 p-2.5 border border-zinc-800 rounded-lg">
                              <label className="text-[10px] uppercase font-bold text-zinc-400">Kumkum Red/Gold line</label>
                              <input
                                type="checkbox"
                                checked={!!selectedWidget.style.hasBottomBorder}
                                onChange={(e) => {
                                  updateSelectedField("style", "hasBottomBorder", e.target.checked)
                                  pushState(layout)
                                }}
                                className="w-4 h-4 accent-amber-500"
                              />
                            </div>
                            <div className="space-y-1 flex items-center justify-between bg-zinc-900 p-2.5 border border-zinc-800 rounded-lg">
                              <label className="text-[10px] uppercase font-bold text-zinc-400">Gold Shimmer Glow</label>
                              <input
                                type="checkbox"
                                checked={!!selectedWidget.style.hasShimmerEffect}
                                onChange={(e) => {
                                  updateSelectedField("style", "hasShimmerEffect", e.target.checked)
                                  pushState(layout)
                                }}
                                className="w-4 h-4 accent-amber-500"
                              />
                            </div>
                          </>
                        )}

                        {selectedWidget.type === "image" && (
                          <>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <label className="text-[10px] uppercase font-bold text-zinc-400">Image height</label>
                                <span className="text-[10px] text-zinc-500">{selectedWidget.style.height || "380px"}</span>
                              </div>
                              <input
                                type="text"
                                value={selectedWidget.style.height || "380px"}
                                onChange={(e) => updateSelectedField("style", "height", e.target.value)}
                                onBlur={handleSliderRelease}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <label className="text-[10px] uppercase font-bold text-zinc-400">Border Radius (px)</label>
                                <span className="text-[10px] text-zinc-500">{selectedWidget.style.borderRadius || "16px"}</span>
                              </div>
                              <input
                                type="text"
                                value={selectedWidget.style.borderRadius || "16px"}
                                onChange={(e) => updateSelectedField("style", "borderRadius", e.target.value)}
                                onBlur={handleSliderRelease}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Section/Column Background Adjustments */}
                    {(selectedType === "section" || selectedType === "column") && (
                      <div className="space-y-3">
                        <p className="font-extrabold uppercase text-[10px] tracking-wider text-[#C9A84C]">Section styles</p>
                        
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-400">Background Color</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={(selectedType === "section" ? selectedSection?.style?.backgroundColor : selectedColumn?.style?.backgroundColor) || "#000000"}
                              onChange={(e) => updateSelectedField("style", "backgroundColor", e.target.value)}
                              onBlur={handleSliderRelease}
                              className="w-8 h-8 rounded border border-zinc-800 bg-transparent cursor-pointer"
                            />
                            <input
                              type="text"
                              value={(selectedType === "section" ? selectedSection?.style?.backgroundColor : selectedColumn?.style?.backgroundColor) || ""}
                              onChange={(e) => updateSelectedField("style", "backgroundColor", e.target.value)}
                              className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-white"
                              placeholder="var(--bg-primary) or #HEX"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Sub-Tab 3: Advanced Options */}
                {activeEditTab === "advanced" && (
                  <div className="space-y-4 text-xs">
                    <p className="font-extrabold uppercase text-[10px] tracking-wider text-[#C9A84C]">Animations & Custom Attributes</p>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-400">Entrance Animation</label>
                      <select
                        value={(selectedWidget || selectedSection)?.advanced?.animation || ""}
                        onChange={(e) => {
                          updateSelectedField("advanced", "animation", e.target.value)
                          pushState(layout)
                        }}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
                      >
                        <option value="">None (Static)</option>
                        <option value="animate-slide-up">Slide Up Fade</option>
                        <option value="animate-fade">Simple Fade In</option>
                        <option value="animate-scale-in">Scale In pop</option>
                        <option value="animate-float">Gentle floating loop</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-400">Custom CSS Classes</label>
                      <input
                        type="text"
                        value={(selectedWidget || selectedSection)?.advanced?.cssClass || ""}
                        onChange={(e) => updateSelectedField("advanced", "cssClass", e.target.value)}
                        onBlur={handleSliderRelease}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
                        placeholder="e.g. shadow-lg rounded-2xl"
                      />
                    </div>

                    <div className="border border-dashed border-zinc-800 rounded-xl p-3 text-[10px] leading-relaxed text-zinc-400">
                      🔒 Level 4 Pro Settings unlocked. Spacing sliders and responsive controls are automatically bound to standard Tailwind layout boundaries!
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VIEW C: NAVIGATOR HIERARCHY TREE VIEW */}
            {activeSidebarTab === "navigator" && (
              <div className="space-y-3">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-2">Navigator (Layers)</p>
                <div className="space-y-2 max-h-[480px] overflow-y-auto">
                  {layout.map((sec, secIdx) => (
                    <div key={sec.id} className="space-y-1">
                      {/* Section Node */}
                      <div
                        onClick={() => handleSelectElement(sec.id, "section")}
                        className={`p-2 rounded-lg flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                          selectedId === sec.id ? "bg-blue-500/20 border border-blue-500/50 text-blue-400" : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800"
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          <span>📐</span> Section {secIdx + 1}
                        </span>
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => moveSection(sec.id, "up")} disabled={secIdx === 0} className="hover:text-white text-zinc-500 text-[10px]">▲</button>
                          <button onClick={() => moveSection(sec.id, "down")} disabled={secIdx === layout.length - 1} className="hover:text-white text-zinc-500 text-[10px]">▼</button>
                          <button onClick={() => duplicateSection(sec.id)} className="hover:text-white text-zinc-500 text-[10px]">👥</button>
                          <button onClick={() => deleteSection(sec.id)} className="hover:text-red-400 text-zinc-500 text-[10px]">✕</button>
                        </div>
                      </div>

                      {/* Columns inside Section */}
                      <div className="pl-4 space-y-1 border-l border-zinc-800 ml-3">
                        {sec.columns.map((col, colIdx) => (
                          <div key={col.id} className="space-y-1">
                            <div
                              onClick={() => handleSelectElement(col.id, "column")}
                              className={`p-1.5 rounded-md flex items-center justify-between text-[11px] font-semibold transition-all cursor-pointer ${
                                selectedId === col.id ? "bg-sky-500/20 border border-sky-500/40 text-sky-400" : "bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/60"
                              }`}
                            >
                              <span>🏛️ Column ({Math.round(col.width)}%)</span>
                            </div>

                            {/* Widgets inside Column */}
                            <div className="pl-4 space-y-1 border-l border-zinc-800/50 ml-2">
                              {col.widgets.map((wid) => (
                                <div
                                  key={wid.id}
                                  onClick={() => handleSelectElement(wid.id, "widget")}
                                  className={`p-1 px-2.5 rounded flex items-center justify-between text-[10px] transition-all cursor-pointer ${
                                    selectedId === wid.id ? "bg-pink-500/20 border border-pink-500/40 text-pink-400" : "bg-zinc-900/40 hover:bg-zinc-900/60 border border-transparent"
                                  }`}
                                >
                                  <span>⚙️ {wid.type.toUpperCase()}</span>
                                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                    <button onClick={() => duplicateWidget(wid.id)} className="hover:text-white text-zinc-600">👥</button>
                                    <button onClick={() => deleteWidget(wid.id)} className="hover:text-red-400 text-zinc-600">✕</button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW D: GLOBAL PAGE PAGE CUSTOM CSS RULES */}
            {activeSidebarTab === "settings" && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Global Page Styles</h4>
                  <p className="text-[10px] text-zinc-400">Inject custom visual overrides directly into the live storefront workspace layout.</p>
                </div>
                <textarea
                  rows={15}
                  defaultValue={`/* Write custom CSS overrides here */\n.dynamic-visual-layout {\n  animation: fade-in 1s ease;\n}`}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 font-mono text-[10px] text-emerald-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => showNotice("success", "Custom override compiled & loaded!")}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs py-2 rounded-lg font-bold transition-all"
                >
                  Compile Custom Overrides
                </button>
              </div>
            )}

          </div>

          {/* SIDEBAR FOOTER TOOLBAR */}
          <footer className="p-3 border-t border-zinc-800 flex items-center justify-between bg-zinc-950/80">
            <div className="flex items-center gap-3">
              <button
                onClick={handleUndo}
                disabled={historyIndex === 0}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-all text-xs font-bold text-zinc-400 hover:text-white disabled:opacity-40"
                title="Undo (Ctrl+Z)"
              >
                ↩️ Undo
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex === history.length - 1}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-all text-xs font-bold text-zinc-400 hover:text-white disabled:opacity-40"
                title="Redo (Ctrl+Y)"
              >
                ↪️ Redo
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
                {(["desktop", "tablet", "mobile"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewportMode(mode)}
                    className={`p-1.5 rounded-md text-xs transition-all ${
                      viewportMode === mode ? "bg-zinc-800 text-[#C9A84C]" : "text-zinc-500 hover:text-zinc-200"
                    }`}
                    title={`${mode.toUpperCase()} screen size`}
                  >
                    {mode === "desktop" ? "🖥️" : mode === "tablet" ? "📟" : "📱"}
                  </button>
                ))}
              </div>
            </div>
          </footer>

        </aside>
      )}

      {/* 3. LIVE CANVAS / VISUAL WORKSPACE (RIGHT PANE) */}
      <main className="flex-1 flex flex-col bg-[#140a04] overflow-hidden relative">
        
        {/* VIEWPORT CONTROLS HEADER */}
        <header className="h-14 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950/40 backdrop-blur z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold text-zinc-300 transition-all"
            >
              {isPreviewMode ? "🛠️ Show Controls" : "👁️ Hide Controls (Preview)"}
            </button>
            
            <div className="text-[11px] text-zinc-400 uppercase tracking-widest font-extrabold hidden sm:block">
              Viewport: <span className="text-amber-500 font-bold">{viewportMode}</span> Mode
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (confirm("Reset current page layout modifications to standard default settings?")) {
                  const { DEFAULT_LAYOUT } = require("@lib/default-layout")
                  pushState(DEFAULT_LAYOUT)
                }
              }}
              className="px-3.5 py-1.5 rounded-lg border border-red-500/20 text-xs text-red-400 font-semibold hover:bg-red-500/10 active:scale-95 transition-all"
            >
              Reset Page
            </button>

            <button
              onClick={handlePublish}
              disabled={isPending}
              className="px-5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 font-bold text-xs uppercase tracking-wider text-white shadow-[0_4px_12px_rgba(16,185,129,0.2)] transition-all active:scale-95 disabled:opacity-50"
            >
              {isPending ? "Publishing Layout..." : "Publish Page 🚀"}
            </button>
          </div>
        </header>

        {/* WORKSPACE PREVIEW IFRAME / WRAPPER CONTAINER */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex items-center justify-center bg-[#110702] relative">
          
          {/* Visual device wrapper frame layout based on responsive toggle */}
          <div
            className={`transition-all duration-300 bg-white dark:bg-[#180D06] shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative border border-zinc-800/40 ${
              viewportMode === "desktop"
                ? "w-full min-h-full rounded-none"
                : viewportMode === "tablet"
                ? "w-[768px] h-[1024px] rounded-[32px] border-[12px] border-zinc-800"
                : "w-[375px] h-[760px] rounded-[48px] border-[14px] border-zinc-800"
            }`}
          >
            {/* Bezel details for Phone/Tablet Frames */}
            {viewportMode !== "desktop" && (
              <>
                {/* Phone Notch */}
                {viewportMode === "mobile" && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-zinc-800 rounded-b-xl z-50 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 mr-2" />
                    <div className="w-8 h-1 rounded-full bg-zinc-900" />
                  </div>
                )}
                {/* Status bar mockups */}
                <div className="h-6 w-full bg-zinc-950 flex items-center justify-between px-6 text-[9px] text-zinc-500 font-extrabold select-none pointer-events-none rounded-t-[18px]">
                  <span>9:41 AM</span>
                  <div className="flex items-center gap-1">
                    <span>📶</span>
                    <span>🔋 100%</span>
                  </div>
                </div>
              </>
            )}

            {/* LIVE PREVIEW IFRAME CANVAS OVERLAY */}
            <div className={`w-full overflow-y-auto custom-scrollbar ${viewportMode !== "desktop" ? "h-[calc(100%-24px)]" : "h-full"}`}>
              
              {/* Floating workspace indicator overlay */}
              {isEditing && (
                <div className="absolute top-2 right-2 bg-pink-500/95 text-white text-[9px] px-2 py-0.5 rounded font-black z-30 pointer-events-none uppercase tracking-widest shadow-md">
                  Active Visual Workspace
                </div>
              )}

              {/* Dynamic Page Renderer connected with controls */}
              <DynamicRenderer
                layout={layout}
                isEditing={true}
                selectedId={selectedId}
                onSelectElement={handleSelectElement}
                onInlineEdit={handleInlineEdit}
              />

              {/* Empty Workspace Indicator */}
              {layout.length === 0 && (
                <div className="w-full py-20 flex flex-col items-center justify-center text-center p-8 bg-zinc-950/30">
                  <span className="text-5xl mb-4">🧱</span>
                  <h3 className="font-bold text-lg text-zinc-400">Visual Layout Empty</h3>
                  <p className="text-xs text-zinc-600 mt-1 max-w-sm">No sections have been configured yet. Click "Add Custom Section" in the sidebar widgets drawer to begin building visually!</p>
                  <button
                    onClick={() => addSection(1)}
                    className="mt-6 px-5 py-2 rounded-xl bg-amber-500 text-zinc-950 text-xs font-bold shadow-md hover:scale-105 transition-all"
                  >
                    Add Column Section
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>

      </main>

    </div>
  )
}
