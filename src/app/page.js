"use client";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import placeholderImg from "@/assets/placeholder.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";
import {
  CheckCheck,
  CheckCircle,
  ChevronRight,
  Dice6,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Mimage } from "@/components/Mimage";
import { ModeToggle } from "@/components/ui/themeButton";
import FeaturedGamesSlider from "@/components/FeaturedGameSlider";

const AddMultipleProductsButton = () => {
  const handleAddProducts = () => {
    const products = [
      {
        id: "game1",
        name: "Mystic Quest",
        slug: "mystic-quest",
        price: 19.99,
        type: "game",
        thumbnail: "/images/mystic-quest-thumbnail.jpg",
        mechanics: ["deck-builder", "adventure"],
        gameId: "game1Details",
      },
      {
        id: "game2",
        name: "Dragon's Lair",
        slug: "dragons-lair",
        price: 24.99,
        type: "game",
        thumbnail: "/images/dragons-lair-thumbnail.jpg",
        mechanics: ["dungeon-crawler", "strategy"],
        gameId: "game2Details",
      },
      {
        id: "game3",
        name: "Galactic Conquest",
        slug: "galactic-conquest",
        price: 29.99,
        type: "game",
        thumbnail: "/images/galactic-conquest-thumbnail.jpg",
        mechanics: ["4X", "space", "strategy"],
        gameId: "game3Details",
      },
      {
        id: "game4",
        name: "Island Explorers",
        slug: "island-explorers",
        price: 17.99,
        type: "game",
        thumbnail: "/images/island-explorers-thumbnail.jpg",
        mechanics: ["exploration", "resource-management"],
        gameId: "game4Details",
      },
      {
        id: "expansion1",
        name: "Mystic Quest: Dark Forest Expansion",
        slug: "mystic-quest-dark-forest",
        price: 9.99,
        type: "expansion",
        thumbnail: "/images/mystic-quest-dark-forest-thumbnail.jpg",
        mechanics: ["deck-builder", "expansion"],
        gameId: "expansion1Details",
        relatedGames: ["game1"],
      },
      {
        id: "expansion2",
        name: "Dragon's Lair: The Hidden Cave",
        slug: "dragons-lair-hidden-cave",
        price: 12.99,
        type: "expansion",
        thumbnail: "/images/dragons-lair-hidden-cave-thumbnail.jpg",
        mechanics: ["dungeon-crawler", "expansion"],
        gameId: "expansion2Details",
        relatedGames: ["game2"],
      },
      {
        id: "expansion3",
        name: "Galactic Conquest: The Outer Rim",
        slug: "galactic-conquest-outer-rim",
        price: 14.99,
        type: "expansion",
        thumbnail: "/images/galactic-conquest-outer-rim-thumbnail.jpg",
        mechanics: ["4X", "expansion", "space"],
        gameId: "expansion3Details",
        relatedGames: ["game3"],
      },
      {
        id: "bundle1",
        name: "Mystic Adventure Bundle",
        slug: "mystic-adventure-bundle",
        price: 24.99,
        type: "bundle",
        thumbnail: "/images/mystic-adventure-bundle-thumbnail.jpg",
        mechanics: ["bundle"],
        relatedProducts: ["game1", "expansion1"],
      },
      {
        id: "bundle2",
        name: "Galactic Domination Bundle",
        slug: "galactic-domination-bundle",
        price: 39.99,
        type: "bundle",
        thumbnail: "/images/galactic-domination-bundle-thumbnail.jpg",
        mechanics: ["bundle"],
        relatedProducts: ["game3", "expansion3"],
      },
    ];
    const games = [
      {
        id: "game1Details",
        playersCount: 2,
        age: 12,
        componentsList: ["cards", "tokens", "dice"],
        neededComponents: ["notepad", "pencil"],
        images: ["/images/mystic-quest-1.jpg", "/images/mystic-quest-2.jpg"],
        thumbnail: "/images/mystic-quest-thumbnail.jpg",
        kickstarterLink: "https://www.kickstarter.com/mystic-quest",
        howToVideos: [
          "https://www.youtube.com/watch?v=mystic-quest-howto1",
          "https://www.youtube.com/watch?v=mystic-quest-howto2",
        ],
        dataset: "mystic-quest-dataset",
      },
      {
        id: "game2Details",
        playersCount: 3,
        age: 14,
        componentsList: ["board", "miniatures", "cards"],
        neededComponents: ["table", "light source"],
        images: ["/images/dragons-lair-1.jpg", "/images/dragons-lair-2.jpg"],
        thumbnail: "/images/dragons-lair-thumbnail.jpg",
        kickstarterLink: "https://www.kickstarter.com/dragons-lair",
        howToVideos: ["https://www.youtube.com/watch?v=dragons-lair-howto1"],
        dataset: "dragons-lair-dataset",
      },
      {
        id: "game3Details",
        playersCount: 4,
        age: 16,
        componentsList: ["cards", "board", "tokens"],
        neededComponents: ["space for game board"],
        images: [
          "/images/galactic-conquest-1.jpg",
          "/images/galactic-conquest-2.jpg",
        ],
        thumbnail: "/images/galactic-conquest-thumbnail.jpg",
        kickstarterLink: "https://www.kickstarter.com/galactic-conquest",
        howToVideos: [
          "https://www.youtube.com/watch?v=galactic-conquest-howto1",
        ],
        dataset: "galactic-conquest-dataset",
      },
      {
        id: "game4Details",
        playersCount: 2,
        age: 10,
        componentsList: ["map", "cards", "tokens"],
        neededComponents: ["compass", "notebook"],
        images: [
          "/images/island-explorers-1.jpg",
          "/images/island-explorers-2.jpg",
        ],
        thumbnail: "/images/island-explorers-thumbnail.jpg",
        kickstarterLink: "https://www.kickstarter.com/island-explorers",
        howToVideos: [
          "https://www.youtube.com/watch?v=island-explorers-howto1",
        ],
        dataset: "island-explorers-dataset",
      },
      {
        id: "expansion1Details",
        playersCount: 2,
        age: 12,
        componentsList: ["cards", "new tokens"],
        neededComponents: ["base game", "dice"],
        images: [
          "/images/mystic-quest-dark-forest-1.jpg",
          "/images/mystic-quest-dark-forest-2.jpg",
        ],
        thumbnail: "/images/mystic-quest-dark-forest-thumbnail.jpg",
        kickstarterLink: "https://www.kickstarter.com/mystic-quest-dark-forest",
        howToVideos: [
          "https://www.youtube.com/watch?v=mystic-quest-dark-forest-howto1",
        ],
        dataset: "mystic-quest-dark-forest-dataset",
      },
      {
        id: "expansion2Details",
        playersCount: 3,
        age: 14,
        componentsList: ["new miniatures", "cards"],
        neededComponents: ["base game", "light source"],
        images: [
          "/images/dragons-lair-hidden-cave-1.jpg",
          "/images/dragons-lair-hidden-cave-2.jpg",
        ],
        thumbnail: "/images/dragons-lair-hidden-cave-thumbnail.jpg",
        kickstarterLink: "https://www.kickstarter.com/dragons-lair-hidden-cave",
        howToVideos: [
          "https://www.youtube.com/watch?v=dragons-lair-hidden-cave-howto1",
        ],
        dataset: "dragons-lair-hidden-cave-dataset",
      },
      {
        id: "expansion3Details",
        playersCount: 4,
        age: 16,
        componentsList: ["additional cards", "tokens"],
        neededComponents: ["base game", "space for expansion board"],
        images: [
          "/images/galactic-conquest-outer-rim-1.jpg",
          "/images/galactic-conquest-outer-rim-2.jpg",
        ],
        thumbnail: "/images/galactic-conquest-outer-rim-thumbnail.jpg",
        kickstarterLink:
          "https://www.kickstarter.com/galactic-conquest-outer-rim",
        howToVideos: [
          "https://www.youtube.com/watch?v=galactic-conquest-outer-rim-howto1",
        ],
        dataset: "galactic-conquest-outer-rim-dataset",
      },
    ];

    const collectionName = "games"; // Change the collection name as needed

    // Call the utility function to add the products to Firestore
    MobxStore.addProductsToFirestore(games, collectionName);
  };

  return (
    <button
      onClick={handleAddProducts}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Add Multiple Products to Firestore
    </button>
  );
};

