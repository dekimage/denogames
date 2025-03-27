"use client";

import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import { Card } from "@/components/ui/card";
import { CheckCircle, Package, ShoppingBag, Gift } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const GameCard = ({ game }) => {
  const { getRelatedExpansions, products, user } = MobxStore;

  // Get related expansions
  const allExpansions = getRelatedExpansions(game.id, { includeOwned: true });
  const ownedExpansions = allExpansions.filter((exp) => exp.isOwned);

  // Get related add-ons
  const allAddons = products.filter(
    (product) => product.type === "add-on" && product.relatedGames === game.id
  );

  const ownedAddons = allAddons.filter((addon) =>
    user?.unlockedRewards?.includes(addon.id)
  );

  const acquisitionMethod = game.acquisitionMethod || "Shop"; // Default to Shop

  return (
    <Link href={`/account/my-games/${game.slug}`}>
      <Card className="flex gap-4 p-4 hover:shadow-lg transition-all">
        <div className="relative w-32 h-32 flex-shrink-0">
          <Image
            src={game.thumbnail}
            alt={game.name}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 128px) 100vw, 128px"
          />
        </div>
        <div className="flex flex-col flex-grow gap-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">{game.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Owned</span>
                <span>•</span>
                <span>Acquired via {acquisitionMethod}</span>
              </div>
            </div>
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Package className="w-4 h-4" />
              {ownedExpansions.length}/{allExpansions.length} Expansions
            </Badge>

            <Badge
              variant="outline"
              className="flex items-center gap-1 bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border-purple-500/20"
            >
              <Gift className="w-4 h-4" />
              {ownedAddons.length}/{allAddons.length} Add-ons
            </Badge>
          </div>
        </div>
      </Card>
    </Link>
  );
};

const MyGamesPage = observer(() => {
  const { user, products } = MobxStore;

  // Filter only owned base games (no expansions)
  const ownedGames = products.filter(
    (product) =>
      product.type === "game" && user?.purchasedProducts?.includes(product.id)
  );

  if (ownedGames.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-3xl font-bold mb-4">
          You don&apos;t have any games yet
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Start your collection by exploring our game shop!
        </p>
        <Link href="/">
          <Button size="lg" className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Visit Shop
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 font-strike">My Games</h1>
      <div className="flex flex-col gap-4 mb-20">
        {ownedGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
      <div className="bg-background rounded-lg shadow-md p-8 relative border">
        <div className="absolute left-1/2 -translate-x-1/2 -top-[60px]">
          <div className="relative w-[120px] h-[120px]">
            <Image
              src="/muhari/shopkeeper.png"
              alt="Shopkeeper"
              fill
              className="object-contain bg-background rounded-full p-2 border"
            />
          </div>
        </div>
        <div className="flex flex-col items-center pt-8">
          <h2 className="text-2xl font-semibold mb-4">
            Check out more games in our shop
          </h2>
          <p className="text-muted-foreground text-lg mb-6 text-center max-w-lg">
            Discover new adventures and expand your collection!
          </p>
          <Link href="/">
            <Button size="lg" className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Browse More Games
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
});

export default MyGamesPage;
