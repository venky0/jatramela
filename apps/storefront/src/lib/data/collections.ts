"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

// Re-throw Next.js internal errors (e.g. DYNAMIC_SERVER_USAGE) so that
// Next.js can properly fall back to dynamic rendering instead of crashing.
const isNextInternalError = (e: unknown): boolean =>
  typeof (e as any)?.digest === "string"

export const retrieveCollection = async (id: string) => {
  try {
    const next = {
      ...(await getCacheOptions("collections")),
    }

    return await sdk.client
      .fetch<{ collection: HttpTypes.StoreCollection }>(
        `/store/collections/${id}`,
        {
          next,
          cache: "force-cache",
        }
      )
      .then(({ collection }) => collection)
  } catch (error) {
    if (isNextInternalError(error)) throw error
    console.warn(`Failed to retrieve collection ${id} from backend, returning null:`, error)
    return null
  }
}

const MOCK_COLLECTIONS: HttpTypes.StoreCollection[] = [
  { id: "col_silk", title: "Mysore Silk & Sarees", handle: "silk-sarees" } as any,
  { id: "col_organic", title: "Organic Foods", handle: "organic-foods" } as any,
  { id: "col_wellness", title: "Wellness & Ayurveda", handle: "wellness-ayurveda" } as any,
  { id: "col_handicrafts", title: "Heritage Handicrafts", handle: "heritage-handicrafts" } as any,
  { id: "col_home", title: "Natural Home", handle: "natural-home" } as any,
  { id: "col_digital", title: "Digital Products", handle: "digital-products" } as any,
]

export const listCollections = async (
  queryParams: Record<string, string> = {}
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> => {
  try {
    const next = {
      ...(await getCacheOptions("collections")),
    }

    queryParams.limit = queryParams.limit || "100"
    queryParams.offset = queryParams.offset || "0"

    const res = await sdk.client
      .fetch<{ collections: HttpTypes.StoreCollection[]; count: number }>(
        "/store/collections",
        {
          query: queryParams,
          next,
          cache: "force-cache",
        }
      )
      .then(({ collections }) => ({ collections, count: collections.length }))

    if (!res.collections || res.collections.length === 0) {
      return { collections: MOCK_COLLECTIONS, count: MOCK_COLLECTIONS.length }
    }
    return res
  } catch (error) {
    if (isNextInternalError(error)) throw error
    console.warn("Failed to fetch collections from backend, returning empty list:", error)
    return { collections: MOCK_COLLECTIONS, count: MOCK_COLLECTIONS.length }
  }
}

export const getCollectionByHandle = async (
  handle: string
): Promise<HttpTypes.StoreCollection | null> => {
  const getMockCollection = () => {
    return MOCK_COLLECTIONS.find(c => c.handle === handle) || null
  }

  try {
    const next = {
      ...(await getCacheOptions("collections")),
    }

    const res = await sdk.client
      .fetch<HttpTypes.StoreCollectionListResponse>(`/store/collections`, {
        query: { handle, fields: "*products" },
        next,
        cache: "force-cache",
      })
      .then(({ collections }) => collections[0] || null)

    return res || getMockCollection()
  } catch (error) {
    if (isNextInternalError(error)) throw error
    console.warn(`Failed to get collection by handle ${handle} from backend, returning null:`, error)
    return getMockCollection()
  }
}
