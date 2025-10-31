"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "./store/useAuthStore";

// public paths that should NOT be guarded client-side
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/api",
  "/favicon.ico",
  "/_next",
  "/public",
];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // if current path is public, don't redirect
    if (!pathname) return;
    const isPublic = PUBLIC_PATHS.some(
      (p) => pathname === p || pathname.startsWith(p)
    );
    if (isPublic) return;

    if (!token) {
      router.push("/login");
    }
  }, [token, router, pathname]);

  // If route is public, render children regardless of token
  if (!pathname) return null;
  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p)
  );
  if (isPublic) return <>{children}</>;

  // For protected routes, wait for token
  if (!token) return null;
  return <>{children}</>;
}
