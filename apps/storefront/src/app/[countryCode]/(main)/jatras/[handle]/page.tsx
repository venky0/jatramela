import { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getJatraByHandle } from "@lib/data/jatras"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{
    countryCode: string
    handle: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const jatra = getJatraByHandle(params.handle)

  if (!jatra) {
    notFound()
  }

  return {
    title: `${jatra.title} — History, Rituals & Details | Jatramela`,
    description: jatra.summary,
  }
}

export default async function JatraDetailPage(props: Props) {
  const params = await props.params
  const jatra = getJatraByHandle(params.handle)

  if (!jatra) {
    notFound()
  }

  // Devotional shlokas tailored to the deity/jatra
  let shloka = "॥ ॐ तत्सत् ॥"
  let shlokaMeaning = "Om Tat Sat - The absolute truth is supreme."

  if (jatra.handle === "mysuru-dasara-jatra") {
    shloka = "॥ सर्वमंगल मांगल्ये शिवे सर्वार्थ साधिके । शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥"
    shlokaMeaning = "Salutations to the auspicious one who bestows all blessings, the protector, Goddess Chamundeshwari."
  } else if (jatra.handle === "sharanabasaveshwara-jatra") {
    shloka = "॥ ॐ नमः शिवाय ॥"
    shlokaMeaning = "Adoration to Lord Shiva, the embodiment of peace, charity, and divine consciousness."
  } else if (jatra.handle === "hampi-vijaya-utsav") {
    shloka = "॥ ॐ नमः शिवाय ॥"
    shlokaMeaning = "Salutations to Lord Virupaksha, the ancient protector deity of Vijayanagara."
  } else if (jatra.handle === "basavanagudi-kadalekai-parishe") {
    shloka = "॥ ॐ नन्दಿಕೇಶ್ವರಾಯ ನಮಃ ॥"
    shlokaMeaning = "Salutations to the sacred Nandi, the carrier of Lord Shiva and the guardian of our fields."
  }

  return (
    <div className="min-h-screen bg-[#120500] text-[#FFF8E7] pb-20 font-sans relative overflow-hidden">
      {/* Devotional Background Graphics - Rays, pillars, and subtle glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,111,0,0.18),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(201,168,76,0.12),transparent_50%)] pointer-events-none" />
      
      {/* Top Temple Border motif */}
      <div className="temple-border" />

      {/* Main Content Container */}
      <main className="content-container py-12 px-4 max-w-4xl mx-auto">
        
        {/* Navigation Breadcrumb & Back Link */}
        <div className="mb-8">
          <LocalizedClientLink 
            href="/jatras" 
            className="inline-flex items-center gap-2 text-[#C9A84C] hover:text-[#FF8C00] transition-colors font-bold uppercase tracking-wider text-xs"
          >
            <span className="text-[14px]">🔱</span>
            <span>Back to all Jatras</span>
          </LocalizedClientLink>
        </div>

        {/* Sacred Sanskrit Shloka Block */}
        <div className="text-center mb-8">
          <div className="inline-block px-6 py-3 rounded-xl border border-[#C9A84C]/30 bg-black/50 text-[#FFD700] max-w-xl mx-auto shadow-[0_0_15px_rgba(255,140,0,0.1)]">
            <p className="text-sm sm:text-base font-bold tracking-widest mb-1 italic leading-relaxed">
              {shloka}
            </p>
            <p className="text-[10px] sm:text-xs text-amber-200/60 leading-normal">
              {shlokaMeaning}
            </p>
          </div>
        </div>

        {/* Header Title Section */}
        <header className="text-center mb-12">
          <span className="text-sm font-semibold tracking-widest text-[#FF8C00] uppercase block mb-2">
            Sacred Karnataka Jatra
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#E8C56A] to-[#FF8C00] drop-shadow-[0_2px_10px_rgba(255,140,0,0.4)]" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            {jatra.title}
          </h1>
          <p className="text-lg sm:text-xl text-orange-400 font-semibold kannada-title tracking-wide mb-6">
            {jatra.titleKannada}
          </p>

          {/* Temple bells animated decorative line */}
          <div className="flex items-center justify-center gap-4 text-[#C9A84C]/50 my-6">
            <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#C9A84C]/45" />
            <span className="text-[16px] animate-bounce" style={{ animationDuration: "1.8s" }}>🔔</span>
            <span className="text-[16px] animate-bounce" style={{ animationDuration: "2.2s" }}>🛕</span>
            <span className="text-[16px] animate-bounce" style={{ animationDuration: "2.0s" }}>🔔</span>
            <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#C9A84C]/45" />
          </div>
        </header>

        {/* Hero Image Container with Gold Border */}
        <div className="relative w-full aspect-[1.85/1] rounded-2xl overflow-hidden border-2 border-[#C9A84C] shadow-[0_15px_40px_rgba(255,111,0,0.3)] mb-12">
          <Image 
            src={jatra.image} 
            alt={jatra.title}
            fill 
            priority
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          {/* Subtle Devotional Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#120500]/90 via-transparent to-black/20" />
        </div>

        {/* Detailed Metadata Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 rounded-2xl border border-[#C9A84C]/20 bg-black/40 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <h3 className="text-[#FFD700] text-sm uppercase font-bold tracking-wider mb-4 border-b border-[#C9A84C]/15 pb-2 flex items-center gap-2">
              <span>🕉️</span> Deity & Holy Place
            </h3>
            <table className="w-full text-xs sm:text-sm text-[#FFF8E7]/90 border-collapse">
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-2.5 font-bold text-orange-400 w-1/3">Presiding Deity</td>
                  <td className="py-2.5">{jatra.deity}</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2.5 font-bold text-orange-400">Sacred Place</td>
                  <td className="py-2.5">{jatra.place}</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-orange-400">District</td>
                  <td className="py-2.5">{jatra.district}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-6 rounded-2xl border border-[#C9A84C]/20 bg-black/40 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <h3 className="text-[#FFD700] text-sm uppercase font-bold tracking-wider mb-4 border-b border-[#C9A84C]/15 pb-2 flex items-center gap-2">
              <span>📅</span> Sacred Timing
            </h3>
            <table className="w-full text-xs sm:text-sm text-[#FFF8E7]/90 border-collapse">
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-2.5 font-bold text-orange-400 w-1/3">Hindu Month</td>
                  <td className="py-2.5">{jatra.kannadaMonth}</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-orange-400">Duration / Days</td>
                  <td className="py-2.5">{jatra.timing}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Narrative Content - History & Legend */}
        <section className="p-8 rounded-3xl border-2 border-[#C9A84C]/25 bg-gradient-to-br from-[#270E04] to-[#120500] shadow-[0_10px_30px_rgba(0,0,0,0.5)] mb-12 relative">
          {/* Diya Graphic absolute positioned in top corner */}
          <div className="absolute top-4 right-4 opacity-40">
            <svg width="40" height="40" viewBox="0 0 64 64" fill="none" className="text-[#C9A84C]">
              <path d="M12 40C12 40 18 44 32 44C46 44 52 40 52 40C52 40 54 48 32 48C10 48 12 40 12 40Z" fill="#5C1E06" stroke="#C9A84C" />
              <path d="M16 40C32 46 48 40 48 40C48 40 42 34 32 34C22 34 16 40 16 40Z" fill="#D4900A" />
              <path d="M32 6C32 6 26 22 28 28C30 34 34 34 36 28C38 22 32 6 32 6Z" fill="#FF4500" />
            </svg>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#FFD700] mb-4 border-b border-[#C9A84C]/20 pb-2 flex items-center gap-2">
            <span>📜</span> Divine History & Legend
          </h2>
          <p className="text-sm sm:text-base text-[#FFF8E7]/90 leading-relaxed font-serif whitespace-pre-line">
            {jatra.history}
          </p>
        </section>

        {/* Sacred Rituals Timeline */}
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-[#FFD700] mb-6 border-b border-[#C9A84C]/20 pb-2 flex items-center gap-2">
            <span>🔥</span> Sacred Rituals & Processions
          </h2>
          <div className="space-y-4">
            {jatra.rituals.map((ritual, idx) => (
              <div 
                key={idx}
                className="group flex gap-4 p-5 rounded-2xl border border-[#C9A84C]/15 bg-black/35 hover:bg-[#2C1307]/30 transition-all duration-300 hover:border-[#FF8C00]"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full border border-[#C9A84C]/40 bg-[#3A1406] text-[#FFD700] flex items-center justify-center font-bold text-sm shadow-[0_2px_8px_rgba(201,168,76,0.3)] group-hover:scale-110 transition-transform">
                  {idx + 1}
                </div>
                <div className="flex-1 text-sm sm:text-base text-[#FFF8E7]/95 leading-relaxed pt-1.5">
                  {ritual}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Spiritual Significance Callout */}
        <section className="p-6 rounded-2xl border border-[#FF8C00]/40 bg-gradient-to-r from-[#FF6F00]/10 to-[#C9A84C]/10 shadow-[inset_0_0_15px_rgba(255,111,0,0.15)] mb-12">
          <h3 className="text-[#FF8C00] font-bold text-sm sm:text-base uppercase tracking-wider mb-2 flex items-center gap-2">
            <span>✨</span> Spiritual Significance
          </h3>
          <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed italic">
            &ldquo;{jatra.significance}&rdquo;
          </p>
        </section>

        {/* Back Link Button */}
        <div className="text-center pt-8 border-t border-[#C9A84C]/20">
          <LocalizedClientLink 
            href="/jatras"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider text-[#2C1810] bg-gradient-to-r from-[#FFD700] via-[#E8C56A] to-[#FF8C00] border-2 border-[#FFD700] transition-all hover:scale-105 hover:brightness-110 shadow-[0_4px_15px_rgba(201,168,76,0.4)]"
          >
            <span>Explore other Jatras</span>
            <span className="text-[14px]">🕉️</span>
          </LocalizedClientLink>
        </div>

      </main>

      {/* Decorative Footer */}
      <footer className="text-center text-xs text-[#C9A84C]/45 mt-16 py-8 border-t border-[#C9A84C]/20 bg-black/50">
        <p className="mb-2">॥ कृण्वन्तो विश्वमार्यम् ॥</p>
        <p>© JATRAMELA Store · Sacred Traditions of Karnataka</p>
      </footer>
    </div>
  )
}
