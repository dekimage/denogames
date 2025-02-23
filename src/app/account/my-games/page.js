"use client";

import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import { Card } from "@/components/ui/card";
import { CheckCircle, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const GameCard = ({ game }) => {
    const { getRelatedExpansions } = MobxStore;
    const allExpansions = getRelatedExpansions(game.id, { includeOwned: true });
    const ownedExpansions = allExpansions.filter(exp => exp.isOwned);

    // Determine acquisition method (you'll need to add this data to your user's purchasedProducts)
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

                    <div className="mt-auto flex items-center gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            {ownedExpansions.length}/{allExpansions.length} Expansions
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
        product =>
            product.type === "game" &&
            user.purchasedProducts?.includes(product.id)
    );

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">My Games</h1>
            <div className="flex flex-col gap-4">
                {ownedGames.map(game => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>
        </div>
    );
});

export default MyGamesPage; 