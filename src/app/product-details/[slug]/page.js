"use client";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";

import React, { useEffect, useState, useCallback } from "react";
import { ReviewSection } from "@/components/Reviews";
import ImageCarousel from "@/components/ImageCarousel";
import { Button } from "@/components/ui/button";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Hourglass,
  Download,
  BadgeCheck,
  Plus,
  Minus,
  Baby,
  CheckCircle,
  ExternalLink,
  User,
  DollarSign,
  Calendar,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

import { ProductCard } from "@/app/home/page";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { gamesStaticData, placeholderBenefitsImg } from "../productsData";

import { Badge } from "@/components/ui/badge";
import kickstarterLogo from "@/assets/ks-logo.png";
import { LoadingSpinner } from "@/reusable-ui/LoadingSpinner";
import { useParams, useRouter } from "next/navigation";

const MechanicsBasicSection = ({ mechanics }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {mechanics.map((mechanic, i) => (
        <Badge key={i} variant="outline" className="text-sm">
          {mechanic}
        </Badge>
      ))}
    </div>
  );
};

const BasicFeatures = ({ productDetails }) => {
  return (
    <div className="flex items-center justify-between text-lg py-6 font-strike uppercase">
      <div className="flex gap-2 items-center text-gray-700">
        <Users className="w-8 h-8" />
        <span className="text-[24px]">
          {productDetails?.stats?.minPlayers}-
          {productDetails?.stats?.maxPlayers}
        </span>
      </div>
      {/* <span className="mx-4 text-gray-300">|</span> */}
      <div className="flex gap-1 items-center text-gray-700">
        <Hourglass className="w-8 h-8" />
        <span className="text-[24px]">
          {productDetails?.stats?.minDuration}` -{" "}
          {productDetails?.stats?.maxDuration}`
        </span>
      </div>
      {/* <span className="mx-4 text-gray-300">|</span> */}
      <div className="flex gap-2 items-center text-gray-700">
        <Baby className="w-8 h-8" />
        <span className="text-[24px]">
          {productDetails?.stats?.age || "12"}+
        </span>
      </div>
    </div>
  );
};

