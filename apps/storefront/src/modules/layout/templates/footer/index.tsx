import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { FooterBrand, FooterNewsletter } from "./footer-client"

type Category   = { id: string; name: string; handle: string; parent_category?: { id: string } | null }
type Collection = { id: string; title: string; handle: string }

const FH = ({ children }: { children: React.ReactNode }) => (
  <h4 className="text-xs font-black mb-5 tracking-widest uppercase" style={{ color: "var(--gold-bright)", fontFamily: "'Baloo 2', sans-serif" }}>
    {children}
  </h4>
)

const FL = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li><LocalizedClientLink href={href} className="footer-link">{children}</LocalizedClientLink></li>
)

export default async function Footer() {
  const { collections } = await listCollections({ fields: "*products" })
  const productCategories = await listCategories()

  return (
    <footer style={{ background: "var(--bg-header)" }}>
      <div className="temple-border" />

      <div className="content-container pt-12 pb-8">
        <FooterNewsletter />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10">
          {/* Brand */}
          <FooterBrand />

          {/* Categories */}
          <div>
            <FH>Shop</FH>
            <ul className="space-y-2">
              {productCategories && productCategories.length > 0 ? (
                (productCategories as Category[]).filter(c => !c.parent_category).slice(0, 7).map(c => (
                  <FL key={c.id} href={`/categories/${c.handle}`}>{c.name}</FL>
                ))
              ) : (
                <>
                  <FL href="/categories/clothing">🥻 Mysore Silk & Sarees</FL>
                  <FL href="/categories/organic">🌾 Organic Foods</FL>
                  <FL href="/categories/wellness">🌿 Wellness & Ayurveda</FL>
                  <FL href="/categories/handicrafts">🏺 Heritage Handicrafts</FL>
                  <FL href="/categories/natural-home">🏡 Natural Home</FL>
                  <FL href="/categories/digital">💻 Digital Products</FL>
                  <FL href="/store">View All →</FL>
                </>
              )}
            </ul>
          </div>

          {/* Collections */}
          <div>
            <FH>Collections</FH>
            <ul className="space-y-2">
              {collections && collections.length > 0 ? (
                (collections as Collection[]).slice(0, 6).map(c => (
                  <FL key={c.id} href={`/collections/${c.handle}`}>{c.title}</FL>
                ))
              ) : (
                <>
                  <FL href="/store">Festival Specials</FL>
                  <FL href="/store">Ugadi Collection</FL>
                  <FL href="/store">Dasara Silks</FL>
                  <FL href="/store">Wedding Season</FL>
                  <FL href="/store">Gift Hampers</FL>
                  <FL href="/store">Monsoon Wellness</FL>
                </>
              )}
            </ul>
          </div>

          {/* Help & Company */}
          <div>
            <FH>Help</FH>
            <ul className="space-y-2">
              <FL href="/about">About Jatramela</FL>
              <FL href="/contact">Contact Us</FL>
              <FL href="/account/orders">Track Your Order</FL>
              <FL href="/account">My Account</FL>
              <FL href="/contact">Become a Seller</FL>
              <FL href="/contact">Wholesale Enquiry</FL>
            </ul>
            <div className="mt-6">
              <FH>Legal</FH>
              <ul className="space-y-2">
                <FL href="/privacy">Privacy Policy</FL>
                <FL href="/terms">Terms of Service</FL>
                <FL href="/shipping">Shipping Policy</FL>
                <FL href="/returns">Return & Refund</FL>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: "1px solid rgba(255,248,231,0.1)" }}>
          <p className="text-xs text-center" style={{ color: "rgba(255,248,231,0.42)" }}>
            © {new Date().getFullYear()} Jatramela.com · Preserving Karnataka's Heritage · Made with ♥ in Bengaluru, Karnataka
          </p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {["Visa", "Mastercard", "UPI", "RuPay", "Razorpay"].map(m => (
              <span key={m} className="px-2.5 py-1 rounded-md text-[10px] font-bold"
                style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,248,231,0.55)", border: "1px solid rgba(255,248,231,0.1)" }}>
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="temple-border" />
    </footer>
  )
}
