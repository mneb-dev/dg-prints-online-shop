import { Navigate, Route, Routes } from "react-router-dom"

import { ShopLayout } from "@/layouts/shop-layout"
import { ScrollToTop } from "@/components/scroll-to-top"
import { CartPage } from "@/pages/cart-page"
import { CheckoutPage } from "@/pages/checkout-page"
import { CheckoutReturnPage } from "@/pages/checkout-return-page"
import { OrderPlacedPage } from "@/pages/order-placed-page"
import { LandingPage } from "@/pages/landing-page"
import {
  ContactPage,
  PrivacyPage,
  ReturnsPolicyPage,
  ShippingPolicyPage,
  TermsPage,
} from "@/pages/policy-pages"
import { ProductPage } from "@/pages/product-page"
import { ShopPage } from "@/pages/shop-page"

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<ShopLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="shop/:productId" element={<ProductPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="checkout/success" element={<OrderPlacedPage />} />
          <Route path="checkout/return" element={<CheckoutReturnPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="shipping" element={<ShippingPolicyPage />} />
          <Route path="returns" element={<ReturnsPolicyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  )
}
