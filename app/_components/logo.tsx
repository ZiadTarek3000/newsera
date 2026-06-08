type LogoProps = {
  className?: string;
};

/** The Newsera wordmark, set in the brand serif (Playfair Display). */
export default function Logo({ className }: LogoProps) {
  return (
    <span
      className={`font-serif font-bold tracking-[-0.02em] text-on-surface ${className ?? ""}`}
    >
      Newsera
    </span>
  );
}
