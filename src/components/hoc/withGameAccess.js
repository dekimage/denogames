"use client";
import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useRouter } from "next/navigation";
import MobxStore from "@/mobx";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { LoadingSpinner } from "@/reusable-ui/LoadingSpinner";

export const withGameAccess = (WrappedComponent, gameId) => {
  return observer((props) => {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [authInitialized, setAuthInitialized] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
      // Listen for Firebase auth state changes
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setAuthInitialized(true);
      });

      return () => unsubscribe();
    }, []);

    useEffect(() => {
      const checkAccess = async () => {
        try {
          // Wait for both Firebase auth and MobX store to be ready
          if (!authInitialized || MobxStore.loadingUser) {
            return;
          }

          // Check if user is logged in
          if (!MobxStore.user) {
            router.push("/login?redirect=" + window.location.pathname);
            return;
          }

          // Get the current user's token
          const token = await auth.currentUser.getIdToken();

          // Call the API to verify access
          const response = await fetch("/api/auth/check-game-access", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token,
              gameId,
            }),
          });

          if (!response.ok) {
            const data = await response.json();
            if (response.status === 403) {
              // Redirect to product details page if game not purchased
              router.push(`/product-details/${gameId}?error=not_purchased`);
              return;
            }
            throw new Error(data.error || "Access denied");
          }

          setIsAuthorized(true);
        } catch (error) {
          console.error("Access check failed:", error);
          setError(error.message);
          if (authInitialized && !MobxStore.loadingUser) {
            router.push(`/product-details/${gameId}?error=access_denied`);
          }
        } finally {
          if (authInitialized && !MobxStore.loadingUser) {
            setIsLoading(false);
          }
        }
      };

      checkAccess();
    }, [
      router,
      authInitialized,
    ]);

    if (isLoading || !authInitialized || MobxStore.loadingUser) {
      return <LoadingSpinner />; // Or your loading component
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push(`/product-details/${gameId}`)}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            View Game Details
          </button>
        </div>
      );
    }

    return isAuthorized ? <WrappedComponent {...props} /> : null;
  });
};
