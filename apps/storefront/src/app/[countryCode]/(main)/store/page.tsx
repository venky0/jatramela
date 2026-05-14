import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Shop All | Jatramela — Back to Roots Karnataka",
  description: "Explore authentic Karnataka heritage products — organic food, handwoven silk sarees, Ayurvedic wellness, and traditional handicrafts. Directly from artisans to your door.",
  keywords: ["Karnataka", "organic food", "silk saree", "Ayurvedic", "handicrafts", "Jatramela"],
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
    />
  )
}
