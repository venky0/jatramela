import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

// Re-throw Next.js internal errors (e.g. DYNAMIC_SERVER_USAGE) so that
// Next.js can properly fall back to dynamic rendering instead of crashing.
const isNextInternalError = (e: unknown): boolean =>
  typeof (e as any)?.digest === "string"

export const MOCK_CATEGORIES: HttpTypes.StoreProductCategory[] = [
  {
    id: "cat_clothing",
    name: "Clothing",
    handle: "clothing",
    description: "Traditional and modern clothing handcrafted with care.",
    parent_category_id: null,
    category_children: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rank: 0,
    mpath: "cat_clothing",
    metadata: {},
    parent_category: null,
    products: []
  } as any,
  {
    id: "cat_organic",
    name: "Organic Food",
    handle: "organic",
    description: "Fresh, healthy, and organic produce sourced from local farmers.",
    parent_category_id: null,
    category_children: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rank: 1,
    mpath: "cat_organic",
    metadata: {},
    parent_category: null,
    products: []
  } as any,
  {
    id: "cat_wellness",
    name: "Wellness",
    handle: "wellness",
    description: "Ayurvedic products, essential oils, and wellness remedies.",
    parent_category_id: null,
    category_children: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rank: 2,
    mpath: "cat_wellness",
    metadata: {},
    parent_category: null,
    products: []
  } as any,
  {
    id: "cat_handicrafts",
    name: "Handicrafts",
    handle: "handicrafts",
    description: "Channapatna toys, Bidriware, and wood carvings by local artisans.",
    parent_category_id: null,
    category_children: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rank: 3,
    mpath: "cat_handicrafts",
    metadata: {},
    parent_category: null,
    products: []
  } as any,
]

export const listCategories = async (query?: Record<string, unknown>) => {
  try {
    const next = {
      ...(await getCacheOptions("categories")),
    }

    const limit = query?.limit || 100

    const product_categories = await sdk.client
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

    if (!product_categories || product_categories.length === 0) {
      return MOCK_CATEGORIES
    }
    return product_categories
  } catch (error) {
    if (isNextInternalError(error)) throw error
    console.warn("Failed to fetch categories from backend, returning mock list:", error)
    return MOCK_CATEGORIES
  }
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  try {
    const handle = `${categoryHandle.join("/")}`

    const next = {
      ...(await getCacheOptions("categories")),
    }

    const category = await sdk.client
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

    if (!category) {
      return MOCK_CATEGORIES.find(c => c.handle === handle) || null
    }
    return category
  } catch (error) {
    if (isNextInternalError(error)) throw error
    console.warn(`Failed to get category by handle ${categoryHandle.join("/")} from backend, returning mock category:`, error)
    const handle = `${categoryHandle.join("/")}`
    return MOCK_CATEGORIES.find(c => c.handle === handle) || null
  }
}

