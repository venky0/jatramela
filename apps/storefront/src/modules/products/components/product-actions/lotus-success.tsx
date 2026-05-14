"use client"

import { useEffect, useRef, useState } from "react"

// Lotus SVG petals — bloom on cart add
function LotusIcon({ blooming }: { blooming: boolean }) {
  return (
    <svg
      viewBox="0 0 80 80"
      width="72"
      height="72"
      style={{
        filter: "drop-shadow(0 0 12px rgba(201,168,76,0.7))",
        transform: blooming ? "scale(1)" : "scale(0.1)",
        opacity: blooming ? 1 : 0,
        transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease",
      }}
    >
      {/* Centre */}
      <circle cx="40" cy="40" r="8" fill="#C9A84C" />
      {/* 8 petals */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i * 45 * Math.PI) / 180
        const px = 40 + Math.cos(angle) * 20
        const py = 40 + Math.sin(angle) * 20
        return (
          <ellipse
            key={i}
            cx={px}
            cy={py}
            rx="9"
            ry="5"
            fill={i % 2 === 0 ? "#C9A84C" : "#E8C56A"}
            style={{
              transform: `rotate(${i * 45}deg)`,
              transformOrigin: "40px 40px",
              opacity: blooming ? 1 : 0,
              transition: `opacity 0.3s ease ${i * 0.05}s`,
            }}
          />
        )
      })}
    </svg>
  )
}

export default function LotusCartSuccess({ show, onDone }: { show: boolean; onDone: () => void }) {
  useEffect(() => {
    if (!show) return
    const t = setTimeout(onDone, 2000)
    return () => clearTimeout(t)
  }, [show, onDone])

  if (!show) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[200] flex items-center justify-center"
      aria-hidden
    >
      <div
        className="flex flex-col items-center gap-3"
        style={{
          animation: "lotus-float 2s ease-out forwards",
        }}
      >
        <LotusIcon blooming={show} />
        <span
          className="text-xs font-bold tracking-widest uppercase"
          style={{
            color: "#C9A84C",
            opacity: show ? 1 : 0,
            transition: "opacity 0.4s ease 0.3s",
            textShadow: "0 2px 8px rgba(201,168,76,0.5)",
          }}
        >
          ✓ Added to Bag
        </span>
      </div>
      <style>{`
        @keyframes lotus-float {
          0%   { transform: scale(0.5) translateY(20px); opacity: 0; }
          20%  { transform: scale(1.05) translateY(-5px); opacity: 1; }
          70%  { transform: scale(1) translateY(0); opacity: 1; }
          100% { transform: scale(0.9) translateY(-30px); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
