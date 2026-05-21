"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

// Re-throw Next.js internal errors (e.g. DYNAMIC_SERVER_USAGE) so that
// Next.js can properly fall back to dynamic rendering instead of crashing.
const isNextInternalError = (e: unknown): boolean =>
  typeof (e as any)?.digest === "string"

const getFallbackRegion = (idOrCountryCode: string): HttpTypes.StoreRegion => {
  const code = idOrCountryCode.startsWith("reg_")
    ? idOrCountryCode.substring(4)
    : idOrCountryCode.length === 2
      ? idOrCountryCode
      : "in"

  const name = code === "in" ? "India" : code === "us" ? "United States" : "Denmark"
  const currency = code === "in" ? "inr" : code === "us" ? "usd" : "dkk"

  return {
    id: `reg_${code}`,
    name,
    currency_code: currency,
    countries: [
      {
        id: `c_${code}`,
        iso_2: code,
        name,
        display_name: name,
      } as any
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as any
}

export const listRegions = async () => {
  try {
    const next = {
      ...(await getCacheOptions("regions")),
    }

    return await sdk.client
      .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
        method: "GET",
        next,
        cache: "no-store",
      })
      .then(({ regions }) => regions)
  } catch (error) {
    if (isNextInternalError(error)) throw error
    console.warn("Failed to fetch regions from backend, returning empty list:", error)
    return []
  }
}

export const retrieveRegion = async (id: string) => {
  try {
    const next = {
      ...(await getCacheOptions(["regions", id].join("-"))),
    }

    return await sdk.client
      .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
        method: "GET",
        next,
        cache: "no-store",
      })
      .then(({ region }) => region)
  } catch (error) {
    if (isNextInternalError(error)) throw error
    console.warn(`Failed to retrieve region ${id} from backend, returning fallback:`, error)
    return getFallbackRegion(id)
  }
}

const regionMap = new Map<string, HttpTypes.StoreRegion>()

export const getRegion = async (countryCode: string) => {
  if (regionMap.has(countryCode)) {
    return regionMap.get(countryCode)
  }

  const regions = await listRegions()

  if (!regions || regions.length === 0) {
    return getFallbackRegion(countryCode)
  }

  regions.forEach((region) => {
    region.countries?.forEach((c) => {
      regionMap.set(c?.iso_2 ?? "", region)
    })
  })

  const region = countryCode
    ? regionMap.get(countryCode)
    : regionMap.get("us")

  return region || getFallbackRegion(countryCode)
}

