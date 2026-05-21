import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const cwd = process.cwd()
    let filePath = path.join(cwd, "src/lib/data/jatra-updates.json")
    
    try {
      await fs.access(filePath)
    } catch {
      filePath = path.join(cwd, "apps/storefront/src/lib/data/jatra-updates.json")
    }

    const fileContent = await fs.readFile(filePath, "utf-8")
    const data = JSON.parse(fileContent)
    
    // Add caching header to prevent aggressive browser caching, but allow dynamic fetching
    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    })
  } catch (error) {
    console.error("Error reading jatra-updates.json:", error)
    return NextResponse.json({ error: "Failed to load jatra updates" }, { status: 500 })
  }
}
