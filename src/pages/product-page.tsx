import { useEffect, useState } from "react"
import { ArrowLeftIcon, CheckIcon, InfoIcon, MessageCircleIcon, PackageXIcon, ShoppingBagIcon, XIcon } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import { MobileActionBar } from "@/components/mobile-action-bar"
import { OutOfStockBadge } from "@/components/product-card"
import { ProductGallery } from "@/components/product-gallery"
import { ProductVisual } from "@/components/product-image"
import { StartingPrice } from "@/components/price-tag"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QuantityInput } from "@/components/ui/quantity-input"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { MAX_LINE_QUANTITY, MAX_NOTE_LENGTH, useCart } from "@/lib/cart"
import { useCatalog } from "@/lib/catalog"
import { announceCartAdded, flyToCart, isCompactViewport } from "@/lib/fly-to-cart"
import { buildMadeToOrderMessage, openMessenger } from "@/lib/messenger"
import {
  computeLineTotal,
  describeAppliesTo,
  isAreaPriced,
  isManualPricingProduct,
  resolvePricing,
  type LinePricing,
  type PricingResolution,
} from "@/lib/pricing-resolver"
import { useShopSettings } from "@/lib/shop-settings"
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
        "inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full px-4 font-heading text-sm font-extrabold transition-[translate,box-shadow,color] duration-200 outline-none focus-visible:ring-4 focus-visible:ring-primary/30 active:scale-[0.96] motion-reduce:transition-none",
        selected
          ? "bg-brand-gradient text-primary-foreground shadow-clay-button"
          : "bg-card text-foreground shadow-clay-card hover:-translate-y-0.5 hover:text-primary hover:shadow-clay-card-hover motion-reduce:hover:translate-y-0"
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
        "flex cursor-pointer flex-col items-start gap-1 rounded-[20px] p-4 text-left transition-[translate,box-shadow,background-color] duration-200 outline-none focus-visible:ring-4 focus-visible:ring-primary/30",
        selected
          ? "bg-accent shadow-clay-pressed ring-2 ring-primary"
          : "bg-card shadow-clay-card hover:-translate-y-0.5 hover:shadow-clay-card-hover motion-reduce:hover:translate-y-0"
      )}
    >
      <span className={cn("text-sm font-medium", selected && "text-accent-foreground")}>
        {entry.packageName || describeAppliesTo(entry.appliesTo)}
      </span>
      <span className="font-heading text-lg font-black tabular-nums">{formatCurrency(entry.price)}</span>
    </button>
  )
}

function parsePositive(value: string): number | null {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : null
}

/** "Required" marker shown in the options sheet on choices the buyer still has to make. */
function RequiredMark() {
  return <span className="ml-1.5 text-xs font-medium text-destructive">Required</span>
}

type ConfigFieldsProps = {
  product: ShopProduct
  selected: Record<string, string>
  onToggle: (optionId: string, value: string, required: boolean) => void
  resolution: PricingResolution
  entry: PricingEntry | undefined
  onSelectPackage: (id: string) => void
  areaPriced: boolean
  width: string
  height: string
  onWidthChange: (value: string) => void
  onHeightChange: (value: string) => void
  unavailable: boolean
  /** Keeps input ids unique while the same fields render inline and in the options sheet. */
  idPrefix?: string
  /** Mark still-missing required choices (used in the options sheet). */
  showRequired?: boolean
}

/** Option chips, package tiers and size inputs — rendered inline on the page and in the options sheet,
 *  both driven by the same ProductConfigurator state. */
