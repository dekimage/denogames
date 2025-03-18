"use client";

import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import { useEffect, useState } from "react";
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

import Breadcrumbs from "@/components/Breadcrumbs";
import { LoadingSpinner } from "@/reusable-ui/LoadingSpinner";

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
              <Link href="/cart" className="w-full">
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

  const handleDownload = () => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
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
            onClick={handleDownload}
            disabled={!fileUrl}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Files
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
        <h2 className="text-2xl font-semibold">{title}</h2>
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
  if (!expansions || expansions.length === 0) return null;

  // Sort expansions to show owned first
  const sortedExpansions = [...expansions].sort((a, b) => {
    if (a.isOwned === b.isOwned) return 0;
    return a.isOwned ? -1 : 1;
  });

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-6">
        {icon}
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedExpansions.map((item) => (
          <div key={item.id} className="space-y-5">
            {/* Improved Card for Expansion/Add-on */}
            <div className="relative rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-all">
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

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
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

                {/* Product Type Badge */}
                <div className="absolute top-3 left-3">
                  <Badge
                    variant="outline"
                    className={`
                      capitalize ${
                        type === "expansion"
                          ? "bg-blue-500/10 text-blue-600 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400"
                          : "bg-purple-500/10 text-purple-600 border-purple-200 dark:bg-purple-500/20 dark:text-purple-400"
                      }
                    `}
                  >
                    {type}
                  </Badge>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-3 truncate">
                  {item.name}
                </h3>

                {/* Action Button */}
                <div className="mb-3">
                  {!item.isOwned ? (
                    <Link
                      href={`/product-details/${item.slug}`}
                      className="w-full"
                    >
                      <Button
                        variant={type === "expansion" ? "default" : "secondary"}
                        size="sm"
                        className="w-full"
                      >
                        {type === "expansion" ? (
                          <>
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Buy Expansion
                          </>
                        ) : (
                          <>
                            <Gift className="w-4 h-4 mr-2" />
                            View Add-on
                          </>
                        )}
                      </Button>
                    </Link>
                  ) : item.components && item.components.length > 0 ? (
                    <div className="text-sm text-muted-foreground">
                      {item.components.length} component
                      {item.components.length !== 1 ? "s" : ""} available
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No downloadable components
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Components Section - Using original component design */}
            {item.components && item.components.length > 0 && (
              <div className="grid grid-cols-1 gap-4 pl-4 border-l-2 border-muted ml-4">
                {item.components.map((component, index) => (
                  <ComponentCard
                    key={`${item.id}-component-${index}`}
                    {...component}
                  />
                ))}
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
  const { user, products, getRelatedExpansions } = MobxStore;
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const game = products.find((p) => p.slug === slug);

  // Get add-ons data for the badge display
  const allAddons = products.filter(
    (product) => product.type === "add-on" && product.relatedGames === game?.id
  );
  const ownedAddons = allAddons.filter((addon) =>
    user?.unlockedRewards?.includes(addon.id)
  );

  useEffect(() => {
    // Ensure products are loaded
    if (products.length === 0) {
      MobxStore.fetchProducts();
    }

    const fetchGameDetails = async () => {
      try {
        setLoading(true);
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error("No auth token available");

        const response = await fetch(`/api/game-details/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setGameData(data);
      } catch (error) {
        console.error("Error fetching game details:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (game?.id) {
      fetchGameDetails();
    }
  }, [game?.id, slug, products.length]);

  if (!game) return <div>Game not found</div>;
  if (loading) return <LoadingSpinner />;
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
          className="hover:bg-transparent"
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
          <h1 className="text-4xl font-bold mb-2">{game.name}</h1>
          <p className="text-lg text-muted-foreground mb-6">
            {game.description}
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <Badge
              variant="success"
              className="flex items-center gap-2 px-4 py-2 text-base"
            >
              <CheckCircle className="w-5 h-5" />
              Owned
            </Badge>
            <Badge
              variant="secondary"
              className="flex items-center gap-2 px-4 py-2 text-base"
            >
              <Package className="w-5 h-5" />
              {ownedExpansions.length}/{allExpansions.length} Expansions
            </Badge>
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
        type="addon"
      />

      {/* Variable Files Section - Keeping as requested */}
      {gameData?.variableFiles &&
        Object.values(gameData.variableFiles).some((file) => file !== null) && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Variable Files</h2>
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
