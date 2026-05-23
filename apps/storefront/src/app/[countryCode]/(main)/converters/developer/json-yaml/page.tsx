"use client"

import { useState } from "react"
import Link from "next/link"
import QuickSwitch from "../../components/quick-switch"

export default function JsonYamlPage() {
  const [jsonText, setJsonText] = useState<string>('{\n  "store": "Jatramela",\n  "location": "Karnataka",\n  "active": true,\n  "categories": [\n    "Clothing",\n    "Organic Food",\n    "Handicrafts"\n  ]\n}')
  const [yamlText, setYamlText] = useState<string>("store: Jatramela\nlocation: Karnataka\nactive: true\ncategories:\n  - Clothing\n  - Organic Food\n  - Handicrafts")
  const [error, setError] = useState<string | null>(null)
  const [copyStatus, setCopyStatus] = useState<"json" | "yaml" | null>(null)

  // Lightweight JSON to YAML stringifier
  const stringifyYAML = (obj: any, indent = 0): string => {
    const spaces = " ".repeat(indent)
    if (obj === null) return "null"
    if (typeof obj === "undefined") return "undefined"
    if (typeof obj !== "object") {
      if (typeof obj === "string") return `"${obj}"`
      return String(obj)
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) return "[]"
      return obj.map(item => {
        if (typeof item === "object") {
          const itemYaml = stringifyYAML(item, indent + 2).trimStart()
          return `${spaces}- ${itemYaml}`
        }
        return `${spaces}- ${stringifyYAML(item, 0)}`
      }).join("\n")
    }

    const keys = Object.keys(obj)
    if (keys.length === 0) return "{}"
    return keys.map(key => {
      const val = obj[key]
      if (typeof val === "object" && val !== null) {
        return `${spaces}${key}:\n${stringifyYAML(val, indent + 2)}`
      }
      return `${spaces}${key}: ${stringifyYAML(val, 0)}`
    }).join("\n")
  }

  // Lightweight YAML to JSON parser
  const parseYAML = (yaml: string): any => {
    const lines = yaml.split("\n")
    const result: any = {}
    let currentObj = result
    const stack: { indent: number; obj: any }[] = [{ indent: -2, obj: result }]

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (!line.trim() || line.trim().startsWith("#")) continue

      const indent = line.search(/\S/)
      const trimmed = line.trim()
      
      // Determine array items vs object keys
      if (trimmed.startsWith("-")) {
        // Simple array parsing approximation
        const valStr = trimmed.substring(1).trim()
        let val: any = valStr
        if (valStr === "true") val = true
        if (valStr === "false") val = false
        if (valStr === "null") val = null
        if (!isNaN(Number(valStr)) && valStr !== "") val = Number(valStr)

        // Find parent object in stack
        let parent = stack[stack.length - 1]
        while (stack.length > 1 && parent.indent >= indent) {
          stack.pop()
          parent = stack[stack.length - 1]
        }

        // If parent is not an array, convert or initialize
        const parentKey = Object.keys(parent.obj).pop()
        if (parentKey) {
          if (!Array.isArray(parent.obj[parentKey])) {
            parent.obj[parentKey] = []
          }
          parent.obj[parentKey].push(val)
        }
        continue
      }

      const separatorIdx = trimmed.indexOf(":")
      if (separatorIdx === -1) continue

      const key = trimmed.substring(0, separatorIdx).trim()
      const valStr = trimmed.substring(separatorIdx + 1).trim()
      
      let val: any = valStr
      if (valStr === "") {
        val = {}
      } else if (valStr === "true") {
        val = true
      } else if (valStr === "false") {
        val = false
      } else if (valStr === "null") {
        val = null
      } else if (!isNaN(Number(valStr))) {
        val = Number(valStr)
      } else if (valStr.startsWith('"') && valStr.endsWith('"')) {
        val = valStr.substring(1, valStr.length - 1)
      }

      // Stack alignment
      let parent = stack[stack.length - 1]
      while (stack.length > 1 && parent.indent >= indent) {
        stack.pop()
        parent = stack[stack.length - 1]
      }

      parent.obj[key] = val
      
      if (typeof val === "object" && val !== null) {
        stack.push({ indent, obj: val })
      }
    }
    return result
  }

  const handleJsonToYaml = () => {
    try {
      setError(null)
      const parsed = JSON.parse(jsonText)
      const yaml = stringifyYAML(parsed)
      setYamlText(yaml)
    } catch (err: any) {
      setError("Invalid JSON format: " + err.message)
    }
  }

  const handleYamlToJson = () => {
    try {
      setError(null)
      const parsed = parseYAML(yamlText)
      const json = JSON.stringify(parsed, null, 2)
      setJsonText(json)
    } catch (err: any) {
      setError("YAML Parsing Error: " + err.message)
    }
  }

  const copyText = (text: string, type: "json" | "yaml") => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus(type)
      setTimeout(() => setCopyStatus(null), 1800)
    })
  }

  return (
    <div style={{ background: "var(--bg-primary)" }}>
      {/* ── HEADER ── */}
      <section style={{ background: "var(--bg-header)" }} className="py-12 text-center relative">
        <div className="temple-border absolute top-0 left-0 right-0" />
        <div className="content-container">
          <Link href="/converters/developer" className="text-xs font-bold mb-2 block hover:opacity-80" style={{ color: "rgba(255,248,231,0.6)" }}>
            ← Back to Developer Tools
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-shimmer mb-3" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            JSON ➔ YAML / YAML ➔ JSON
          </h1>
          <p className="text-xs sm:text-sm max-w-lg mx-auto" style={{ color: "rgba(255,248,231,0.75)" }}>
            Format and translate data layouts between JSON and YAML syntax structures instantly.
          </p>
          <QuickSwitch currentHref="/converters/developer/json-yaml" />
        </div>
        <div className="temple-border absolute bottom-0 left-0 right-0" />
      </section>

      <div className="content-container py-10 max-w-4xl mx-auto">
        {error && (
          <div className="p-4 mb-6 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-400">
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* JSON Box */}
          <div className="heritage-card p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-extrabold text-sm" style={{ fontFamily: "'Baloo 2', sans-serif" }}>JSON Document</h3>
              <button onClick={() => copyText(jsonText, "json")} className="text-[10px] text-[#C9A84C] font-bold">
                {copyStatus === "json" ? "Copied! ✓" : "📋 Copy"}
              </button>
            </div>
            <textarea value={jsonText} onChange={e => setJsonText(e.target.value)}
              className="w-full h-72 bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-xs font-mono text-amber-100 outline-none focus:border-[#C9A84C] resize-none"
            />
            <button onClick={handleJsonToYaml} className="w-full btn-gold py-2.5 text-xs mt-4">
              Convert JSON ➔ YAML
            </button>
          </div>

          {/* YAML Box */}
          <div className="heritage-card p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-extrabold text-sm" style={{ fontFamily: "'Baloo 2', sans-serif" }}>YAML Document</h3>
              <button onClick={() => copyText(yamlText, "yaml")} className="text-[10px] text-[#C9A84C] font-bold">
                {copyStatus === "yaml" ? "Copied! ✓" : "📋 Copy"}
              </button>
            </div>
            <textarea value={yamlText} onChange={e => setYamlText(e.target.value)}
              className="w-full h-72 bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-xs font-mono text-amber-100 outline-none focus:border-[#C9A84C] resize-none"
            />
            <button onClick={handleYamlToJson} className="w-full btn-primary py-2.5 text-xs mt-4">
              Convert YAML ➔ JSON
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
