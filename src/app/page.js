"use client";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

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
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

const ProductCard = observer(({ product }) => {
  const { addToCart, cart } = MobxStore;

  // Check if the product is already in the cart
  const isInCart = cart.includes(product.id);

  return (
    <Link href={`/product-details/${product.slug}`}>
      <Card className="p-4">
        <img
          src={product.imageUrls?.[0]}
          alt={product.name}
          className="w-full h-64 object-cover rounded"
        />
        <h2 className="text-xl font-bold mt-4">{product.name}</h2>
        <p className="text-gray-600 mt-2">{product.description}</p>
        <p className="text-lg font-bold mt-2">${product.price}</p>

        {isInCart ? (
          <div className="flex items-center mt-4">
            <CheckCircle className="text-green-500 mr-2" size={20} />
            <span className="text-green-500 font-bold">In Cart</span>
            <Link href="/cart">
              <button className="bg-blue-500 text-white px-4 py-2 rounded ml-4">
                Checkout
              </button>
            </Link>
          </div>
        ) : (
          <button
            onClick={() => addToCart(product)}
            className="bg-green-500 text-white px-4 py-2 rounded mt-4"
          >
            Add to Cart
          </button>
        )}
      </Card>
    </Link>
  );
});

const HomePage = observer(() => {
  const { availableProducts, products, loading } = MobxStore;

  // return <AddMultipleProductsButton />;

  if (loading) {
    return <div>Loading...</div>;
  }

  const games = products.filter((product) => product.type === "game");
  const expansions = products.filter((product) => product.type === "expansion");
  const bundles = products.filter((product) => product.type === "bundle");

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

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products?.map((game) => (
          <ProductCard key={game.id} product={game} />
        ))}
      </div>
      {/* 
      <ProductSection title="New Games" products={newGames} />

      <ProductSection title="Coming Soon" products={comingSoon} />

      <ProductSection title="Best Sellers" products={bestSellers} /> */}

      <ProductSection title="Games" products={games} />

      <ProductSection title="Expansions" products={expansions} />

      <ProductSection title="Bundles" products={bundles} />
    </div>
  );
});

export default HomePage;