function ConfigFields({
  product,
  selected,
  onToggle,
  resolution,
  entry,
  onSelectPackage,
  areaPriced,
  width,
  height,
  onWidthChange,
  onHeightChange,
  unavailable,
  idPrefix = "",
  showRequired = false,
}: ConfigFieldsProps) {
  return (
    <>
      {product.options.map((option) => (
        <fieldset key={option.id} className="flex flex-col gap-2.5">
          <legend className="mb-2.5 text-sm font-semibold">
            {option.name}
            {!option.required && <span className="ml-1.5 font-normal text-muted-foreground">(optional)</span>}
            {showRequired && option.required && !selected[option.id] && <RequiredMark />}
          </legend>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => (
              <ChoiceChip
                key={value}
                selected={selected[option.id] === value}
                onClick={() => onToggle(option.id, value, option.required)}
              >
                {value}
              </ChoiceChip>
            ))}
          </div>
        </fieldset>
      ))}

      {resolution.kind === "package" && (
        <fieldset className="flex flex-col">
          <legend className="mb-2.5 text-sm font-semibold">
            Package
            {showRequired && !entry && <RequiredMark />}
          </legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {resolution.candidates.map((candidate) => (
              <PackageTierCard
                key={candidate.id}
                entry={candidate}
                selected={candidate.id === entry?.id}
                onSelect={() => onSelectPackage(candidate.id)}
              />
            ))}
          </div>
        </fieldset>
      )}

      {areaPriced && entry && (
        <fieldset className="flex flex-col">
          <legend className="mb-2.5 text-sm font-semibold">
            Size <span className="font-normal text-muted-foreground">(in feet)</span>
            {showRequired && (!parsePositive(width) || !parsePositive(height)) && <RequiredMark />}
          </legend>
          <div className="grid max-w-sm grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`${idPrefix}width`}>Width (ft)</Label>
              <Input
                id={`${idPrefix}width`}
                type="number"
                inputMode="decimal"
                min="0"
                step="0.5"
                value={width}
                onChange={(event) => onWidthChange(event.target.value)}
                placeholder="e.g. 3"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`${idPrefix}height`}>Height (ft)</Label>
              <Input
                id={`${idPrefix}height`}
                type="number"
                inputMode="decimal"
                min="0"
                step="0.5"
                value={height}
                onChange={(event) => onHeightChange(event.target.value)}
                placeholder="e.g. 5"
              />
            </div>
          </div>
        </fieldset>
      )}

      {unavailable && (
        <p className="clay-well flex items-start gap-2 p-4 text-sm font-medium text-muted-foreground">
          <InfoIcon className="mt-0.5 size-4 shrink-0" />
          This combination isn't available. Try a different option.
        </p>
      )}
    </>
  )
}

function QuantityField({ id, value, onChange }: { id: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>Quantity</Label>
      <div className="w-40">
        <QuantityInput id={id} value={value} onChange={onChange} />
      </div>
    </div>
  )
}

