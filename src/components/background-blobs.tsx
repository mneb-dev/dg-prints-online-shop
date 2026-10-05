/** Atmospheric depth behind the top of every page: large, heavily blurred indigo/violet orbs at low
 *  opacity. Static (no wandering) so they stay calm; rendered once by ShopLayout. */
export function BackgroundBlobs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[56rem] overflow-hidden">
      <div className="absolute -top-48 -left-40 size-[36rem] rounded-full bg-indigo-200/50 blur-3xl" />
      <div className="absolute -top-24 -right-32 size-[32rem] rounded-full bg-violet-200/40 blur-3xl" />
      <div className="absolute top-80 left-1/3 size-[26rem] rounded-full bg-sky-100/40 blur-3xl" />
    </div>
  )
}
