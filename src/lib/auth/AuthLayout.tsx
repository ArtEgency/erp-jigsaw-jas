"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { hasPermission } from "./permission";

interface AuthLayoutProps {
  children: ReactNode;
  /** Custom redirect path when not authenticated (default: /login) */
  loginPath?: string;
  /** Custom redirect path when no permission (default: /login) */
  forbiddenPath?: string;
}

export default function AuthLayout({
  children,
  loginPath = "/login",
  forbiddenPath = "/login",
}: AuthLayoutProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // Not logged in → redirect to login
    if (!isAuthenticated) {
      router.replace(loginPath);
      return;
    }

    // Logged in but no permission → redirect to forbidden
    if (user && !hasPermission(user.role, pathname)) {
      router.replace(forbiddenPath);
    }
  }, [isLoading, isAuthenticated, user, pathname, router, loginPath, forbiddenPath]);

  // Show nothing while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-gray-400">กำลังตรวจสอบสิทธิ์...</div>
      </div>
    );
  }

  // Not authenticated → show nothing (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // No permission → show nothing (will redirect)
  if (user && !hasPermission(user.role, pathname)) {
    return null;
  }

  return <>{children}</>;
}
