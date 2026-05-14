import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://jatramela.in/in"
  const now = new Date()

  const staticPages = [
    { url: "https://jatramela.in/in",            priority: 1.0, changeFrequency: "daily" as const },
    { url: `${base}/store`,                       priority: 0.9, changeFrequency: "daily" as const },
    { url: `${base}/categories/organic`,          priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${base}/categories/clothing`,         priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${base}/categories/wellness`,         priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${base}/categories/handicrafts`,      priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${base}/about`,                       priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${base}/contact`,                     priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${base}/blog`,                        priority: 0.7, changeFrequency: "weekly" as const },
    { url: `${base}/faq`,                         priority: 0.6, changeFrequency: "monthly" as const },
    { url: `${base}/privacy`,                     priority: 0.4, changeFrequency: "yearly" as const },
    { url: `${base}/terms`,                       priority: 0.4, changeFrequency: "yearly" as const },
    { url: `${base}/shipping`,                    priority: 0.5, changeFrequency: "monthly" as const },
    { url: `${base}/returns`,                     priority: 0.5, changeFrequency: "monthly" as const },
  ]

  return staticPages.map(p => ({
    url: p.url,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }))
}