function ProductConfigurator({ product }: { product: ShopProduct }) {
  const navigate = useNavigate()
  const { addLine } = useCart()
  const [selected, setSelected] = useState<Record<string, string>>({})
  const [packageId, setPackageId] = useState<string | null>(null)
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [note, setNote] = useState("")
  const [sheetOpen, setSheetOpen] = useState(false)

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
        pricingEntryId: entry.id,
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

  const selectedOptions = product.options
    .filter((option) => selected[option.id])
    .map((option) => ({ name: option.name, value: selected[option.id] }))

  function toggleOption(optionId: string, value: string, required: boolean) {
    setSelected((current) => {
      const next = { ...current }
      if (current[optionId] === value && !required) delete next[optionId]
      else next[optionId] = value
      return next
    })
  }

  /** `source` is the tapped button; on mobile the product flies from it to the cart icon. */
  function handleAdd(source?: HTMLElement) {
    if (!canAdd) return
    const line = {
      productId: product.id,
      productName: product.name,
      category: product.category,
      imageUrl: product.images[0]?.url,
      selectedOptions,
      pricing: manual ? null : linePricing,
      quantity: qty,
      note,
    }
    setNote("")
    setSheetOpen(false)

    function commit() {
      addLine(line)
      toast.success(`${product.name} added to cart`, {
        action: { label: "View cart", onClick: () => navigate("/cart") },
      })
    }

    if (source && isCompactViewport()) {
      // Add as it lands, so the badge ticks up (and the cart icon bumps) when the product "arrives".
      void flyToCart({ from: source, imageUrl: line.imageUrl }).then(() => {
        commit()
        announceCartAdded()
      })
      return
    }
    commit()
  }

  // Mobile bar: add straight away when the choice is complete, otherwise ask for what's missing.
  function handleMobileAdd(event: React.MouseEvent<HTMLElement>) {
    if (canAdd) handleAdd(event.currentTarget)
    else setSheetOpen(true)
  }

  let hint: string | null = null
  if (missingOptions.length > 0) hint = `Choose ${missingOptions.map((option) => option.name.toLowerCase()).join(" and ")}`
  else if (resolution.kind === "package" && !entry) hint = "Choose a package"
  else if (areaPriced && !dimensionsReady) hint = "Enter your width and height"
  else if (!qtyValid) hint = "Enter a quantity of at least 1"

  const fieldProps = {
    product,
    selected,
    onToggle: toggleOption,
    resolution,
    entry,
    onSelectPackage: setPackageId,
    areaPriced,
    width,
    height,
    onWidthChange: setWidth,
    onHeightChange: setHeight,
    unavailable,
  }

  // Plain "₱50 × 2" — the shop shows prices without units, so area-priced items just show the total.
  const priceBreakdown = entry && total !== null && !areaPriced && qty > 1 && (
    <p className="text-xs text-muted-foreground tabular-nums">
      {formatCurrency(entry.price)} × {qty}
    </p>
  )

  return (
    <div className="flex flex-col gap-6">
      <ConfigFields {...fieldProps} />
      <QuantityField id="quantity" value={quantity} onChange={setQuantity} />
      <NoteField value={note} onChange={setNote} />

      {/* Desktop keeps the button inline; below lg it lives in the MobileActionBar. */}
      <div className="clay-panel hidden gap-4 p-6 lg:flex lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{manual ? "Price" : "Total"}</p>
          {manual ? (
            <p className="text-lg font-semibold">Price on request</p>
          ) : total !== null ? (
            <p className="font-heading text-3xl font-black tracking-tight tabular-nums">{formatCurrency(total)}</p>
          ) : (
            <p className="text-sm text-muted-foreground">{hint ?? "Choose your options"}</p>
          )}
          {priceBreakdown}
        </div>
        <Button size="sm" disabled={!canAdd} onClick={() => handleAdd()}>
          <ShoppingBagIcon className="size-4" />
          Add to cart
        </Button>
      </div>
      {manual && (
        <p className="text-xs text-muted-foreground lg:-mt-3">
          We'll confirm the price for this item with you after you send your order.
        </p>
      )}

      <MobileActionBar>
        <div className="min-w-0 flex-1">
          {manual ? (
            <p className="font-semibold">Price on request</p>
          ) : total !== null ? (
            <>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="font-heading text-xl leading-tight font-black tracking-tight tabular-nums">{formatCurrency(total)}</p>
            </>
          ) : (
            <StartingPrice product={product} />
          )}
        </div>
        <Button size="sm" className="h-12 px-6" onClick={handleMobileAdd}>
          <ShoppingBagIcon className="size-4" />
          Add to cart
        </Button>
      </MobileActionBar>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="max-h-[85svh] gap-0 p-0 duration-300 ease-out data-[side=bottom]:data-ending-style:translate-y-full data-[side=bottom]:data-starting-style:translate-y-full motion-reduce:transition-none"
        >
          <div aria-hidden className="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-muted-foreground/30" />
          <SheetHeader className="flex-row items-center gap-3 border-b border-border/70 px-5 pt-2 pb-4">
            <ProductVisual
              url={product.images[0]?.url}
              alt={product.name}
              category={product.category}
              className="size-14 shrink-0 rounded-2xl"
              iconClassName="size-6"
            />
            <div className="min-w-0 flex-1">
              <SheetTitle className="truncate text-lg font-extrabold">{product.name}</SheetTitle>
              <SheetDescription>Choose your options</SheetDescription>
            </div>
            <SheetClose render={<Button variant="secondary" size="icon" className="self-start" />}>
              <XIcon />
              <span className="sr-only">Close</span>
            </SheetClose>
          </SheetHeader>

          <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto overscroll-contain px-5 py-5">
            <ConfigFields {...fieldProps} idPrefix="sheet-" showRequired />
            <QuantityField id="sheet-quantity" value={quantity} onChange={setQuantity} />
          </div>

          <div className="flex items-center gap-3 border-t border-border/70 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <div className="min-w-0 flex-1">
              {manual ? (
                <p className="font-semibold">Price on request</p>
              ) : total !== null ? (
                <>
                  <p className="font-heading text-xl leading-tight font-black tracking-tight tabular-nums">{formatCurrency(total)}</p>
                  {priceBreakdown}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">{hint ?? "Choose your options"}</p>
              )}
            </div>
            <Button size="sm" className="h-12 px-6" disabled={!canAdd} onClick={(event) => handleAdd(event.currentTarget)}>
              <ShoppingBagIcon className="size-4" />
              Add to cart
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function NoteField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="note">
        Notes <span className="font-normal text-muted-foreground">(optional)</span>
      </Label>
      <Textarea
        id="note"
        value={value}
        maxLength={MAX_NOTE_LENGTH}
        onChange={(event) => onChange(event.target.value)}
        placeholder="e.g. name to print, colors, when you need it"
        className="max-h-40 min-h-20"
      />
      <p className="text-right text-xs text-muted-foreground tabular-nums">
        {value.length}/{MAX_NOTE_LENGTH}
      </p>
    </div>
  )
}

