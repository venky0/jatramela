import { NextResponse } from "next/server"
import { transliterateDocument, generateSuggestions } from "@lib/kannada-transliteration"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { text } = body

    if (typeof text !== "string") {
      return NextResponse.json({ error: "Invalid input. 'text' parameter must be a string." }, { status: 400 })
    }

    const transliteratedText = transliterateDocument(text)

    // Generate alternate spelling suggestions for all alphabetic words in the text
    const words = text.split(/[^a-zA-Z]+/).filter(Boolean)
    const suggestions: { [key: string]: string[] } = {}
    
    for (const word of words) {
      const lower = word.toLowerCase()
      if (!suggestions[lower]) {
        suggestions[lower] = generateSuggestions(word)
      }
    }

    return NextResponse.json({
      transliteratedText,
      suggestions
    })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 })
  }
}
