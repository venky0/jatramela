"use client"

import { useState } from "react"
import Link from "next/link"
import QuickSwitch from "../../components/quick-switch"

const MASAS = [
  "Chaitra (March - April)",
  "Vaishakha (April - May)",
  "Jyeshtha (May - June)",
  "Ashadha (June - July)",
  "Shravana (July - August)",
  "Bhadrapada (August - September)",
  "Ashwayuja (September - October)",
  "Karthika (October - November)",
  "Margashira (November - December)",
  "Pushya (December - January)",
  "Magha (January - February)",
  "Phalguna (February - March)"
]

const TITHIS = [
  "Pratipada (1st Day)", "Dwitiya (2nd Day)", "Tritiya (3rd Day)", "Chaturthi (4th Day)",
  "Panchami (5th Day)", "Shashti (6th Day)", "Saptami (7th Day)", "Ashtami (8th Day)",
  "Navami (9th Day)", "Dashami (10th Day)", "Ekadashi (11th Day)", "Dwadashi (12th Day)",
  "Trayodashi (13th Day)", "Chaturdashi (14th Day)", "Poornima (Full Moon)"
]

const TITHIS_KRISHNA = [
  "Pratipada (1st Day)", "Dwitiya (2nd Day)", "Tritiya (3rd Day)", "Chaturthi (4th Day)",
  "Panchami (5th Day)", "Shashti (6th Day)", "Saptami (7th Day)", "Ashtami (8th Day)",
  "Navami (9th Day)", "Dashami (10th Day)", "Ekadashi (11th Day)", "Dwadashi (12th Day)",
  "Trayodashi (13th Day)", "Chaturdashi (14th Day)", "Amavasya (New Moon)"
]

export default function HinduCalendarPage() {
  const [targetDate, setTargetDate] = useState<string>("2026-10-20") // Dasara season 2026 default
  const [result, setResult] = useState<any>(null)

  const calculatePanchanga = () => {
    if (!targetDate) return
    const date = new Date(targetDate)
    
    // Reference date: New Moon on Jan 18, 2026
    const refDate = new Date("2026-01-18")
    const diffTime = date.getTime() - refDate.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)
    
    // Lunar Month cycle (Synodic Month = 29.53059 days)
    const synodicMonth = 29.53059
    const lunarAge = (diffDays % synodicMonth + synodicMonth) % synodicMonth
    const tithiPct = lunarAge / synodicMonth
    
    // Tithi mapping: 1 to 30 (1-15 Shukla, 16-30 Krishna)
    const tithiNum = Math.floor(tithiPct * 30) + 1
    
    let paksha = "Shukla Paksha (Waxing Phase)"
    let tithiName = ""
    if (tithiNum <= 15) {
      tithiName = TITHIS[tithiNum - 1]
    } else {
      paksha = "Krishna Paksha (Waning Phase)"
      tithiName = TITHIS_KRISHNA[tithiNum - 16]
    }

    // Month calculations (approximate alignment with reference: Jan 18, 2026 = Magha Masa start)
    const monthIndex = (Math.floor(diffDays / synodicMonth) + 10) % 12
    const masa = MASAS[monthIndex]

    // Associated festival highlights
    let festival = "Daily Temple Darshana & Routine Poojas"
    if (monthIndex === 6 && tithiNum <= 10 && paksha.startsWith("Shukla")) { // Ashwayuja Shukla 1-10
      festival = "🍂 Mysuru Dasara Jatra (Goddess Chamundeshwari Vijayadashami)"
    } else if (monthIndex === 11 && tithiNum === 20) { // Phalguna Krishna 5
      festival = "🕉️ Sri Sharanabasaveshwara Jatra (Chariot Rathotsava, Kalaburagi)"
    } else if (monthIndex === 10 && tithiNum === 29) { // Magha Krishna Chaturdashi
      festival = "🔱 Gokarna Mahashivaratri Jatra (Lord Shiva Atmalinga Festival)"
    } else if (monthIndex === 8 && tithiNum === 15) { // Karthika Poornima
      festival = "🥜 Kadalekai Parishe (Groundnut Festival, Bull Temple Bengaluru)"
    }

    setResult({
      masa,
      paksha,
      tithi: tithiName,
      lunarAge: lunarAge.toFixed(1) + " days",
      festival
    })
  }

  return (
    <div style={{ background: "var(--bg-primary)" }}>
      {/* ── HEADER ── */}
      <section style={{ background: "var(--bg-header)" }} className="py-12 text-center relative">
        <div className="temple-border absolute top-0 left-0 right-0" />
        <div className="content-container">
          <Link href="/converters/cultural" className="text-xs font-bold mb-2 block hover:opacity-80" style={{ color: "rgba(255,248,231,0.6)" }}>
            ← Back to Cultural Tools
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-shimmer mb-3" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            Gregorian ➔ Hindu Calendar Converter
          </h1>
          <p className="text-xs sm:text-sm max-w-lg mx-auto" style={{ color: "rgba(255,248,231,0.75)" }}>
            Convert standard Gregorian dates into traditional Hindu Panchanga details (Masa, Paksha, Tithi) and corresponding Jatra festivals.
          </p>
          <QuickSwitch currentHref="/converters/cultural/hindu-calendar" />
        </div>
        <div className="temple-border absolute bottom-0 left-0 right-0" />
      </section>

      <div className="content-container py-10 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Controls */}
          <div className="heritage-card p-6 flex flex-col justify-between md:col-span-1" style={{ minHeight: 280 }}>
            <div>
              <h3 className="font-extrabold text-sm mb-3" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Select Date</h3>
              <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)}
                className="w-full bg-[var(--bg-secondary)] border border-neutral-700 rounded-xl p-3 text-xs text-[var(--text-primary)] outline-none focus:border-amber-500" />
            </div>
            <button onClick={calculatePanchanga} className="w-full btn-gold py-3 text-xs mt-6">
              📅 Calculate Hindu Date
            </button>
          </div>

          {/* Results Output */}
          <div className="heritage-card p-6 md:col-span-2 flex flex-col justify-between" style={{ minHeight: 280 }}>
            <div>
              <h3 className="font-extrabold text-sm mb-4" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Lunar Panchanga Results</h3>
              {result ? (
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between border-b pb-2 border-[var(--border)]">
                    <span className="text-[var(--text-muted)]">Lunar Month (Masa):</span>
                    <span className="font-bold text-[var(--text-primary)]">{result.masa}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2 border-[var(--border)]">
                    <span className="text-[var(--text-muted)]">Phase (Paksha):</span>
                    <span className="font-bold text-[var(--text-primary)]">{result.paksha}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2 border-[var(--border)]">
                    <span className="text-[var(--text-muted)]">Lunar Day (Tithi):</span>
                    <span className="font-bold text-[var(--text-primary)]">{result.tithi}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2 border-[var(--border)]">
                    <span className="text-[var(--text-muted)]">Lunar Cycle Age:</span>
                    <span className="font-bold text-[var(--text-primary)]">{result.lunarAge}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-900/20 border border-amber-900/50 mt-4">
                    <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Karnataka Festival / Jatra</p>
                    <p className="font-extrabold text-xs text-amber-200 mt-1">{result.festival}</p>
                  </div>
                </div>
              ) : (
                <div className="text-[var(--text-subtle)] text-xs py-8 text-center">Select a target date and press calculate.</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
