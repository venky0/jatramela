import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@modules/common/components/ui"

import Divider from "@modules/common/components/divider"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  const fulfillments = (order as any).fulfillments || []

  return (
    <div>
      <Heading level="h2" className="flex flex-row text-3xl-regular my-6">
        Delivery
      </Heading>
      <div className="flex items-start gap-x-8">
        <div
          className="flex flex-col w-1/3"
          data-testid="shipping-address-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1">
            Shipping Address
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address?.first_name}{" "}
            {order.shipping_address?.last_name}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address?.address_1}{" "}
            {order.shipping_address?.address_2}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address?.postal_code},{" "}
            {order.shipping_address?.city}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address?.country_code?.toUpperCase()}
          </Text>
        </div>

        <div
          className="flex flex-col w-1/3 "
          data-testid="shipping-contact-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1">Contact</Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address?.phone}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">{order.email}</Text>
        </div>

        <div
          className="flex flex-col w-1/3"
          data-testid="shipping-method-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1">Method</Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {(order.shipping_methods?.[0] as { name?: string })?.name} (
            {convertToLocale({
              amount: order.shipping_methods?.[0].total ?? 0,
              currency_code: order.currency_code,
            })}
            )
          </Text>
        </div>
      </div>

      {fulfillments.length > 0 && (
        <div className="mt-8 p-6 rounded-2xl border border-[rgba(201,168,76,0.15)] bg-gradient-to-br from-[rgba(255,248,231,0.02)] to-transparent">
          <Heading level="h3" className="text-xl font-bold text-amber-500 mb-4 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            Shipment Tracking
          </Heading>
          
          <div className="space-y-6">
            {fulfillments.map((fulfillment: any, idx: number) => {
              const trackingNumbers = (fulfillment.tracking_numbers || [])
                .map((t: any) => typeof t === "string" ? t : t?.tracking_number)
                .filter(Boolean)
              
              const isShipped = !!fulfillment.shipped_at
              const isDelivered = !!fulfillment.delivered_at

              let statusText = "Preparing Shipment"
              let statusColor = "text-amber-500"
              let step = 1
              if (isDelivered) {
                statusText = "Delivered"
                statusColor = "text-emerald-500"
                step = 3
              } else if (isShipped) {
                statusText = "Shipped"
                statusColor = "text-sky-500"
                step = 2
              }

              return (
                <div key={fulfillment.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/30 border border-zinc-800">
                  <div className="space-y-1">
                    <Text className="txt-small text-ui-fg-subtle">
                      Package #{idx + 1}
                    </Text>
                    <Text className={`font-semibold ${statusColor}`}>
                      {statusText}
                    </Text>
                    {trackingNumbers.length > 0 ? (
                      <div className="mt-2 space-y-1">
                        {trackingNumbers.map((num: string) => (
                          <div key={num} className="flex flex-col gap-1">
                            <Text className="txt-medium text-ui-fg-base">
                              Tracking No: <span className="font-mono text-amber-300 font-medium">{num}</span>
                            </Text>
                            <a
                              href={`https://shiprocket.co/tracking/${num}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors underline font-medium mt-1"
                            >
                              Track with Shiprocket
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                              </svg>
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Text className="txt-small text-ui-fg-muted mt-1 italic">
                        No tracking number assigned yet
                      </Text>
                    )}
                  </div>

                  {/* Progress timeline */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 1 ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 'bg-zinc-800 text-zinc-500'}`}>
                        1
                      </div>
                      <div className={`w-10 h-1 ${step >= 2 ? 'bg-amber-500' : 'bg-zinc-800'}`} />
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 2 ? 'bg-sky-500 text-black shadow-[0_0_10px_rgba(14,165,233,0.4)]' : 'bg-zinc-800 text-zinc-500'}`}>
                        2
                      </div>
                      <div className={`w-10 h-1 ${step >= 3 ? 'bg-emerald-500' : 'bg-zinc-800'}`} />
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 3 ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-zinc-800 text-zinc-500'}`}>
                        3
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      <Divider className="mt-8" />
    </div>
  )
}

export default ShippingDetails
