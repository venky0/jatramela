import { Metadata } from "next"
import ConvertersDashboard from "./converters-dashboard"

export const metadata: Metadata = {
  title: "Online Conversion Tools Suite | Jatramela",
  description: "Browse our collections of in-browser online utility tools. Optimize images, convert between text formats, transliterate Kannada script, parse JSON, and more.",
}

export default function ConvertersPage() {
  return <ConvertersDashboard />
}
