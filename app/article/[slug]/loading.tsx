export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="fixed top-0 z-50 h-20 w-full border-b border-outline-variant/30 bg-surface/80 backdrop-blur-xl" />
      <div className="pt-20">
        <div className="h-[70vh] min-h-[500px] w-full animate-pulse bg-surface-container" />
        <div className="mx-auto max-w-3xl space-y-6 px-6 py-24">
          <div className="h-24 w-full animate-pulse rounded-xl bg-surface-container" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-4 w-full animate-pulse rounded bg-surface-container"
            />
          ))}
          <div className="h-4 w-2/3 animate-pulse rounded bg-surface-container" />
        </div>
      </div>
    </div>
  );
}
