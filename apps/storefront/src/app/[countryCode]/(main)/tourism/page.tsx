"use client"

import { useState } from "react"
import Link from "next/link"

interface Package {
  id: string
  category: "temple" | "youth" | "corporate"
  title: string
  tagline: string
  price: string
  duration: string
  difficulty: "Easy" | "Moderate" | "Hard"
  startPoint: string
  tags: string[]
  marketAnalysis: {
    transit: string
    accommodation: string
    food: string
  }
  itinerary: { day: number; title: string; desc: string }[]
  inclusions: string[]
  exclusions: string[]
}

const TOURISM_PACKAGES: Package[] = [
  // ── TEMPLE PILGRIMAGES ──
  {
    id: "temple-malnad",
    category: "temple",
    title: "Malnad Sacred Valley Pilgrimage",
    tagline: "Discover Hoysala stone carvings and the holy shrines of the Western Ghats.",
    price: "₹12,500",
    duration: "4 Days / 3 Nights",
    difficulty: "Easy",
    startPoint: "Bengaluru",
    tags: ["Hoysala Art", "Western Ghats", "River Shrines"],
    marketAnalysis: {
      transit: "Executive AC Mercedes-Benz/Volvo coach from Bengaluru to Hassan; dedicated 4x4 mountain jeeps for Sringeri hill-ghat paths.",
      accommodation: "1 night in a premium heritage hotel in Hassan, 2 nights in traditional temple cottages / riverside guest houses in Sringeri.",
      food: "Traditional Malnad Brahmin cuisine served on banana leaves. Includes local specialties like Akki Rotti, Tambli (herbal cold soup), steamed Kadubu, and fresh pineapple payasa."
    },
    itinerary: [
      { day: 1, title: "Hoysala Legacy in Belur & Halebidu", desc: "Drive from Bengaluru. Explore the 12th-century Chennakeshava Temple (Belur) and the twin Hoysaleswara structures (Halebidu) with a local historian." },
      { day: 2, title: "Horanadu Abundance Shrine", desc: "Depart for Horanadu. Cross the scenic Charmadi Ghats to visit Sri Annapoorneshwari Temple. Dine on sacred temple prasadam lunch." },
      { day: 3, title: "Sringeri Sharada Peetham", desc: "Drive to Sringeri on the banks of Tunga River. Seek blessings at Sri Sharadamba Temple and admire the 12-pillar zodiac-aligned Vidyashankara Temple." },
      { day: 4, title: "Chikmagalur Viewpoint & Return", desc: "Morning riverside chants. Return drive to Bengaluru via Mullayanagiri scenic foothills." }
    ],
    inclusions: ["All transportation in Volvo coaches", "Heritage hotel lodging", "Malnad style meals (Breakfast/Dinner)", "VIP Darshan passes", "Local guides"],
    exclusions: ["Personal pooja expenses", "Camera fees", "Extra meals outside the menu"]
  },
  {
    id: "temple-karavali",
    category: "temple",
    title: "Karavali Coast & Sacred Waters Tour",
    tagline: "Travel the shoreline from Mangaluru to the ancient shrines of Udupi and Gokarna.",
    price: "₹16,200",
    duration: "5 Days / 4 Nights",
    difficulty: "Easy",
    startPoint: "Mangaluru",
    tags: ["Coastal Route", "Udupi Krishna", "Gokarna Shiva"],
    marketAnalysis: {
      transit: "Private AC Toyota Innova / Ertiga for the entire National Highway 66 (NH-66) coastline run.",
      accommodation: "1 night in Mangaluru (Premium business hotel), 2 nights in Udupi (Beachfront resort), 1 night in Gokarna (Traditional heritage lodge).",
      food: "Traditional Karavali vegetarian cuisine (Udupi Krishna Mutt prasadam style meals, Pathrode, jackfruit-steamed idlis, and coastal sweet coconut milk)."
    },
    itinerary: [
      { day: 1, title: "Riverine Shrine of Kateel", desc: "Arrive in Mangaluru. Visit the river-island temple of Sri Durgaparameshwari in Kateel. Drive to Udupi for night stay." },
      { day: 2, title: "Udupi Krishna Mutt & Malpe Beach", desc: "Morning darshan of Lord Krishna through the Kanakana Kindi. Afternoon boat ride to St. Mary's Island. Sunset at Malpe." },
      { day: 3, title: "Kollur Mookambika Foothills", desc: "Drive north to Kollur located in the dense Souparnika valley. Attend the grand evening Mangala Arati of Goddess Mookambika." },
      { day: 4, title: "Murudeshwar Shiva & Gokarna Soul", desc: "Visit Murudeshwar's towering ocean-front Shiva statue. Drive to Gokarna to visit the Atmalinga at Mahabaleshwar Temple." },
      { day: 5, title: "Coastal Departure", desc: "Sunrise beach walk in Gokarna. Return drive to Mangaluru airport/railway station." }
    ],
    inclusions: ["Private AC SUV transport", "Resort & Heritage stays", "Udupi traditional breakfasts & dinners", "Coracle/Boat transfers"],
    exclusions: ["Special pooja ticket costs", "Watersports at Malpe Beach"]
  },
  {
    id: "temple-pancha",
    category: "temple",
    title: "Dakshina Kashi & Royal Heritage Trail",
    tagline: "Explore the sand-buried shrines of Talakadu and the hilltop temple of Melukote.",
    price: "₹9,800",
    duration: "3 Days / 2 Nights",
    difficulty: "Easy",
    startPoint: "Mysuru",
    tags: ["Royal Palace", "Kaveri River", "Sand Shrines"],
    marketAnalysis: {
      transit: "AC Tempo Traveller (12-seater luxury setup) with pushback seats for group comfort.",
      accommodation: "2 nights in Mysuru inside a classified Heritage Palace hotel.",
      food: "Royal Mysore style vegetarian dishes. Menu includes Mysore Masala Dosa, Bisi Bele Bath, Shavige Payasa, and authentic Mysore Pak."
    },
    itinerary: [
      { day: 1, title: "Chamundeshwari hill & Royal Palace", desc: "Arrive in Mysuru. Drive up Chamundi Hills to visit Sri Chamundeshwari Temple. Evening illuminated tour of Mysuru Palace." },
      { day: 2, title: "Talakadu Pancha Linga Sand Temples", desc: "Drive to Talakadu on the banks of Kaveri River. Walk on the sands to explore the five ancient Shiva temples. River coracle ride." },
      { day: 3, title: "Melukote Cheluvanarayana Swamy", desc: "Drive to Melukote. Climb the steps to Yoga Narasimha Temple and visit Kalyani pond. Return to Mysuru." }
    ],
    inclusions: ["Group Tempo Traveller transit", "Heritage hotel lodging", "All entry tickets", "Traditional Mysore meals"],
    exclusions: ["Personal pooja items", "Shopping expenditures"]
  },
  {
    id: "temple-hampi",
    category: "temple",
    title: "Ancient Empires: Hampi & Badami Trail",
    tagline: "Witness the stone-cut cave temples of Badami and the majestic ruins of Hampi.",
    price: "₹18,500",
    duration: "4 Days / 3 Nights",
    difficulty: "Moderate",
    startPoint: "Hubballi",
    tags: ["UNESCO Site", "Vijayanagara Ruins", "Chalukya Caves"],
    marketAnalysis: {
      transit: "AC Sedan for intercity travel; eco-friendly electric golf-carts for Hampi ruins transport.",
      accommodation: "1 night in Badami (Heritage Hotel), 2 nights in Hampi (Boutique cottage resort by the river).",
      food: "Traditional North Karnataka Jolada Rotti meals. Features Jowar flatbread, Ennegayi (stuffed brinjal), peanut chutney, and Sajje (pearl millet) rotis."
    },
    itinerary: [
      { day: 1, title: "Badami Caves & Bhutanatha Temple", desc: "Drive from Hubballi to Badami. Explore the 6th-century rock-cut cave shrines and the lakeside temple ruins." },
      { day: 2, title: "UNESCO Pattadakal & Aihole", desc: "Explore Pattadakal's temple clusters (union of Nagara & Dravidian styles) and Aihole's Durga temple. Drive to Hampi." },
      { day: 3, title: "Hampi Empire Splendor", desc: "Visit Virupaksha Temple, Stone Chariot at Vittala Temple, and King's Balance. Witness sunset from Hemakuta Hill." },
      { day: 4, title: "Tungabhadra Coracle & Departure", desc: "Traditional coracle ride on the Tungabhadra River. Return drive to Hubballi for departure." }
    ],
    inclusions: ["All intercity & local transport", "Cottage resort stays", "UNESCO monument entry fees", "Coracle ride", "Heritage guide"],
    exclusions: ["Guide gratuities", "Personal expenses"]
  },
  {
    id: "temple-subramanya",
    category: "temple",
    title: "Sacred Hills & Subramanya Trail",
    tagline: "Traverse the Western Ghats to seek blessings at Dharmasthala and Kukke.",
    price: "₹11,200",
    duration: "4 Days / 3 Nights",
    difficulty: "Easy",
    startPoint: "Bengaluru",
    tags: ["Western Ghats", "Subramanya", "Scenic Drive"],
    marketAnalysis: {
      transit: "Multi-axle AC Sleeper coach from Bengaluru to Kukke; local mountain jeeps for Coorg sightseeing.",
      accommodation: "1 night in Kukke Subramanya (Temple cottages), 2 nights in Madikeri (Plantation homestay).",
      food: "Traditional Malnad & Kodava style vegetarian dishes, including Kadubu, Akki Rotti, bamboo shoot pickles, and herbal tea."
    },
    itinerary: [
      { day: 1, title: "Dharmasthala Sri Manjunatha", desc: "Drive from Bengaluru to Dharmasthala. Visit Sri Manjunatha Temple and bathe in the holy Netravati River." },
      { day: 2, title: "Kukke Subramanya Pooja", desc: "Visit Kukke Subramanya Temple nestled under Kumara Parvatha. Attend morning poojas. Proceed to Coorg." },
      { day: 3, title: "Talakaveri & Bhagamandala", desc: "Drive to Talakaveri (origin of Kaveri River) atop Brahmagiri hills. Climb peak steps. Visit Triveni Sangama." },
      { day: 4, title: "Coorg Estate Walk & Return", desc: "Morning walk in coffee plantation. Return drive to Bengaluru." }
    ],
    inclusions: ["Coach transit", "Homestay & Cottage lodging", "Traditional breakfasts & dinners"],
    exclusions: ["Special pooja tickets", "Personal tips"]
  },
  // ── YOUTH & ADVENTURE ──
  {
    id: "youth-kp",
    category: "youth",
    title: "Ultimate Kumara Parvatha Peak Expedition",
    tagline: "Conquer Karnataka's most strenuous and rewarding mountain trek.",
    price: "₹6,800",
    duration: "3 Days / 2 Nights",
    difficulty: "Hard",
    startPoint: "Bengaluru",
    tags: ["Trekking", "Wild Camping", "Endurance"],
    marketAnalysis: {
      transit: "Overnight KSRTC Sleeper bus to Kukke; local off-road jeeps to forest checkpost base camp.",
      accommodation: "1 night campsite camping in professional trekking tents; 1 night homestay in Kukke.",
      food: "High-energy endurance meals. Jaggery-peanut chikki, ragi mudde, dense lentil broth, bananas, and high-carb trekking foods."
    },
    itinerary: [
      { day: 1, title: "Ascent to Bhattara Mane", desc: "Overnight transit to Kukke. Start trekking 6km through dense forest to Bhattara Mane (Basecamp). Camp and watch stars." },
      { day: 2, title: "Summiting Shesha & Kumara Parvatha", desc: "Start at 4:00 AM. Climb steep grasslands to Shesha Parvatha and final Kumara Parvatha peak (1712m). Descend to Kukke." },
      { day: 3, title: "Waterfalls & Return", desc: "Relaxing natural stream bath at local waterfall. Return overnight bus to Bengaluru." }
    ],
    inclusions: ["Forest department trekking permits", "Experienced trek guides", "Tents & Sleeping bags", "High-energy meals"],
    exclusions: ["Personal porter charges", "Snacks"]
  },
  {
    id: "youth-kudremukh",
    category: "youth",
    title: "Peak Conquest: Mullayanagiri & Kudremukh Ridge",
    tagline: "Scale the highest peak in Karnataka and explore the horse-faced ridge.",
    price: "₹8,500",
    duration: "3 Days / 2 Nights",
    difficulty: "Moderate",
    startPoint: "Bengaluru",
    tags: ["Shola Forests", "Highest Peak", "Western Ghats"],
    marketAnalysis: {
      transit: "Private AC Tempo Traveller from Bengaluru; local forest department jeeps for Kudremukh zone entry.",
      accommodation: "2 nights in a rustic valley-view adventure homestay in Kudremukh.",
      food: "Authentic Malnad village style food. Warm rice, local sambar, horse gram soup, fresh buttermilk, and estate filter coffee."
    },
    itinerary: [
      { day: 1, title: "Mullayanagiri Sunrise Hike", desc: "Depart Bengaluru. Reach Chikmagalur. Short climb to Mullayanagiri peak (highest in Karnataka). Drive to Kudremukh." },
      { day: 2, title: "Kudremukh Ridge Trek", desc: "18km challenge. Trek through UNESCO-listed Shola forest meadows to the horse-shaped ridge. View wild bisons." },
      { day: 3, title: "Somavathi Waterfalls & Return", desc: "Morning dip in Somavathi waterfalls. Scenic return drive to Bengaluru." }
    ],
    inclusions: ["Trek guide & forest permits", "Off-road jeep transit", "Homestay lodging", "All village style meals"],
    exclusions: ["Extra snacks", "Waterfall rappelling activity fee"]
  },
  {
    id: "youth-gokarna",
    category: "youth",
    title: "Gokarna Coast Cliff Trek & Surf Camp",
    tagline: "Cliff-hop across five golden beaches and camp by the Arabian Sea.",
    price: "₹7,500",
    duration: "3 Days / 2 Nights",
    difficulty: "Easy",
    startPoint: "Bengaluru",
    tags: ["Beach Camping", "Surfing", "Water Sports"],
    marketAnalysis: {
      transit: "Overnight train or sleeper bus from Bengaluru to Gokarna; local auto-rickshaws for short transits.",
      accommodation: "2 nights beach camping in tents under palm trees at Paradise Beach.",
      food: "Karavali sea-side food, grilled vegetarian dishes, and coastal cafe style breakfasts (ragi cookies, local coconut juices)."
    },
    itinerary: [
      { day: 1, title: "5-Beach Cliff Trek", desc: "Trek along cliff edges linking Gokarna's famous beaches (Kudle ➔ Om ➔ Half Moon ➔ Paradise). Setup tents at Paradise." },
      { day: 2, title: "Surfing & Jet Skiing", desc: "Surf training at Om Beach. Afternoon jet-skiing and banana boat rides. Sunset beach volley." },
      { day: 3, title: "Mirjan Fort Ruins", desc: "Explore the moss-covered stone walls of Mirjan Fort. Evening return train to Bengaluru." }
    ],
    inclusions: ["Beach tents & sleeping mats", "Surf lessons & surfboard rental", "Water sports", "Campfire", "2 breakfasts & 2 dinners"],
    exclusions: ["Cafe lunch costs", "Train tickets"]
  },
  {
    id: "youth-dandeli",
    category: "youth",
    title: "Dandeli Jungle Adventure & River Rafting",
    tagline: "Navigate the white-water rapids of Kali River and sleep in the jungle.",
    price: "₹9,200",
    duration: "3 Days / 2 Nights",
    difficulty: "Moderate",
    startPoint: "Hubballi",
    tags: ["River Rafting", "Treehouses", "Night Safari"],
    marketAnalysis: {
      transit: "AC Explorer cab from Hubballi to Dandeli jungle camp; open-top safari jeeps for forest drives.",
      accommodation: "2 nights in Dandeli (Eco jungle treehouse or luxury tents with wooden platforms).",
      food: "Rustic jungle camp buffet. Spicy local curries, fire-grilled skewers, local rotis, and country sweets."
    },
    itinerary: [
      { day: 1, title: "Jungle Walk & Hornbill Spotting", desc: "Arrive in Dandeli forest camp. Afternoon guided canopy walk. Spot giant Hornbills. Night campfire." },
      { day: 2, title: "White Water Rafting on Kali River", desc: "Full-scale river rafting (9km, Grade 3 rapids). Kayaking and natural river jacuzzi pool bath." },
      { day: 3, title: "Syntheri Rocks & Crocodile Park", desc: "Visit the monolithic Syntheri granite rocks. Crocodile sighting. Return drive to Hubballi." }
    ],
    inclusions: ["Kali River rafting & safety gear", "Canopy guide", "Jungle resort treehouse stay", "All buffet meals"],
    exclusions: ["Jungle safari park fee", "Camera licenses"]
  },
  {
    id: "youth-netravati",
    category: "youth",
    title: "Netravati Peak Cloud Meadow Trek",
    tagline: "Walk above the clouds on the green grassy meadows of Kudremukh forest.",
    price: "₹6,200",
    duration: "3 Days / 2 Nights",
    difficulty: "Moderate",
    startPoint: "Bengaluru",
    tags: ["Cloud Bed", "Ridge Walks", "Waterfalls"],
    marketAnalysis: {
      transit: "AC Traveller from Bengaluru to Kudremukh forest gate; local jeeps for peak trail access.",
      accommodation: "2 nights in a hill-view valley homestay.",
      food: "Traditional Malnad countryside meals. Hot rice, spicy sambar, local pickles, and home-brewed filter coffee."
    },
    itinerary: [
      { day: 1, title: "Reach Kudremukh Valley", desc: "Drive from Bengaluru. Reach Kudremukh homestay. Excursion to local hidden waterfall. Evening bonfire." },
      { day: 2, title: "Netravati Peak Summit", desc: "Trek 12km through shola patches to the peak. Stand above a bed of clouds. Return to homestay." },
      { day: 3, title: "Tea Estate Walk & Return", desc: "Walk through local organic tea estates. Return drive to Bengaluru." }
    ],
    inclusions: ["Forest department permissions & guides", "Mountain jeep transit", "Homestay lodging", "All meals"],
    exclusions: ["Insurance cover", "Personal items"]
  },
  // ── CORPORATE PLANS ──
  {
    id: "corp-estate",
    category: "corporate",
    title: "Premium Coffee Plantation Leadership Retreat",
    tagline: "Elevate team bonding and leadership strategy amidst luxury coffee estates.",
    price: "₹24,500",
    duration: "3 Days / 2 Nights",
    difficulty: "Easy",
    startPoint: "Bengaluru",
    tags: ["5-Star Resort", "Team Building", "Conference Hall"],
    marketAnalysis: {
      transit: "Executive Volvo AC Coach direct from the corporate office to the resort with on-board refreshments.",
      accommodation: "2 nights in luxury villas at Evolve Back Coorg or The Serai Chikmagalur.",
      food: "Gourmet multi-cuisine spreads, live barbecue grills, gala dinners, and private coffee-tasting masterclasses with a certified barista."
    },
    itinerary: [
      { day: 1, title: "Volvo Drive & Welcome Campfire", desc: "Volvo transfer. Traditional welcome drink. Team ice-breaker and cocktail campfire dinner." },
      { day: 2, title: "Strategy Workshop & Outbound Outings", desc: "Morning workshop in state-of-the-art conference hall. Afternoon estate treasure hunt and outbound activities." },
      { day: 3, title: "Coffee Brewing & Return", desc: "Barista-led coffee brewing masterclass. Return drive in Volvo coach to corporate office." }
    ],
    inclusions: ["End-to-end Volvo Coach transport", "5-Star Luxury Resort Stay", "Outbound team building coaches", "Conference hall hire & AV", "All gourmet meals & Cocktail drinks"],
    exclusions: ["Resort spa services", "Room services"]
  }
]

