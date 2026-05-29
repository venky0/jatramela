import { Metadata } from "next"
import Hero from "@modules/home/components/hero"
import { getRegion } from "@lib/data/regions"
import { getHomeLayout } from "@lib/data/portal-actions"
import DynamicRenderer from "@modules/home/components/dynamic-renderer"

export const metadata: Metadata = {
  title: "Jatramela — Back to Roots Karnataka",
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  const region = await getRegion(countryCode)
  if (!region) {
    return null
  }

  // Fetch visual editor visual layout
  const layout = await getHomeLayout()

  return (
    <>
      <DynamicRenderer layout={layout} />
    </>
  )
}
