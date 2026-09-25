import { useEffect, useState } from "react"
import { ArrowLeftIcon, CheckIcon, InfoIcon, PackageXIcon, ShoppingBagIcon } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import { ProductGallery } from "@/components/product-gallery"
import { StartingPrice } from "@/components/price-tag"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QuantityInput } from "@/components/ui/quantity-input"
import { MAX_LINE_QUANTITY, useCart } from "@/lib/cart"
import { useCatalog } from "@/lib/catalog"
import {
  computeLineTotal,
  describeAppliesTo,
  isAreaPriced,
  isManualPricingProduct,
  resolvePricing,
  unitSuffix,
  type LinePricing,
} from "@/lib/pricing-resolver"
import type { PricingEntry, ShopProduct } from "@/lib/shop-types"
import { cn, formatCurrency } from "@/lib/utils"

function ChoiceChip({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-lg border px-3.5 text-sm font-medium transition-[background-color,border-color,color,box-shadow] outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        selected
          ? "border-primary bg-accent text-accent-foreground shadow-[var(--shadow-soft)]"
          : "border-border bg-card hover:border-primary/40 hover:bg-muted"
      )}
    >
      {selected && <CheckIcon className="size-3.5" />}
      {children}
    </button>
  )
}

function PackageTierCard({
  entry,
  selected,
  onSelect,
}: {
  entry: PricingEntry
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "flex cursor-pointer flex-col items-start gap-1 rounded-xl border p-3.5 text-left transition-[background-color,border-color,box-shadow] outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        selected
          ? "border-primary bg-accent shadow-[var(--shadow-soft)]"
          : "border-border bg-card hover:border-primary/40 hover:bg-muted"
      )}
    >
      <span className={cn("text-sm font-medium", selected && "text-accent-foreground")}>
        {entry.packageName || describeAppliesTo(entry.appliesTo)}
      </span>
      <span className="font-semibold tabular-nums">{formatCurrency(entry.price)}</span>
    </button>
  )
}

function parsePositive(value: string): number | null {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : null
}

