"use client";

import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase";
import {
  CheckCircle,
  Package,
  Star,
  Download,
  Lock,
  Cog,
  ChevronLeft,
  ShoppingCart,
  CheckCheck,
  Gift,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";

import Breadcrumbs from "@/components/Breadcrumbs";
import { LoadingSpinner } from "@/reusable-ui/LoadingSpinner";
import { ProductTypeBadge } from "@/components/ProductTypeBadge";
import { unlockProductAchievement } from "@/lib/helpers/clientAchievementHelper";

const ComponentCard = ({
  title,
  name,
  image,
  description,
  fileUrl,
  isLocked,
  lockReason,
  requirements,
  price,
  productSlug,
  sourceName,
  achievementKey,
  ctaLabel,
}) => {
  const { addToCart, cart } = MobxStore;
  const isInCart =
    requirements?.type === "purchase" && cart.includes(requirements.value);

  const getLockContent = () => {
    if (!isLocked) return null;

    switch (requirements?.type) {
      case "achievement":
        return {
          message: `Unlock this add-on: ${sourceName}`,
          action: (
            <Link href={`/product-details/${productSlug}`} className="w-full">
              <Button variant="secondary" size="sm" className="w-full">
                <Gift className="w-4 h-4 mr-2" />
                View Add-on
              </Button>
            </Link>
          ),
        };
      case "purchase":
        if (isInCart) {
          return {
            message: "Available after purchase",
            action: (
              <Link href="/checkout" className="w-full">
                <Button variant="secondary" size="sm" className="w-full">
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Complete Purchase
                </Button>
              </Link>
            ),
          };
        }
        return {
          message: `Requires expansion: ${sourceName}`,
          action: (
            <Link href={`/product-details/${productSlug}`} className="w-full">
              <Button variant="secondary" size="sm" className="w-full">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buy Expansion
              </Button>
            </Link>
          ),
        };
      default:
        return {
          message: lockReason,
          action: null,
        };
    }
  };
  const lockContent = getLockContent();

  const handleDownload = async (achievementKey) => {
    if (achievementKey) {
      await unlockProductAchievement(achievementKey);
    }

    if (fileUrl) {
      try {
        // Check if it's a Firebase Storage URL
        const isFirebaseUrl = fileUrl.includes(
          "firebasestorage.googleapis.com"
        );

        // Show loading toast
        const loadingToast = toast({
          title: "Downloading...",
          description: "Please wait while we prepare your download",
        });

        if (isFirebaseUrl) {
          // Use our proxy API instead of direct fetch
          const proxyUrl = `/api/download?url=${encodeURIComponent(fileUrl)}`;

          // Create an invisible iframe to trigger the download
          const iframe = document.createElement("iframe");
          iframe.style.display = "none";
          document.body.appendChild(iframe);

          iframe.onload = () => {
            // Remove the iframe and loading toast after download starts
            setTimeout(() => {
              document.body.removeChild(iframe);
              loadingToast.dismiss();
            }, 1000);
          };

          // Navigate the iframe to our proxy URL to start download
          iframe.src = proxyUrl;
        } else {
          // For non-Firebase URLs, ensure we have an absolute path
          let absoluteUrl = fileUrl;

          // Check if it's a relative path without leading slash
          if (!fileUrl.startsWith("http") && !fileUrl.startsWith("/")) {
            absoluteUrl = `/${fileUrl}`;
          }

          // Use window.location.origin to create absolute URL from relative paths
          if (absoluteUrl.startsWith("/")) {
            absoluteUrl = `${window.location.origin}${absoluteUrl}`;
          }

          // Open in new tab with the corrected absolute URL
          window.open(absoluteUrl, "_blank");
          loadingToast.dismiss();
        }
      } catch (error) {
        console.error("Download failed:", error);
        toast({
          title: "Download failed",
          description:
            "There was a problem downloading your file. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Use title or name, ensuring we always have a value for display
  const displayTitle = title || name || "Component";

  return (
    <Card className="flex flex-col h-full">
      <div className="flex gap-4 p-4">
        <div className="relative w-24 h-24 flex-shrink-0">
          <Image
            src={image || "/placeholder-image.jpg"}
            alt={displayTitle}
            fill
            className={`object-cover rounded-md ${
              isLocked ? "opacity-70" : ""
            }`}
            sizes="(max-width: 96px) 100vw, 96px"
          />
          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md">
              <Lock className="w-8 h-8 text-white/80" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-1">{displayTitle}</h3>
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
          {sourceName && (
            <Badge
              variant="outline"
              className={`text-xs ${isLocked ? "opacity-70" : ""}`}
            >
              {sourceName}
            </Badge>
          )}
        </div>
      </div>
      <div className="mt-auto p-4 pt-0">
        {isLocked && lockContent && (
          <div className="mb-3">
            <div className="flex items-center text-muted-foreground mb-2">
              <Lock className="w-4 h-4 mr-2" />
              <span className="text-sm">{lockContent.message}</span>
            </div>
            {lockContent.action}
          </div>
        )}
        {!isLocked && (
          <Button
            variant="default"
            size="sm"
            className="w-full"
            onClick={() => handleDownload(achievementKey)}
            disabled={!fileUrl}
          >
            <Download className="w-4 h-4 mr-2" />
            {ctaLabel || "Download Files"}
          </Button>
        )}
      </div>
    </Card>
  );
};

const ComponentSection = ({ title, components, icon }) => {
  if (!components || components.length === 0) return null;

  // Sort components to show unlocked first
  const sortedComponents = [...components].sort((a, b) => {
    if (a.isLocked === b.isLocked) return 0;
    return a.isLocked ? 1 : -1;
  });

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-2xl font-strike">{title}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {sortedComponents.map((component, index) => (
          <ComponentCard
            key={`${component.title || component.name}-${index}`}
            {...component}
          />
        ))}
      </div>
    </div>
  );
};

const ExpansionSection = ({ title, expansions, icon, type }) => {
  // Move hooks outside of conditional return
  const initialized = useRef(false);
  const [expandedItems, setExpandedItems] = useState({});

  // Sort expansions to show owned first
  const sortedExpansions = [...expansions].sort((a, b) => {
    if (a.isOwned === b.isOwned) return 0;
    return a.isOwned ? -1 : 1;
  });

  const toggleExpand = (itemId, e) => {
    // Stop event propagation to prevent issues with links
    if (e) e.stopPropagation();

    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Initialize all items as expanded by default - ONLY ONCE
  useEffect(() => {
    if (!initialized.current) {
      const initialState = {};
      sortedExpansions.forEach((item) => {
        initialState[item.id] = true; // Set all to expanded by default
      });
      setExpandedItems(initialState);
      initialized.current = true;
    }
  }, [sortedExpansions]);

  if (!expansions || expansions.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-6">
        {icon}
        <h2 className="text-2xl font-strike">{title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedExpansions.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg overflow-hidden shadow-sm h-fit"
          >
            {/* Card Header with Thumbnail */}
            <div className="relative w-full h-[140px]">
              <Image
                src={item.thumbnail || "/placeholder-image.jpg"}
                alt={item.name}
                fill
                className={`object-cover ${
                  !item.isOwned ? "grayscale opacity-80" : ""
                }`}
              />
              {!item.isOwned && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Lock className="w-10 h-10 text-white/90" />
                </div>
              )}
            </div>

            {/* Card Content */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold truncate flex-1">
                  {item.name}
                </h3>

                {item.components &&
                  item.components.length > 0 &&
                  item.isOwned && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 p-0 h-8 w-8"
                      onClick={(e) => toggleExpand(item.id, e)}
                    >
                      <ChevronDown
                        className={`w-5 h-5 transform transition-transform ${
                          expandedItems[item.id] ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  )}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <ProductTypeBadge type={type} />

                {item.isOwned ? (
                  <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    Owned
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-white/80">
                    Locked
                  </Badge>
                )}
              </div>
              {/* Action Button or Component Count */}
              <div className="mb-3">
                {!item.isOwned ? (
                  <Link
                    href={`/product-details/${item.slug}`}
                    className="w-full"
                    onClick={(e) => {
                      // Ensure the click event properly navigates
                      e.stopPropagation();
                    }}
                  >
                    <Button
                      variant={type === "expansion" ? "default" : "secondary"}
                      size="sm"
                      className="w-full"
                    >
                      {type === "expansion" ? (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {item.price
                            ? `$${item.price} Buy Expansion`
                            : "Buy Expansion"}
                        </>
                      ) : (
                        <>
                          <Gift className="w-4 h-4 mr-2" />
                          {item.price
                            ? `$${item.price} View Add-on`
                            : "View Add-on"}
                        </>
                      )}
                    </Button>
                  </Link>
                ) : item.components && item.components.length > 0 ? (
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    {item.components.length} Downloadable File
                    {item.components.length !== 1 ? "s" : ""}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No downloadable files
                  </div>
                )}
              </div>
            </div>

            {/* Components Section - Only shown when expanded */}
            {item.isOwned &&
              item.components &&
              item.components.length > 0 &&
              expandedItems[item.id] && (
                <div className="border-t pt-2 px-4 pb-4 bg-muted/30">
                  <div className="grid grid-cols-1 gap-4">
                    {item.components.map((component, index) => (
                      <ComponentCard
                        key={`${item.id}-component-${index}`}
                        {...component}
                      />
                    ))}
                  </div>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

const GameDetailsPage = observer(({ params }) => {
  const { slug } = params;
  const router = useRouter();
  const {
    user,
    products,
    getRelatedExpansions,
    fetchGameDetails,
    gameDetailsCache,
    gameDetailsLoading,
  } = MobxStore;

  const [error, setError] = useState(null);

  const game = products.find((p) => p.slug === slug);

  // Get data directly from MobX cache instead of local state
  const gameData = gameDetailsCache.get(slug);

  // Determine loading state from MobX
  const isLoading = gameDetailsLoading.has(slug) || (!gameData && game?.id);

  // Get add-ons data for the badge display
  const allAddons = products.filter(
    (product) => product.type === "add-on" && product.relatedGames === game?.id
  );
  const ownedAddons = allAddons.filter((addon) =>
    user?.unlockedRewards?.includes(addon.id)
  );

  useEffect(() => {
    // Only fetch if we have a game ID, don't have data already, and aren't already loading
    if (game?.id && !gameData && !gameDetailsLoading.has(slug)) {
      fetchGameDetails(slug).catch((err) => {
        setError(err.message);
      });
    }
  }, [game?.id, slug, gameData, fetchGameDetails, gameDetailsLoading]);

  if (!game) return <div>Game not found</div>;
  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  // Get expansion data for the badge display
  const allExpansions = getRelatedExpansions(game.id, { includeOwned: true });
  const ownedExpansions = allExpansions.filter((exp) => exp.isOwned);

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/account/my-games")}
          className="hover:bg-transparent font-strike"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to My Games
        </Button>
        <Breadcrumbs
          startFromAccount={true}
          items={[
            { label: "Account", href: "/account" },
            { label: "My Games", href: "/account/my-games" },
            { label: game.name, href: `/account/my-games/${slug}` },
          ]}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="relative w-56 h-56">
          <Image
            src={game.thumbnail || "/placeholder-image.jpg"}
            alt={game.name}
            fill
            className="object-cover rounded-lg shadow-md"
            sizes="(max-width: 224px) 100vw, 224px"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-strike mb-2">{game.name}</h1>
          <p className="text-lg text-muted-foreground mb-6">
            {game.description}
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <Badge
              variant="success"
              className="flex items-center gap-2 px-4 py-2 text-base bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20"
            >
              <CheckCircle className="w-5 h-5" />
              Owned
            </Badge>
            {allExpansions.length > 0 && (
              <Badge
                variant="secondary"
                className="flex items-center gap-2 px-4 py-2 text-base"
              >
                <Package className="w-5 h-5" />
                {ownedExpansions.length}/{allExpansions.length} Expansions
              </Badge>
            )}
            <Badge
              variant="outline"
              className="flex items-center gap-2 px-4 py-2 text-base bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border-purple-500/20"
            >
              <Gift className="w-5 h-5" />
              {ownedAddons.length}/{allAddons.length} Add-ons
            </Badge>
          </div>
        </div>
      </div>

      {/* Base Game Components */}
      <ComponentSection
        title="Main Game"
        components={gameData?.baseComponents}
        icon={<CheckCircle className="w-6 h-6 text-primary" />}
      />

      {/* Expansions Section with all expansions regardless of ownership */}
      <ExpansionSection
        title="Expansions"
        expansions={gameData?.expansions}
        icon={<Package className="w-6 h-6 text-blue-500" />}
        type="expansion"
      />

      {/* Add-ons Section with all add-ons regardless of ownership */}
      <ExpansionSection
        title="Add-ons"
        expansions={gameData?.addons}
        icon={<Gift className="w-6 h-6 text-purple-500" />}
        type="add-on"
      />

      {/* Variable Files Section - Keeping as requested */}
      {gameData?.variableFiles &&
        Object.values(gameData.variableFiles).some((file) => file !== null) && (
          <>
            <h2 className="text-2xl font-strike mb-4">Variable Files</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {gameData.variableFiles.luckyGenerator && (
                <ComponentCard
                  {...gameData.variableFiles.luckyGenerator}
                  items={gameData.variableFiles.luckyGenerator.features}
                  price={4.99}
                  requirements={{
                    type: "purchase",
                    value: "lucky-generator-mm",
                  }}
                />
              )}
              {gameData.variableFiles.makeYourOwn && (
                <ComponentCard
                  {...gameData.variableFiles.makeYourOwn}
                  items={gameData.variableFiles.makeYourOwn.features}
                />
              )}
            </div>
          </>
        )}
    </div>
  );
});

export default GameDetailsPage;
