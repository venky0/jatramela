import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { ThemeProvider } from "@lib/context/theme-provider"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "Jatramela — Organic & Digital Marketplace",
    template: "%s | Jatramela",
  },
  description:
    "India's AI-powered marketplace for organic foods, natural clothing, and digital products. Chemical-free. Handpicked. Delivered to your door.",
  keywords: [
    "organic marketplace india",
    "digital products india",
    "chemical free food",
    "natural clothing",
    "jatramela",
    "online store india",
    "razorpay checkout",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: getBaseURL(),
    siteName: "Jatramela",
    title: "Jatramela — Organic & Digital Marketplace",
    description:
      "India's AI-powered marketplace for organic foods, natural clothing, and digital products.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jatramela — Organic & Digital Marketplace",
    description:
      "India's AI-powered marketplace for organic foods, natural clothing, and digital products.",
  },
  themeColor: "#059669",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider>
          <main className="relative">{props.children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
