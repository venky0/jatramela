import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

// Re-throw Next.js internal errors (e.g. DYNAMIC_SERVER_USAGE) so that
// Next.js can properly fall back to dynamic rendering instead of crashing.
const isNextInternalError = (e: unknown): boolean =>
  typeof (e as any)?.digest === "string"

export const listCategories = async (query?: Record<string, unknown>) => {
  try {
    const next = {
      ...(await getCacheOptions("categories")),
    }

    const limit = query?.limit || 100

    return await sdk.client
      .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
        "/store/product-categories",
        {
          query: {
            fields:
              "*category_children, *products, *parent_category, *parent_category.parent_category",
            limit,
            ...query,
          },
          next,
          cache: "force-cache",
        }
      )
      .then(({ product_categories }) => product_categories)
  } catch (error) {
    if (isNextInternalError(error)) throw error
    console.warn("Failed to fetch categories from backend, returning empty list:", error)
    return []
  }
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  try {
    const handle = `${categoryHandle.join("/")}`

    const next = {
      ...(await getCacheOptions("categories")),
    }

    return await sdk.client
      .fetch<HttpTypes.StoreProductCategoryListResponse>(
        `/store/product-categories`,
        {
          query: {
            fields: "*category_children, *products",
            handle,
          },
          next,
          cache: "force-cache",
        }
      )
      .then(({ product_categories }) => product_categories[0] || null)
  } catch (error) {
    if (isNextInternalError(error)) throw error
    console.warn(`Failed to get category by handle ${categoryHandle.join("/")} from backend, returning null:`, error)
    return null
  }
}