const ProductSection = ({ title, products }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-strike uppercase">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export const ProductCard = observer(({ product, isSmall = false }) => {
  const { addToCart, cart, user } = MobxStore;

  const isInCart = cart.includes(product.id);
  const isPurchased = user
    ? user.purchasedProducts?.includes(product.id)
    : false;

  const getFlagColor = (type) => {
    switch (type) {
      case "expansion":
        return "bg-blue-400";
      case "bundle":
        return "bg-orange-400";
      default:
        return "bg-green-400";
    }
  };

  return (
    <div className={`box ${isSmall ? "space-y-2 w-[220px]" : "space-y-4"}`}>
      <div className="box-inner">
        <div className="box-broken relative">
          <div
            className={`absolute flag ${getFlagColor(product.type)} ${
              isSmall
                ? "p-1 top-[14px] w-[100px] text-[12px]"
                : "p-4 w-[135px] top-[18px] text-[14px]"
            } flex pl-6 left-[0px] text-white uppercase`}
          >
            {product.type}
          </div>
          <div>
            <Link
              href={`/product-details/${product.slug}`}
              className={`flex justify-center items-center flex-col ${
                isSmall ? "p-4" : "p-8"
              }`}
            >
              <Image
                src={product.thumbnail || placeholderImg}
                alt={product.name}
                width={isSmall ? 300 : 300}
                height={isSmall ? 300 : 300}
                className={isSmall ? "w-28 h-28" : "w-54 h-54"}
              />
              <div
                className={`flex flex-col w-full ${isSmall ? "pt-2" : "pt-4"}`}
              >
                <div className="w-full">
                  <div
                    className={`${isSmall ? "mt-2 text-lg" : "mt-4 text-xl"}`}
                  >
                    {product.name}
                  </div>
                  <div className="text-xs">{product.description}</div>
                  <p className={`${isSmall ? "mt-2 text-sm" : "mt-4 text-xl"}`}>
                    ${product.price}.00
                  </p>
                </div>
              </div>
            </Link>
            <div className={isSmall ? "p-4 pt-0" : "p-8 pt-0"}>
              {isPurchased ? (
                <Link
                  href={`/product-details/${product.slug}`}
                  className="w-full"
                >
                  <Button className="bg-blacky text-white hover:bg-green-500 w-1/2">
                    PLAY
                  </Button>
                </Link>
              ) : isInCart ? (
                <div className="flex items-center">
                  <Link href="/cart" className="">
                    <Button className="w-full bg-orange-400">
                      <ShoppingBag size={16} className="mr-1" /> CHECKOUT
                    </Button>
                  </Link>
                  {isInCart && (
                    <div
                      className={`flex justify-center items-center w-[120px] ${
                        isSmall ? "ml-2" : "ml-4"
                      }`}
                    >
                      <CheckCheck className="text-orange-400 mr-2" size={20} />
                      <span className="text-orange-400">IN CART</span>
                    </div>
                  )}
                </div>
              ) : (
                <Button onClick={() => addToCart(product)} className="">
                  <ShoppingCart size={16} className="mr-1" /> ADD TO CART
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const ProductList = ({ label, products }) => {
  return (
    <div className="my-4 mb-12">
      <div className="flex justify-between items-center mb-8">
        <div className="text-2xl font-strike uppercase">{label}</div>
        <Link href="/shop">
          <div className="font-strike text-light flex items-center">
            SHOP MORE <ChevronRight />
          </div>
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products?.map((game) => (
          <ProductCard key={game.id} product={game} />
        ))}
      </div>
    </div>
  );
};

const HomePage = observer(() => {
  const { products, loading, cart, user } = MobxStore;

  // return <AddMultipleProductsButton />;

  if (loading) {
    return <div>Loading...</div>;
  }

  const games = products.filter((product) => product.type === "game");
  const expansions = products.filter((product) => product.type === "expansion");
  const bundles = products.filter((product) => product.type === "bundle");

  // Products already in cart
  const productsInCart = products.filter((product) =>
    cart.includes(product.id)
  );

  // Products that are already purchased
  const purchasedProducts = products.filter((product) =>
    user ? user.purchasedProducts?.includes(product.id) : false
  );

  // Products that are neither in cart nor purchased (ready to add to cart)
  const readyToAddToCart = products.filter(
    (product) =>
      !cart.includes(product.id) &&
      !(user ? user.purchasedProducts?.includes(product.id) : false)
  );

  // const newGames = products.filter(
  //   (product) =>
  //     product.type === "game" &&
  //     new Date(product.dateReleased) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  // );

  // const comingSoon = products.filter(
  //   (product) => new Date(product.dateReleased) > new Date()
  // );

  // const bestSellers = products.filter(
  //   (product) => product.isBestSeller // Assuming you have a flag or criteria for best sellers
  // );

  const gamesArray = [
    {
      title: "Game One",
      description: "This is the first game.",
      imgUrl:
        "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fgame1%2Fimage2.png?alt=media",
      button: "Play Now",
      link: "/game-one",
      index: 1,
    },
    {
      title: "Game Two",
      description: "This is the second game.",
      imgUrl:
        "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fgame1%2Fimage2.png?alt=media",
      button: "Play Now",
      link: "/game-one",
      index: 2,
    },
    // Add more game objects...
  ];

  return (
    <div>
      <ModeToggle />
      {/* <Mimage muhar="shopkeeper" /> */}
      <FeaturedGamesSlider games={gamesArray} />

      <div className="container mx-auto py-8">
        {!user && <ProductList label={"All Games"} products={products} />}

        {cart.length > 0 && (
          <ProductList label={"In Cart"} products={productsInCart} />
        )}

        {user && (
          <>
            <ProductList
              label={"Available Games"}
              products={readyToAddToCart}
            />
            <ProductList
              label={"Purchased Games"}
              products={purchasedProducts}
            />
          </>
        )}

        <div
        // className="box-border flex flex-wrap -mx-3 text-[#272727] font-sans text-sm font-normal leading-[19.6px] text-left bg-white"
        >
          {/* 
      <ProductSection title="New Games" products={newGames} />

      <ProductSection title="Coming Soon" products={comingSoon} />

      <ProductSection title="Best Sellers" products={bestSellers} /> */}

          <ProductSection title="Games" products={games} />

          <ProductSection title="Expansions" products={expansions} />

          <ProductSection title="Bundles" products={bundles} />
        </div>
      </div>
    </div>
  );
});

export default HomePage;
