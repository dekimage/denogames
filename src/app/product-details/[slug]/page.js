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
  AlertTriangle,
  Trophy,
  Lock,
  CheckCircle2,
  ShoppingBag,
  ShoppingCart,
  Hammer,
  Clock,
} from "lucide-react";

import { ProductCard } from "@/components/ProductCard";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { gamesStaticData, placeholderBenefitsImg } from "../productsData";

import { Badge } from "@/components/ui/badge";
import kickstarterLogo from "@/assets/ks-logo.png";
import { LoadingSpinner } from "@/reusable-ui/LoadingSpinner";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/components/lib/utils";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductTypeBadge } from "@/components/ProductTypeBadge";
import SimpleImageCarousel from "@/components/SimpleImageCarousel";

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
  if (!productDetails.howToPlayVideo && !productDetails.rulebookLink)
    return null;
  return (
    <div className="my-8 w-full  flex flex-col max-w-[560px]">
      <div className="text-2xl font-strike uppercase my-4">How to Play</div>
      {productDetails?.howToPlayVideo && (
        <div className="relative w-full pt-[56.25%] ">
          <iframe
            width="560"
            className="absolute top-0 left-0 w-full h-full max-w-[560px] max-h-[315px]"
            height="315"
            src={(() => {
              const url = productDetails.howToPlayVideo;
              const regExp =
                /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
              const match = url.match(regExp);
              return match && match[2].length === 11
                ? `https://www.youtube.com/embed/${match[2]}`
                : url;
            })()}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {productDetails?.rulebookLink && (
        <Link
          href={productDetails.rulebookLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 w-full"
        >
          <Button className="mt-4 bg-foreground h-[48px] w-full text-background hover:bg-background hover:text-foreground border border-black">
            Download Rulebook
            <Download className="ml-2" />
          </Button>
        </Link>
      )}
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
    <div className="flex items-center justify-around gap-8 py-2 mt-4">
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
  if (!productDetails.providedComponents || !productDetails.neededComponents)
    return null;

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
                  <div className=" relative overflow-hidden flex justify-center items-center">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        height={800}
                        width={800}
                        className="w-[400px] h-auto"
                        // layout="fill"
                        // objectFit="cover"
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
                What you get:
              </h3>
              {renderComponentTable(
                productDetails.providedComponents,
                "provided"
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4 font-strike uppercase">
                What you need:
              </h3>
              {renderComponentTable(productDetails.neededComponents, "needed")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ClaimKickstarterSection = () => {
  const { user } = MobxStore;

  if (user?.purchasedProducts?.includes("monstermixology")) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 mt-16 sm:mt-0 px-4">
      <div className="border rounded-lg shadow-sm bg-card overflow-hidden mb-8">
        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <h3 className="text-2xl font-bold">Kickstarter Backer?</h3>
              <Image
                src={kickstarterLogo}
                alt="Kickstarter"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>

            <p className="text-muted-foreground mb-6">
              If you backed Monster Mixology on Kickstarter, claim your digital
              copy here!
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                  <CheckCircle
                    size={14}
                    className={user ? "text-green-500" : "text-primary"}
                  />
                </div>
                <span
                  className={user ? "text-muted-foreground line-through" : ""}
                >
                  Step 1: Log in or create an account
                </span>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                  <CheckCircle size={14} className="text-primary" />
                </div>
                <span>Step 2: Enter your unique backer code</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {!user ? (
                <>
                  <Button asChild className="w-full sm:w-auto">
                    <Link href="/signup">Create Account</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Link href="/login">Log In</Link>
                  </Button>
                </>
              ) : (
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/claim">Claim Monster Mixology</Link>
                </Button>
              )}
            </div>
          </div>

          <div className="relative h-[200px] md:h-auto order-first md:order-last">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fmonster-mixology%2FGroup%2047%20(1).png?alt=media"
              alt="Monster Mixology"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const KickstarterSection = ({ productDetails }) => {
  if (!productDetails.kickstarter?.kickstarterLink) return null;

  const isActive = productDetails.kickstarter?.kickstarterActive === true;

  return (
    <section className="mb-12">
      <div className="flex items-center my-6">
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
                  href={productDetails.kickstarter?.kickstarterLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M5.7 11.5L7.8 9.1 10.9 11.5 9.1 5.7 12 3.5 14.9 5.7 13.1 11.5 16.2 9.1 18.3 11.5 16.2 13.9 18.3 16.3 16.3 18.9 13.1 16.3 14.9 22.3 12 20.1 9.1 22.3 10.9 16.3 7.8 18.9 5.7 16.3 7.8 13.9z" />
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

              <Link
                href={productDetails.kickstarter?.kickstarterLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  className="w-full border-green-200 dark:border-green-800 hover:bg-green-400"
                >
                  <span className="flex items-center justify-center">
                    View Kickstarter Campaign
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </span>
                </Button>
              </Link>
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

const AchievementDialog = ({ achievement }) => {
  const router = useRouter();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer">
          <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
            <Image
              src={achievement.image || "/placeholder-image.png"}
              alt={achievement.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold">{achievement.name}</div>
            <div className="text-sm text-muted-foreground">
              {achievement.requirement}
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            {achievement.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="relative h-24 w-24 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={achievement.image || "/placeholder-image.png"}
                alt={achievement.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground">{achievement.description}</p>
              <div className="mt-2 text-sm">
                <span className="font-semibold">Requirement:</span>{" "}
                {achievement.requirement}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/account/my-collection")}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View All Collectibles
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ProductDetailsPage = observer(({}) => {
  const { slug } = useParams();
  const router = useRouter();
  const { addToCart, cart, user, products, loadingProducts } = MobxStore;
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedExpansions, setRelatedExpansions] = useState([]);
  const [mainGame, setMainGame] = useState(null);
  const [otherExpansions, setOtherExpansions] = useState([]);
  const [otherGames, setOtherGames] = useState([]);

  useEffect(() => {
    const loadProductDetails = () => {
      try {
        setLoading(true);

        // Use the new utility method
        const productData = MobxStore.getProductBySlug(slug);

        if (!productData) {
          setError("Product not found");
          return;
        }

        setProductDetails(productData);

        // Handle related products
        if (productData.type === "game") {
          setRelatedExpansions(
            products.filter(
              (p) =>
                (p.type === "expansion" || p.type === "add-on") &&
                p.relatedGames === productData.id
            )
          );
        } else if (productData.relatedGames) {
          const mainGameProduct = products.find(
            (p) => p.id === productData.relatedGames
          );
          setMainGame(mainGameProduct);

          setOtherExpansions(
            products.filter(
              (p) =>
                p.id !== productData.id &&
                p.type === "expansion" &&
                p.relatedGames === productData.relatedGames
            )
          );
        }

        // Get other games, with proper filtering:
        // 1. Only include products of type "game"
        // 2. Exclude the current product we're viewing
        // 3. Exclude the main game if we're viewing an expansion
        const otherGamesList = products.filter(
          (p) =>
            p.type === "game" &&
            p.id !== productData.id &&
            // If we're viewing an expansion, exclude its main game
            p.id !== productData.relatedGames
        );

        // Sort: unpurchased games first, then purchased ones
        const sortedGames = otherGamesList.sort((a, b) => {
          const aIsPurchased = user?.purchasedProducts?.includes(a.id) ? 1 : 0;
          const bIsPurchased = user?.purchasedProducts?.includes(b.id) ? 1 : 0;
          return aIsPurchased - bIsPurchased;
        });

        // Take up to 4 games for display
        setOtherGames(sortedGames.slice(0, 4));
      } catch (err) {
        console.log("Error processing product details:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    // Only process if products are loaded
    if (!loadingProducts && products.length > 0) {
      loadProductDetails();
    }
  }, [slug, products, loadingProducts, user?.purchasedProducts]);

  if (loading) {
    return (
      <div className="container mx-auto py-16 flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !productDetails) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-8 text-muted-foreground">
            The product you&apos;re looking for doesn&apos;t exist or has been
            removed.
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

  const progress = MobxStore.getAddOnProgress(productDetails.id);

  // Get the current product with reactive state from MobX store
  const currentProduct = MobxStore.products.find(
    (p) => p.id === productDetails.id
  );
  const averageRating =
    currentProduct?.averageRating || productDetails.averageRating || 0;
  const totalReviews =
    currentProduct?.totalReviews || productDetails.totalReviews || 0;

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
            <SimpleImageCarousel
              images={[
                productDetails.thumbnail,
                ...(productDetails.carouselImages || []),
              ]}
            />

            <div className="flex flex-col w-full lg:max-w-[440px]">
              {/* Add Coming Soon banner at the top if product is coming soon */}
              {productDetails.isComingSoon && (
                <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <div>
                    <p className="font-semibold">Coming Soon</p>
                    {productDetails.dateReleased && (
                      <p className="text-sm opacity-90">
                        Expected Release:{" "}
                        {new Date(
                          productDetails.dateReleased
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="text-[46px] leading-[60px] whitespace-wrap font-bold font-strike mb-2">
                {productDetails.name}
              </div>

              {/* here */}
              {(productDetails.type === "expansion" ||
                productDetails.type === "add-on") &&
                productDetails.relatedGames && (
                  <>
                    <div
                      className={cn(
                        "my-4 p-3 rounded-lg text-sm flex items-center gap-2",
                        user?.purchasedProducts?.includes(
                          productDetails.relatedGames
                        )
                          ? "bg-green-50 border border-green-200 text-green-800"
                          : "bg-amber-50 border border-amber-200 text-amber-800"
                      )}
                    >
                      {user?.purchasedProducts?.includes(
                        productDetails.relatedGames
                      ) ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>
                            You own the base game{" "}
                            <Link
                              href={`/product-details/${
                                products.find(
                                  (p) => p.id === productDetails.relatedGames
                                )?.slug
                              }`}
                              className="font-semibold hover:underline"
                            >
                              {
                                products.find(
                                  (p) => p.id === productDetails.relatedGames
                                )?.name
                              }
                            </Link>
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-4 w-4" />
                          <span>
                            You need the base game{" "}
                            <Link
                              href={`/product-details/${
                                products.find(
                                  (p) => p.id === productDetails.relatedGames
                                )?.slug
                              }`}
                              className="font-semibold hover:underline"
                            >
                              {
                                products.find(
                                  (p) => p.id === productDetails.relatedGames
                                )?.name
                              }
                            </Link>{" "}
                            to play this{" "}
                            {productDetails.type === "expansion"
                              ? "expansion"
                              : "add-on"}
                          </span>
                        </>
                      )}
                    </div>

                    <Link
                      href={`/product-details/${
                        products.find(
                          (p) => p.id === productDetails.relatedGames
                        )?.slug
                      }`}
                      className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-accent/50 transition-colors border mb-4"
                    >
                      <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={
                            products.find(
                              (p) => p.id === productDetails.relatedGames
                            )?.thumbnail || "/placeholder-image.png"
                          }
                          alt="Base game"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium mb-1">
                          Base Game
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-base font-semibold truncate">
                            {
                              products.find(
                                (p) => p.id === productDetails.relatedGames
                              )?.name
                            }
                          </div>
                          {user?.purchasedProducts?.includes(
                            productDetails.relatedGames
                          ) && (
                            <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full px-2 py-1 text-xs flex items-center">
                              <CheckCircle size={12} className="mr-1" /> Owned
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </>
                )}

              <ProductTypeBadge type={productDetails.type} />

              <ProductDescription
                description={productDetails.description || "No Description"}
              />

              {productDetails.type === "game" && (
                <Link href="#ratings" className="w-fit">
                  <div className="flex gap-2 items-center border-b w-fit cursor-pointer my-2 hover:border-foreground">
                    <div className="text-yellow-400 flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`text-xl ${
                            star <= averageRating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-[12px] text-muted-foreground">
                      ({totalReviews} Reviews)
                    </div>
                  </div>
                </Link>
              )}

              {productDetails.type === "game" && (
                <BasicFeatures productDetails={productDetails} />
              )}

              {productDetails.type === "game" && (
                <MechanicsBasicSection mechanics={productDetails?.mechanics} />
              )}

              {productDetails.type === "add-on" ? (
                <div className="mt-8 space-y-6">
                  {user?.unlockedRewards?.includes(productDetails.id) ? (
                    // User already owns/unlocked the add-on - show download button
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700 mb-2">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="font-medium">
                            You&apos;ve crafted this add-on!
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          You can now access all files for this add-on in your
                          game library.
                        </p>

                        <Link
                          href={`/account/my-games/${productDetails.relatedGames}`}
                          className="w-full"
                        >
                          <Button className="w-full font-strike">
                            <Download className="h-4 w-4 mr-2" />
                            Download Files
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    // User doesn't own the add-on yet - show achievements progress
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          Required Collectibles
                        </h3>
                        {user ? (
                          <div className="text-sm text-muted-foreground">
                            Progress:{" "}
                            {productDetails.achievements?.filter(
                              (achievement) =>
                                user?.achievements?.includes(achievement.id)
                            ).length || 0}
                            /{productDetails.achievements?.length || 0}
                          </div>
                        ) : null}
                      </div>

                      {user && productDetails.achievements?.length > 0 && (
                        <Progress
                          value={
                            ((productDetails.achievements.filter(
                              (achievement) =>
                                user?.achievements?.includes(achievement.id)
                            ).length || 0) /
                              productDetails.achievements.length) *
                            100
                          }
                          className="h-2"
                        />
                      )}

                      <div className="space-y-2">
                        {productDetails.achievements?.map((achievement) => (
                          <div
                            key={achievement.id}
                            className={cn(
                              "relative rounded-lg border p-4",
                              user?.achievements?.includes(achievement.id)
                                ? "bg-green-50 border-green-200"
                                : "bg-muted"
                            )}
                          >
                            <AchievementDialog achievement={achievement} />
                            {user?.achievements?.includes(achievement.id) && (
                              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {user ? (
                    <>
                      {!user?.unlockedRewards?.includes(productDetails.id) && (
                        <>
                          {/* Check if user has all achievements but doesn't own the base game */}
                          {productDetails.achievements?.every((achievement) =>
                            user?.achievements?.includes(achievement.id)
                          ) &&
                          !user?.purchasedProducts?.includes(
                            productDetails.relatedGames
                          ) ? (
                            // User has all achievements but is missing the base game
                            <div className="mb-4 p-4 border border-amber-200 bg-amber-50 rounded-lg">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="font-medium text-amber-800">
                                    You&apos;ve collected all required
                                    achievements!
                                  </p>
                                  <p className="text-sm text-amber-700 mt-1">
                                    However, you need to own the base game{" "}
                                    <Link
                                      href={`/product-details/${
                                        products.find(
                                          (p) =>
                                            p.id === productDetails.relatedGames
                                        )?.slug
                                      }`}
                                      className="font-semibold underline hover:text-amber-900"
                                    >
                                      {
                                        products.find(
                                          (p) =>
                                            p.id === productDetails.relatedGames
                                        )?.name
                                      }
                                    </Link>{" "}
                                    to craft this add-on.
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : null}

                          <Button
                            className="w-full font-strike"
                            disabled={
                              !productDetails.achievements?.every(
                                (achievement) =>
                                  user?.achievements?.includes(achievement.id)
                              ) ||
                              !user?.purchasedProducts?.includes(
                                productDetails.relatedGames
                              )
                            }
                            onClick={async () => {
                              if (
                                productDetails.achievements?.every(
                                  (achievement) =>
                                    user?.achievements?.includes(achievement.id)
                                ) &&
                                user?.purchasedProducts?.includes(
                                  productDetails.relatedGames
                                )
                              ) {
                                try {
                                  setLoading(true);
                                  await MobxStore.claimSpecialReward(
                                    productDetails.id
                                  );
                                } catch (error) {
                                  console.error(
                                    "Error claiming reward:",
                                    error
                                  );
                                } finally {
                                  setLoading(false);
                                }
                              }
                            }}
                          >
                            {loading ? (
                              <LoadingSpinner size="sm" />
                            ) : productDetails.achievements?.every(
                                (achievement) =>
                                  user?.achievements?.includes(achievement.id)
                              ) ? (
                              <>
                                {user?.purchasedProducts?.includes(
                                  productDetails.relatedGames
                                ) ? (
                                  <>
                                    <Hammer className="h-4 w-4 mr-2" />
                                    Craft Add-on
                                  </>
                                ) : (
                                  <>
                                    <Lock className="h-4 w-4 mr-2" />
                                    Get Base Game to Craft
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                <Lock className="h-4 w-4 mr-2" />
                                Collect All Achievements
                              </>
                            )}
                          </Button>
                        </>
                      )}

                      {!user?.unlockedRewards?.includes(productDetails.id) && (
                        <Button
                          variant="outline"
                          className="w-full font-strike"
                          onClick={() => router.push("/account/my-collection")}
                        >
                          <Trophy className="h-4 w-4 mr-2" />
                          View Your Collection
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full font-strike"
                      onClick={() => router.push("/login")}
                    >
                      Sign in to Craft Add-ons
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="text-[28px] font-strike uppercase mb-4">
                    ${productDetails.price}.00 USD
                  </div>

                  {/* Update CTA button based on coming soon status */}
                  {productDetails.isComingSoon ? (
                    <Button
                      className="text-xl h-[48px] font-strike w-full"
                      disabled
                    >
                      <Clock size={20} className="mr-2" />
                      Coming Soon
                    </Button>
                  ) : isPurchased ? (
                    <Link
                      href={`/account/my-games/${
                        productDetails.type === "game"
                          ? productDetails.id
                          : productDetails.relatedGames
                      }`}
                      className="w-full"
                    >
                      <Button className="text-xl h-[48px] font-strike w-full bg-black hover:bg-black/80 text-white">
                        Open Files
                      </Button>
                    </Link>
                  ) : isInCart ? (
                    <Link href="/checkout" className="w-full">
                      <Button className="text-xl h-[48px] font-strike w-full bg-orange-400 hover:bg-orange-300">
                        <ShoppingBag size={20} className="mr-2" />
                        Checkout
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      className="text-xl h-[48px] font-strike w-full"
                      onClick={() => MobxStore.addToCart(productDetails)}
                    >
                      <ShoppingCart size={20} className="mr-2" />
                      Add to Cart
                    </Button>
                  )}
                </>
              )}
              {productDetails.type === "game" && (
                <GameMetrics productDetails={productDetails} />
              )}
            </div>
          </div>

          <ComponentsList productDetails={productDetails} />

          {productDetails.type === "game" && (
            <KickstarterSection productDetails={productDetails} />
          )}

          {productDetails.slug === "monstermixology" && (
            <ClaimKickstarterSection />
          )}

          {productDetails.id && productDetails.type === "game" && (
            <ReviewSection
              productDetails={productDetails}
              productId={productDetails.id}
            />
          )}

          {(productDetails.type === "game" ||
            productDetails.type === "expansion") && (
            <HowToPlaySimple productDetails={productDetails} />
          )}

          {productDetails.type === "game" && relatedExpansions?.length > 0 && (
            <section className="mb-12 mt-12">
              <div className="flex items-center my-6">
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

          {(productDetails.type === "expansion" ||
            productDetails.type === "add-on") &&
            mainGame && (
              <section className="mb-12">
                <div className="flex items-center my-6">
                  <h2 className="text-2xl font-strike">Main Game</h2>
                  <div className="ml-4 flex-grow h-px bg-border"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <ProductCard product={mainGame} />
                </div>
              </section>
            )}

          {(productDetails.type === "expansion" ||
            productDetails.type === "add-on") &&
            otherExpansions.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center my-6">
                  <h2 className="text-2xl font-strike">Related Expansions</h2>
                  <div className="ml-4 flex-grow h-px bg-border"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {otherExpansions.map((expansion) => (
                    <ProductCard key={expansion.id} product={expansion} />
                  ))}
                </div>
              </section>
            )}

          {/* New "Other Games" section */}
          {otherGames.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center my-6">
                <h2 className="text-2xl font-strike">Other Games</h2>
                <div className="ml-4 flex-grow h-px bg-border"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {otherGames.map((game) => (
                  <ProductCard key={game.id} product={game} />
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
