"use client"

import { useState } from "react"
import Link from "next/link"

export default function MarkdownHtmlPage() {
  const [mdText, setMdText] = useState<string>(
    "# Jatramela Festival\n\nWelcome to the grand **Winter Harvest** festival. Here are the key events:\n\n- Siddheshwara Jatra (Vijayapura)\n- Huskur Madduramma Jatra (Anekal)\n\nLearn more at [Jatramela.com](https://jatramela.com).\n\n```javascript\nconst festival = 'Siddheshwara';\nconsole.log(`Welcome to ${festival}`);\n```"
  )
  const [htmlText, setHtmlText] = useState<string>(
    '<h1>Jatramela Festival</h1>\n\n<p>Welcome to the grand <strong>Winter Harvest</strong> festival. Here are the key events:</p>\n\n<ul>\n  <li>Siddheshwara Jatra (Vijayapura)</li>\n  <li>Huskur Madduramma Jatra (Anekal)</li>\n</ul>\n\n<p>Learn more at <a href="https://jatramela.com" target="_blank" rel="noopener noreferrer">Jatramela.com</a>.</p>\n\n<pre><code>const festival = \'Siddheshwara\';\nconsole.log(`Welcome to ${festival}`);</code></pre>'
  )
  const [error, setError] = useState<string | null>(null)
  const [copyStatus, setCopyStatus] = useState<"md" | "html" | null>(null)

  // Lightweight, robust Markdown to HTML compiler
  const convertMdToHtml = (markdown: string): string => {
    let html = markdown

    // Handle Code Blocks (``` lang ... ```)
    const codeBlockRegex = /```(?:[a-zA-Z0-9]+)?\n([\s\S]*?)\n```/g
    html = html.replace(codeBlockRegex, (match, p1) => {
      // Escape HTML inside code blocks
      const escaped = p1
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
      return `<pre><code>${escaped}</code></pre>`
    })

    // Split into lines for block-level parsing
    const lines = html.split("\n")
    const resultLines: string[] = []
    let inList = false
    let inParagraph = false

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmed = line.trim()

      // Skip lines already formatted as pre/code blocks
      if (trimmed.startsWith("<pre>") || trimmed.startsWith("<code>") || trimmed.startsWith("</pre>") || trimmed.startsWith("</code>") || (resultLines.length > 0 && resultLines[resultLines.length - 1].startsWith("<pre>")) && !resultLines[resultLines.length - 1].endsWith("</pre>")) {
        // If we are inside an uncompleted pre block, just push the raw line
        if (resultLines.length > 0 && resultLines[resultLines.length - 1].includes("<pre>") && !resultLines[resultLines.length - 1].includes("</pre>")) {
          resultLines[resultLines.length - 1] += "\n" + line
        } else {
          resultLines.push(line)
        }
        continue
      }

      // Headers (1-6)
      const headerMatch = line.match(/^(#{1,6})\s+(.*)$/)
      if (headerMatch) {
        if (inList) {
          resultLines.push("</ul>")
          inList = false
        }
        if (inParagraph) {
          resultLines.push("</p>")
          inParagraph = false
        }
        const level = headerMatch[1].length
        resultLines.push(`<h${level}>${parseInlineMd(headerMatch[2])}</h${level}>`)
        continue
      }

      // Unordered Lists (- or *)
      const listMatch = line.match(/^[-*]\s+(.*)$/)
      if (listMatch) {
        if (inParagraph) {
          resultLines.push("</p>")
          inParagraph = false
        }
        if (!inList) {
          resultLines.push("<ul>")
          inList = true
        }
        resultLines.push(`  <li>${parseInlineMd(listMatch[1])}</li>`)
        continue
      }

      // Empty Lines (separators/breaks)
      if (trimmed === "") {
        if (inList) {
          resultLines.push("</ul>")
          inList = false
        }
        if (inParagraph) {
          resultLines.push("</p>")
          inParagraph = false
        }
        resultLines.push("") // keep spacing
        continue
      }

      // Paragraph / Multi-line paragraph
      if (!inList && !inParagraph) {
        resultLines.push(`<p>${parseInlineMd(line)}`)
        inParagraph = true
      } else if (inParagraph) {
        // Append to current open paragraph
        resultLines[resultLines.length - 1] += " " + parseInlineMd(line)
      } else {
        resultLines.push(parseInlineMd(line))
      }
    }

    // Close any unclosed tags
    if (inList) resultLines.push("</ul>")
    if (inParagraph) resultLines.push("</p>")

    // Combine lines and format spacing slightly
    return resultLines.join("\n").replace(/\n{3,}/g, "\n\n")
  }

  // Parse inline elements: bold, italics, inline code, links
  const parseInlineMd = (text: string): string => {
    let parsed = text

    // Escape basic HTML entities first to prevent script injection (except inside custom pre blocks)
    parsed = parsed
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")

    // Bold (**text** or __text__)
    parsed = parsed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    parsed = parsed.replace(/__(.*?)__/g, "<strong>$1</strong>")

    // Italics (*text* or _text_)
    parsed = parsed.replace(/\*(.*?)\*/g, "<em>$1</em>")
    parsed = parsed.replace(/_(.*?)_/g, "<em>$1</em>")

    // Inline Code (`code`)
    parsed = parsed.replace(/`(.*?)`/g, "<code>$1</code>")

    // Links ([text](url))
    parsed = parsed.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

    return parsed
  }

  // HTML to Markdown reverse-parser
  const convertHtmlToMd = (html: string): string => {
    let md = html

    // Code Blocks
    md = md.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (match, p1) => {
      const unescaped = p1
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
      return `\`\`\`javascript\n${unescaped}\n\`\`\``
    })

    // Headers
    md = md.replace(/<h1>(.*?)<\/h1>/gi, "# $1\n")
    md = md.replace(/<h2>(.*?)<\/h2>/gi, "## $1\n")
    md = md.replace(/<h3>(.*?)<\/h3>/gi, "### $1\n")
    md = md.replace(/<h4>(.*?)<\/h4>/gi, "#### $1\n")
    md = md.replace(/<h5>(.*?)<\/h5>/gi, "##### $1\n")
    md = md.replace(/<h6>(.*?)<\/h6>/gi, "###### $1\n")

    // Lists wrapper removal
    md = md.replace(/<ul>\s*([\s\S]*?)\s*<\/ul>/gi, "$1")
    md = md.replace(/\s*<li>(.*?)<\/li>/gi, "\n- $1")

    // Paragraphs
    md = md.replace(/<p>(.*?)<\/p>/gi, "$1\n\n")

    // Bold / Strong
    md = md.replace(/<strong>(.*?)<\/strong>/gi, "**$1**")
    md = md.replace(/<b>(.*?)<\/b>/gi, "**$1**")

    // Italics / Em
    md = md.replace(/<em>(.*?)<\/em>/gi, "*$1*")
    md = md.replace(/<i>(.*?)<\/i>/gi, "*$1*")

    // Inline Code
    md = md.replace(/<code>(.*?)<\/code>/gi, "`$1`")

    // Links
    md = md.replace(/<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)")

    // Decode standard HTML entities
    md = md
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")

    // Clean up carriage returns and trailing spacing
    return md.trim().replace(/\n{3,}/g, "\n\n")
  }

  const handleMdToHtml = () => {
    try {
      setError(null)
      const res = convertMdToHtml(mdText)
      setHtmlText(res)
    } catch (err: any) {
      setError("Markdown compilation error: " + err.message)
    }
  }

  const handleHtmlToMd = () => {
    try {
      setError(null)
      const res = convertHtmlToMd(htmlText)
      setMdText(res)
    } catch (err: any) {
      setError("HTML parsing error: " + err.message)
    }
  }

  const copyText = (text: string, type: "md" | "html") => {
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
            Markdown ➔ HTML Converter
          </h1>
          <p className="text-xs sm:text-sm max-w-lg mx-auto" style={{ color: "rgba(255,248,231,0.75)" }}>
            Bidirectionally parse, format, and translate between clean Markdown syntax and valid HTML tag formats locally in your tab.
          </p>
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
          {/* Markdown Box */}
          <div className="heritage-card p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-extrabold text-sm" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Markdown Text</h3>
              <button onClick={() => copyText(mdText, "md")} className="text-[10px] text-[#C9A84C] font-bold">
                {copyStatus === "md" ? "Copied! ✓" : "📋 Copy"}
              </button>
            </div>
            <textarea
              value={mdText}
              onChange={(e) => setMdText(e.target.value)}
              className="w-full h-80 bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-xs font-mono text-amber-100 outline-none focus:border-[#C9A84C] resize-none"
            />
            <button onClick={handleMdToHtml} className="w-full btn-gold py-2.5 text-xs mt-4">
              Compile to HTML ➔
            </button>
          </div>

          {/* HTML Box */}
          <div className="heritage-card p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-extrabold text-sm" style={{ fontFamily: "'Baloo 2', sans-serif" }}>HTML Markup</h3>
              <button onClick={() => copyText(htmlText, "html")} className="text-[10px] text-[#C9A84C] font-bold">
                {copyStatus === "html" ? "Copied! ✓" : "📋 Copy"}
              </button>
            </div>
            <textarea
              value={htmlText}
              onChange={(e) => setHtmlText(e.target.value)}
              className="w-full h-80 bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-xs font-mono text-amber-100 outline-none focus:border-[#C9A84C] resize-none"
            />
            <button onClick={handleHtmlToMd} className="w-full btn-primary py-2.5 text-xs mt-4">
              Decompile HTML ➔ Markdown
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
