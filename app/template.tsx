/**
 * Wraps every route in a subtle fade-in. Unlike `layout`, a `template`
 * re-mounts on navigation, so this animation replays on each route change.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
