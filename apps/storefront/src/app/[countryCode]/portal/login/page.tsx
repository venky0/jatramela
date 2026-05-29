"use client"

import React, { useActionState, startTransition } from "react"
import { adminLogin } from "@lib/data/portal-actions"
import { useParams, useRouter } from "next/navigation"

export default function PortalLoginPage() {
  const params = useParams()
  const router = useRouter()
  const countryCode = (params?.countryCode as string) || "in"

  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await adminLogin(prevState, formData)
      if (result.success) {
        router.push(`/${countryCode}/portal/dashboard`)
        router.refresh()
      }
      return result
    },
    { success: false, error: null }
  )

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
      style={{
        backgroundColor: "#160D08",
        backgroundImage: "radial-gradient(circle at center, #2c1a10 0%, #110905 100%)",
      }}
    >
      {/* Visual background decoration */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header/Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 shadow-[0_0_20px_rgba(245,158,11,0.3)] mb-4">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M8 4l4 24h4L12 8l12 20h4L20 4H8z" fill="white" />
            </svg>
          </div>
          <h2
            className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-orange-500"
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            Jatramela Portal
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Secure admin & vendor management access
          </p>
        </div>

        {/* Golden-bordered card */}
        <div className="bg-zinc-950/70 backdrop-blur-md p-8 rounded-2xl border border-amber-500/20 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {state?.error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                {state.error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-amber-500 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none block w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-sm"
                placeholder="admin@jatramela.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-amber-500 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none block w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-sm"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-zinc-950 bg-gradient-to-r from-amber-400 via-amber-300 to-orange-500 hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_15px_rgba(245,158,11,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center mt-4">
          <a
            href={`/${countryCode}`}
            className="text-xs text-zinc-500 hover:text-amber-500 transition-colors font-medium"
          >
            ← Return to storefront
          </a>
        </div>
      </div>
    </div>
  )
}