function ProductConfigurator({ product }: { product: ShopProduct }) {
  const navigate = useNavigate()
  const { addLine } = useCart()
  const [selected, setSelected] = useState<Record<string, string>>({})
  const [packageId, setPackageId] = useState<string | null>(null)
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [quantity, setQuantity] = useState("1")

  const manual = isManualPricingProduct(product)
  const resolution = resolvePricing(product, selected)
  const entry =
    resolution.kind === "auto"
      ? resolution.entry
      : resolution.kind === "package"
        ? resolution.candidates.find((candidate) => candidate.id === packageId)
        : undefined

  const missingOptions = product.options.filter((option) => option.required && !selected[option.id])
  const areaPriced = !!entry && isAreaPriced(entry)
  const widthFt = parsePositive(width)
  const heightFt = parsePositive(height)
  const qty = Math.min(MAX_LINE_QUANTITY, Math.floor(Number(quantity)))
  const qtyValid = Number.isFinite(qty) && qty >= 1
  const unavailable = !manual && missingOptions.length === 0 && resolution.kind === "none"

  const linePricing: LinePricing | null = entry
    ? {
        pricingType: entry.pricingType,
        unit: entry.unit,
        unitPrice: entry.price,
        packageName: entry.packageName || (resolution.kind === "package" ? describeAppliesTo(entry.appliesTo) : undefined),
        ...(areaPriced && widthFt && heightFt ? { width: widthFt, height: heightFt } : {}),
      }
    : null
  const dimensionsReady = !areaPriced || (widthFt !== null && heightFt !== null)
  const canAdd = missingOptions.length === 0 && qtyValid && (manual || (!!linePricing && dimensionsReady))
  const total = linePricing && dimensionsReady && qtyValid ? computeLineTotal(linePricing, qty) : null

  function toggleOption(optionId: string, value: string, required: boolean) {
    setSelected((current) => {
      const next = { ...current }
      if (current[optionId] === value && !required) delete next[optionId]
      else next[optionId] = value
      return next
    })
  }

  function handleAdd() {
    if (!canAdd) return
    addLine({
      productId: product.id,
      productName: product.name,
      category: product.category,
      imageUrl: product.images[0]?.url,
      selectedOptions: product.options
        .filter((option) => selected[option.id])
        .map((option) => ({ name: option.name, value: selected[option.id] })),
      pricing: manual ? null : linePricing,
      quantity: qty,
    })
    toast.success(`${product.name} added to cart`, {
      action: { label: "View cart", onClick: () => navigate("/cart") },
    })
  }

  let hint: string | null = null
  if (missingOptions.length > 0) hint = `Choose ${missingOptions.map((option) => option.name.toLowerCase()).join(" and ")}`
  else if (resolution.kind === "package" && !entry) hint = "Choose a package"
  else if (areaPriced && !dimensionsReady) hint = "Enter your width and height"
  else if (!qtyValid) hint = "Enter a quantity of at least 1"

  return (
    <div className="flex flex-col gap-6">
      {product.options.map((option) => (
        <fieldset key={option.id} className="flex flex-col gap-2.5">
          <legend className="mb-2.5 text-sm font-semibold">
            {option.name}
            {!option.required && <span className="ml-1.5 font-normal text-muted-foreground">(optional)</span>}
          </legend>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => (
              <ChoiceChip
                key={value}
                selected={selected[option.id] === value}
                onClick={() => toggleOption(option.id, value, option.required)}
              >
                {value}
              </ChoiceChip>
            ))}
          </div>
        </fieldset>
      ))}

      {resolution.kind === "package" && (
        <fieldset className="flex flex-col">
          <legend className="mb-2.5 text-sm font-semibold">Package</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {resolution.candidates.map((candidate) => (
              <PackageTierCard
                key={candidate.id}
                entry={candidate}
                selected={candidate.id === entry?.id}
                onSelect={() => setPackageId(candidate.id)}
              />
            ))}
          </div>
        </fieldset>
      )}

      {areaPriced && entry && (
        <fieldset className="flex flex-col">
          <legend className="mb-2.5 text-sm font-semibold">
            Size <span className="font-normal text-muted-foreground">(in feet · {formatCurrency(entry.price)} / sq.ft.)</span>
          </legend>
          <div className="grid max-w-sm grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="width">Width (ft)</Label>
              <Input
                id="width"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.5"
                value={width}
                onChange={(event) => setWidth(event.target.value)}
                placeholder="e.g. 3"
                className="h-10"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="height">Height (ft)</Label>
              <Input
                id="height"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.5"
                value={height}
                onChange={(event) => setHeight(event.target.value)}
                placeholder="e.g. 5"
                className="h-10"
              />
            </div>
          </div>
        </fieldset>
      )}

      {unavailable && (
        <p className="flex items-start gap-2 rounded-lg border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
          <InfoIcon className="mt-0.5 size-4 shrink-0" />
          This combination isn't available. Try a different option.
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="quantity">Quantity</Label>
        <div className="w-40">
          <QuantityInput id="quantity" value={quantity} onChange={setQuantity} className="h-10" />
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{manual ? "Price" : "Total"}</p>
          {manual ? (
            <p className="text-lg font-semibold">Price on request</p>
          ) : total !== null ? (
            <p className="text-2xl font-bold tracking-tight tabular-nums">{formatCurrency(total)}</p>
          ) : (
            <p className="text-sm text-muted-foreground">{hint ?? "Choose your options"}</p>
          )}
          {entry && total !== null && (
            <p className="text-xs text-muted-foreground tabular-nums">
              {formatCurrency(entry.price)}
              {unitSuffix(entry)}
              {areaPriced && widthFt && heightFt && ` × ${widthFt * heightFt} sq.ft.`} × {qty}
            </p>
          )}
        </div>
        <Button variant="gradient" size="lg" className="h-11 gap-2 px-5 pointer-coarse:h-12" disabled={!canAdd} onClick={handleAdd}>
          <ShoppingBagIcon className="size-4" />
          Add to cart
        </Button>
      </div>
      {manual && (
        <p className="-mt-3 text-xs text-muted-foreground">
          We'll confirm the price for this item with you after you send your order.
        </p>
      )}
    </div>
  )
}

export function ProductPage() {
  const { productId = "" } = useParams()
  const { productsById, detailStatus, detailError, loadProduct } = useCatalog()
  const product = productsById[productId]

  useEffect(() => {
    void loadProduct(productId)
  }, [productId, loadProduct])

  if (!product) {
    if (detailStatus === "failed") {
      return (
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <Empty className="border border-border bg-card py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <PackageXIcon />
              </EmptyMedia>
              <EmptyTitle>Product not available</EmptyTitle>
              <EmptyDescription>{detailError}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" render={<Link to="/shop" />} nativeButton={false}>
                Back to shop
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      )
    }
    return (
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:py-12">
        <div className="aspect-square w-full animate-pulse rounded-2xl bg-muted" />
        <div className="flex flex-col gap-4">
          <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
          <div className="h-9 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-5 w-1/3 animate-pulse rounded bg-muted" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-10">
      <Link
        to="/shop"
        className="mb-6 inline-flex min-h-10 items-center gap-1.5 rounded-md text-sm font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <ArrowLeftIcon className="size-4" />
        Back to shop
      </Link>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Keyed so switching products starts on the new product's main image. */}
        <ProductGallery key={product.id} product={product} className="lg:sticky lg:top-24 lg:self-start" />
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Badge variant="secondary">{product.category}</Badge>
            <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">{product.name}</h1>
            {product.description && <p className="text-muted-foreground">{product.description}</p>}
            <StartingPrice product={product} className="text-lg" />
          </div>
          {/* Keyed so switching products resets every choice. */}
          <ProductConfigurator key={product.id} product={product} />
        </div>
      </div>
    </div>
  )
}