export default function TourismPortalPage() {
  const [activeTab, setActiveTab] = useState<"all" | "temple" | "youth" | "corporate">("all")
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  
  // Inquiry form states
  const [inquiryName, setInquiryName] = useState("")
  const [inquiryEmail, setInquiryEmail] = useState("")
  const [inquiryPhone, setInquiryPhone] = useState("")
  const [travelersCount, setTravelersCount] = useState("2")
  const [inquiryDate, setInquiryDate] = useState("")
  const [inquiryNotes, setInquiryNotes] = useState("")
  const [isInquirySubmitting, setIsInquirySubmitting] = useState(false)
  const [inquirySuccess, setInquirySuccess] = useState(false)

  const filteredPackages = activeTab === "all" 
    ? TOURISM_PACKAGES 
    : TOURISM_PACKAGES.filter(p => p.category === activeTab)

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inquiryName || !inquiryEmail || !inquiryPhone) {
      alert("Please fill in Name, Email, and Phone.")
      return
    }
    setIsInquirySubmitting(true)
    setTimeout(() => {
      setIsInquirySubmitting(false)
      setInquirySuccess(true)
      // reset form
      setTimeout(() => {
        setInquirySuccess(false)
        setInquiryName("")
        setInquiryEmail("")
        setInquiryPhone("")
        setInquiryNotes("")
        setInquiryDate("")
      }, 5000)
    }, 1500)
  }

  return (
    <div style={{ background: "var(--bg-primary)" }} className="min-h-screen pb-16">
      {/* ── HEADER ── */}
      <section style={{ background: "var(--bg-header)" }} className="py-16 text-center relative">
        <div className="temple-border absolute top-0 left-0 right-0" />
        <div className="content-container">
          <p className="section-label mb-3" style={{ color: "rgba(255,248,231,0.6)" }}>Karnataka Tourism Services</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-shimmer mb-4" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            Explore Scenic Karnataka
          </h1>
          <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: "rgba(255,248,231,0.75)" }}>
            Discover culturally rich temple paths, high-energy mountain treks, coastal surfcamps, and premium corporate retreats, mapped with strategic transportation, accommodations, and traditional foods.
          </p>
        </div>
        <div className="temple-border absolute bottom-0 left-0 right-0" />
      </section>

      {/* ── MAIN WORKSPACE ── */}
      <div className="content-container py-10 max-w-6xl">
        
        {/* Tab Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 border-b pb-4" style={{ borderColor: "var(--border)" }}>
          <button 
            onClick={() => setActiveTab("all")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === "all" 
                ? "bg-[var(--gold)] text-[#2C1810]" 
                : "bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            🌟 All Packages
          </button>
          <button 
            onClick={() => setActiveTab("temple")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === "temple" 
                ? "bg-[var(--gold)] text-[#2C1810]" 
                : "bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            🛕 Temple Pilgrimages
          </button>
          <button 
            onClick={() => setActiveTab("youth")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === "youth" 
                ? "bg-[var(--gold)] text-[#2C1810]" 
                : "bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            ⛰️ Adventure & Trekking
          </button>
          <button 
            onClick={() => setActiveTab("corporate")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === "corporate" 
                ? "bg-[var(--gold)] text-[#2C1810]" 
                : "bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            🏢 Corporate Retreats
          </button>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map(pkg => (
            <div key={pkg.id} className="heritage-card p-5 flex flex-col justify-between h-[390px] border-[var(--border)]">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    pkg.category === "temple" 
                      ? "bg-[var(--primary-glow)] border border-[var(--primary)] text-[var(--primary)]" 
                      : pkg.category === "youth"
                        ? "bg-[var(--green-glow)] border border-[var(--green)] text-[var(--green)]"
                        : "bg-[var(--gold-glow)] border border-[var(--gold)] text-[var(--gold)]"
                  }`}>
                    {pkg.category === "temple" ? "🛕 Pilgrimage" : pkg.category === "youth" ? "⛰️ Adventure" : "🏢 Corporate"}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] font-bold">{pkg.duration}</span>
                </div>

                <h3 className="text-lg font-extrabold text-[var(--text-primary)] mb-1.5 line-clamp-1" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                  {pkg.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mb-4 line-clamp-2 leading-relaxed">
                  {pkg.tagline}
                </p>

                {/* Spec Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {pkg.tags.map(t => (
                    <span key={t} className="text-[9px] px-2 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border)]">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Specs List */}
                <div className="space-y-1.5 text-[11px] text-[var(--text-muted)] border-t border-dashed pt-3 border-[var(--border)]">
                  <p>📍 **Starts**: {pkg.startPoint}</p>
                  <p>💪 **Difficulty**: {pkg.difficulty}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-dashed pt-3 mt-4 border-[var(--border)]">
                <div>
                  <p className="text-[9px] text-[var(--text-subtle)] uppercase tracking-widest leading-none">Starting from</p>
                  <p className="text-base font-extrabold text-[var(--gold)] mt-0.5">{pkg.price}</p>
                </div>
                <button 
                  onClick={() => setSelectedPackage(pkg)}
                  className="btn-gold py-2 px-5 text-xs rounded-xl"
                >
                  View Strategy Plan →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── OVERLAY PACKAGE DRAWER ── */}
      {selectedPackage && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedPackage(null)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-2xl bg-[var(--bg-primary)] border-l border-[var(--border)] shadow-2xl h-full flex flex-col justify-between z-10 animate-fade">
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-[var(--border)] flex justify-between items-center" style={{ background: "var(--bg-header)" }}>
              <div className="text-left">
                <span className="text-[10px] font-extrabold uppercase text-[var(--gold)] tracking-widest">
                  {selectedPackage.category === "temple" ? "🛕 Pilgrimage Package" : selectedPackage.category === "youth" ? "⛰️ Adventure Package" : "🏢 Corporate Plan"}
                </span>
                <h2 className="text-xl font-extrabold text-shimmer mt-0.5" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                  {selectedPackage.title}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedPackage(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white text-sm transition-all"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 text-[var(--text-muted)]">
              
              {/* Stats overview */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
                <div>
                  <p className="text-[10px] text-[var(--text-subtle)] uppercase">Duration</p>
                  <p className="text-xs font-bold text-[var(--text-primary)] mt-0.5">{selectedPackage.duration}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[var(--text-subtle)] uppercase">Start Point</p>
                  <p className="text-xs font-bold text-[var(--text-primary)] mt-0.5">{selectedPackage.startPoint}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[var(--text-subtle)] uppercase">Difficulty</p>
                  <p className="text-xs font-bold text-[var(--text-primary)] mt-0.5">{selectedPackage.difficulty}</p>
                </div>
              </div>

              {/* In-Depth Market Logistics Analysis */}
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-[var(--gold)] border-b pb-2 uppercase tracking-wide" style={{ fontFamily: "'Baloo 2', sans-serif", borderColor: "var(--border)" }}>
                  📋 Strategic Market & Logistics Analysis
                </h3>
                
                <div className="space-y-4 text-xs leading-relaxed">
                  <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                    <p className="font-extrabold text-[var(--text-primary)] mb-1 flex items-center gap-1.5">🚌 Transportation & Transit Logistics</p>
                    <p className="text-[var(--text-muted)]">{selectedPackage.marketAnalysis.transit}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                    <p className="font-extrabold text-[var(--text-primary)] mb-1 flex items-center gap-1.5">🏨 Accommodation Standards</p>
                    <p className="text-[var(--text-muted)]">{selectedPackage.marketAnalysis.accommodation}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                    <p className="font-extrabold text-[var(--text-primary)] mb-1 flex items-center gap-1.5">🍲 Traditional Karnataka Cuisine & Food Plan</p>
                    <p className="text-[var(--text-muted)]">{selectedPackage.marketAnalysis.food}</p>
                  </div>
                </div>
              </div>

              {/* Day-by-Day Itinerary */}
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-[var(--gold)] border-b pb-2 uppercase tracking-wide" style={{ fontFamily: "'Baloo 2', sans-serif", borderColor: "var(--border)" }}>
                  📍 Day-By-Day Itinerary
                </h3>
                
                <div className="relative border-l border-[var(--border)] pl-4 ml-2.5 space-y-6">
                  {selectedPackage.itinerary.map(item => (
                    <div key={item.day} className="relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-[24px] top-1.5 bg-[var(--gold)] text-[var(--bg-primary)] font-extrabold text-[9px] w-[18px] h-[18px] rounded-full flex items-center justify-center ring-4 ring-[var(--bg-primary)]">
                        {item.day}
                      </span>
                      <h4 className="text-xs font-bold text-[var(--text-primary)]">{item.title}</h4>
                      <p className="text-[11px] text-[var(--text-muted)] mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--border)]">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[var(--green)]">Inclusions</h4>
                  <ul className="list-disc pl-4 text-[11px] text-[var(--text-muted)] space-y-1">
                    {selectedPackage.inclusions.map(inc => (
                      <li key={inc}>{inc}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[var(--primary)]">Exclusions</h4>
                  <ul className="list-disc pl-4 text-[11px] text-[var(--text-muted)] space-y-1">
                    {selectedPackage.exclusions.map(exc => (
                      <li key={exc}>{exc}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Interactive Booking Form */}
              <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] space-y-4">
                <h4 className="text-xs font-bold text-[var(--gold)] uppercase tracking-wider text-center">
                  Book or Inquire About This Package
                </h4>
                
                {inquirySuccess ? (
                  <div className="p-4 rounded-xl bg-[var(--green)]/10 border border-[var(--green)] text-[var(--green)] text-xs text-center font-bold animate-pulse">
                    🎉 Inquiry Submitted! Our travel expert will contact you within 2 hours with a custom quote.
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-[var(--text-muted)] mb-1 block">Full Name</label>
                        <input 
                          type="text" 
                          required 
                          value={inquiryName}
                          onChange={e => setInquiryName(e.target.value)}
                          className="field-input text-xs py-2 bg-[var(--bg-primary)] border-[var(--border)] text-[var(--text-primary)]" 
                          placeholder="Venkatesh N."
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[var(--text-muted)] mb-1 block">Phone Number</label>
                        <input 
                          type="tel" 
                          required 
                          value={inquiryPhone}
                          onChange={e => setInquiryPhone(e.target.value)}
                          className="field-input text-xs py-2 bg-[var(--bg-primary)] border-[var(--border)] text-[var(--text-primary)]" 
                          placeholder="+91 98XXX XXXXX"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="text-[10px] text-[var(--text-muted)] mb-1 block">Email Address</label>
                        <input 
                          type="email" 
                          required 
                          value={inquiryEmail}
                          onChange={e => setInquiryEmail(e.target.value)}
                          className="field-input text-xs py-2 bg-[var(--bg-primary)] border-[var(--border)] text-[var(--text-primary)]" 
                          placeholder="name@domain.com"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[var(--text-muted)] mb-1 block">Travelers</label>
                        <select 
                          value={travelersCount}
                          onChange={e => setTravelersCount(e.target.value)}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--gold)]"
                        >
                          <option value="1">1 Person</option>
                          <option value="2">2 People</option>
                          <option value="3-5">3 - 5 People</option>
                          <option value="5-10">5 - 10 People</option>
                          <option value="10+">10+ People</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-[var(--text-muted)] mb-1 block">Preferred Date of Travel</label>
                      <input 
                        type="date"
                        value={inquiryDate}
                        onChange={e => setInquiryDate(e.target.value)}
                        className="field-input text-xs py-2 bg-[var(--bg-primary)] border-[var(--border)] text-[var(--text-primary)]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-[var(--text-muted)] mb-1 block">Special Requests / Notes</label>
                      <textarea 
                        rows={2} 
                        value={inquiryNotes}
                        onChange={e => setInquiryNotes(e.target.value)}
                        className="field-input text-xs py-2 bg-[var(--bg-primary)] border-[var(--border)] text-[var(--text-primary)]" 
                        placeholder="Specify any dietary needs or hotel upgrades..."
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={isInquirySubmitting}
                      className="w-full btn-gold py-2.5 text-xs rounded-xl"
                    >
                      {isInquirySubmitting ? "Sending Inquiry..." : "🚀 Submit Custom Inquiry"}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[var(--border)] flex items-center justify-between bg-[var(--bg-secondary)]/40">
              <div>
                <p className="text-[10px] text-[var(--text-subtle)] uppercase">Estimated Budget</p>
                <p className="text-lg font-extrabold text-[var(--gold)] mt-0.5">{selectedPackage.price} <span className="text-[10px] font-normal text-[var(--text-subtle)]">/ person</span></p>
              </div>
              <button 
                onClick={() => setSelectedPackage(null)}
                className="py-2 px-6 text-xs rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all font-bold"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
