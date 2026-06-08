"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function HeaderAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="size-9 animate-pulse rounded-full bg-surface-container-high" />;
  }

  if (session?.user) {
    const { name, image } = session.user;
    const initial = (name ?? session.user.email ?? "?").charAt(0).toUpperCase();
    return (
      <Link
        href="/dashboard"
        aria-label="Go to your dashboard"
        className="flex size-9 items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-surface-container-high text-[13px] font-semibold text-on-surface-variant transition-transform hover:scale-105"
      >
        {image ? (
          <Image
            src={image}
            alt={name ?? "Profile"}
            width={36}
            height={36}
            className="size-full object-cover"
          />
        ) : (
          initial
        )}
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="link-underline text-[12px] font-semibold tracking-[0.1em] text-on-surface-variant transition-colors hover:text-primary"
    >
      Sign in
    </Link>
  );
}
