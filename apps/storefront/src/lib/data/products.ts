"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

// Re-throw Next.js internal errors (e.g. DYNAMIC_SERVER_USAGE) so that
// Next.js can properly fall back to dynamic rendering instead of crashing.
const isNextInternalError = (e: unknown): boolean =>
  typeof (e as any)?.digest === "string"

const MOCK_PRODUCTS: HttpTypes.StoreProduct[] = [
  {
    id: "prod_mysore_silk",
    title: "Pure Mysore Silk Zari Saree",
    handle: "pure-mysore-silk-zari-saree",
    description: "An exquisite traditional pure Mysore silk saree adorned with rich golden zari borders. Hand-woven with love in Karnataka.",
    thumbnail: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
    images: [
      { id: "img_mysore_silk_1", url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800" }
    ] as any,
    collection_id: "col_silk",
    collection: {
      id: "col_silk",
      title: "Mysore Silk & Sarees",
      handle: "silk-sarees"
    } as any,
    categories: [
      {
        id: "cat_clothing",
        name: "Clothing",
        handle: "clothing"
      }
    ] as any,
    options: [
      {
        id: "opt_color",
        title: "Color",
        values: [
          { id: "val_red", value: "Royal Red" },
          { id: "val_blue", value: "Peacock Blue" }
        ]
      }
    ] as any,
    variants: [
      {
        id: "var_mysore_silk_red",
        title: "Royal Red Saree",
        sku: "MYS-SILK-RED",
        options: [
          { id: "v_opt_color", value: "Royal Red", option_id: "opt_color" }
        ] as any,
        calculated_price: {
          calculated_amount: 8499,
          original_amount: 9999,
          currency_code: "inr",
          calculated_price: {
            price_list_type: "sale"
          }
        }
      }
    ] as any,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as any,
  {
    id: "prod_byadgi_chilli",
    title: "Organic Byadgi Chilli Powder",
    handle: "organic-byadgi-chilli-powder",
    description: "Authentic, vibrant red Byadgi Chilli Powder known for its gorgeous color and mild heat. Sourced from organic farms in Dharwad.",
    thumbnail: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=800",
    images: [
      { id: "img_byadgi_chilli_1", url: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=800" }
    ] as any,
    collection_id: "col_organic",
    collection: {
      id: "col_organic",
      title: "Organic Foods",
      handle: "organic-foods"
    } as any,
    categories: [
      {
        id: "cat_organic",
        name: "Organic Food",
        handle: "organic"
      }
    ] as any,
    options: [] as any,
    variants: [
      {
        id: "var_byadgi_chilli_1",
        title: "500g Pack",
        sku: "BYA-CHL-500G",
        options: [] as any,
        calculated_price: {
          calculated_amount: 249,
          original_amount: 299,
          currency_code: "inr",
          calculated_price: {
            price_list_type: "sale"
          }
        }
      }
    ] as any,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as any,
  {
    id: "prod_sandalwood_soap",
    title: "Heritage Pure Sandalwood Soap",
    handle: "heritage-pure-sandalwood-soap",
    description: "Infused with pure natural sandalwood oil from Mysore, this rich soap hydrates, heals, and keeps your skin smelling divine.",
    thumbnail: "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=800",
    images: [
      { id: "img_sandalwood_soap_1", url: "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=800" }
    ] as any,
    collection_id: "col_wellness",
    collection: {
      id: "col_wellness",
      title: "Wellness & Ayurveda",
      handle: "wellness-ayurveda"
    } as any,
    categories: [
      {
        id: "cat_wellness",
        name: "Wellness",
        handle: "wellness"
      }
    ] as any,
    options: [] as any,
    variants: [
      {
        id: "var_sandalwood_soap_1",
        title: "Standard Bar 150g",
        sku: "SAN-SOAP-150G",
        options: [] as any,
        calculated_price: {
          calculated_amount: 149,
          original_amount: 199,
          currency_code: "inr",
          calculated_price: {
            price_list_type: "sale"
          }
        }
      }
    ] as any,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as any,
  {
    id: "prod_channapatna_toy",
    title: "Channapatna Wooden Toy Train",
    handle: "channapatna-wooden-toy-train",
    description: "Handcrafted toy train made from ivory wood and colored using non-toxic natural vegetable dyes by traditional artisans of Channapatna.",
    thumbnail: "https://images.unsplash.com/photo-1537758061216-049a37e504c5?auto=format&fit=crop&q=80&w=800",
    images: [
      { id: "img_channapatna_toy_1", url: "https://images.unsplash.com/photo-1537758061216-049a37e504c5?auto=format&fit=crop&q=80&w=800" }
    ] as any,
    collection_id: "col_handicrafts",
    collection: {
      id: "col_handicrafts",
      title: "Heritage Handicrafts",
      handle: "heritage-handicrafts"
    } as any,
    categories: [
      {
        id: "cat_handicrafts",
        name: "Handicrafts",
        handle: "handicrafts"
      }
    ] as any,
    options: [] as any,
    variants: [
      {
        id: "var_channapatna_toy_1",
        title: "Classic Toy Train",
        sku: "CHA-TRA-CLASSIC",
        options: [] as any,
        calculated_price: {
          calculated_amount: 699,
          original_amount: 799,
          currency_code: "inr",
          calculated_price: {
            price_list_type: "sale"
          }
        }
      }
    ] as any,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as any,
  {
    id: "prod_copper_jug",
    title: "Traditional Pure Copper Water Jug",
    handle: "traditional-pure-copper-water-jug",
    description: "Hand-hammered pure copper water jug for storing water overnight, providing traditional Ayurvedic health benefits.",
    thumbnail: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800",
    images: [
      { id: "img_copper_jug_1", url: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800" }
    ] as any,
    collection_id: "col_home",
    collection: {
      id: "col_home",
      title: "Natural Home",
      handle: "natural-home"
    } as any,
    categories: [
      {
        id: "cat_handicrafts",
        name: "Handicrafts",
        handle: "handicrafts"
      }
    ] as any,
    options: [] as any,
    variants: [
      {
        id: "var_copper_jug_1",
        title: "Copper Jug 1.5L",
        sku: "COP-JUG-1.5L",
        options: [] as any,
        calculated_price: {
          calculated_amount: 1299,
          original_amount: 1499,
          currency_code: "inr",
          calculated_price: {
            price_list_type: "sale"
          }
        }
      }
    ] as any,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as any,
  {
    id: "prod_flute_album",
    title: "Carnatic Devotional Flute Album",
    handle: "carnatic-devotional-flute-album",
    description: "A peaceful collection of instrumental flute tracks playing traditional Carnatic ragas. Perfect for meditation and focus.",
    thumbnail: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=800",
    images: [
      { id: "img_flute_album_1", url: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=800" }
    ] as any,
    collection_id: "col_digital",
    collection: {
      id: "col_digital",
      title: "Digital Products",
      handle: "digital-products"
    } as any,
    categories: [
      {
        id: "cat_wellness",
        name: "Wellness",
        handle: "wellness"
      }
    ] as any,
    options: [] as any,
    variants: [
      {
        id: "var_flute_album_1",
        title: "Digital Audio Pack (MP3/FLAC)",
        sku: "CAR-FLUT-ALB",
        options: [] as any,
        calculated_price: {
          calculated_amount: 199,
          original_amount: 299,
          currency_code: "inr",
          calculated_price: {
            price_list_type: "sale"
          }
        }
      }
    ] as any,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as any
]

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  const getMockProductsResponse = () => {
    let products = [...MOCK_PRODUCTS]
    
    // Filter by handle if specified
    if (queryParams?.handle) {
      products = products.filter(p => p.handle === queryParams.handle)
    }
    
    // Filter by collection if specified
    if (queryParams?.collection_id) {
      const ids = Array.isArray(queryParams.collection_id) 
        ? queryParams.collection_id 
        : [queryParams.collection_id]
      products = products.filter(p => ids.includes(p.collection_id))
    }

    // Filter by category if specified
    if (queryParams?.category_id) {
      const ids = Array.isArray(queryParams.category_id) 
        ? queryParams.category_id 
        : [queryParams.category_id]
      products = products.filter(p => 
        p.categories?.some(cat => ids.includes(cat.id))
      )
    }

    return {
      response: {
        products,
        count: products.length,
      },
      nextPage: null,
      queryParams,
    }
  }

  if (!region) {
    return getMockProductsResponse()
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  try {
    const res = await sdk.client
      .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
        `/store/products`,
        {
          method: "GET",
          query: {
            limit,
            offset,
            region_id: region?.id,
            fields:
              "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,",
            ...queryParams,
          },
          headers,
          next,
          cache: "no-store",
        }
      )
      .then(({ products, count }) => {
        const nextPage = count > offset + limit ? pageParam + 1 : null

        return {
          response: {
            products,
            count,
          },
          nextPage: nextPage,
          queryParams,
        }
      })

    // If backend returns empty list (no items initialized), serve the mocks
    if (!res.response.products || res.response.products.length === 0) {
      return getMockProductsResponse()
    }
    return res
  } catch (error) {
    if (isNextInternalError(error)) throw error
    console.warn("Failed to fetch products from backend, returning empty list:", error)
    return getMockProductsResponse()
  }
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12

  const {
    response: { products, count },
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 100,
    },
    countryCode,
  })

  const sortedProducts = sortProducts(products, sortBy)

  const pageParam = (page - 1) * limit

  const nextPage = count > pageParam + limit ? pageParam + limit : null

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count,
    },
    nextPage,
    queryParams,
  }
}
