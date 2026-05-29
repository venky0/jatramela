"use client"

import React, { useState, useTransition } from "react"
import {
  adminLogout,
  updateCMSConfig,
  addPortalProduct,
  fulfillAndShipPortalOrder,
} from "@lib/data/portal-actions"
import { useRouter } from "next/navigation"

type PortalDashboardClientProps = {
  user: {
    id: string
    email: string
    first_name?: string
    last_name?: string
    role: string
  }
  initialProducts: any[]
  initialOrders: any[]
  initialCmsConfig: any
  countryCode: string
}

export default function PortalDashboardClient({
  user,
  initialProducts,
  initialOrders,
  initialCmsConfig,
  countryCode,
}: PortalDashboardClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState<"overview" | "cms" | "products" | "orders">(
    user.role === "ui_editor" ? "cms" : user.role === "vendor" ? "products" : "overview"
  )

  // CMS Form States
  const [announcementEnabled, setAnnouncementEnabled] = useState(
    initialCmsConfig?.announcement?.enabled ?? true
  )
  const [announcementText, setAnnouncementText] = useState(
    initialCmsConfig?.announcement?.text ?? ""
  )
  const [heroTitle, setHeroTitle] = useState(initialCmsConfig?.hero?.title ?? "")
  const [heroSubtitle, setHeroSubtitle] = useState(initialCmsConfig?.hero?.subtitle ?? "")
  const [heroButtonText, setHeroButtonText] = useState(initialCmsConfig?.hero?.buttonText ?? "")
  const [themeColor, setThemeColor] = useState(initialCmsConfig?.theme?.primaryColor ?? "dasara")

  // Products and Orders States
  const [products, setProducts] = useState(initialProducts)
  const [orders, setOrders] = useState(initialOrders)

  // Modals / Inputs
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    subtitle: "",
    price: 499,
    imageUrl: "",
    weight: 500,
  })

  const [fulfillmentOrderId, setFulfillmentOrderId] = useState<string | null>(null)
  const [trackingNumber, setTrackingNumber] = useState("")

  // Notification status
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const showNotification = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text })
    setTimeout(() => setStatusMessage(null), 4000)
  }

  const handleLogout = async () => {
    await adminLogout()
    router.push(`/${countryCode}/portal/login`)
    router.refresh()
  }

  const handleSaveCMS = async (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const config = {
        announcement: { enabled: announcementEnabled, text: announcementText },
        hero: { title: heroTitle, subtitle: heroSubtitle, buttonText: heroButtonText },
        theme: { primaryColor: themeColor },
      }
      const res = await updateCMSConfig(config)
      if (res.success) {
        showNotification("success", "Website layout & theme customized successfully! Changes will reflect immediately on the storefront.")
        router.refresh()
      } else {
        showNotification("error", res.error || "Failed to update layout configurations.")
      }
    })
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProduct.title || !newProduct.price) {
      showNotification("error", "Product Title and Price are required.")
      return
    }
    startTransition(async () => {
      const res = await addPortalProduct(newProduct)
      if (res.success) {
        showNotification("success", `Product "${newProduct.title}" has been published and listed.`)
        setProducts([res.product, ...products])
        setShowAddProductModal(false)
        setNewProduct({ title: "", description: "", subtitle: "", price: 499, imageUrl: "", weight: 500 })
        router.refresh()
      } else {
        showNotification("error", res.error || "Failed to add product.")
      }
    })
  }

  const handleFulfillOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fulfillmentOrderId || !trackingNumber) return
    startTransition(async () => {
      const res = await fulfillAndShipPortalOrder(fulfillmentOrderId, trackingNumber)
      if (res.success) {
        showNotification("success", `Order shipment marked as Shipped. Shiprocket tracking number: ${trackingNumber}`)
        
        // Update local orders list state
        setOrders(
          orders.map((o) =>
            o.id === fulfillmentOrderId
              ? { ...o, fulfillment_status: "fulfilled", fulfillments: [{ tracking_numbers: [trackingNumber], shipped_at: new Date().toISOString() }] }
              : o
          )
        )
        setFulfillmentOrderId(null)
        setTrackingNumber("")
        router.refresh()
      } else {
        showNotification("error", res.error || "Fulfillment creation failed.")
      }
    })
  }

  // Calculate quick metrics for Admin
  const totalRevenue = orders
    .filter((o) => o.payment_status === "captured" || o.payment_status === "awaiting" || o.status === "completed")
    .reduce((sum, o) => sum + (o.total || 0), 0) / 100

  return (
    <div className="min-h-screen bg-[#160D08] text-white font-sans flex flex-col">
      {/* Top golden announcement bar */}
      {statusMessage && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl border text-sm max-w-md animate-bounce ${
            statusMessage.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-400"
              : "bg-red-950/90 border-red-500/30 text-red-400"
          }`}
        >
          <div className="font-semibold mb-1">
            {statusMessage.type === "success" ? "✓ Success" : "✕ Error"}
          </div>
          {statusMessage.text}
        </div>
      )}

      {/* Header bar */}
      <header className="border-b border-amber-500/10 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              J
            </div>
            <div>
              <span className="font-bold text-lg tracking-wider text-amber-500" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                Jatramela Dashboard
              </span>
              <span className="ml-2 px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400 font-bold uppercase tracking-wide">
                Portal v2
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-zinc-200">
                {user.first_name ? `${user.first_name} ${user.last_name || ""}` : user.email}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                Role: {user.role === "admin" ? "Super Admin" : user.role === "ui_editor" ? "UI Customizer" : "Vendor"}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-lg border border-red-500/20 text-xs font-semibold text-red-400 hover:bg-red-500/10 active:scale-95 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="md:w-64 flex-shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 border-b md:border-b-0 md:border-r border-amber-500/10 pr-0 md:pr-6">
          {user.role === "admin" && (
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2.5 flex-shrink-0 ${
                activeTab === "overview"
                  ? "bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-400 border-l-2 border-amber-500 font-bold"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              📊 Overview Metrics
            </button>
          )}

          {(user.role === "admin" || user.role === "ui_editor") && (
            <button
              onClick={() => setActiveTab("cms")}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2.5 flex-shrink-0 ${
                activeTab === "cms"
                  ? "bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-400 border-l-2 border-amber-500 font-bold"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              🎨 UI of Website (CMS)
            </button>
          )}

          {(user.role === "admin" || user.role === "vendor") && (
            <button
              onClick={() => setActiveTab("products")}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2.5 flex-shrink-0 ${
                activeTab === "products"
                  ? "bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-400 border-l-2 border-amber-500 font-bold"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              📦 Product Catalog
            </button>
          )}

          {(user.role === "admin" || user.role === "vendor") && (
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2.5 flex-shrink-0 ${
                activeTab === "orders"
                  ? "bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-400 border-l-2 border-amber-500 font-bold"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              🚚 Orders & Shipping
            </button>
          )}
        </aside>

        {/* Tab Contents */}
        <main className="flex-1 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && user.role === "admin" && (
            <div className="space-y-8 animate-fadeIn">
              <h2 className="text-2xl font-bold text-amber-400" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                System Performance Overview
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/40">
                  <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Total Sales Revenue</div>
                  <div className="text-3xl font-extrabold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
                    ₹{totalRevenue.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-2">Captured/Paid orders</div>
                </div>

                <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/40">
                  <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Orders Count</div>
                  <div className="text-3xl font-extrabold mt-2 text-white">
                    {orders.length}
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-2">All times store orders</div>
                </div>

                <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/40">
                  <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Catalog Products</div>
                  <div className="text-3xl font-extrabold mt-2 text-white">
                    {products.length}
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-2">Published & draft items</div>
                </div>

                <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/40">
                  <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Store Region status</div>
                  <div className="text-xl font-bold mt-3 text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active Online
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-2">Medusa Core Connected</div>
                </div>
              </div>

              {/* Quick statistics section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/30">
                  <h3 className="text-lg font-bold text-zinc-200 mb-4">Recent Sales Activity</h3>
                  <div className="space-y-4">
                    {orders.slice(0, 4).map((order) => (
                      <div key={order.id} className="flex justify-between items-center text-sm border-b border-zinc-900 pb-2">
                        <div>
                          <div className="font-semibold">Order #{order.display_id}</div>
                          <div className="text-xs text-zinc-500">{new Date(order.created_at).toLocaleDateString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-amber-500">₹{(order.total / 100).toLocaleString("en-IN")}</div>
                          <div className="text-[10px] uppercase text-zinc-400">{order.payment_status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Popular Products */}
                <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/30">
                  <h3 className="text-lg font-bold text-zinc-200 mb-4">Latest Published Items</h3>
                  <div className="space-y-4">
                    {products.slice(0, 4).map((product) => (
                      <div key={product.id} className="flex justify-between items-center text-sm border-b border-zinc-900 pb-2">
                        <div>
                          <div className="font-semibold">{product.title}</div>
                          <div className="text-xs text-zinc-500">{product.handle}</div>
                        </div>
                        <div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-zinc-800 text-zinc-300">
                            {product.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UI CUSTOMIZER (LEVEL 1) */}
          {activeTab === "cms" && (user.role === "admin" || user.role === "ui_editor") && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-amber-400" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                  Website UI Customizer
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Level 1 Authorization: Customize announcement banners, active page sliders, and theme configurations in real-time.
                </p>
              </div>

              <form onSubmit={handleSaveCMS} className="bg-zinc-950/40 p-6 rounded-2xl border border-zinc-800 space-y-6">
                {/* Announcement Bar */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-zinc-200 uppercase tracking-wider">Announcement Alert Bar</label>
                    <input
                      type="checkbox"
                      checked={announcementEnabled}
                      onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                      className="sr-only peer"
                      id="announcement-toggle"
                    />
                    <label
                      htmlFor="announcement-toggle"
                      className="relative w-11 h-6 bg-zinc-800 rounded-full peer peer-focus:ring-2 peer-focus:ring-amber-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500 cursor-pointer"
                    />
                  </div>
                  <input
                    type="text"
                    disabled={!announcementEnabled}
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/50 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm disabled:opacity-40"
                    placeholder="Enter announcement text..."
                  />
                </div>

                <hr className="border-zinc-800" />

                {/* Hero Banner configuration */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-zinc-200 uppercase tracking-wider">Homepage Hero Content</label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Hero Title</label>
                      <input
                        type="text"
                        value={heroTitle}
                        onChange={(e) => setHeroTitle(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/50 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                        placeholder="Hero Title..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Hero Button Text</label>
                      <input
                        type="text"
                        value={heroButtonText}
                        onChange={(e) => setHeroButtonText(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/50 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                        placeholder="Explore Now..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Hero Subtitle</label>
                    <textarea
                      rows={3}
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/50 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                      placeholder="Hero Subtitle..."
                    />
                  </div>
                </div>

                <hr className="border-zinc-800" />

                {/* Theme Customization */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-zinc-200 uppercase tracking-wider">Primary Theme Template</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setThemeColor("dasara")}
                      className={`p-4 rounded-xl border text-sm font-semibold transition-all ${
                        themeColor === "dasara"
                          ? "border-amber-500 bg-amber-500/10 text-amber-400"
                          : "border-zinc-800 bg-zinc-900/20 text-zinc-400"
                      }`}
                    >
                      🎪 Dasara Red/Gold
                    </button>
                    <button
                      type="button"
                      onClick={() => setThemeColor("gold")}
                      className={`p-4 rounded-xl border text-sm font-semibold transition-all ${
                        themeColor === "gold"
                          ? "border-amber-500 bg-amber-500/10 text-amber-400"
                          : "border-zinc-800 bg-zinc-900/20 text-zinc-400"
                      }`}
                    >
                      👑 Royal Gold
                    </button>
                    <button
                      type="button"
                      onClick={() => setThemeColor("default")}
                      className={`p-4 rounded-xl border text-sm font-semibold transition-all ${
                        themeColor === "default"
                          ? "border-amber-500 bg-amber-500/10 text-amber-400"
                          : "border-zinc-800 bg-zinc-900/20 text-zinc-400"
                      }`}
                    >
                      🌿 Default Green
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider text-zinc-950 bg-gradient-to-r from-amber-400 to-orange-500 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isPending ? "Saving..." : "Save Custom Layout"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: PRODUCTS (LEVEL 4) */}
          {activeTab === "products" && (user.role === "admin" || user.role === "vendor") && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-amber-400" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                    {user.role === "vendor" ? "My Product Listings" : "Store Product Catalog"}
                  </h2>
                  <p className="text-sm text-zinc-400 mt-1">
                    Manage catalog items, prices, variants, and published status.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-950 bg-amber-500 hover:bg-amber-400 active:scale-95 transition-all shadow-[0_4px_12px_rgba(245,158,11,0.2)]"
                >
                  + Add Product
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/40 text-xs uppercase text-zinc-400 font-bold">
                      <th className="p-4">Item Details</th>
                      <th className="p-4">Handle</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => {
                      const price = product.variants?.[0]?.prices?.[0]?.amount ?? 499
                      return (
                        <tr key={product.id} className="border-b border-zinc-900/60 hover:bg-zinc-900/20 text-sm">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {product.thumbnail ? (
                                <img
                                  src={product.thumbnail}
                                  alt={product.title}
                                  className="w-10 h-10 object-cover rounded-lg border border-zinc-800"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-xs font-bold">
                                  N/A
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-zinc-200">{product.title}</div>
                                <div className="text-xs text-zinc-500">{product.description?.slice(0, 60)}...</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-xs font-mono text-zinc-400">{product.handle}</td>
                          <td className="p-4 font-semibold text-amber-400">₹{price}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              product.status === "published" ? "bg-emerald-950/50 text-emerald-400 border border-emerald-500/20" : "bg-zinc-800 text-zinc-400"
                            }`}>
                              {product.status}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS & SHIPPING (LEVEL 4/ADMIN) */}
          {activeTab === "orders" && (user.role === "admin" || user.role === "vendor") && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-amber-400" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                  Orders & Shipments Fulfillment
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Track customer sales transactions, check payment captures, and update delivery fulfillments using Shiprocket tracking links.
                </p>
              </div>

              {/* Orders Table */}
              <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/40 text-xs uppercase text-zinc-400 font-bold">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Purchased Items</th>
                      <th className="p-4">Transaction Payment</th>
                      <th className="p-4">Shipping Status</th>
                      <th className="p-4 text-right">Fulfillment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      const trackingNumber = order.fulfillments?.[0]?.tracking_numbers?.[0]
                      return (
                        <tr key={order.id} className="border-b border-zinc-900/60 hover:bg-zinc-900/20 text-sm">
                          <td className="p-4">
                            <div className="font-bold text-zinc-200">#{order.display_id}</div>
                            <div className="text-xs text-zinc-500">{new Date(order.created_at).toLocaleDateString()}</div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              {order.items?.map((item: any) => (
                                <div key={item.id} className="text-xs">
                                  {item.title} <span className="text-zinc-500">x{item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-amber-400">₹{(order.total / 100).toLocaleString("en-IN")}</div>
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase mt-1 ${
                              order.payment_status === "captured"
                                ? "bg-emerald-950/50 text-emerald-400 border border-emerald-500/20"
                                : "bg-amber-950/50 text-amber-400 border border-amber-500/20"
                            }`}>
                              {order.payment_status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col gap-1">
                              <span className={`inline-block w-fit px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                order.fulfillment_status === "fulfilled" ? "bg-sky-950/50 text-sky-400 border border-sky-500/20" : "bg-amber-950/50 text-amber-500 border border-amber-500/10"
                              }`}>
                                {order.fulfillment_status === "fulfilled" ? "Shipped" : "Preparing"}
                              </span>
                              {trackingNumber && (
                                <div className="text-[10px] text-zinc-400 font-mono">
                                  Track: {trackingNumber}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            {order.fulfillment_status !== "fulfilled" ? (
                              <button
                                onClick={() => setFulfillmentOrderId(order.id)}
                                className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all active:scale-95"
                              >
                                Fulfill & Ship
                              </button>
                            ) : (
                              <span className="text-xs text-zinc-500 italic">Completed</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: ADD PRODUCT */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-amber-500/20 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-amber-400" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                Add New Heritage Product
              </h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900/50 text-white focus:outline-none text-sm"
                  placeholder="e.g. Handmade Sandalwood Carving"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900/50 text-white focus:outline-none text-sm"
                    placeholder="499"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Weight (grams)</label>
                  <input
                    type="number"
                    value={newProduct.weight}
                    onChange={(e) => setNewProduct({ ...newProduct, weight: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900/50 text-white focus:outline-none text-sm"
                    placeholder="500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Brief Description</label>
                <textarea
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900/50 text-white focus:outline-none text-sm"
                  placeholder="Tell customers about its authenticity..."
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Image URL</label>
                <input
                  type="text"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900/50 text-white focus:outline-none text-sm"
                  placeholder="https://..."
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider text-zinc-950 bg-amber-500 hover:bg-amber-400 active:scale-95 transition-all disabled:opacity-55"
              >
                {isPending ? "Creating..." : "Publish Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: FULFILL ORDER & TRACKING */}
      {fulfillmentOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-amber-500/20 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-amber-400" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                Fulfill Order & Ship
              </h3>
              <button
                onClick={() => setFulfillmentOrderId(null)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFulfillOrder} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Shiprocket Tracking Number</label>
                <input
                  type="text"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/50 text-white focus:outline-none text-sm"
                  placeholder="e.g. SR1029384756"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider text-zinc-950 bg-sky-500 hover:bg-sky-400 active:scale-95 transition-all disabled:opacity-55"
              >
                {isPending ? "Registering Shipment..." : "Register Shipment & Track"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
