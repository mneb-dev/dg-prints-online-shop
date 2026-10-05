import { useEffect } from "react"

import { CategoryGrid } from "@/components/landing/category-grid"
import { Faq } from "@/components/landing/faq"
import { FeaturedProducts } from "@/components/landing/featured-products"
import { FinalCta } from "@/components/landing/final-cta"
import { Hero } from "@/components/landing/hero"
import { WhyDgPrints } from "@/components/landing/why-dg-prints"
import { useCatalog } from "@/lib/catalog"

export function LandingPage() {
  const { categories, categoriesStatus, loadCategories } = useCatalog()

  useEffect(() => {
    if (categoriesStatus === "idle") void loadCategories()
  }, [categoriesStatus, loadCategories])

  return (
    <>
      <Hero />
      <CategoryGrid categories={categories} loading={categoriesStatus === "idle" || categoriesStatus === "loading"} />
      <FeaturedProducts />
      <WhyDgPrints />
      <Faq />
      <FinalCta />
    </>
  )
}
