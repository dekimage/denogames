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
    CheckCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Breadcrumbs from "@/components/Breadcrumbs";

const GameCard = ({
    title,
    image,
    description,
    items,
    isLocked,
    lockReason,
    requirements,
    onAction,
    actionType = "download",
    price,
    productSlug
}) => {
    const { addToCart, cart } = MobxStore;
    const isInCart = requirements?.type === "purchase" && cart.includes(requirements.value);

    const getLockContent = () => {
        if (!isLocked) return null;

        switch (requirements?.type) {
            case "level":
                return {
                    message: `Requires Level ${requirements.value}`,
                    action: (
                        <Link href="/account/rewards" className="w-full">
                            <Button variant="secondary" size="sm" className="w-full">
                                View Rewards & Levels
                            </Button>
                        </Link>
                    )
                };
            case "achievement":
                return {
                    message: `Requires Achievement: ${requirements.value}`,
                    action: (
                        <Link href="/account/achievements" className="w-full">
                            <Button variant="secondary" size="sm" className="w-full">
                                View Achievements
                            </Button>
                        </Link>
                    )
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
                        )
                    };
                }
                return {
                    message: `Requires ${productSlug ? 'expansion' : 'purchase'}`,
                    action: productSlug ? (
                        <Link href={`/product-details/${productSlug}`} className="w-full">
                            <Button variant="secondary" size="sm" className="w-full">
                                View Expansion
                            </Button>
                        </Link>
                    ) : (
                        <Button
                            variant="secondary"
                            size="sm"
                            className="w-full"
                            onClick={() => addToCart(requirements.value)}
                        >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart - ${price}
                        </Button>
                    )
                };
            default:
                return {
                    message: lockReason,
                    action: null
                };
        }
    };

    const lockContent = getLockContent();

    return (
        <Card className="flex flex-col h-full">
            <div className="flex gap-4 p-4">
                <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover rounded-md"
                        sizes="(max-width: 96px) 100vw, 96px"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1">{title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{description}</p>
                    {items && items.length > 0 && (
                        <ul className="text-xs space-y-1">
                            {items.map((item, i) => (
                                <li key={i} className="flex items-center">
                                    <div className="w-1 h-1 bg-primary rounded-full mr-2" />
                                    {item}
                                </li>
                            ))}
                        </ul>
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
                        onClick={onAction}
                    >
                        {actionType === "download" ? (
                            <>
                                <Download className="w-4 h-4 mr-2" />
                                Download Files
                            </>
                        ) : (
                            <>
                                <Cog className="w-4 h-4 mr-2" />
                                Use Generator
                            </>
                        )}
                    </Button>
                )}
            </div>
        </Card>
    );
};

const GameDetailsPage = observer(({ params }) => {
    const { slug } = params;
    const router = useRouter();
    const { user, products, getRelatedExpansions } = MobxStore;
    const [gameFiles, setGameFiles] = useState(null);
    const [variableFiles, setVariableFiles] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const game = products.find(p => p.slug === slug);
    const allExpansions = getRelatedExpansions(game?.id, { includeOwned: true });
    const ownedExpansions = allExpansions.filter(exp => exp.isOwned);

    // Calculate special assets
    const specialFiles = gameFiles?.filter(file => file.type === "special") || [];
    const totalSpecials = specialFiles.length;
    const ownedSpecials = specialFiles.filter(file => !file.isLocked).length;

    useEffect(() => {
        const fetchGameFiles = async () => {
            try {
                const token = await auth.currentUser?.getIdToken();
                if (!token) throw new Error("No auth token available");

                const response = await fetch(`/api/game-files/${slug}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                setGameFiles(data.files);
                setVariableFiles(data.variableFiles);
            } catch (error) {
                console.error("Error fetching game files:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (game?.id) fetchGameFiles();
    }, [game?.id, slug]);

    if (!game) return <div>Game not found</div>;
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container py-8">
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="ghost"
                    onClick={() => router.push('/account/my-games')}
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

            <div className="flex gap-8 mb-8">
                <div className="relative w-56 h-56">
                    <Image
                        src={game.thumbnail}
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
                    <div className="flex gap-6 items-center">
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
                            variant="secondary"
                            className="flex items-center gap-2 px-4 py-2 text-base"
                        >
                            <Star className="w-5 h-5" />
                            {ownedSpecials}/{totalSpecials} Special Assets
                        </Badge>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Files</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
                {gameFiles?.map((file) => (
                    <GameCard
                        key={file.id}
                        {...file}
                        onAction={() => {
                            if (file.files) {
                                window.open(file.files[0].url, '_blank');
                            }
                        }}
                        actionType="download"
                    />
                ))}
            </div>

            {variableFiles && (Object.values(variableFiles).some(file => file !== null)) && (
                <>
                    <h2 className="text-2xl font-semibold mb-4">Variable Files</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {variableFiles.luckyGenerator && (
                            <GameCard
                                {...variableFiles.luckyGenerator}
                                items={variableFiles.luckyGenerator.features}
                                onAction={() => console.log("Opening Lucky Generator...")}
                                actionType="generator"
                                price={4.99}
                                requirements={{
                                    type: "purchase",
                                    value: "lucky-generator-mm"
                                }}
                            />
                        )}
                        {variableFiles.makeYourOwn && (
                            <GameCard
                                {...variableFiles.makeYourOwn}
                                items={variableFiles.makeYourOwn.features}
                                onAction={() => console.log("Opening Make Your Own...")}
                                actionType="generator"
                            />
                        )}
                    </div>
                </>
            )}
        </div>
    );
});

export default GameDetailsPage; 