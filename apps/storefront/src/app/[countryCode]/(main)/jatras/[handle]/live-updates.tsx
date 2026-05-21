"use client"

import { useEffect, useState } from "react"

interface JatraUpdate {
  crowdStatus: string
  crowdCount: string
  currentRitual: string
  nextEvent: string
  weather: string
  parkingAlert: string
  liveAlert: string
  lastUpdated: string
}

interface LiveJatraUpdatesProps {
  jatraId: string
  initialData: JatraUpdate
}

export default function LiveJatraUpdates({ jatraId, initialData }: LiveJatraUpdatesProps) {
  const [data, setData] = useState<JatraUpdate>(initialData)
  const [loading, setLoading] = useState(false)
  const [timeSinceUpdate, setTimeSinceUpdate] = useState<string>("just now")

  useEffect(() => {
    // Poll for updates every 15 seconds
    const interval = setInterval(() => {
      setLoading(true)
      fetch("/api/jatra-updates")
        .then((res) => res.json())
        .then((updates) => {
          if (updates && updates[jatraId]) {
            setData(updates[jatraId])
          }
          setLoading(false)
        })
        .catch((err) => {
          console.error("Error polling jatra updates:", err)
          setLoading(false)
        })
    }, 15000)

    return () => clearInterval(interval)
  }, [jatraId])

  useEffect(() => {
    const updateTimeStr = () => {
      const diffMs = Date.now() - new Date(data.lastUpdated).getTime()
      const diffMins = Math.floor(diffMs / 60000)
      if (diffMins < 1) {
        setTimeSinceUpdate("just now")
      } else if (diffMins === 1) {
        setTimeSinceUpdate("1 minute ago")
      } else {
        setTimeSinceUpdate(`${diffMins} minutes ago`)
      }
    }

    updateTimeStr()
    const timeInterval = setInterval(updateTimeStr, 30000)
    return () => clearInterval(timeInterval)
  }, [data.lastUpdated])

  // Get status color for crowd density
  const getCrowdColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "peak":
      case "vvip":
        return "bg-red-950/80 text-red-400 border-red-800/60"
      case "moderate":
        return "bg-amber-950/80 text-amber-400 border-amber-800/60"
      case "normal":
      case "calm":
      default:
        return "bg-emerald-950/80 text-emerald-400 border-emerald-800/60"
    }
  }

  return (
    <div className="rounded-3xl border-2 border-[#FF8C00]/40 bg-gradient-to-br from-[#270E04] via-[#1E0900] to-[#120500] p-6 sm:p-8 shadow-[0_15px_35px_rgba(255,111,0,0.25),_inset_0_0_20px_rgba(255,140,0,0.1)] relative overflow-hidden transition-all duration-300 hover:border-[#FF8C00]/70">
      {/* Devotional background elements */}
      <div className="absolute -right-10 -bottom-10 opacity-[0.03] pointer-events-none text-[150px]">
        🔱
      </div>
      
      {/* Live status badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-[#C9A84C]/20 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#FFD700] tracking-wider uppercase flex items-center gap-2" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            Live Devotional Feed
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xs text-amber-200/50">
            {loading ? "refreshing..." : `updated ${timeSinceUpdate}`}
          </span>
          <button 
            onClick={() => {
              setLoading(true)
              fetch("/api/jatra-updates")
                .then((res) => res.json())
                .then((updates) => {
                  if (updates && updates[jatraId]) {
                    setData(updates[jatraId])
                  }
                  setLoading(false)
                })
                .catch(() => setLoading(false))
            }}
            className="p-1.5 rounded-full border border-[#C9A84C]/30 bg-black/40 hover:bg-[#C9A84C]/10 text-[#FFD700] transition-colors"
            title="Refresh feed"
          >
            <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        
        {/* Crowd Density & Count */}
        <div className="p-5 rounded-2xl border border-[#C9A84C]/15 bg-black/40 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-orange-400 font-semibold text-xs tracking-wider uppercase mb-3">
              <span>👥</span> Devotee Congregation
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase border ${getCrowdColor(data.crowdStatus)}`}>
                {data.crowdStatus} Flow
              </span>
              <span className="text-sm sm:text-base font-bold text-[#FFF8E7]">
                {data.crowdCount}
              </span>
            </div>
          </div>
          <p className="text-[10px] text-amber-200/30 mt-4 italic">
            *Real-time estimates gathered from temple queue counters.
          </p>
        </div>

        {/* Weather status */}
        <div className="p-5 rounded-2xl border border-[#C9A84C]/15 bg-black/40 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-orange-400 font-semibold text-xs tracking-wider uppercase mb-3">
              <span>☁️</span> Shrine Weather
            </div>
            <div className="text-sm sm:text-base font-bold text-[#FFF8E7] flex items-center gap-2">
              <span className="text-xl">🌤️</span>
              <span>{data.weather}</span>
            </div>
          </div>
          <p className="text-[10px] text-amber-200/30 mt-4">
            Dress recommendation: Traditional cotton or light silks.
          </p>
        </div>

        {/* Current Ritual */}
        <div className="p-5 rounded-2xl border border-[#C9A84C]/15 bg-black/40 backdrop-blur-sm md:col-span-2">
          <div className="flex items-center gap-2 text-orange-400 font-semibold text-xs tracking-wider uppercase mb-3">
            <span>🔥</span> Active Temple Ritual
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl animate-bounce" style={{ animationDuration: "2.5s" }}>🔔</span>
            <div>
              <p className="font-bold text-base text-[#FFD700]">{data.currentRitual}</p>
              <p className="text-xs text-amber-200/60 mt-1">
                Next Event: <strong className="text-orange-300">{data.nextEvent}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Live Alerts & Parking */}
        <div className="p-5 rounded-2xl border border-red-500/25 bg-red-950/10 backdrop-blur-sm md:col-span-2 shadow-[inset_0_0_15px_rgba(239,68,68,0.05)]">
          <div className="flex items-center gap-2 text-red-400 font-bold text-xs tracking-wider uppercase mb-3">
            <span>🚨</span> Important Devotional Alerts
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-[#FFF8E7]/90 leading-relaxed">
            <div className="flex items-start gap-2.5">
              <span className="text-[#FF8C00] text-sm">⚠️</span>
              <div>
                <strong className="text-[#FF8C00]">Traffic & Parking:</strong> {data.parkingAlert}
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-red-400 text-sm">📢</span>
              <div>
                <strong className="text-red-400">Queue Entry:</strong> {data.liveAlert}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
