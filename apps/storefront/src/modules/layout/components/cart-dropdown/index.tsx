"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(undefined)
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open  = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef  = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()
    const timer = setTimeout(close, 5000)
    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) clearTimeout(activeTimer)
    open()
  }

  useEffect(() => {
    return () => { if (activeTimer) clearTimeout(activeTimer) }
  }, [activeTimer])

  const pathname = usePathname()

  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current])

  return (
    <div className="h-full z-50" onMouseEnter={openAndCancel} onMouseLeave={close}>
      <Popover className="relative h-full">
        <PopoverButton className="h-full focus:outline-none">
          <LocalizedClientLink
            href="/cart"
            data-testid="nav-cart-link"
            className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 relative"
            style={{
              background: cartDropdownOpen
                ? "rgba(201,168,76,0.22)"
                : "rgba(255,255,255,0.1)",
              border: `1.5px solid ${cartDropdownOpen ? "rgba(201,168,76,0.6)" : "rgba(255,248,231,0.2)"}`,
              color: "var(--text-on-header, #FFF8E7)",
            }}
          >
            {/* Cart bag icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke={cartDropdownOpen ? "#C9A84C" : "currentColor"} strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {totalItems > 0 && (
              <span
                className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold"
                style={{ background: "#C9A84C", color: "#1a0a00" }}
              >
                {totalItems}
              </span>
            )}
          </LocalizedClientLink>
        </PopoverButton>

        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-2 scale-95"
          enterTo="opacity-100 translate-y-0 scale-100"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0 scale-100"
          leaveTo="opacity-0 translate-y-2 scale-95"
        >
          <PopoverPanel
            static
            className="hidden small:block absolute top-[calc(100%+12px)] right-0 w-[380px] z-[60]"
            data-testid="nav-cart-dropdown"
            style={{
              background: "linear-gradient(160deg, #1a0a00 0%, #2d1200 100%)",
              border: "1px solid rgba(201,168,76,0.25)",
              borderRadius: "16px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.08)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div className="px-5 py-4 flex items-center justify-between"
              style={{ borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
              <div>
                <h3 className="font-bold text-sm" style={{ color: "#C9A84C" }}>
                  Your Bag 🛍️
                </h3>
                <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,248,231,0.45)" }}>
                  {totalItems === 0 ? "Empty" : `${totalItems} item${totalItems > 1 ? "s" : ""}`}
                </p>
              </div>
              <LocalizedClientLink href="/cart"
                className="text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all duration-200"
                style={{ background: "rgba(201,168,76,0.15)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.3)" }}>
                View All →
              </LocalizedClientLink>
            </div>

            {cartState && cartState.items?.length ? (
              <>
                {/* Items */}
                <div className="overflow-y-auto max-h-[320px] px-4 py-3 flex flex-col gap-3 no-scrollbar">
                  {cartState.items
                    .sort((a, b) => ((a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1))
                    .map((item) => (
                      <div
                        key={item.id}
                        data-testid="cart-item"
                        className="flex gap-3 rounded-xl p-2 transition-all duration-150"
                        style={{ background: "rgba(255,248,231,0.04)", border: "1px solid rgba(201,168,76,0.1)" }}
                      >
                        <LocalizedClientLink href={`/products/${item.product_handle}`} className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-lg overflow-hidden"
                            style={{ border: "1px solid rgba(201,168,76,0.2)" }}>
                            <Thumbnail
                              thumbnail={item.thumbnail}
                              images={item.variant?.product?.images}
                              size="square"
                            />
                          </div>
                        </LocalizedClientLink>
                        <div className="flex flex-col justify-between flex-1 min-w-0">
                          <div>
                            <LocalizedClientLink
                              href={`/products/${item.product_handle}`}
                              data-testid="product-link"
                              className="text-xs font-semibold leading-tight block truncate"
                              style={{ color: "#FFF8E7" }}
                            >
                              {item.title}
                            </LocalizedClientLink>
                            <LineItemOptions
                              variant={item.variant}
                              data-testid="cart-item-variant"
                              data-value={item.variant}
                            />
                            <span className="text-[10px]" style={{ color: "rgba(255,248,231,0.4)" }}
                              data-testid="cart-item-quantity" data-value={item.quantity}>
                              Qty: {item.quantity}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <LineItemPrice
                              item={item}
                              style="tight"
                              currencyCode={cartState.currency_code}
                            />
                            <DeleteButton
                              id={item.id}
                              data-testid="cart-item-remove-button"
                              className="text-[10px]"
                            >
                              Remove
                            </DeleteButton>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-5 py-4 space-y-3"
                  style={{ borderTop: "1px solid rgba(201,168,76,0.15)" }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium" style={{ color: "rgba(255,248,231,0.6)" }}>
                      Subtotal
                    </span>
                    <span className="text-sm font-bold" style={{ color: "#C9A84C" }}
                      data-testid="cart-subtotal" data-value={subtotal}>
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>
                  <LocalizedClientLink href="/cart" passHref>
                    <button
                      data-testid="go-to-cart-button"
                      className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-200"
                      style={{
                        background: "linear-gradient(135deg, #C9A84C 0%, #a8722a 100%)",
                        color: "#1a0a00",
                        boxShadow: "0 4px 16px rgba(201,168,76,0.3)",
                      }}
                    >
                      Proceed to Checkout →
                    </button>
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 gap-4">
                <div className="text-5xl">🛒</div>
                <div className="text-center">
                  <p className="text-sm font-semibold" style={{ color: "rgba(255,248,231,0.8)" }}>
                    Your bag is empty
                  </p>
                  <p className="text-xs mt-1" style={{ color: "rgba(255,248,231,0.4)" }}>
                    Discover authentic Karnataka products
                  </p>
                </div>
                <LocalizedClientLink href="/store">
                  <button
                    onClick={close}
                    className="px-6 py-2.5 rounded-full font-semibold text-xs transition-all duration-200"
                    style={{
                      background: "rgba(201,168,76,0.15)",
                      border: "1px solid rgba(201,168,76,0.4)",
                      color: "#C9A84C",
                    }}
                  >
                    Explore Jatramela Store →
                  </button>
                </LocalizedClientLink>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
