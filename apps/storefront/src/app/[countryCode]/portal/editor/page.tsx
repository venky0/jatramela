import React from "react"
import { redirect } from "next/navigation"
import { getAdminUser, getHomeLayout } from "@lib/data/portal-actions"
import EditorClient from "./editor-client"

export default async function PortalEditorPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const countryCode = params.countryCode || "in"

  // 1. Authenticate user
  const user = await getAdminUser()
  if (!user) {
    redirect(`/${countryCode}/portal/login`)
  }

  // 2. Load CMS configuration visual layout tree
  const homeLayout = await getHomeLayout()

  return (
    <EditorClient
      user={user}
      initialLayout={homeLayout}
      countryCode={countryCode}
    />
  )
}
