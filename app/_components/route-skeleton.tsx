/**
 * Lightweight, shared loading skeleton shown instantly during navigation while
 * a route's server component streams in. Pure markup (no client JS) so it costs
 * almost nothing and makes navigation feel immediate.
 */
export default function RouteSkeleton({
  showHero = true,
}: {
  showHero?: boolean;
}) {
  return (
    <div className="min-h-screen">
      <div className="fixed top-0 z-50 h-20 w-full border-b border-outline-variant/30 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-8">
          <div className="h-7 w-36 animate-pulse rounded bg-surface-container" />
          <div className="hidden gap-8 md:flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-3 w-16 animate-pulse rounded bg-surface-container"
              />
            ))}
          </div>
          <div className="size-9 animate-pulse rounded-full bg-surface-container" />
        </div>
      </div>

      <main className="mx-auto max-w-[1440px] px-8 pt-32">
        {showHero && (
          <div className="mb-16 grid gap-8 lg:grid-cols-12">
            <div className="space-y-5 lg:col-span-7">
              <div className="h-4 w-28 animate-pulse rounded bg-surface-container" />
              <div className="h-14 w-full animate-pulse rounded bg-surface-container" />
              <div className="h-14 w-3/4 animate-pulse rounded bg-surface-container" />
              <div className="h-4 w-full animate-pulse rounded bg-surface-container" />
            </div>
            <div className="aspect-[4/5] animate-pulse rounded-xl bg-surface-container lg:col-span-5" />
          </div>
        )}

        <div className="grid grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="aspect-[3/2] animate-pulse rounded-lg bg-surface-container" />
              <div className="h-4 w-24 animate-pulse rounded bg-surface-container" />
              <div className="h-6 w-full animate-pulse rounded bg-surface-container" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-surface-container" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
