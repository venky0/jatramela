"use client"

import { useState, useRef, useEffect } from "react"

interface Point {
  x: number
  y: number
}

interface PathData {
  color: string
  d: string
  points: Point[]
  area: number
  smoothing: number
}

interface Pixel {
  r: number
  g: number
  b: number
  a: number
}

export default function ConvertersClient() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [vectorSvg, setVectorSvg] = useState<string | null>(null)
  const [epsContent, setEpsContent] = useState<string | null>(null)
  const [originalWidth, setOriginalWidth] = useState<number>(0)
  const [originalHeight, setOriginalHeight] = useState<number>(0)
  const [traceWidth, setTraceWidth] = useState<number>(0)
  const [traceHeight, setTraceHeight] = useState<number>(0)

  // Advanced Designer Parameters
  const [colorCount, setColorCount] = useState<number>(6)
  const [traceDetail, setTraceDetail] = useState<number>(800) // 400 | 800 | 1200 | 1600
  const [rdpThreshold, setRdpThreshold] = useState<number>(0.8) // Simplification Epsilon
  const [smoothing, setSmoothing] = useState<number>(0.4) // Bezier Factor
  const [laplacianSmooth, setLaplacianSmooth] = useState<number>(4) // Coordinate Smoothing Iterations
  const [noiseThreshold, setNoiseThreshold] = useState<number>(5) // Ignore paths smaller than X pixels area
  const [viewMode, setViewMode] = useState<"both" | "vector" | "outline">("both")
  
  // Color palette management
  const [extractedColors, setExtractedColors] = useState<string[]>([])
  const [excludedColors, setExcludedColors] = useState<Set<string>>(new Set())
  const [pixelsData, setPixelsData] = useState<Pixel[]>([])
  const [originalPixels, setOriginalPixels] = useState<Pixel[]>([])
  const [orgW, setOrgW] = useState<number>(0)
  const [orgH, setOrgH] = useState<number>(0)

  // Trigger vectorization when parameters change
  useEffect(() => {
    if (originalUrl && originalPixels.length > 0) {
      reprocessWithParams()
    }
  }, [colorCount, rdpThreshold, smoothing, laplacianSmooth, noiseThreshold, excludedColors, traceDetail])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      processFile(files[0])
    }
  }

  const processFile = (file: File) => {
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = () => {
      const url = reader.result as string
      setOriginalUrl(url)
      
      const img = new Image()
      img.onload = () => {
        const width = img.naturalWidth || img.width
        const height = img.naturalHeight || img.height
        setOriginalWidth(width)
        setOriginalHeight(height)
        setOrgW(width)
        setOrgH(height)

        // Capture original high-res pixels
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)
          const imgData = ctx.getImageData(0, 0, width, height)
          const pixels: Pixel[] = []
          for (let i = 0; i < imgData.data.length; i += 4) {
            pixels.push({
              r: imgData.data[i],
              g: imgData.data[i + 1],
              b: imgData.data[i + 2],
              a: imgData.data[i + 3],
            })
          }
          setOriginalPixels(pixels)
          
          // Trigger first quantization & vectorize
          runPipeline(pixels, width, height, traceDetail)
        }
      }
      img.src = url
    }
    reader.readAsDataURL(file)
  }

  const reprocessWithParams = () => {
    if (originalPixels.length === 0) return
    runPipeline(originalPixels, orgW, orgH, traceDetail)
  }

  const runPipeline = (pixels: Pixel[], w: number, h: number, maxDim: number) => {
    setIsProcessing(true)
    setTimeout(() => {
      // 1. Calculate downsampled dimensions for tracing
      let tw = w
      let th = h
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          th = Math.round((h * maxDim) / w)
          tw = maxDim
        } else {
          tw = Math.round((w * maxDim) / h)
          th = maxDim
        }
      }
      setTraceWidth(tw)
      setTraceHeight(th)

      // Create downsampled pixels
      const downsampleCanvas = document.createElement("canvas")
      downsampleCanvas.width = tw
      downsampleCanvas.height = th
      const ctx = downsampleCanvas.getContext("2d")
      if (!ctx) {
        setIsProcessing(false)
        return
      }

      // Draw original image scaled down to offscreen canvas
      const tempImg = new Image()
      tempImg.onload = () => {
        ctx.drawImage(tempImg, 0, 0, tw, th)
        const imgData = ctx.getImageData(0, 0, tw, th)
        const tracePixels: Pixel[] = []
        for (let i = 0; i < imgData.data.length; i += 4) {
          tracePixels.push({
            r: imgData.data[i],
            g: imgData.data[i + 1],
            b: imgData.data[i + 2],
            a: imgData.data[i + 3],
          })
        }
        setPixelsData(tracePixels)

        // 2. Quantize Colors using K-Means++
        const centroids = runKMeansPlusPlus(tracePixels, colorCount)
        const colors = centroids.map(c => rgbToHex(c.r, c.g, c.b))
        setExtractedColors(colors)

        // 3. Trace and fit curves
        runVectorizer(tracePixels, tw, th, colors, excludedColors)
      }
      tempImg.src = originalUrl!
    }, 30)
  }

  const runVectorizer = (
    pixels: Pixel[], 
    w: number, 
    h: number, 
    colors: string[], 
    exclusions: Set<string>
  ) => {
    const scale = originalWidth / w
    const centroidRGBs = colors.map(hexToRgb)
    
    // Pixel to centroid assignment
    const pixelAssignments = new Uint8Array(pixels.length)
    for (let i = 0; i < pixels.length; i++) {
      const p = pixels[i]
      if (p.a < 35) {
        pixelAssignments[i] = 255 // Transparent
        continue
      }
      
      let minDist = Infinity
      let minIdx = 0
      for (let c = 0; c < colors.length; c++) {
        const centroid = centroidRGBs[c]
        const dist = Math.hypot(p.r - centroid.r, p.g - centroid.g, p.b - centroid.b)
        if (dist < minDist) {
          minDist = dist
          minIdx = c
        }
      }
      pixelAssignments[i] = minIdx
    }

    const allPaths: PathData[] = []
    
    for (let c = 0; c < colors.length; c++) {
      const colorHex = colors[c]
      if (exclusions.has(colorHex)) continue
      
      const grid = Array.from({ length: h }, () => new Array(w).fill(false))
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          grid[y][x] = pixelAssignments[y * w + x] === c
        }
      }

      // Find boundaries
      const contours = findContours(grid)
      
      for (const contour of contours) {
        // scale to original dimensions
        const scaledContour = contour.map(p => ({ x: p.x * scale, y: p.y * scale }))
        
        // Laplacian Smoothing to eliminate staircases (jagged pixels)
        const smoothed = smoothContour(scaledContour, laplacianSmooth)
        
        // Ramer-Douglas-Peucker simplification
        const simplified = simplifyRDP(smoothed, rdpThreshold * scale)
        if (simplified.length < 3) continue

        // Ignore small noise elements
        const area = getPolygonArea(simplified)
        if (area < noiseThreshold * scale * scale) continue
        
        // Fit normalized segment-length Bezier curves
        const d = fitBezier(simplified, smoothing)
        
        allPaths.push({
          color: colorHex,
          d,
          points: simplified,
          area,
          smoothing
        })
      }
    }

    // Stack paths: Largest shapes at bottom, smaller detail shapes on top
    allPaths.sort((a, b) => b.area - a.area)

    // Generate Even-Odd grouped SVG
    let svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${originalWidth} ${originalHeight}" width="100%" height="100%">\n`
    svgStr += `  <g id="Layer_Background_Placeholder" />\n`
    
    // Group paths by color to make clean layers
    const colorGroups: { [color: string]: PathData[] } = {}
    for (const p of allPaths) {
      if (!colorGroups[p.color]) {
        colorGroups[p.color] = []
      }
      colorGroups[p.color].push(p)
    }

    let layerIdx = 1
    for (const color in colorGroups) {
      // Combine all paths of this color into a single `<path>` element with fill-rule="evenodd"
      // This automatically cuts out holes in letters (O, A, P) and logo circles
      const combinedD = colorGroups[color].map(p => p.d.trim()).join(" ")
      svgStr += `  <path id="Layer_${layerIdx}_${color.replace("#", "")}" fill="${color}" fill-rule="evenodd" d="${combinedD}" />\n`
      layerIdx++
    }
    svgStr += `</svg>`
    
    setVectorSvg(svgStr)

    // Generate Illustrator-compliant Even-Odd EPS using `eofill`
    const epsStr = compileEPS(originalWidth, originalHeight, allPaths)
    setEpsContent(epsStr)

    setIsProcessing(false)
  }

  // K-Means++ algorithm for smart color centroid selection
  const runKMeansPlusPlus = (pixels: Pixel[], k: number, maxIterations = 15): Pixel[] => {
    // 1. Filter out transparent pixels
    const solidPixels = pixels.filter(p => p.a >= 80)
    if (solidPixels.length === 0) return []

    const centroids: Pixel[] = []
    
    // Choose first centroid randomly
    const firstIdx = Math.floor(Math.random() * solidPixels.length)
    centroids.push({ ...solidPixels[firstIdx] })

    // Choose remaining centroids furthest from chosen ones
    for (let i = 1; i < k; i++) {
      let maxDist = -1
      let furthestIdx = 0
      
      const step = Math.max(1, Math.floor(solidPixels.length / 1000))
      for (let j = 0; j < solidPixels.length; j += step) {
        const p = solidPixels[j]
        let minDist = Infinity
        for (const c of centroids) {
          const dist = Math.hypot(p.r - c.r, p.g - c.g, p.b - c.b)
          if (dist < minDist) {
            minDist = dist
          }
        }
        if (minDist > maxDist) {
          maxDist = minDist
          furthestIdx = j
        }
      }
      centroids.push({ ...solidPixels[furthestIdx] })
    }

    // Standard K-Means assignment iterations
    for (let iter = 0; iter < maxIterations; iter++) {
      const clusters: Pixel[][] = Array.from({ length: k }, () => [])
      
      for (const p of solidPixels) {
        let minDist = Infinity
        let minIdx = 0
        for (let c = 0; c < k; c++) {
          const dist = Math.hypot(p.r - centroids[c].r, p.g - centroids[c].g, p.b - centroids[c].b)
          if (dist < minDist) {
            minDist = dist
            minIdx = c
          }
        }
        clusters[minIdx].push(p)
      }

      let changed = false
      for (let c = 0; c < k; c++) {
        if (clusters[c].length === 0) continue
        let sumR = 0, sumG = 0, sumB = 0
        for (const p of clusters[c]) {
          sumR += p.r
          sumG += p.g
          sumB += p.b
        }
        const newCentroid: Pixel = {
          r: Math.round(sumR / clusters[c].length),
          g: Math.round(sumG / clusters[c].length),
          b: Math.round(sumB / clusters[c].length),
          a: 255
        }

        const diff = Math.hypot(newCentroid.r - centroids[c].r, newCentroid.g - centroids[c].g, newCentroid.b - centroids[c].b)
        if (diff > 1.0) {
          centroids[c] = newCentroid
          changed = true
        }
      }
      if (!changed) break
    }
    return centroids
  }

  // Moore-Neighbor boundary finding
  const findContours = (grid: boolean[][]): Point[][] => {
    const h = grid.length
    const w = grid[0].length
    const visited = Array.from({ length: h }, () => new Array(w).fill(false))
    const contours: Point[][] = []

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (grid[y][x] && !visited[y][x]) {
          let isBoundary = false
          if (x === 0 || x === w - 1 || y === 0 || y === h - 1) {
            isBoundary = true
          } else {
            if (!grid[y - 1][x] || !grid[y + 1][x] || !grid[y][x - 1] || !grid[y][x + 1]) {
              isBoundary = true
            }
          }
          
          if (isBoundary) {
            const contour = traceContour(grid, x, y, visited)
            if (contour.length > 2) {
              contours.push(contour)
            }
          }
        }
      }
    }
    return contours
  }

  const traceContour = (grid: boolean[][], startX: number, startY: number, visited: boolean[][]): Point[] => {
    const h = grid.length
    const w = grid[0].length
    const points: Point[] = []
    
    let cx = startX
    let cy = startY
    
    const dx = [-1, 0, 1, 1, 1, 0, -1, -1]
    const dy = [-1, -1, -1, 0, 1, 1, 1, 0]
    
    let backtrackDir = 7
    points.push({ x: cx, y: cy })
    visited[cy][cx] = true
    
    let loopCount = 0
    const maxLoop = w * h
    
    while (loopCount < maxLoop) {
      loopCount++
      let foundNext = false
      
      for (let i = 0; i < 8; i++) {
        const dir = (backtrackDir + i) % 8
        const nx = cx + dx[dir]
        const ny = cy + dy[dir]
        
        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
          if (grid[ny][nx]) {
            cx = nx
            cy = ny
            points.push({ x: cx, y: cy })
            visited[cy][cx] = true
            backtrackDir = (dir + 5) % 8
            foundNext = true
            break
          }
        }
      }
      
      if (!foundNext) break
      if (cx === startX && cy === startY) break
    }
    
    return points
  }

  // Laplacian Coordinate Smoothing to dissolve jagged staircase pixel edges
  const smoothContour = (points: Point[], iterations: number): Point[] => {
    if (points.length < 5 || iterations === 0) return points
    let current = [...points]
    const n = current.length

    for (let iter = 0; iter < iterations; iter++) {
      const nextList: Point[] = []
      for (let i = 0; i < n; i++) {
        const prev = current[(i - 1 + n) % n]
        const curr = current[i]
        const next = current[(i + 1) % n]
        
        nextList.push({
          x: (prev.x + curr.x * 2 + next.x) / 4,
          y: (prev.y + curr.y * 2 + next.y) / 4
        })
      }
      current = nextList
    }
    return current
  }

  // Ramer-Douglas-Peucker simplification
  const simplifyRDP = (points: Point[], epsilon: number): Point[] => {
    if (points.length <= 2) return points
    const sqTolerance = epsilon * epsilon
    const last = points.length - 1
    const simplified: Point[] = [points[0]]
    simplifyDPStep(points, 0, last, sqTolerance, simplified)
    simplified.push(points[last])
    return simplified
  }

  const simplifyDPStep = (points: Point[], first: number, last: number, sqTolerance: number, simplified: Point[]) => {
    let maxSqDist = sqTolerance
    let index = -1
    for (let i = first + 1; i < last; i++) {
      const sqDist = getSqSegDist(points[i], points[first], points[last])
      if (sqDist > maxSqDist) {
        index = i
        maxSqDist = sqDist
      }
    }
    if (index !== -1) {
      simplifyDPStep(points, first, index, sqTolerance, simplified)
      simplified.push(points[index])
      simplifyDPStep(points, index, last, sqTolerance, simplified)
    }
  }

  const getSqSegDist = (p: Point, p1: Point, p2: Point) => {
    let x = p1.x
    let y = p1.y
    let dx = p2.x - x
    let dy = p2.y - y
    if (dx !== 0 || dy !== 0) {
      const t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy)
      if (t > 1) {
        x = p2.x
        y = p2.y
      } else if (t > 0) {
        x += dx * t
        y += dy * t
      }
    }
    dx = p.x - x
    dy = p.y - y
    return dx * dx + dy * dy
  }

  const getPolygonArea = (points: Point[]): number => {
    let area = 0
    const n = points.length
    for (let i = 0; i < n; i++) {
      const p1 = points[i]
      const p2 = points[(i + 1) % n]
      area += p1.x * p2.y - p2.x * p1.y
    }
    return Math.abs(area) * 0.5
  }

  // Segment-length normalized cubic Bezier curve fitting
  const fitBezier = (points: Point[], smoothing: number): string => {
    if (points.length < 3) {
      let d = ""
      for (let i = 0; i < points.length; i++) {
        d += `${i === 0 ? "M" : "L"} ${points[i].x.toFixed(1)} ${points[i].y.toFixed(1)} `
      }
      d += "Z"
      return d
    }

    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)} `
    const n = points.length
    
    for (let i = 0; i < n; i++) {
      const p0 = points[i]
      const p1 = points[(i + 1) % n]
      const pPrev = points[(i - 1 + n) % n]
      const pNext2 = points[(i + 2) % n]
      
      // Calculate normalized tangents
      const t0x = p1.x - pPrev.x
      const t0y = p1.y - pPrev.y
      const lenT0 = Math.hypot(t0x, t0y)
      const t0x_norm = lenT0 > 0 ? t0x / lenT0 : 0
      const t0y_norm = lenT0 > 0 ? t0y / lenT0 : 0

      const t1x = pNext2.x - p0.x
      const t1y = pNext2.y - p0.y
      const lenT1 = Math.hypot(t1x, t1y)
      const t1x_norm = lenT1 > 0 ? t1x / lenT1 : 0
      const t1y_norm = lenT1 > 0 ? t1y / lenT1 : 0

      // Calculate distance between p0 and p1
      const segmentLen = Math.hypot(p1.x - p0.x, p1.y - p0.y)

      // Compute control points scaled by segment length
      const cp1x = p0.x + t0x_norm * segmentLen * (smoothing / 3)
      const cp1y = p0.y + t0y_norm * segmentLen * (smoothing / 3)
      
      const cp2x = p1.x - t1x_norm * segmentLen * (smoothing / 3)
      const cp2y = p1.y - t1y_norm * segmentLen * (smoothing / 3)
      
      d += `C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} `
    }
    
    d += "Z"
    return d
  }

  // EPS Compiler utilizing the `eofill` operator for cut-out holes
  const compileEPS = (width: number, height: number, paths: PathData[]): string => {
    let eps = `%!PS-Adobe-3.0 EPSF-3.0
