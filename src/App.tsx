import { Navigate, Route, Routes } from "react-router-dom"

import { ShopLayout } from "@/layouts/shop-layout"
import { ScrollToTop } from "@/components/scroll-to-top"
import { CartPage } from "@/pages/cart-page"
import { LandingPage } from "@/pages/landing-page"
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  )
}
