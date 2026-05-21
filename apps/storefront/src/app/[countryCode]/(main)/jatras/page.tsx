import { Metadata } from "next"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { listJatras } from "@lib/data/jatras"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Karnataka Jatras — Sacred Fairs & Festivals | Jatramela",
  description: "Explore the ancient, power-filled devotional fairs (Jatras) of Karnataka. timings, history, rituals, and sacred places of our rich heritage.",
}

export default async function JatrasPage() {
  const jatras = listJatras()

  return (
    <div className="min-h-screen bg-[#120500] text-[#FFF8E7] pb-16 font-sans relative overflow-hidden">
      {/* Devotional Background Graphics - Subtle Temple Pillar Patterns and Rays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,111,0,0.15),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(201,168,76,0.1),transparent_50%)] pointer-events-none" />
      
      {/* Top Temple Border motif */}
      <div className="temple-border" />

      {/* Hero Header Section */}
      <header className="relative py-16 px-4 text-center border-b border-[#C9A84C]/25 bg-gradient-to-b from-[#3D0E02] via-[#220A00] to-[#120500]">
        {/* Hindu Calligraphy / Invocation */}
        <div className="mb-4 text-center">
          <span className="inline-block px-6 py-2 rounded-full border border-[#C9A84C]/30 bg-black/40 text-[#C9A84C] font-semibold tracking-wider text-xs sm:text-sm animate-pulse">
            ॥ धर्मो रक्षति रक्षितः ॥
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#E8C56A] to-[#FF8C00] drop-shadow-[0_2px_10px_rgba(255,140,0,0.4)]" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
          ಕರ್ನಾಟಕದ ಜಾತ್ರೆಗಳು
        </h1>
        <p className="text-xl sm:text-2xl text-[#E8C56A] max-w-2xl mx-auto font-medium serif-title italic mb-6">
          Sacred Fairs & Festivals of Karnataka
        </p>

        {/* Shloka description block */}
        <div className="max-w-xl mx-auto p-4 rounded-xl border border-[#C9A84C]/20 bg-black/30 backdrop-blur-sm relative">
          <p className="text-xs sm:text-sm text-amber-200/80 leading-relaxed italic">
            &ldquo;Jatra is not just a congregation; it is the heartbeat of our devotion, where the divine chariot meets the soil, and the air echoes with temple bells and sacred chants.&rdquo;
          </p>
        </div>

        {/* Glowing Diya illustration in center */}
        <div className="mt-8 flex justify-center">
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* SVG Diya with animated flame */}
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="text-[#C9A84C] drop-shadow-[0_0_15px_rgba(255,111,0,0.6)]">
              <path d="M12 40C12 40 18 44 32 44C46 44 52 40 52 40C52 40 54 48 32 48C10 48 12 40 12 40Z" fill="#5C1E06" stroke="#C9A84C" strokeWidth="2" />
              <path d="M16 40C32 46 48 40 48 40C48 40 42 34 32 34C22 34 16 40 16 40Z" fill="#D4900A" />
              {/* Flame path */}
              <path d="M32 6C32 6 26 22 28 28C30 34 34 34 36 28C38 22 32 6 32 6Z" fill="#FF4500" className="animate-pulse origin-bottom" style={{ animationDuration: '1.2s' }} />
              <path d="M32 14C32 14 29 23 30 26C31 29 33 29 34 26C35 23 32 14 32 14Z" fill="#FFD700" />
            </svg>
            <div className="absolute top-1 w-2 h-2 bg-orange-500 rounded-full blur-[4px] animate-ping" />
          </div>
        </div>
      </header>

      {/* Main Container / Jatra Grid */}
      <main className="content-container py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {jatras.map((jatra) => (
            <div 
              key={jatra.id} 
              className="group relative rounded-2xl overflow-hidden border-2 border-[#C9A84C]/30 bg-[#220A00] transition-all duration-300 hover:border-[#FF8C00] hover:shadow-[0_10px_35px_rgba(255,111,0,0.25)] flex flex-col"
            >
              {/* Image Container with golden ratio */}
              <div className="relative h-64 sm:h-80 w-full overflow-hidden border-b border-[#C9A84C]/30">
                <Image 
                  src={jatra.image} 
                  alt={jatra.title}
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Devotional Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#220A00] via-transparent to-black/40" />
                
                {/* Deity Badge */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-[#FF6F00] to-[#C0392B] border border-[#FFD700] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#FFF8E7] shadow-lg flex items-center gap-1.5">
                  <span className="text-[14px]">🛕</span>
                  <span>{jatra.deity}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  {/* Title and Kannada Title */}
                  <div className="mb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#FFD700] group-hover:text-[#FFF8E7] transition-colors leading-tight mb-1" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                      {jatra.title}
                    </h2>
                    <p className="text-sm text-orange-400 font-semibold kannada-title tracking-wide">
                      {jatra.titleKannada}
                    </p>
                  </div>

                  {/* Place and Timing Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 p-4 rounded-xl border border-[#C9A84C]/15 bg-black/45 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 text-amber-200/90">
                      <span className="text-orange-500 text-[15px]">📍</span>
                      <div>
                        <p className="font-bold text-[#FFF8E7]">Place</p>
                        <p className="text-[11px] sm:text-xs opacity-80">{jatra.place}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-amber-200/90">
                      <span className="text-orange-500 text-[15px]">📅</span>
                      <div>
                        <p className="font-bold text-[#FFF8E7]">Timing / Month</p>
                        <p className="text-[11px] sm:text-xs opacity-80">{jatra.kannadaMonth}</p>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-[#FFF8E7]/70 leading-relaxed mb-6">
                    {jatra.summary}
                  </p>
                </div>

                {/* Devotional CTA Link */}
                <div className="pt-4 border-t border-[#C9A84C]/15 flex justify-end">
                  <LocalizedClientLink 
                    href={`/jatras/${jatra.handle}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#2C1810] bg-gradient-to-r from-[#FFD700] via-[#E8C56A] to-[#FF8C00] border-2 border-[#FFD700] transition-all hover:scale-105 hover:brightness-110 shadow-[0_4px_12px_rgba(201,168,76,0.3)]"
                  >
                    <span>Read History & Rituals</span>
                    <span className="text-[14px] transition-transform group-hover:translate-x-1">🕉️</span>
                  </LocalizedClientLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Temple Bells SVG Illustration at the bottom */}
      <footer className="mt-12 text-center text-xs text-[#C9A84C]/50 relative py-8 border-t border-[#C9A84C]/25 bg-black/40">
        <div className="flex justify-center gap-6 mb-4">
          <span className="text-[20px] opacity-60 animate-bounce" style={{ animationDuration: '2s' }}>🔔</span>
          <span className="text-[20px] opacity-60 animate-bounce" style={{ animationDuration: '2.5s' }}>🔔</span>
        </div>
        <p>© JATRAMELA Store · Back to Roots Karnataka</p>
      </footer>
    </div>
  )
}
