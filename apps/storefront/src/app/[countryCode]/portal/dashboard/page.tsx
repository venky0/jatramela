import React from "react"
import { redirect } from "next/navigation"
import {
  getAdminUser,
  getCMSConfig,
  getPortalOrders,
  getPortalProducts,
} from "@lib/data/portal-actions"
import PortalDashboardClient from "./dashboard-client"

export default async function PortalDashboardPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const countryCode = params.countryCode || "in"

  // 1. Authenticate user
  const user = await getAdminUser()
  if (!user) {
    redirect(`/${countryCode}/portal/login`)
  }

  // 2. Fetch required dashboard data based on role or for general use
  const [products, orders, cmsConfig] = await Promise.all([
    getPortalProducts(),
    getPortalOrders(),
    getCMSConfig(),
  ])

  return (
    <PortalDashboardClient
      user={user}
      initialProducts={products}
      initialOrders={orders}
      initialCmsConfig={cmsConfig}
      countryCode={countryCode}
    />
  )
}
