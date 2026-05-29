"use server"

import { sdk } from "@lib/config"
import { cookies } from "next/headers"
import fs from "fs/promises"
import path from "path"

const CMS_CONFIG_PATH = path.join(process.cwd(), "src/lib/cms-config.json")

// Helper to get auth headers for admin requests
async function getAdminHeaders() {
  const cookieStore = await cookies()
  const token = cookieStore.get("_medusa_admin_jwt")?.value
  if (!token) {
    throw new Error("Unauthorized admin user")
  }
  return {
    authorization: `Bearer ${token}`
  }
}

export async function adminLogin(_currentState: unknown, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    // Authenticate admin user using Medusa Auth SDK
    const token = await sdk.auth.login("admin", "emailpass", { email, password })
    if (!token) {
      return { success: false, error: "Invalid credentials" }
    }

    const cookieStore = await cookies()
    cookieStore.set("_medusa_admin_jwt", token as string, {
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })

    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to log in" }
  }
}

export async function adminLogout() {
  const cookieStore = await cookies()
  cookieStore.set("_medusa_admin_jwt", "", { maxAge: -1 })
  return { success: true }
}

export async function getAdminUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("_medusa_admin_jwt")?.value

  if (!token) return null

  try {
    const res = await sdk.client.fetch<any>("/admin/users/me", {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    
    const user = res.user
    if (!user) return null

    // Read role from user metadata
    const role = user.metadata?.role || "admin"
    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: role
    }
  } catch {
    return null
  }
}

export async function getCMSConfig() {
  try {
    const data = await fs.readFile(CMS_CONFIG_PATH, "utf-8")
    return JSON.parse(data)
  } catch {
    // Return defaults if reading fails
    return {
      announcement: {
        enabled: true,
        text: "🌾 Support Karnataka's local artisans & weavers directly. Free shipping on orders above ₹999!"
      },
      hero: {
        title: "Experience Karnataka's Heritage",
        subtitle: "Handcrafted with love by local SHGs, weavers, and farmers.",
        buttonText: "Explore Marketplace"
      },
      theme: {
        primaryColor: "dasara"
      }
    }
  }
}

export async function updateCMSConfig(config: any) {
  try {
    await fs.writeFile(CMS_CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update configuration" }
  }
}

// ---- Products Management ----
export async function getPortalProducts() {
  try {
    const headers = await getAdminHeaders()
    const { products } = await sdk.client.fetch<any>("/admin/products", {
      method: "GET",
      headers
    })
    return products || []
  } catch (error) {
    console.error("Failed to get portal products", error)
    return []
  }
}

export async function addPortalProduct(productData: {
  title: string
  description: string
  subtitle?: string
  handle?: string
  price: number
  imageUrl?: string
  weight?: number
}) {
  try {
    const headers = await getAdminHeaders()
    
    // In Medusa V2, we create a product with options and variants
    const body = {
      title: productData.title,
      description: productData.description,
      subtitle: productData.subtitle || "",
      handle: productData.handle || productData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      weight: productData.weight || 500,
      images: productData.imageUrl ? [{ url: productData.imageUrl }] : [],
      options: [
        {
          title: "Standard",
          values: ["Default"]
        }
      ],
      variants: [
        {
          title: "Default",
          sku: `PROD-${Date.now()}`,
          options: {
            Standard: "Default"
          },
          prices: [
            {
              currency_code: "inr",
              amount: productData.price
            }
          ]
        }
      ],
      status: "published"
    }

    const { product } = await sdk.client.fetch<any>("/admin/products", {
      method: "POST",
      body,
      headers
    })

    return { success: true, product }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create product" }
  }
}

// ---- Orders & Fulfillment Management ----
export async function getPortalOrders() {
  try {
    const headers = await getAdminHeaders()
    // Fetch orders with items, fulfillments and payments
    const { orders } = await sdk.client.fetch<any>("/admin/orders", {
      method: "GET",
      query: {
        fields: "*items,*payment_collections.payments,*fulfillments"
      },
      headers
    })
    return orders || []
  } catch (error) {
    console.error("Failed to get portal orders", error)
    return []
  }
}

export async function fulfillAndShipPortalOrder(orderId: string, trackingNumber: string) {
  try {
    const headers = await getAdminHeaders()

    // 1. Get the order details to find items to fulfill
    const { order } = await sdk.client.fetch<any>(`/admin/orders/${orderId}`, {
      method: "GET",
      query: {
        fields: "*items"
      },
      headers
    })

    if (!order || !order.items || order.items.length === 0) {
      return { success: false, error: "Order has no items to fulfill" }
    }

    // 2. Create the fulfillment
    const fulfillmentItems = order.items.map((item: any) => ({
      id: item.id,
      quantity: item.quantity
    }))

    // In Medusa V2, we call /admin/orders/{id}/fulfillments to create fulfillment
    const fulfillmentRes = await sdk.client.fetch<any>(`/admin/orders/${orderId}/fulfillments`, {
      method: "POST",
      body: {
        items: fulfillmentItems
      },
      headers
    })

    const fulfillment = fulfillmentRes.fulfillment
    if (!fulfillment) {
      return { success: false, error: "Failed to create fulfillment" }
    }

    // 3. Mark the fulfillment as shipped and attach the tracking number
    // In Medusa V2: /admin/fulfillments/{id}/shipments
    await sdk.client.fetch<any>(`/admin/fulfillments/${fulfillment.id}/shipments`, {
      method: "POST",
      body: {
        tracking_numbers: [trackingNumber]
      },
      headers
    })

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fulfill order" }
  }
}
