import Link from "next/link";
import type { Metadata } from "next";
import Logo from "../_components/logo";
import ResetPasswordForm from "../_components/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
  robots: { index: false },
};

type ResetPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPageProps) {
  const { token } = await searchParams;

  return (
    <div className="flex min-h-screen flex-grow items-center justify-center bg-background p-4 text-on-background sm:p-6">
      <div className="animate-rise-in w-full max-w-[480px] rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] sm:p-10 md:p-12">
        <header className="mb-8 text-center">
          <h1 className="mb-1 text-[36px] leading-[1.1] sm:text-[40px]">
            <Logo className="uppercase" />
          </h1>
          <p className="text-[15px] leading-[1.6] text-on-surface-variant">
            Choose a new password
          </p>
        </header>

        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="space-y-6 text-center">
            <p className="rounded border border-error/30 bg-error/5 px-3 py-3 text-[14px] font-medium text-error">
              This reset link is missing its token. Please request a new one.
            </p>
            <Link
              href="/forgot-password"
              className="inline-flex w-full items-center justify-center rounded bg-primary py-3 text-[14px] font-medium text-on-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
            >
              Request a reset link
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
