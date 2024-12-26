"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import MobxStore from "@/mobx";
import { observer } from "mobx-react";
import { Loader2 } from "lucide-react";

export function withAuth(WrappedComponent) {
  return observer(function WithAuthComponent(props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { user, loadingUser, userFullyLoaded } = MobxStore;

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
      // Store the current URL before redirecting
      const redirectPath =
        pathname +
        (searchParams.toString() ? `?${searchParams.toString()}` : "");
      localStorage.setItem("redirectAfterLogin", redirectPath);
      router.push("/login");
      return null;
    }

    // We definitely have a user
    return <WrappedComponent {...props} />;
  });
}
