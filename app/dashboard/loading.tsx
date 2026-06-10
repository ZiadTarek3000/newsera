export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="fixed top-0 z-50 h-20 w-full border-b border-outline-variant/30 bg-surface/80 backdrop-blur-xl" />
      <div className="mx-auto max-w-[1280px] px-5 pt-32 md:px-16">
        <div className="mb-12 space-y-4">
          <div className="h-12 w-80 animate-pulse rounded bg-surface-container" />
          <div className="h-5 w-96 animate-pulse rounded bg-surface-container" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="h-72 animate-pulse rounded-xl bg-surface-container lg:col-span-8" />
          <div className="h-72 animate-pulse rounded-xl bg-surface-container lg:col-span-4" />
        </div>
      </div>
    </div>
  );
}