const HowToPlaySimple = ({ productDetails }) => {
  return (
    <div className="my-8 w-full px-2 sm:px-8 flex flex-col" id="ratings">
      <div className="text-2xl font-strike uppercase my-4">How to Play</div>

      <div>
        <iframe
          width="560"
          height="315"
          src={productDetails.howToPlayVideo}
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>

      <Link
        href={productDetails?.rulebookLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 w-fit"
      >
        <Button className="mt-4 bg-foreground h-[48px]  text-background hover:bg-background hover:text-foreground border border-black">
          Download Rulebook
          <Download className="ml-2" />
        </Button>
      </Link>
    </div>
  );
};

const Speedometer = ({ value, max = 5 }) => {
  const angle = ((max - value) / (max - 1)) * 180;
  return (
    <svg width="60" height="40" viewBox="0 0 60 30">
      {/* Background arc */}
      <path
        d="M5 25 A25 25 0 0 1 55 25"
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="5"
      />
      {/* Tick marks */}
      {[1, 2, 3, 4, 5].map((tick) => {
        const tickAngle = ((tick - 1) / 4) * Math.PI;
        const x = 30 + 25 * Math.cos(tickAngle);
        const y = 25 - 25 * Math.sin(tickAngle);
        return (
          <circle
            key={tick}
            cx={x}
            cy={y}
            r="2"
            fill={tick % 2 === 1 ? "#4b5563" : "#9ca3af"}
          />
        );
      })}
      {/* Pointer */}
      <line
        x1="30"
        y1="25"
        x2={30 + 25 * Math.cos((angle * Math.PI) / 180)}
        y2={25 - 25 * Math.sin((angle * Math.PI) / 180)}
        stroke="#4b5563"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

const GameMetrics = ({ productDetails }) => {
  return (
    <div className="flex items-center justify-around gap-8 py-2">
      <div className="flex flex-col items-center">
        <Speedometer value={productDetails.luck || 2} />
        <span className="mt-2 text-sm">Luck</span>
        <span className="mt-1 font-bold">{productDetails.luck || 2}/5</span>
      </div>
      <div className="flex flex-col items-center">
        <Speedometer value={productDetails.complexity || 3} />
        <span className="mt-2 text-sm">Complexity</span>
        <span className="mt-1 font-bold">
          {productDetails.complexity || 3}/5
        </span>
      </div>
      <div className="flex flex-col items-center">
        <Speedometer value={productDetails.interaction || 4} />
        <span className="mt-2 text-sm">Interaction</span>
        <span className="mt-1 font-bold">
          {productDetails.interaction || 4}/5
        </span>
      </div>
    </div>
  );
};

const ComponentsList = ({ productDetails }) => {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleItem = (type, index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [index]: !prev[type]?.[index],
      },
    }));
  };

  const renderComponentTable = (components, type) => (
    <Table>
      <TableBody>
        {components.map((item, index) => (
          <React.Fragment key={index}>
            <TableRow
              className="cursor-pointer hover:bg-gray-200 transition-colors duration-200"
              onClick={() => toggleItem(type, index)}
            >
              <TableCell className="font-medium flex justify-between items-center">
                {item.name}
                <div
                  className={`transition-transform duration-300 ${
                    expandedItems[type]?.[index] ? "rotate-45" : ""
                  }`}
                >
                  {expandedItems[type]?.[index] ? (
                    <Minus size={20} />
                  ) : (
                    <Plus size={20} />
                  )}
                </div>
              </TableCell>
            </TableRow>
            {expandedItems[type]?.[index] && (
              <TableRow>
                <TableCell colSpan={2} className="p-0">
                  <div className="h-48 relative overflow-hidden">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="box-inner mt-16">
      <div className="box-broken w-full  py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4 font-strike uppercase">
                Needed Components
              </h3>
              {renderComponentTable(
                gamesStaticData[productDetails.slug]?.neededComponents ||
                  neededComponents,
                "needed"
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4 font-strike uppercase">
                Provided Components
              </h3>
              {renderComponentTable(
                gamesStaticData[productDetails.slug]?.providedComponents ||
                  providedComponents,
                "provided"
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RelatedGames = observer(({ gameId }) => {
  const { getRelatedGames, addToCart } = MobxStore;
  const relatedGames = getRelatedGames?.(gameId) ?? [];

  if (relatedGames.length === 0) {
    return null; // Don't render anything if there are no related games
  }

  return (
    <div className="my-8">
      <h2 className="text-3xl font-bold text-center mb-4 font-strike uppercase">
        Other Games
      </h2>
      <div className="flex flex-wrap justify-center gap-4">
        {relatedGames.map((game) => (
          <ProductCard key={game.id} product={game} isSmall={true} />
        ))}
      </div>
    </div>
  );
});

const KickstarterSection = ({ productDetails }) => {
  if (!productDetails.kickstarterLink) return null;

  const isActive = productDetails.kickstarterActive === true;

  return (
    <section className="mb-12">
      <div className="flex items-center mb-6">
        <div className="ml-4 flex-grow h-px bg-border"></div>
      </div>

      {isActive ? (
        // Active campaign section
        <div className="border rounded-lg shadow-sm overflow-hidden bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 flex flex-col justify-center">
              <h3 className="text-xl font-bold mb-2">
                Support Us on Kickstarter
              </h3>
              <p className="text-muted-foreground mb-4">
                Our Kickstarter campaign is live! Back this project to get
                exclusive rewards, early access, and help bring this game to
                life. Join our community of backers and be part of the journey.
              </p>
              <div className="flex flex-col space-y-3 mb-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    <CheckCircle
                      size={14}
                      className="text-green-600 dark:text-green-400"
                    />
                  </div>
                  <span>Early bird discounts and exclusive rewards</span>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    <CheckCircle
                      size={14}
                      className="text-green-600 dark:text-green-400"
                    />
                  </div>
                  <span>Be the first to receive the game</span>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    <CheckCircle
                      size={14}
                      className="text-green-600 dark:text-green-400"
                    />
                  </div>
                  <span>Help unlock stretch goals for additional content</span>
                </div>
              </div>
              <Button
                asChild
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
              >
                <a
                  href={productDetails.kickstarterLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M5.7 11.5L7.8 9.1 10.9 11.5 9.1 5.7 12 3.5 14.9 5.7 13.1 11.5 16.2 9.1 18.3 11.5 16.2 13.9 18.3 16.3 16.2 18.9 13.1 16.3 14.9 22.3 12 20.1 9.1 22.3 10.9 16.3 7.8 18.9 5.7 16.3 7.8 13.9z" />
                  </svg>
                  Visit Kickstarter Campaign
                </a>
              </Button>
            </div>

            <div className="relative h-[250px] md:h-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-green-100/50 dark:to-green-900/20 z-10"></div>
              <Image
                src={productDetails.kickstarter?.thumbnail}
                alt="Kickstarter Campaign"
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold z-20">
                Live Now!
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Ended campaign section (successfully funded)
        <div className="border rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 flex flex-col justify-center">
              <div className="flex items-center mb-2">
                <h3 className="text-2xl font-bold font-strike uppercase">
                  Kickstarter
                </h3>
              </div>

              <div className="bg-white dark:bg-black/20 rounded-lg p-4 mb-4">
                <div className="flex justify-start items-center gap-1 mb-2">
                  <User className="w-4 h-4" />
                  <span className="font-bold">
                    {productDetails.kickstarter?.backers || "500+"}
                  </span>
                </div>
                <div className="flex justify-start items-center gap-1 mb-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-bold">
                    {productDetails.kickstarter?.funded || "$25,000"}
                  </span>
                </div>
                <div className="flex justify-start items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span className="font-bold">
                    {productDetails.kickstarter?.date || "March 2024"}
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground mb-4">
                Thanks to our amazing backers, this game was successfully funded
                on Kickstarter! The campaign has ended, but you can still check
                out the original project page to see how it all began.
              </p>

              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto border-green-200 dark:border-green-800 hover:bg-green-400"
              >
                <a
                  href={productDetails.kickstarterLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  View Kickstarter Campaign{" "}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>

            <div className="relative h-[250px] md:h-auto">
              <Image
                src={productDetails.kickstarter?.thumbnail || kickstarterLogo}
                alt="Kickstarter Campaign"
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold z-20">
                Successfully Funded
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const ProductDescription = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongDescription = description?.length > 250;
  const shortDescription = description?.slice(0, 250);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="text-sm my-4">
      <span>
        {/* Show truncated description or full text depending on isExpanded */}
        {isExpanded || !isLongDescription
          ? description
          : `${shortDescription}...`}

        {/* Add the "Read more" or "Show less" button in-line */}
        {isLongDescription && (
          <button
            onClick={toggleExpand}
            className="text-blue-500 hover:underline ml-1 inline-block"
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
      </span>
    </div>
  );
};

const ProductDetailsPage = observer(({}) => {
  const { slug } = useParams();

  const router = useRouter();
  const { fetchProductDetails, addToCart, cart, user, products } = MobxStore;
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedExpansions, setRelatedExpansions] = useState([]);
  const [mainGame, setMainGame] = useState(null);
  const [otherExpansions, setOtherExpansions] = useState([]);

  useEffect(() => {
    const loadProductDetails = async () => {
      try {
        setLoading(true);
        const productData = await fetchProductDetails(slug);

        if (!productData) {
          setError("Product not found");
          return;
        }

        setProductDetails(productData);

        // Find related content
        if (productData.type === "game") {
          // For games, find related expansions
          const expansions = products.filter(
            (p) =>
              p.type === "expansion" &&
              p.relatedGames &&
              p.relatedGames.includes(productData.id)
          );
          setRelatedExpansions(expansions);
        } else if (
          productDetails.type === "expansion" &&
          productDetails.relatedGames?.length > 0
        ) {
          // For expansions, find the main game and other expansions
          const mainGameId = productDetails.relatedGames[0];
          const mainGameData = products.find((p) => p.id === mainGameId);
          setMainGame(mainGameData);

          // Find other expansions for the same game
          const otherExps = products.filter(
            (p) =>
              p.id !== productData.id &&
              p.type === "expansion" &&
              p.relatedGames &&
              p.relatedGames.includes(mainGameId)
          );
          setOtherExpansions(otherExps);
        }
      } catch (err) {
        console.error("Error loading product details:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadProductDetails();
    }
  }, [slug, fetchProductDetails, products]);

  console.log(slug);

  if (loading) {
    return (
      <div className="container mx-auto py-16 flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  console.log({ error });

  if (error || !productDetails) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-8 text-muted-foreground">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const isInCart = cart.includes(productDetails.id);
  const isPurchased = user
    ? user.purchasedProducts?.includes(productDetails.id)
    : false;

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="py-4 sm:py-8 px-4 md:px-8 flex flex-col items-center">
        <div className="w-full max-w-7xl">
          <div className="flex justify-start w-full mb-2">
            <div className="flex items-center text-sm mb-6">
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground"
              >
                Home
              </Link>
              <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
              <Link
                href="/shop"
                className="text-muted-foreground hover:text-foreground"
              >
                Shop
              </Link>
              <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
              <span className="font-medium truncate">
                {productDetails.name}
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:justify-center gap-12">
            <ImageCarousel
              images={[
                "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fmonster-mixology%2Fa4-mm.png?alt=media",
                "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fmonster-mixology%2FMM-APP.png?alt=media",
                "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fmonster-mixology%2FMM-APP.png?alt=media",
                "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fmonster-mixology%2FMM-APP.png?alt=media",
                "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fmonster-mixology%2FMM-APP.png?alt=media",
              ]}
            />

            <div className="flex flex-col w-full lg:max-w-[440px]">
              <div className="text-[46px] leading-[60px]  whitespace-wrap font-bold font-strike ">
                {productDetails.name}
              </div>
              <ProductDescription
                description={productDetails.description || "No Description"}
              />

              <Link href="#ratings" className="w-fit">
                <div className="flex gap-2 items-center border-b  w-fit cursor-pointer my-4 hover:border-foreground">
                  <div className="text-yellow-400 flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`text-xl ${
                          star <= (productDetails.averageRating || 0)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-[16px]">
                    (
                    {MobxStore.reviewsByProduct[productDetails.id]?.length || 0}{" "}
                    Reviews)
                  </div>
                </div>
              </Link>

              <BasicFeatures productDetails={productDetails} />

              <MechanicsBasicSection mechanics={productDetails?.mechanics} />

              {MobxStore.user?.purchasedProducts?.includes(
                productDetails.id
              ) ? (
                <>
                  <div className="flex items-center gap-2 text-[28px] font-strike uppercase mb-4">
                    <BadgeCheck className="w-8 h-8" />
                    Purchased
                  </div>
                  <div className="space-y-4">
                    <Link href={`/mvp/monstermixology`}>
                      <Button className="w-full bg-green-400 text-black h-[48px] text-xl  hover:bg-green-300 mb-4">
                        <Download className="mr-2" /> Download Resources
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-[28px] font-strike uppercase mb-4">
                    ${productDetails.price}.00 USD
                  </div>
                  <Button
                    className="text-xl h-[48px]"
                    onClick={() => MobxStore.addToCart(productDetails)}
                  >
                    Add to Cart
                  </Button>
                </>
              )}

              <GameMetrics productDetails={productDetails} />
            </div>
          </div>

          <ComponentsList productDetails={productDetails} />

          <KickstarterSection productDetails={productDetails} />

          {productDetails.id && (
            <ReviewSection
              productDetails={productDetails}
              productId={productDetails.id}
            />
          )}

          <HowToPlaySimple productDetails={productDetails} />

          {/* {productDetails && <RelatedGames gameId={productDetails.id} />} */}

          {productDetails.type === "game" && relatedExpansions?.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-strike">Available Expansions</h2>
                <div className="ml-4 flex-grow h-px bg-border"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedExpansions.map((expansion) => (
                  <ProductCard key={expansion.id} product={expansion} />
                ))}
              </div>
            </section>
          )}

          {productDetails.type === "expansion" && mainGame && (
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-strike">Main Game</h2>
                <div className="ml-4 flex-grow h-px bg-border"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <ProductCard product={mainGame} />
              </div>
            </section>
          )}

          {productDetails.type === "expansion" &&
            otherExpansions.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center mb-6">
                  <h2 className="text-2xl font-strike">Other Expansions</h2>
                  <div className="ml-4 flex-grow h-px bg-border"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {otherExpansions.map((expansion) => (
                    <ProductCard key={expansion.id} product={expansion} />
                  ))}
                </div>
              </section>
            )}
        </div>
      </div>
    </div>
  );
});

export default ProductDetailsPage;
