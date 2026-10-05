/** Ambient lighting behind the whole shop: big, blurred, slowly wandering colour blobs that show
 *  through the glass-clay cards. Rendered once by ShopLayout. Alternate drifts keep them out of step. */
export function BackgroundBlobs() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-[10%] -left-[10%] size-[60vh] animate-clay-blob rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute top-[20%] -right-[10%] size-[60vh] animate-clay-blob-alt rounded-full bg-pink-500/10 blur-3xl animation-delay-2000" />
      <div className="absolute -bottom-[15%] left-[20%] size-[55vh] animate-clay-blob rounded-full bg-sky-500/10 blur-3xl animation-delay-4000" />
      <div className="absolute top-[55%] -left-[15%] size-[45vh] animate-clay-blob-alt rounded-full bg-emerald-500/10 blur-3xl animation-delay-4000" />
    </div>
  )
}
