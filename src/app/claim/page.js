"use client";
import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { withAuth } from "@/components/hoc/withAuth";
import MobxStore from "@/mobx";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const ClaimPage = observer(() => {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [claimedProducts, setClaimedProducts] = useState([]);
  const searchParams = useSearchParams();
  const { user } = MobxStore;

  useEffect(() => {
    const urlCode = searchParams.get("code");
    if (urlCode) {
      setCode(urlCode);
    }
  }, [searchParams]);

  const validateCode = async (codeToValidate = code) => {
    setLoading(true);
    setError("");
    setSuccess("");
    setClaimedProducts([]);

    try {
      const response = await fetch("/api/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: codeToValidate,
          email: user.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        switch (response.status) {
          case 403:
            throw new Error("This code belongs to a different user. Please check your email and try again.");
          case 404:
            throw new Error("User not found. Please try logging out and back in.");
          case 400:
            throw new Error(data.error || "Invalid code. Please check and try again.");
          case 500:
            throw new Error("Server error. Please try again later.");
          default:
            throw new Error(data.error || "Failed to validate code");
        }
      }

      setSuccess("Successfully claimed your rewards!");
      setClaimedProducts(data.claimedProducts || []);

      if (data.user) {
        MobxStore.updateUserProfile(data.user);
        // Redirect after a short delay to show success message
        setTimeout(() => {
          router.push("/my-games");
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="box-inner mt-16">
      <div className="container box-broken mx-auto px-4 py-8 max-w-2xl">
        <h1 className="font-strike text-4xl font-bold text-center mb-8">
          Claim Your Rewards
        </h1>

        <div className="box-inner box-broken bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-8">
            <label className="block text-lg font-medium mb-3">
              Enter your unique code
            </label>
            <div className="flex gap-3">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your code"
                className="flex-1 text-lg h-12"
                disabled={loading}
              />
              <Button
                onClick={() => validateCode()}
                disabled={!code || loading}
                className="h-12 px-6 text-lg"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : null}
                Validate
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription className="text-base">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <div className="space-y-6">
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <AlertDescription className="text-base">
                  {success}
                </AlertDescription>
              </Alert>

              {claimedProducts.length > 0 && (
                <div className="mt-6 bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-4">
                    Claimed Products:
                  </h3>
                  <ul className="list-disc pl-6 space-y-3">
                    {claimedProducts.map((product, index) => (
                      <li key={index} className="text-gray-700 text-lg">
                        {product.name}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-gray-600 text-center">
                    Redirecting to My Games...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default withAuth(ClaimPage);
