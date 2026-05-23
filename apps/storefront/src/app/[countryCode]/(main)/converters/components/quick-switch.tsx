"use client"

import { useRouter, useParams } from "next/navigation"

const ALL_TOOLS = [
  {
    category: "Image & Graphic Tools",
    tools: [
      { name: "AI Vector Logo Converter", href: "/converters/graphics/vectorizer" },
      { name: "WebP Image Optimizer", href: "/converters/graphics/webp-optimizer" },
      { name: "SVG to Raster", href: "/converters/graphics/svg-rasterizer" },
      { name: "Color Palette Extractor", href: "/converters/graphics/color-extractor" },
    ]
  },
  {
    category: "Local Script & Cultural Tools",
    tools: [
      { name: "English ➔ Kannada Phonetic", href: "/converters/cultural/kannada-transliteration" },
      { name: "Nudi/Baraha ➔ Unicode", href: "/converters/cultural/unicode-converter" },
      { name: "Gregorian ➔ Hindu Calendar", href: "/converters/cultural/hindu-calendar" },
    ]
  },
  {
    category: "Developer & Data Tools",
    tools: [
      { name: "JSON ➔ YAML / YAML ➔ JSON", href: "/converters/developer/json-yaml" },
      { name: "CSV ➔ JSON / JSON ➔ CSV", href: "/converters/developer/csv-json" },
      { name: "Base64 Encoder/Decoder", href: "/converters/developer/base64" },
      { name: "Markdown ➔ HTML", href: "/converters/developer/markdown-html" },
    ]
  }
]

export default function QuickSwitch({ currentHref }: { currentHref: string }) {
  const router = useRouter()
  const params = useParams()
  const countryCode = (params.countryCode as string) || "us"

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value) {
      router.push(`/${countryCode}${value}`)
    }
  }

  // Normalize currentHref to match the option value
  const normalizedHref = currentHref.replace(/^\/[a-z]{2}/, "")

  return (
    <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs shadow-lg">
      <span className="text-neutral-400 font-bold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
        🔄 Quick Switch Tool:
      </span>
      <select
        value={normalizedHref}
        onChange={handleChange}
        className="bg-transparent text-[#C9A84C] font-extrabold outline-none cursor-pointer pr-2 focus:text-shimmer"
        style={{ fontFamily: "'Baloo 2', sans-serif" }}
      >
        <option value="" disabled className="bg-neutral-950 text-neutral-500">Select Converter...</option>
        {ALL_TOOLS.map(cat => (
          <optgroup key={cat.category} label={cat.category} className="bg-neutral-950 text-neutral-500 font-normal">
            {cat.tools.map(tool => (
              <option key={tool.href} value={tool.href} className="bg-neutral-950 text-[#FFF8E7] font-bold">
                {tool.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  )
}
