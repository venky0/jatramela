"use client"

// Karnataka district map — product origin badge
// Shows the district name + a coloured pin matching the region

const DISTRICT_COLORS: Record<string, string> = {
  "Mysuru":     "#7B3F00",
  "Kodagu":     "#2D5016",
  "Bengaluru":  "#1a3a6b",
  "Mandya":     "#8B5E00",
  "Hassan":     "#4a7c2f",
  "Haveri":     "#8B1A1A",
  "Bagalkot":   "#7a4500",
  "Dharwad":    "#5c3a1e",
  "Bidar":      "#2c4a7c",
  "Kalaburagi": "#5a2d00",
  "default":    "#C9A84C",
}

// Map product keywords → districts
const PRODUCT_DISTRICT_MAP: Record<string, string> = {
  "Mysore Silk":       "Mysuru",
  "Mysuru Silk":       "Mysuru",
  "Ilkal":             "Bagalkot",
  "Dharwad":           "Dharwad",
  "Byadagi":           "Haveri",
  "Channapatna":       "Ramanagara",
  "Bidriware":         "Bidar",
  "Jaggery":           "Mandya",
  "Ragi":              "Hassan",
  "Red Rice":          "Mysuru",
  "Coconut Oil":       "Kodagu",
  "Turmeric":          "Kodagu",
  "Horse Gram":        "Kalaburagi",
  "Sesame":            "Kalaburagi",
  "Sandalwood":        "Mysuru",
  "Forest Honey":      "Kodagu",
  "Ashwagandha":       "Dharwad",
  "Brahmi":            "Bengaluru",
}

function getDistrict(title: string): string | null {
  for (const [keyword, district] of Object.entries(PRODUCT_DISTRICT_MAP)) {
    if (title.toLowerCase().includes(keyword.toLowerCase())) return district
  }
  return null
}

export default function KarnatakaOriginBadge({ productTitle }: { productTitle: string }) {
  const district = getDistrict(productTitle)
  if (!district) return null

  const color = DISTRICT_COLORS[district] ?? DISTRICT_COLORS["default"]

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
      style={{
        background: `${color}22`,
        border: `1px solid ${color}66`,
        color: "#FFF8E7",
      }}
      title={`Sourced from ${district} district, Karnataka`}
    >
      {/* Map pin icon */}
      <svg width="10" height="13" viewBox="0 0 10 13" fill="none">
        <path
          d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8c0-2.76-2.24-5-5-5z"
          fill={color}
        />
        <circle cx="5" cy="5" r="2" fill="white" />
      </svg>
      <span style={{ color: "#FFF8E7" }}>
        {district}, Karnataka
      </span>
      <span className="opacity-50">·</span>
      <span style={{ color: "#C9A84C" }}>GI Origin</span>
    </div>
  )
}
