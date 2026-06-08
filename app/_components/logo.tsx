type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return (
    <span
      className={`font-serif font-bold tracking-[-0.02em] text-on-surface ${className ?? ""}`}
    >
      Newsera
    </span>
  );
}
