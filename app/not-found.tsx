import Link from "next/link";
import SiteHeader from "./_components/site-header";
import SiteFooter from "./_components/site-footer";

export default function NotFound() {
  return (
    <div>
      <SiteHeader />
      <main className="mx-auto flex min-h-[70vh] max-w-[760px] flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
        <p className="text-[14px] font-semibold uppercase tracking-[0.2em] text-primary">
          Error 404
        </p>
        <h1 className="mt-4 font-serif text-[40px] font-bold leading-[1.1] tracking-[-0.02em] text-on-surface sm:text-[56px]">
          Page not found
        </h1>
        <p className="mt-4 max-w-md text-[16px] leading-relaxed text-on-surface-variant sm:text-[18px]">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
          Let&apos;s get you back to the headlines.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3.5 text-[13px] font-semibold tracking-[0.1em] text-on-primary shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.99]"
        >
          Back to home
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
