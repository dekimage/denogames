"use client";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import placeholderImg from "@/assets/placeholder.png";
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
                    ${product.price}
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

  return (
    <div className="flex w-full h-full justify-center items-center">
      <div className="text-2xl font-strike uppercase">Under Construction</div>
    </div>
  );

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
  // return <div>Under Construction</div>;
  return (
    <div>
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