%%Creator: Jatramela Logo Vectorizer
%%Title: Vectorized Logo
%%BoundingBox: 0 0 ${width} ${height}
%%Pages: 1
%%EndComments
%%BeginProlog
%%EndProlog
%%Page: 1 1
gsave
`

    // Group paths by color layer
    const colorGroups: { [color: string]: PathData[] } = {}
    for (const p of paths) {
      if (!colorGroups[p.color]) {
        colorGroups[p.color] = []
      }
      colorGroups[p.color].push(p)
    }

    let layerIdx = 1
    for (const color in colorGroups) {
      const rgb = hexToRgb(color)
      const r = (rgb.r / 255).toFixed(3)
      const g = (rgb.g / 255).toFixed(3)
      const b = (rgb.b / 255).toFixed(3)
      
      eps += `\n% --- Begin Layer: Color ${color} ---\n`
      eps += `%%BeginGroup: Layer_${layerIdx}_${color.replace("#", "")}\n`
      eps += `${r} ${g} ${b} setrgbcolor\n`
      
      // Output all paths of this color within a single path construction
      // completed with `eofill` to subtract holes automatically.
      eps += `newpath\n`
      for (const item of colorGroups[color]) {
        const pts = item.points
        const n = pts.length
        if (n < 2) continue
        
        eps += `  ${pts[0].x.toFixed(1)} ${(height - pts[0].y).toFixed(1)} moveto\n`
        
        if (n < 3 || item.smoothing === 0) {
          for (let i = 1; i < n; i++) {
            eps += `  ${pts[i].x.toFixed(1)} ${(height - pts[i].y).toFixed(1)} lineto\n`
          }
        } else {
          for (let i = 0; i < n; i++) {
            const p0 = pts[i]
            const p1 = pts[(i + 1) % n]
            const pPrev = pts[(i - 1 + n) % n]
            const pNext2 = pts[(i + 2) % n]
            
            const t0x = p1.x - pPrev.x
            const t0y = p1.y - pPrev.y
            const lenT0 = Math.hypot(t0x, t0y)
            const t0x_norm = lenT0 > 0 ? t0x / lenT0 : 0
            const t0y_norm = lenT0 > 0 ? t0y / lenT0 : 0

            const t1x = pNext2.x - p0.x
            const t1y = pNext2.y - p0.y
            const lenT1 = Math.hypot(t1x, t1y)
            const t1x_norm = lenT1 > 0 ? t1x / lenT1 : 0
            const t1y_norm = lenT1 > 0 ? t1y / lenT1 : 0

            const segmentLen = Math.hypot(p1.x - p0.x, p1.y - p0.y)

            const cp1x = p0.x + t0x_norm * segmentLen * (item.smoothing / 3)
            const cp1y = height - (p0.y + t0y_norm * segmentLen * (item.smoothing / 3))
            
            const cp2x = p1.x - t1x_norm * segmentLen * (item.smoothing / 3)
            const cp2y = height - (p1.y - t1y_norm * segmentLen * (item.smoothing / 3))
            
            eps += `  ${cp1x.toFixed(1)} ${cp1y.toFixed(1)} ${cp2x.toFixed(1)} ${cp2y.toFixed(1)} ${p1.x.toFixed(1)} ${(height - p1.y).toFixed(1)} curveto\n`
          }
        }
        eps += `  closepath\n`
      }
      eps += `eofill\n`
      eps += `%%EndGroup\n`
      eps += `% --- End Layer: Color ${color} ---\n`
      layerIdx++
    }

    eps += `\ngrestore\nshowpage\n%%EOF\n`
    return eps
  }

  // Color conversion helper functions
  const rgbToHex = (r: number, g: number, b: number): string => {
    const toHex = (c: number) => {
      const hex = Math.max(0, Math.min(255, c)).toString(16)
      return hex.length === 1 ? "0" + hex : hex
    }
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
  }

  const hexToRgb = (hex: string): Pixel => {
    const c = hex.replace("#", "")
    return {
      r: parseInt(c.substring(0, 2), 16),
      g: parseInt(c.substring(2, 4), 16),
      b: parseInt(c.substring(4, 6), 16),
      a: 255
    }
  }

  // Download logic
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadSvg = () => {
    if (!vectorSvg) return
    const name = imageFile ? imageFile.name.replace(/\.[^/.]+$/, "") : "vector"
    downloadFile(vectorSvg, `${name}_vectorized.svg`, "image/svg+xml")
  }

  const handleDownloadEps = () => {
    if (!epsContent) return
    const name = imageFile ? imageFile.name.replace(/\.[^/.]+$/, "") : "vector"
    downloadFile(epsContent, `${name}_vectorized.eps`, "application/postscript")
  }

  // Toggle exclusion of a color
  const toggleColorExclusion = (color: string) => {
    setExcludedColors(prev => {
      const next = new Set(prev)
      if (next.has(color)) {
        next.delete(color)
      } else {
        next.add(color)
      }
      return next
    })
  }

  // Create outline version of the SVG content
  const getOutlineSvg = (svg: string): string => {
    return svg
      .replace(/fill="([^"]+)"/g, 'fill="none" stroke="#FFD700" stroke-width="1.5"')
      .replace(/<g id="Layer_Background_Placeholder" \/>/g, "")
  }

  return (
    <div style={{ background: "var(--bg-primary)" }}>
      {/* ── HEADER ── */}
      <section style={{ background: "var(--bg-header)" }} className="py-12 text-center relative">
        <div className="temple-border absolute top-0 left-0 right-0" />
        <div className="content-container">
          <p className="section-label mb-2" style={{ color: "rgba(255,248,231,0.6)" }}>Logo Vectorization Tool</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-shimmer mb-4" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            AI Vector Logo Converter
          </h1>
          <p className="text-sm sm:text-base max-w-lg mx-auto leading-relaxed" style={{ color: "rgba(255,248,231,0.75)" }}>
            Convert raster logos (PNG, JPEG, WebP) to professional layered vector EPS and SVG assets.
            Organizes shapes into clean, color-grouped vector layers.
          </p>
        </div>
        <div className="temple-border absolute bottom-0 left-0 right-0" />
      </section>

      <div className="content-container py-10">
        {!originalUrl ? (
          /* ── DROPZONE ── */
          <div className="max-w-2xl mx-auto">
            <div className="heritage-card p-12 text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-[#C9A84C]/80"
              style={{ minHeight: 350, border: "2.5px dashed var(--border)" }}
              onClick={() => document.getElementById("file-upload")?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault()
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  processFile(e.dataTransfer.files[0])
                }
              }}>
              <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleFileUpload} />
              
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner animate-float"
                style={{ background: "var(--gold-glow)", border: "2px solid var(--gold)" }}>
                🎨
              </div>
              <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Upload Logo Image</h2>
              <p className="text-sm mb-6 max-w-sm" style={{ color: "var(--text-muted)" }}>
                Drag & drop or click to select a PNG, JPG, or WebP logo file from your computer. Works 100% in-browser.
              </p>
              <button className="btn-gold px-8 py-3">Select Image File</button>
            </div>
            
            {/* Guide Panel */}
            <div className="mt-8 p-6 rounded-2xl border" style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}>
              <h3 className="font-extrabold text-sm mb-3 text-gradient-red" style={{ fontFamily: "'Baloo 2', sans-serif" }}>💡 Vectorization Pro Tips</h3>
              <ul className="text-xs space-y-2 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                <li>• <strong>High Contrast:</strong> Sharp logos with solid shapes yield the best vector results.</li>
                <li>• <strong>Transparency:</strong> Transparent PNG files trace cleanly without background contamination.</li>
                <li>• <strong>Resolution:</strong> Ensure the uploaded logo is reasonably clear; the AI automatically scales coordinates up to native sizing.</li>
                <li>• <strong>Vector Formats:</strong> SVG is perfect for web deployment. EPS stores layers properly for Adobe Illustrator or CorelDraw.</li>
              </ul>
            </div>
          </div>
        ) : (
          /* ── WORKSPACE ── */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* ── LEFT: PARAMETERS PANEL ── */}
            <div className="heritage-card p-6 space-y-6">
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--border)" }}>
                <h2 className="text-lg font-bold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Trace Settings</h2>
                <button className="text-xs font-semibold text-gradient-red hover:opacity-80" 
                  onClick={() => {
                    setImageFile(null)
                    setOriginalUrl(null)
                    setVectorSvg(null)
                    setEpsContent(null)
                    setExtractedColors([])
                    setOriginalPixels([])
                  }}>
                  ← Reset File
                </button>
              </div>

              {/* Selector: Trace Detail */}
              <div>
                <label className="field-label flex justify-between">
                  <span>Tracing Quality</span>
                  <span className="text-[#C9A84C] font-bold">
                    {traceDetail === 400 ? "Draft" : traceDetail === 800 ? "Medium" : traceDetail === 1200 ? "High" : "Ultra"} ({traceDetail}px)
                  </span>
                </label>
                <select value={traceDetail} 
                  onChange={e => setTraceDetail(parseInt(e.target.value))}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-3 text-xs text-neutral-200 outline-none focus:border-amber-500">
                  <option value="400">Draft (400px)</option>
                  <option value="800">Medium (800px) - Recommended</option>
                  <option value="1200">High (1200px) - Best for Text</option>
                  <option value="1600">Ultra (1600px) - Maximum Detail</option>
                </select>
                <p className="text-[10px] mt-1" style={{ color: "var(--text-subtle)" }}>Higher detail captures thin fonts and tiny lines, but requires more CPU.</p>
              </div>

              {/* Slider: Color Count */}
              <div>
                <label className="field-label flex justify-between">
                  <span>Number of Colors</span>
                  <span className="text-[#C9A84C] font-bold">{colorCount}</span>
                </label>
                <input type="range" min="2" max="16" value={colorCount}
                  onChange={e => setColorCount(parseInt(e.target.value))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-neutral-800"
                  style={{ accentColor: "var(--gold)" }} />
                <p className="text-[10px] mt-1" style={{ color: "var(--text-subtle)" }}>Centroids selected using K-Means++ smart seeding.</p>
              </div>

              {/* Slider: Laplacian Smoothing */}
              <div>
                <label className="field-label flex justify-between">
                  <span>Staircase Smoothing</span>
                  <span className="text-[#C9A84C] font-bold">{laplacianSmooth} passes</span>
                </label>
                <input type="range" min="0" max="10" value={laplacianSmooth}
                  onChange={e => setLaplacianSmooth(parseInt(e.target.value))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-neutral-800"
                  style={{ accentColor: "var(--gold)" }} />
                <p className="text-[10px] mt-1" style={{ color: "var(--text-subtle)" }}>Laplacian coordinates filter. Smooths jagged pixel blocks on circles.</p>
              </div>

              {/* Slider: Path Simplification */}
              <div>
                <label className="field-label flex justify-between">
                  <span>Path Simplification</span>
                  <span className="text-[#C9A84C] font-bold">{rdpThreshold.toFixed(2)}px</span>
                </label>
                <input type="range" min="0.05" max="3.0" step="0.05" value={rdpThreshold}
                  onChange={e => setRdpThreshold(parseFloat(e.target.value))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-neutral-800"
                  style={{ accentColor: "var(--gold)" }} />
                <p className="text-[10px] mt-1" style={{ color: "var(--text-subtle)" }}>RDP epsilon. Controls point counts. Lower = higher geometric fidelity.</p>
              </div>

              {/* Slider: Corner Smoothing */}
              <div>
                <label className="field-label flex justify-between">
                  <span>Bezier Curve Factor</span>
                  <span className="text-[#C9A84C] font-bold">{Math.round(smoothing * 100)}%</span>
                </label>
                <input type="range" min="0" max="1" step="0.05" value={smoothing}
                  onChange={e => setSmoothing(parseFloat(e.target.value))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-neutral-800"
                  style={{ accentColor: "var(--gold)" }} />
                <p className="text-[10px] mt-1" style={{ color: "var(--text-subtle)" }}>Cubic Bezier control handles length. 0% is sharp polygon corners.</p>
              </div>

              {/* Slider: Noise Filter */}
              <div>
                <label className="field-label flex justify-between">
                  <span>Noise Filter Area</span>
                  <span className="text-[#C9A84C] font-bold">{noiseThreshold} px²</span>
                </label>
                <input type="range" min="0" max="50" step="1" value={noiseThreshold}
                  onChange={e => setNoiseThreshold(parseInt(e.target.value))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-neutral-800"
                  style={{ accentColor: "var(--gold)" }} />
                <p className="text-[10px] mt-1" style={{ color: "var(--text-subtle)" }}>Ignores traced paths with area below this threshold (cleans artifacts).</p>
              </div>

              {/* Interactive Color Palette */}
              {extractedColors.length > 0 && (
                <div>
                  <label className="field-label mb-2 flex justify-between">
                    <span>Active Color Layers</span>
                    <span className="text-[10px]" style={{ color: "var(--text-subtle)" }}>Toggle to exclude (e.g. background)</span>
                  </label>
                  <div className="flex flex-wrap gap-2 p-3 rounded-xl border" style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}>
                    {extractedColors.map(color => {
                      const isExcluded = excludedColors.has(color)
                      return (
                        <button key={color}
                          onClick={() => toggleColorExclusion(color)}
                          className={`relative w-8 h-8 rounded-lg border transition-all duration-200 ${
                            isExcluded ? "opacity-30 border-dashed border-red-500 scale-95" : "border-white/20 scale-100 shadow-md"
                          }`}
                          style={{ backgroundColor: color }}
                          title={isExcluded ? `Exclude ${color}` : `Keep ${color}`}>
                          {isExcluded && (
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-red-500 bg-black/60 rounded-lg">
                              ✕
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Downloads Panel */}
              {vectorSvg && (
                <div className="space-y-3 pt-4 border-t border-dashed" style={{ borderColor: "var(--border)" }}>
                  <button onClick={handleDownloadSvg} className="w-full btn-gold py-3 text-xs flex items-center justify-center gap-2">
                    📥 Download Vector SVG
                  </button>
                  <button onClick={handleDownloadEps} className="w-full btn-primary py-3 text-xs flex items-center justify-center gap-2">
                    📐 Download Layered EPS (Illustrator)
                  </button>
                </div>
              )}
            </div>

            {/* ── RIGHT: PREVIEW PANEL ── */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Preview controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
                <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>
                  Resolution: {originalWidth}x{originalHeight} px (Traced at {traceWidth}x{traceHeight})
                </span>
                
                <div className="flex rounded-lg overflow-hidden border border-neutral-700 bg-neutral-900 text-xs">
                  <button className={`px-4 py-2 font-semibold ${viewMode === "both" ? "bg-[#C9A84C] text-[#2C1810]" : "text-neutral-300 hover:bg-neutral-800"}`}
                    onClick={() => setViewMode("both")}>
                    Split View
                  </button>
                  <button className={`px-4 py-2 font-semibold ${viewMode === "vector" ? "bg-[#C9A84C] text-[#2C1810]" : "text-neutral-300 hover:bg-neutral-800"}`}
                    onClick={() => setViewMode("vector")}>
                    Vector SVG
                  </button>
                  <button className={`px-4 py-2 font-semibold ${viewMode === "outline" ? "bg-[#C9A84C] text-[#2C1810]" : "text-neutral-300 hover:bg-neutral-800"}`}
                    onClick={() => setViewMode("outline")}>
                    Outline (Cmd+Y)
                  </button>
                </div>
              </div>

              {/* Render Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* original */}
                {(viewMode === "both") && (
                  <div className="heritage-card p-6 flex flex-col items-center justify-center" style={{ minHeight: 380 }}>
                    <h3 className="text-xs font-bold mb-4 uppercase tracking-wider text-neutral-400">Original Raster Image</h3>
                    <div className="relative border border-white/5 rounded-xl overflow-hidden shadow-inner max-w-full flex items-center justify-center bg-neutral-950 p-2" style={{ maxHeight: 300, width: "100%", height: 300 }}>
                      <img src={originalUrl} alt="Original raster" className="object-contain max-h-full max-w-full" />
                    </div>
                  </div>
                )}

                {/* vector render */}
                <div className={`heritage-card p-6 flex flex-col items-center justify-center ${viewMode !== "both" ? "md:col-span-2" : ""}`} style={{ minHeight: 380 }}>
                  <div className="w-full flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      {viewMode === "outline" ? "Illustrator Wireframe View" : "Traced Vector Output"}
                    </h3>
                    
                    {isProcessing && (
                      <span className="text-[10px] text-amber-500 font-semibold animate-pulse flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span> Tracing...
                      </span>
                    )}
                  </div>
                  
                  {/* Checkerboard container */}
                  <div className={`relative border border-white/5 rounded-xl overflow-hidden max-w-full flex items-center justify-center p-2`} 
                    style={{ 
                      maxHeight: 300, 
                      width: "100%", 
                      height: 300,
                      background: viewMode === "outline" 
                        ? "#151515" 
                        : "repeating-conic-gradient(#202020 0% 25%, #2a2a2a 0% 50%) 50% / 16px 16px" 
                    }}>
                    
                    {vectorSvg ? (
                      <div className="max-h-full max-w-full w-full h-full flex items-center justify-center"
                        dangerouslySetInnerHTML={{ 
                          __html: viewMode === "outline" ? getOutlineSvg(vectorSvg) : vectorSvg 
                        }} 
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center opacity-35 text-xs text-neutral-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500 mb-3"></div>
                        Generating vector curves...
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Statistics & Meta Info */}
              {vectorSvg && (
                <div className="p-4 rounded-xl border text-xs grid grid-cols-2 md:grid-cols-4 gap-4 text-center" style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}>
                  <div>
                    <p style={{ color: "var(--text-subtle)" }}>Vector Layers</p>
                    <p className="font-extrabold text-sm text-[#C9A84C] mt-0.5">
                      {extractedColors.length - excludedColors.size} Even-Odd Layers
                    </p>
                  </div>
                  <div>
                    <p style={{ color: "var(--text-subtle)" }}>Active Paths</p>
                    <p className="font-extrabold text-sm text-[#C9A84C] mt-0.5">
                      {(vectorSvg.match(/d=/g) || []).length} Compound Paths
                    </p>
                  </div>
                  <div>
                    <p style={{ color: "var(--text-subtle)" }}>Holes (Inner)</p>
                    <p className="font-extrabold text-sm text-green-500 mt-0.5">Auto-Cut eofill</p>
                  </div>
                  <div>
                    <p style={{ color: "var(--text-subtle)" }}>Curve Fitting</p>
                    <p className="font-extrabold text-sm text-[#C9A84C] mt-0.5">Normalized Spline</p>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}
      </div>
    </div>
  )
}
