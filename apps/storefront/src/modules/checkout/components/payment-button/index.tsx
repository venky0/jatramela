"use client"

import { isManual, isRazorpay, isStripeLike } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useEffect, useState } from "react"
import ErrorMessage from "../error-message"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  switch (true) {
    case isStripeLike(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isRazorpay(paymentSession?.provider_id):
      return (
        <RazorpayPaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
      )
    default:
      return <Button disabled>Select a payment method</Button>
  }
}

// ─── Razorpay Payment Button ───────────────────────────────────────────────────

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void
      on: (event: string, handler: (response: Record<string, unknown>) => void) => void
    }
  }
}

const RazorpayPaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  // Dynamically load Razorpay checkout script
  useEffect(() => {
    if (document.getElementById("razorpay-script")) {
      setScriptLoaded(true)
      return
    }
    const script = document.createElement("script")
    script.id = "razorpay-script"
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => setScriptLoaded(true)
    document.body.appendChild(script)
  }, [])

  const handlePayment = async () => {
    if (!scriptLoaded || !session?.data) {
      setErrorMessage("Razorpay is not ready yet. Please try again.")
      return
    }

    setSubmitting(true)
    setErrorMessage(null)

    try {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: (session.data as Record<string, unknown>).amount,
        currency: cart.currency_code?.toUpperCase() || "INR",
        name: "Jatramela",
        description: "Secure Checkout — Jatramela Marketplace",
        order_id: (session.data as Record<string, unknown>).id,
        prefill: {
          name: `${cart.billing_address?.first_name || ""} ${cart.billing_address?.last_name || ""}`.trim(),
          email: cart.email || "",
          contact: cart.billing_address?.phone || "",
        },
        theme: {
          color: "#059669",
        },
        handler: async (response: Record<string, unknown>) => {
          // Payment successful — place the Medusa order
          await placeOrder()
            .catch((err: Error) => setErrorMessage(err.message))
            .finally(() => setSubmitting(false))
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false)
            setErrorMessage("Payment cancelled. Please try again.")
          },
        },
      }

      const rzp = new window.Razorpay(options)

      rzp.on("payment.failed", (response: Record<string, unknown>) => {
        const err = response.error as Record<string, unknown> | undefined
        setErrorMessage(
          (err?.description as string) || "Payment failed. Please try again."
        )
        setSubmitting(false)
      })

      rzp.open()
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.")
      setSubmitting(false)
    }
  }

  return (
    <>
      <button
        onClick={handlePayment}
        disabled={notReady || submitting || !scriptLoaded}
        data-testid={dataTestId}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-white text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "linear-gradient(135deg, #528FF0 0%, #3C5FD5 100%)",
          boxShadow: "0 4px 15px rgba(82,143,240,0.3)",
        }}
        onMouseEnter={(e) => {
          if (!notReady && !submitting) {
            e.currentTarget.style.transform = "translateY(-2px)"
            e.currentTarget.style.boxShadow = "0 8px 25px rgba(82,143,240,0.45)"
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)"
          e.currentTarget.style.boxShadow = "0 4px 15px rgba(82,143,240,0.3)"
        }}
      >
        {submitting ? (
          <>
            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            Processing...
          </>
        ) : (
          <>
            {/* Razorpay "R" logo */}
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <path d="M8 4l4 24h4L12 8l12 20h4L20 4H8z" fill="white"/>
            </svg>
            Pay with Razorpay
          </>
        )}
      </button>
      <p className="text-xs text-center mt-2" style={{ color: "var(--text-subtle)" }}>
        UPI · Cards · Netbanking · Wallets · EMI
      </p>
      <ErrorMessage error={errorMessage} data-testid="razorpay-payment-error" />
    </>
  )
}

// ─── Stripe Payment Button ─────────────────────────────────────────────────────

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => setErrorMessage(err.message))
      .finally(() => setSubmitting(false))
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const disabled = !stripe || !elements ? true : false

  const handlePayment = async () => {
    setSubmitting(true)
    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }
    await stripe
      .confirmCardPayment(session?.data.client_secret as string, {
        payment_method: {
          card,
          billing_details: {
            name: `${cart.billing_address?.first_name} ${cart.billing_address?.last_name}`,
            address: {
              city: cart.billing_address?.city ?? undefined,
              country: cart.billing_address?.country_code ?? undefined,
              line1: cart.billing_address?.address_1 ?? undefined,
              line2: cart.billing_address?.address_2 ?? undefined,
              postal_code: cart.billing_address?.postal_code ?? undefined,
              state: cart.billing_address?.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address?.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent
          if ((pi && pi.status === "requires_capture") || (pi && pi.status === "succeeded")) {
            onPaymentCompleted()
          }
          setErrorMessage(error.message || null)
          return
        }
        if ((paymentIntent && paymentIntent.status === "requires_capture") || paymentIntent.status === "succeeded") {
          return onPaymentCompleted()
        }
      })
  }

  return (
    <>
      <Button disabled={disabled || notReady} onClick={handlePayment} size="large" isLoading={submitting} data-testid={dataTestId}>
        Place order
      </Button>
      <ErrorMessage error={errorMessage} data-testid="stripe-payment-error-message" />
    </>
  )
}

// ─── Manual Test Payment Button ────────────────────────────────────────────────

const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handlePayment = () => {
    setSubmitting(true)
    placeOrder()
      .catch((err) => setErrorMessage(err.message))
      .finally(() => setSubmitting(false))
  }

  return (
    <>
      <Button disabled={notReady} isLoading={submitting} onClick={handlePayment} size="large" data-testid="submit-order-button">
        Place order
      </Button>
      <ErrorMessage error={errorMessage} data-testid="manual-payment-error-message" />
    </>
  )
}

export default PaymentButton
