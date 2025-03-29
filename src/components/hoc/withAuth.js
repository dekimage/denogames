"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import MobxStore from "@/mobx";
import { observer } from "mobx-react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export function withAuth(WrappedComponent, options = {}) {
  return observer(function WithAuthComponent(props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { user, loadingUser, userFullyLoaded } = MobxStore;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    // Don't render anything until client-side hydration is complete
    if (!mounted) {
      return null;
    }

    // Wait for EVERYTHING to be loaded
    if (loadingUser || !userFullyLoaded) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      );
    }

    // Now we're 100% sure about the auth state
    if (!user) {
      // Get the current path and query params for redirect
      const currentPath =
        pathname +
        (searchParams.toString() ? `?${searchParams.toString()}` : "");

      // Use the configured redirect path or default to signup
      const redirectTo =
        options?.redirectPath ||
        `/signup?redirect=${encodeURIComponent(currentPath)}`;

      if (typeof window !== "undefined") {
        router.push(redirectTo);
      }
      return null;
    }

    // We definitely have a user
    return <WrappedComponent {...props} />;
  });
}
