export type Alignment = "left" | "center" | "right" | "justify"

export interface Widget {
  id: string
  type: string
  content: Record<string, any>
  style: Record<string, any>
  advanced: Record<string, any>
}

export interface Column {
  id: string
  width: number
  widgets: Widget[]
  style: Record<string, any>
}

export interface Section {
  id: string
  columns: Column[]
  style: Record<string, any>
  advanced: Record<string, any>
}

export const DEFAULT_LAYOUT: Section[] = [
  // SECTION 1: HERO CAROUSEL
  {
    id: "sec-hero",
    columns: [
      {
        id: "col-hero-1",
        width: 100,
        widgets: [
          {
            id: "wid-hero-carousel",
            type: "jatra-carousel",
            content: {
              autoplay: true,
              autoplaySpeed: 8000,
              badgeText: "SACRED HERITAGE",
            },
            style: {
              textColor: "#FFF8E7",
            },
            advanced: {
              animation: "none",
              cssClass: "",
            },
          },
        ],
        style: {},
      },
    ],
    style: {
      paddingTop: "0px",
      paddingBottom: "0px",
    },
    advanced: {
      animation: "none",
    },
  },
  // SECTION 2: STATS BAR
  {
    id: "sec-stats",
    columns: [
      {
        id: "col-stats-1",
        width: 100,
        widgets: [
          {
            id: "wid-stats",
            type: "stats",
            content: {
              items: [
                { number: "2,000+", label: "Artisans Empowered" },
                { number: "500+", label: "Organic Products" },
                { number: "31", label: "Karnataka Districts" },
                { number: "₹0", label: "Platform Fee" },
              ],
            },
            style: {
              textColor: "var(--text-on-header)",
              numberColor: "var(--gold-bright)",
              backgroundColor: "var(--bg-header)",
            },
            advanced: {
              animation: "animate-fade",
            },
          },
        ],
        style: {},
      },
    ],
    style: {
      paddingTop: "0px",
      paddingBottom: "0px",
    },
    advanced: {},
  },
  // SECTION 3: CATEGORIES GRID
  {
    id: "sec-categories",
    columns: [
      {
        id: "col-cat-1",
        width: 100,
        widgets: [
          {
            id: "wid-cat-heading-label",
            type: "heading",
            content: {
              text: "What We Offer",
              tag: "p",
            },
            style: {
              textColor: "var(--gold)",
              fontSize: "0.75rem",
              fontWeight: "700",
              alignment: "center",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "8px",
            },
            advanced: {},
          },
          {
            id: "wid-cat-heading",
            type: "heading",
            content: {
              text: "Karnataka's Finest Collections",
              tag: "h2",
            },
            style: {
              textColor: "var(--primary)",
              fontSize: "2.25rem",
              fontWeight: "800",
              alignment: "center",
              marginBottom: "16px",
              hasBottomBorder: true,
            },
            advanced: {},
          },
          {
            id: "wid-cat-desc",
            type: "text-editor",
            content: {
              text: "Carefully curated from the heart of Karnataka — everything your ancestors used and loved.",
            },
            style: {
              textColor: "var(--text-muted)",
              fontSize: "1rem",
              alignment: "center",
              marginBottom: "40px",
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
            },
            advanced: {},
          },
          {
            id: "wid-categories-grid",
            type: "categories-grid",
            content: {
              items: [
                {
                  label: "Mysore Silk & Sarees",
                  emoji: "🥻",
                  href: "/categories/clothing",
                  image: "/images/karnataka-clothing.png",
                  desc: "Authentic Mysore silk, Ilkal & Kasuti sarees",
                },
                {
                  label: "Organic Foods",
                  emoji: "🌾",
                  href: "/categories/organic",
                  image: "/images/karnataka-food.png",
                  desc: "Ragi, red rice, cold-pressed oils & spices",
                },
                {
                  label: "Wellness & Ayurveda",
                  emoji: "🌿",
                  href: "/categories/wellness",
                  image: "/images/karnataka-wellness.png",
                  desc: "Neem, sandalwood, turmeric & herbal remedies",
                },
                {
                  label: "Heritage Handicrafts",
                  emoji: "🏺",
                  href: "/categories/handicrafts",
                  image: "/images/karnataka-handicrafts.png",
                  desc: "Channapatna toys, Bidriware & wood carvings",
                },
              ],
            },
            style: {},
            advanced: {},
          },
        ],
        style: {},
      },
    ],
    style: {
      paddingTop: "64px",
      paddingBottom: "64px",
    },
    advanced: {},
  },
  // SECTION 4: HEALTH SOLUTIONS (ANCIENT WISDOM)
  {
    id: "sec-solutions",
    columns: [
      {
        id: "col-sol-1",
        width: 100,
        widgets: [
          {
            id: "wid-sol-heading-label",
            type: "heading",
            content: {
              text: "Ancient Wisdom, Modern Solutions",
              tag: "p",
            },
            style: {
              textColor: "var(--gold)",
              fontSize: "0.75rem",
              fontWeight: "700",
              alignment: "center",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "8px",
            },
            advanced: {},
          },
          {
            id: "wid-sol-heading",
            type: "heading",
            content: {
              text: "Solutions to Today's Health Problems",
              tag: "h2",
            },
            style: {
              textColor: "var(--primary)",
              fontSize: "2.25rem",
              fontWeight: "800",
              alignment: "center",
              marginBottom: "16px",
              hasBottomBorder: true,
            },
            advanced: {},
          },
          {
            id: "wid-sol-desc",
            type: "text-editor",
            content: {
              text: "Our ancestors had natural solutions to every modern problem. Let's rediscover them together.",
            },
            style: {
              textColor: "var(--text-muted)",
              fontSize: "1rem",
              alignment: "center",
              marginBottom: "48px",
            },
            advanced: {},
          },
          {
            id: "wid-solutions-grid",
            type: "solutions",
            content: {
              items: [
                { problem: "Diabetes & Blood Sugar", solution: "Ragi, Jowar & Bitter Gourd Products", icon: "🩸" },
                { problem: "Hair Fall & Dandruff", solution: "Neem + Amla + Bhringraj Herbal Oils", icon: "💇" },
                { problem: "Digestive Issues", solution: "Probiotic Buttermilk Mix & Herbal Teas", icon: "🫁" },
                { problem: "Skin Problems", solution: "Turmeric & Sandalwood Skincare Range", icon: "✨" },
                { problem: "Stress & Anxiety", solution: "Ashwagandha & Brahmi Formulations", icon: "🧘" },
                { problem: "Obesity & Weight", solution: "Traditional Millets & Low-GI Grains", icon: "⚖️" },
              ],
            },
            style: {},
            advanced: {},
          },
        ],
        style: {},
      },
    ],
    style: {
      paddingTop: "64px",
      paddingBottom: "64px",
      backgroundColor: "var(--bg-section-alt)",
      borderTopWidth: "1px",
      borderBottomWidth: "1px",
      borderColor: "var(--border)",
    },
    advanced: {},
  },
  // SECTION 5: FEATURED PRODUCTS
  {
    id: "sec-featured-products",
    columns: [
      {
        id: "col-feat-prod-1",
        width: 100,
        widgets: [
          {
            id: "wid-feat-heading-label",
            type: "heading",
            content: {
              text: "Handpicked for You",
              tag: "p",
            },
            style: {
              textColor: "var(--gold)",
              fontSize: "0.75rem",
              fontWeight: "700",
              alignment: "left",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "8px",
            },
            advanced: {},
          },
          {
            id: "wid-feat-heading",
            type: "heading",
            content: {
              text: "Featured Products",
              tag: "h2",
            },
            style: {
              textColor: "var(--primary)",
              fontSize: "2rem",
              fontWeight: "800",
              alignment: "left",
              marginBottom: "40px",
              hasBottomBorder: true,
            },
            advanced: {},
          },
          {
            id: "wid-featured-products-grid",
            type: "featured-products",
            content: {
              items: [
                { name: "Ragi Malt Mix", price: "₹ 249", tag: "Bestseller", emoji: "🌾", desc: "Traditional Karnataka breakfast mix with finger millet. Rich in calcium & iron." },
                { name: "Mysore Silk Saree", price: "₹ 4,999", tag: "Premium", emoji: "🥻", desc: "Pure Mysore silk with gold zari border. GI certified handwoven." },
                { name: "Neem Tulsi Herbal Soap", price: "₹ 89", tag: "Natural", emoji: "🌿", desc: "100% natural handcrafted soap. No chemicals, no parabens." },
                { name: "Cold-Pressed Coconut Oil", price: "₹ 399", tag: "Organic", emoji: "🥥", desc: "Traditional wooden-press extraction. Retains all nutrients." },
                { name: "Channapatna Wooden Toys", price: "₹ 299", tag: "Handmade", emoji: "🪆", desc: "Safe lacquered wooden toys made in GI-tagged Channapatna, Karnataka." },
                { name: "Organic Turmeric Powder", price: "₹ 149", tag: "Pure", emoji: "🟡", desc: "Lakadong turmeric with 7%+ curcumin. No additives." },
              ],
            },
            style: {},
            advanced: {},
          },
        ],
        style: {},
      },
    ],
    style: {
      paddingTop: "64px",
      paddingBottom: "64px",
    },
    advanced: {},
  },
  // SECTION 6: WHY JATRAMELA (THE PROMISE)
  {
    id: "sec-promise",
    columns: [
      {
        id: "col-prom-1",
        width: 100,
        widgets: [
          {
            id: "wid-prom-heading-label",
            type: "heading",
            content: {
              text: "Why Choose Us",
              tag: "p",
            },
            style: {
              textColor: "rgba(255,248,231,0.6)",
              fontSize: "0.75rem",
              fontWeight: "700",
              alignment: "center",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "8px",
            },
            advanced: {},
          },
          {
            id: "wid-prom-heading",
            type: "heading",
            content: {
              text: "The Jatramela Promise",
              tag: "h2",
            },
            style: {
              textColor: "var(--gold-bright)",
              fontSize: "2.25rem",
              fontWeight: "800",
              alignment: "center",
              marginBottom: "40px",
              hasShimmerEffect: true,
            },
            advanced: {},
          },
          {
            id: "wid-promise-grid",
            type: "promise",
            content: {
              items: [
                { icon: "🌾", title: "100% Organic", desc: "Zero chemicals, traditional farming methods from Karnataka's fertile lands" },
                { icon: "🤝", title: "Farm to Door", desc: "Direct from Karnataka artisans and farmers — no middlemen, fair prices" },
                { icon: "🏡", title: "Traditional Wisdom", desc: "Age-old South Indian knowledge curated by experts and village elders" },
                { icon: "♻️", title: "Zero Waste Living", desc: "Eco-conscious packaging, reusable vessels, sustainable lifestyle solutions" },
                { icon: "💊", title: "Modern Solutions", desc: "Ancient remedies solving today's lifestyle diseases & health problems" },
                { icon: "🇮🇳", title: "Made in Karnataka", desc: "Empowering 2,000+ local artisans and farmers across all 31 districts" },
              ],
            },
            style: {},
            advanced: {},
          },
        ],
        style: {},
      },
    ],
    style: {
      paddingTop: "64px",
      paddingBottom: "64px",
      backgroundColor: "var(--bg-header)",
    },
    advanced: {},
  },
  // SECTION 7: OUR STORY (ABOUT)
  {
    id: "sec-about",
    columns: [
      {
        id: "col-about-img",
        width: 50,
        widgets: [
          {
            id: "wid-about-image",
            type: "image",
            content: {
              src: "/images/karnataka-farm.png",
              alt: "Karnataka Organic Farm",
              badgeText: "🌾 Our Farmers, Kaveri basin, Karnataka",
              badgeSubtext: "Practicing organic farming for 3+ generations",
            },
            style: {
              borderRadius: "16px",
              height: "380px",
              borderWidth: "3px",
              borderColor: "var(--gold)",
              borderStyle: "solid",
            },
            advanced: {},
          },
        ],
        style: {
          paddingRight: "20px",
        },
      },
      {
        id: "col-about-content",
        width: 50,
        widgets: [
          {
            id: "wid-about-heading-label",
            type: "heading",
            content: {
              text: "Our Story",
              tag: "p",
            },
            style: {
              textColor: "var(--gold)",
              fontSize: "0.75rem",
              fontWeight: "700",
              alignment: "left",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "8px",
            },
            advanced: {},
          },
          {
            id: "wid-about-heading",
            type: "heading",
            content: {
              text: "Preserving Karnataka's Ancient Food Wisdom",
              tag: "h2",
            },
            style: {
              textColor: "var(--primary)",
              fontSize: "2.25rem",
              fontWeight: "800",
              alignment: "left",
              marginBottom: "24px",
              hasBottomBorder: true,
            },
            advanced: {},
          },
          {
            id: "wid-about-text-1",
            type: "text-editor",
            content: {
              text: "Our grandmothers knew the secrets to a healthy life. They cooked in brass vessels, used turmeric daily, wore natural cotton, and ate only what the land gave. We are on a mission to bring those age-old practices back to every Indian household.",
            },
            style: {
              textColor: "var(--text-muted)",
              fontSize: "1rem",
              lineHeight: "1.625",
              marginBottom: "20px",
            },
            advanced: {},
          },
          {
            id: "wid-about-text-2",
            type: "text-editor",
            content: {
              text: "Started in Mysuru, Jatramela connects Karnataka's farmers and artisans directly with families across India — cutting out middlemen, ensuring fair pay to producers, and delivering the purest products to your doorstep.",
            },
            style: {
              textColor: "var(--text-muted)",
              fontSize: "1rem",
              lineHeight: "1.625",
              marginBottom: "32px",
            },
            advanced: {},
          },
          {
            id: "wid-about-buttons",
            type: "button-group",
            content: {
              buttons: [
                { text: "Read Our Story", link: "/about", type: "primary" },
                { text: "Shop Now", link: "/store", type: "gold" },
              ],
            },
            style: {
              gap: "16px",
            },
            advanced: {},
          },
        ],
        style: {
          paddingLeft: "20px",
        },
      },
    ],
    style: {
      paddingTop: "64px",
      paddingBottom: "64px",
    },
    advanced: {
      animation: "animate-slide-up",
    },
  },
  // SECTION 8: TESTIMONIALS
  {
    id: "sec-testimonials",
    columns: [
      {
        id: "col-test-1",
        width: 100,
        widgets: [
          {
            id: "wid-test-heading-label",
            type: "heading",
            content: {
              text: "Customer Love",
              tag: "p",
            },
            style: {
              textColor: "var(--gold)",
              fontSize: "0.75rem",
              fontWeight: "700",
              alignment: "center",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "8px",
            },
            advanced: {},
          },
          {
            id: "wid-test-heading",
            type: "heading",
            content: {
              text: "What Our Customers Say",
              tag: "h2",
            },
            style: {
              textColor: "var(--primary)",
              fontSize: "2.25rem",
              fontWeight: "800",
              alignment: "center",
              marginBottom: "40px",
              hasBottomBorder: true,
            },
            advanced: {},
          },
          {
            id: "wid-testimonials-grid",
            type: "testimonials",
            content: {
              items: [
                { name: "Savitha R.", location: "Bengaluru", text: "My family's health transformed after switching to Jatramela's ragi and red rice. My children's immunity has improved tremendously!", stars: 5 },
                { name: "Manjunath K.", location: "Mysuru", text: "The Mysore silk saree I got for my wife's birthday was absolutely stunning. Pure quality, authentic weave. Worth every rupee!", stars: 5 },
                { name: "Padma S.", location: "Dharwad", text: "I replaced all my kitchen oils with cold-pressed coconut and sesame from Jatramela. My cholesterol levels dropped significantly.", stars: 5 },
              ],
            },
            style: {},
            advanced: {},
          },
        ],
        style: {},
      },
    ],
    style: {
      paddingTop: "64px",
      paddingBottom: "64px",
      backgroundColor: "var(--bg-section-alt)",
      borderTopWidth: "1px",
      borderBottomWidth: "1px",
      borderColor: "var(--border)",
    },
    advanced: {},
  },
  // SECTION 9: NEWSLETTER CTA
  {
    id: "sec-newsletter",
    columns: [
      {
        id: "col-news-1",
        width: 100,
        widgets: [
          {
            id: "wid-newsletter",
            type: "newsletter",
            content: {
              label: "Stay Connected",
              title: "Join the Back-to-Roots Movement",
              subtitle: "Get weekly recipes, health tips rooted in Karnataka tradition, exclusive offers and new product launches — delivered to your inbox. 100% free.",
              buttonText: "Subscribe 🌺",
              placeholder: "your@email.com",
            },
            style: {
              backgroundColor: "var(--bg-header)",
              borderColor: "rgba(201,168,76,0.3)",
              borderWidth: "2px",
            },
            advanced: {},
          },
        ],
        style: {},
      },
    ],
    style: {
      paddingTop: "64px",
      paddingBottom: "64px",
    },
    advanced: {},
  },
]