/** Made-to-order product: no options, quantity, notes or cart — the buyer messages us on Facebook
 *  and staff settle the details and price in the chat. */
function MadeToOrderPanel({ product }: { product: ShopProduct }) {
  const { messengerUrl, isLoading } = useShopSettings()

  async function handleMessage() {
    if (!messengerUrl) return
    const copied = await openMessenger(messengerUrl, buildMadeToOrderMessage(product.name))
    if (copied) toast.success("Message copied. Paste it in Messenger if it isn't filled in.")
  }

  return (
    <>
      <div className="clay-panel flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-heading text-lg font-extrabold">Made to order</p>
          <p className="text-sm text-muted-foreground">
            {messengerUrl || isLoading
              ? "Message us to confirm the details and price."
              : "Please contact DG Prints to order this item."}
          </p>
        </div>
        {messengerUrl && (
          // Below lg this button lives in the MobileActionBar instead.
          <Button size="sm" className="hidden lg:inline-flex" onClick={handleMessage}>
            <MessageCircleIcon className="size-4" />
            Message us on Facebook
          </Button>
        )}
      </div>
      {messengerUrl && (
        <MobileActionBar>
          <Button size="sm" className="h-12 flex-1" onClick={handleMessage}>
            <MessageCircleIcon className="size-4" />
            Message us on Facebook
          </Button>
        </MobileActionBar>
      )}
    </>
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
          <Empty className="py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <PackageXIcon />
              </EmptyMedia>
              <EmptyTitle>Product not available</EmptyTitle>
              <EmptyDescription>{detailError}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="secondary" size="sm" render={<Link to="/shop" />} nativeButton={false}>
                Back to shop
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      )
    }
    return (
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:py-12">
        <div className="aspect-square w-full animate-pulse rounded-[32px] bg-card/60 shadow-clay-card" />
        <div className="flex flex-col gap-4">
          <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
          <div className="h-9 w-2/3 animate-pulse rounded-full bg-muted" />
          <div className="h-5 w-1/3 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-10">
      <Link
        to="/shop"
        className="mb-6 inline-flex min-h-11 items-center gap-1.5 rounded-full font-heading text-sm font-extrabold text-muted-foreground outline-none hover:text-primary focus-visible:ring-4 focus-visible:ring-primary/30"
      >
        <ArrowLeftIcon className="size-4" />
        Back to shop
      </Link>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Keyed so switching products starts on the new product's main image. */}
        <ProductGallery key={product.id} product={product} className="lg:sticky lg:top-24 lg:self-start" />
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="soft">
                {product.category}
              </Badge>
              {!product.inStock && <OutOfStockBadge />}
            </div>
            <h1 className="text-4xl leading-[1.1] font-black tracking-tight text-balance sm:text-5xl">{product.name}</h1>
            {product.description && <p className="text-lg leading-relaxed font-medium text-muted-foreground">{product.description}</p>}
            <StartingPrice product={product} className="font-heading text-2xl [&>span:last-child]:font-black" />
          </div>
          {/* Keyed so switching products resets every choice. */}
          {!product.inStock ? (
            <p className="clay-well flex items-start gap-2 p-4 text-sm font-medium text-muted-foreground">
              <InfoIcon className="mt-0.5 size-4 shrink-0" />
              This item is out of stock right now. Please check back later.
            </p>
          ) : product.madeToOrder ? (
            <MadeToOrderPanel key={product.id} product={product} />
          ) : (
            <ProductConfigurator key={product.id} product={product} />
          )}
        </div>
      </div>
    </div>
  )
}
