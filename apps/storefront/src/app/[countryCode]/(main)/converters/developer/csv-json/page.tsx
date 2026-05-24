"use client"

import { useState } from "react"
import Link from "next/link"
import QuickSwitch from "../../components/quick-switch"

export default function CsvJsonPage() {
  const [csvText, setCsvText] = useState<string>(
    "id,name,role,location\n1,Shiva,Organizer,Vijayapura\n2,Parvati,Coordinator,Bengaluru\n3,Ganesha,Tech Support,Humnabad"
  )
  const [jsonText, setJsonText] = useState<string>(
    '[\n  {\n    "id": "1",\n    "name": "Shiva",\n    "role": "Organizer",\n    "location": "Vijayapura"\n  },\n  {\n    "id": "2",\n    "name": "Parvati",\n    "role": "Coordinator",\n    "location": "Bengaluru"\n  },\n  {\n    "id": "3",\n    "name": "Ganesha",\n    "role": "Tech Support",\n    "location": "Humnabad"\n  }\n]'
  )
  const [error, setError] = useState<string | null>(null)
  const [copyStatus, setCopyStatus] = useState<"csv" | "json" | null>(null)

  // Robust client-side CSV parser supporting quotes and escaped characters
  const parseCSV = (csv: string): any[] => {
    const lines: string[] = []
    let currentLine = ""
    let inQuotes = false

    // Character-by-character scan to handle line breaks within quotes
    for (let i = 0; i < csv.length; i++) {
      const char = csv[i]
      const nextChar = csv[i + 1]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if ((char === "\r" || char === "\n") && !inQuotes) {
        if (char === "\r" && nextChar === "\n") {
          i++ // skip double char break
        }
        lines.push(currentLine)
        currentLine = ""
      } else {
        currentLine += char
      }
    }
    if (currentLine) {
      lines.push(currentLine)
    }

    if (lines.length === 0) return []

    // Parse headers
    const headerLine = lines[0]
    const headers = parseCSVLine(headerLine)

    const result: any[] = []
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue
      const values = parseCSVLine(lines[i])
      const entry: any = {}
      headers.forEach((header, index) => {
        const valStr = values[index] !== undefined ? values[index] : ""
        // Try converting numeric/boolean values
        if (valStr === "true") entry[header] = true
        else if (valStr === "false") entry[header] = false
        else if (valStr === "null") entry[header] = null
        else if (!isNaN(Number(valStr)) && valStr.trim() !== "") entry[header] = Number(valStr)
        else entry[header] = valStr
      })
      result.push(entry)
    }

    return result
  }

  const parseCSVLine = (line: string): string[] => {
    const fields: string[] = []
    let currentField = ""
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          currentField += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === "," && !inQuotes) {
        fields.push(currentField.trim())
        currentField = ""
      } else {
        currentField += char
      }
    }
    fields.push(currentField.trim())
    return fields
  }

  // Robust client-side JSON to CSV serializer
  const serializeToCSV = (jsonArray: any[]): string => {
    if (!Array.isArray(jsonArray) || jsonArray.length === 0) return ""

    // Find all unique keys for headers
    const keys = Array.from(
      new Set(jsonArray.reduce((acc, obj) => acc.concat(Object.keys(obj)), []))
    ) as string[]

    const escapeCSVValue = (val: any): string => {
      if (val === null || val === undefined) return ""
      const str = String(val)
      if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }

    const headerRow = keys.map(escapeCSVValue).join(",")
    const rows = jsonArray.map((obj) => {
      return keys.map((key) => escapeCSVValue(obj[key])).join(",")
    })

    return [headerRow, ...rows].join("\n")
  }

  const handleCsvToJson = () => {
    try {
      setError(null)
      if (!csvText.trim()) {
        setError("CSV input is empty.")
        return
      }
      const parsed = parseCSV(csvText)
      setJsonText(JSON.stringify(parsed, null, 2))
    } catch (err: any) {
      setError("Failed to convert CSV: " + err.message)
    }
  }

  const handleJsonToCsv = () => {
    try {
      setError(null)
      if (!jsonText.trim()) {
        setError("JSON input is empty.")
        return
      }
      const parsed = JSON.parse(jsonText)
      const arrayToConvert = Array.isArray(parsed) ? parsed : [parsed]
      const csv = serializeToCSV(arrayToConvert)
      setCsvText(csv)
    } catch (err: any) {
      setError("Failed to convert JSON: " + err.message + ". Make sure the JSON is a valid array of objects.")
    }
  }

  const copyText = (text: string, type: "csv" | "json") => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus(type)
      setTimeout(() => setCopyStatus(null), 1800)
    })
  }

  return (
    <div style={{ background: "var(--bg-primary)" }} className="min-h-screen">
      {/* ── HEADER ── */}
      <section style={{ background: "var(--bg-header)" }} className="py-12 text-center relative">
        <div className="temple-border absolute top-0 left-0 right-0" />
        <div className="content-container">
          <Link href="/converters/developer" className="text-xs font-bold mb-2 block hover:opacity-80" style={{ color: "rgba(255,248,231,0.6)" }}>
            ← Back to Developer Tools
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-shimmer mb-3" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            CSV ➔ JSON / JSON ➔ CSV
          </h1>
          <p className="text-xs sm:text-sm max-w-lg mx-auto" style={{ color: "rgba(255,248,231,0.75)" }}>
            Format tabular spreadsheet data into queryable JSON arrays or serialize backend data back to standard CSV files locally.
          </p>
          <QuickSwitch currentHref="/converters/developer/csv-json" />
        </div>
        <div className="temple-border absolute bottom-0 left-0 right-0" />
      </section>

      {/* ── MAIN GRID ── */}
      <div className="content-container py-10 max-w-4xl mx-auto">
        {error && (
          <div className="p-4 mb-6 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-400">
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* CSV Box */}
          <div className="heritage-card p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-extrabold text-sm" style={{ fontFamily: "'Baloo 2', sans-serif" }}>CSV Document</h3>
              <button onClick={() => copyText(csvText, "csv")} className="text-[10px] text-[#C9A84C] font-bold">
                {copyStatus === "csv" ? "Copied! ✓" : "📋 Copy"}
              </button>
            </div>
            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="w-full h-72 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-4 text-xs font-mono text-amber-100 outline-none focus:border-[#C9A84C] resize-none"
            />
            <button onClick={handleCsvToJson} className="w-full btn-gold py-2.5 text-xs mt-4">
              Convert CSV ➔ JSON
            </button>
          </div>

          {/* JSON Box */}
          <div className="heritage-card p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-extrabold text-sm" style={{ fontFamily: "'Baloo 2', sans-serif" }}>JSON Array</h3>
              <button onClick={() => copyText(jsonText, "json")} className="text-[10px] text-[#C9A84C] font-bold">
                {copyStatus === "json" ? "Copied! ✓" : "📋 Copy"}
              </button>
            </div>
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="w-full h-72 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-4 text-xs font-mono text-amber-100 outline-none focus:border-[#C9A84C] resize-none"
            />
            <button onClick={handleJsonToCsv} className="w-full btn-primary py-2.5 text-xs mt-4">
              Convert JSON ➔ CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
