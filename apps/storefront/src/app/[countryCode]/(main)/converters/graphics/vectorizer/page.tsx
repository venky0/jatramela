import { Metadata } from "next"
import ConvertersClient from "./converters-client"

export const metadata: Metadata = {
  title: "AI Vector Logo Converter — Layered EPS & SVG | Jatramela",
  description: "Convert logo images (PNG, JPEG, WebP) into professional, layered vector EPS and SVG files. Adjust color clustering, simplify paths, toggle Illustrator outlines, and download vector assets.",
}

export default function VectorizerPage() {
  return <ConvertersClient />
}
