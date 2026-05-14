"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { MagnifyingGlassMini } from "@medusajs/icons"

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("")
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/store?q=${encodeURIComponent(query.trim())}`)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-center pt-20 px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#1a0a00] border border-[#C9A84C]/30 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <form onSubmit={handleSearch} className="flex items-center p-6 gap-4">
          <MagnifyingGlassMini className="text-[#C9A84C]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for Karnataka heritage..."
            className="flex-1 bg-transparent border-none outline-none text-[#FFF8E7] text-lg placeholder:text-white/20"
          />
          <button 
            type="button" 
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors text-sm font-bold"
          >
            ESC
          </button>
        </form>

        {query.length > 0 && (
          <div className="p-4 border-t border-white/5 bg-white/5">
            <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-3 ml-2">Quick Results for "{query}"</p>
            <div className="flex flex-col gap-1">
              <button 
                onClick={handleSearch}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded bg-gold/20 flex items-center justify-center text-gold">🛒</div>
                <div>
                  <p className="text-sm font-semibold text-[#FFF8E7]">Search all products for "{query}"</p>
                  <p className="text-[11px] text-white/40">Find matching organic food, silks and more</p>
                </div>
              </button>
            </div>
          </div>
        )}

        <div className="p-6 bg-black/40">
          <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-4">Trending Searches</p>
          <div className="flex flex-wrap gap-2">
            {["Mysore Silk", "Organic Ragi", "Byadagi Chilli", "Channapatna Toys", "Sandalwood"].map(t => (
              <button
                key={t}
                onClick={() => {
                  router.push(`/store?q=${encodeURIComponent(t.toLowerCase())}`)
                  onClose()
                }}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-[#FFF8E7] hover:border-gold hover:text-gold transition-all"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
