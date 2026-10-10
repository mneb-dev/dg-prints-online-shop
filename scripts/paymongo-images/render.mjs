// Renders the images PayMongo's checkout page shows for the "Shipping fee" row and for products
// without photos. They mirror the shop's CategoryTile (src/components/category-visual.tsx): one
// image per icon × gradient, picked on the server by src/utils/categoryImage.ts in
// dg-prints-management-server — keep all three in sync.
//
// Run from the shop root (playwright isn't a dependency; install it just for this):
//   npm i --no-save playwright && npx playwright install chromium
//   node scripts/paymongo-images/render.mjs
// then upload everything in scripts/paymongo-images/out/ to the product-images bucket's `static/`
// folder in each Supabase project (dev + prod).
import { mkdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { BoxIcon, FlagIcon, IdCardIcon, LayersIcon, PrinterIcon, ShirtIcon, StickerIcon, TruckIcon } from "lucide-react"
import { chromium } from "playwright"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "out")
const SIZE = 256

// Light-theme values of --brand-from / --brand-to (src/index.css).
const BRAND_FROM = "oklch(0.511 0.262 276.966)"
const BRAND_TO = "oklch(0.541 0.281 293.009)"
// Same order as TILE_GRADIENTS in category-visual.tsx.
const GRADIENTS = [
  `linear-gradient(135deg, ${BRAND_FROM}, ${BRAND_TO})`,
  `linear-gradient(135deg, oklch(0.55 0.22 262), ${BRAND_FROM})`,
  `linear-gradient(135deg, ${BRAND_TO}, oklch(0.6 0.24 322))`,
  `linear-gradient(135deg, oklch(0.58 0.16 235), oklch(0.55 0.23 285))`,
]
// Keys match CATEGORY_IMAGE_RULES in the server's categoryImage.ts.
const ICONS = {
  sticker: StickerIcon,
  flag: FlagIcon,
  layers: LayersIcon,
  box: BoxIcon,
  shirt: ShirtIcon,
  idcard: IdCardIcon,
  printer: PrinterIcon,
}

function tile(icon, gradient) {
  const svg = renderToStaticMarkup(
    createElement(icon, { size: SIZE / 2, color: "white", strokeWidth: 1.5, style: { position: "relative", filter: "drop-shadow(0 1px 2px rgba(0,0,0,.12))" } })
  )
  return `<html><body style="margin:0"><div style="position:relative;overflow:hidden;width:${SIZE}px;height:${SIZE}px;display:flex;align-items:center;justify-content:center;background-image:${gradient}">
    <div style="position:absolute;top:-33%;left:-25%;width:75%;height:75%;border-radius:50%;background:rgba(255,255,255,.2);filter:blur(40px)"></div>
    <div style="position:absolute;inset:0;background-image:radial-gradient(circle, rgba(255,255,255,.14) 1.5px, transparent 1.5px);background-size:22px 22px"></div>
    ${svg}</div></body></html>`
}

mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: SIZE, height: SIZE } })
async function render(name, html) {
  await page.setContent(html)
  await page.screenshot({ path: path.join(OUT, `${name}.png`) })
}
for (const [key, icon] of Object.entries(ICONS)) {
  for (const [index, gradient] of GRADIENTS.entries()) await render(`category-${key}-${index}`, tile(icon, gradient))
}
await render("shipping", tile(TruckIcon, GRADIENTS[0]))
await browser.close()
console.log(`Rendered ${Object.keys(ICONS).length * GRADIENTS.length + 1} images to ${OUT}`)
