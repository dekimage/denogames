"use client";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ProductReviews,
  ReviewForm,
  ReviewSection,
} from "@/components/Reviews";
import ImageCarousel from "@/components/ImageCarousel";
import { Button } from "@/components/ui/button";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Hourglass,
  Dices,
  Clover,
  Brain,
  UserPlus,
  Download,
  ChevronDown,
  ChevronUp,
  Printer,
  Smartphone,
  BadgeCheck,
} from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ProductCard } from "@/app/page"; // Adjust the import path as needed
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Cog, BookOpen, ShoppingCart } from "lucide-react";

// Dummy data for mechanics
const mechanicsData = [
  {
    id: "mech1",
    name: "Deck Builder",
    icon: <BookOpen className="w-4 h-4" />,
    description:
      "Players create a personal deck of cards during the game, adding more powerful cards and removing weaker ones as the game progresses.",
    blogs: [
      {
        id: "blog1",
        title: "Mastering Deck Building",
        snippet: "Learn the strategies behind effective deck construction...",
      },
      {
        id: "blog2",
        title: "Evolution of Deck Builders",
        snippet: "Explore how deck-building games have changed over time...",
      },
    ],
    relatedGames: ["uN2wXIY3e58v7ptkmsv0", "dLj79FaA9eoGKe9Azqf2"],
  },
  {
    id: "mech2",
    name: "Worker Placement",
    icon: <Users className="w-4 h-4" />,
    description:
      "Players assign a limited number of worker pieces to various actions or locations on the game board to gain resources or perform actions.",
    blogs: [
      {
        id: "blog3",
        title: "Worker Placement Strategies",
        snippet: "Discover key tactics for successful worker placement...",
      },
      {
        id: "blog4",
        title: "Top Worker Placement Games",
        snippet: "Check out our list of the best worker placement games...",
      },
    ],
    relatedGames: ["uN2wXIY3e58v7ptkmsv0"],
  },
  {
    id: "mech3",
    name: "Open Market",
    icon: <ShoppingCart className="w-4 h-4" />,
    description:
      "Players can freely buy and sell resources or items in a shared marketplace, with prices often fluctuating based on supply and demand.",
    blogs: [
      {
        id: "blog5",
        title: "Mastering Open Markets",
        snippet: "Learn how to thrive in games with open market mechanics...",
      },
      {
        id: "blog6",
        title: "Economic Games Spotlight",
        snippet: "Explore games that feature robust open market systems...",
      },
    ],
    relatedGames: ["dLj79FaA9eoGKe9Azqf2"],
  },
];

const MechanicsSection = ({ mechanics }) => {
  const mechanicsToUse = mechanics || mechanicsData.map((m) => m.name);

  return (
    <div className="my-8">
      <h2 className="text-3xl font-bold text-center mb-4 font-strike uppercase">
        Game Mechanics
      </h2>
      <div className="flex flex-wrap justify-center gap-4">
        {mechanicsToUse.map((mechanic) => (
          <MechanicTag key={mechanic} mechanic={mechanic} />
        ))}
      </div>
    </div>
  );
};

const MechanicTag = ({ mechanic }) => {
  const mechanicData = mechanicsData.find(
    (m) => m.name.toLowerCase() === mechanic.toLowerCase()
  );

  const icon = mechanicData ? mechanicData.icon : <Cog className="w-4 h-4" />;

  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant="outline"
          className="flex items-center gap-2 hover:bg-gray-100"
        >
          {icon}
          {mechanic}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[50%] w-full max-h-[90vh] overflow-y-auto dialog-content">
        <MechanicDetails mechanic={mechanicData} />
      </DialogContent>
    </Dialog>
  );
};

const MechanicDetails = ({ mechanic }) => {
  if (!mechanic) {
    return <div>Mechanic details not found.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-strike uppercase text-center mb-4 flex items-center justify-center gap-2">
        {mechanic.icon} {mechanic.name}
      </h2>
      <p className="mb-6 text-sm">{mechanic.description}</p>

      <h3 className="text-xl font-strike uppercase mb-2">Blogs:</h3>
      <div className="space-y-4 mb-6">
        {mechanic.blogs.map((blog) => (
          <div className="box-inner" key={blog.id}>
            <div className="box-broken border p-6 rounded-lg hover:shadow-md transition-shadow">
              <h4 className="text-lg">{blog.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{blog.snippet}</p>
              <Button variant="link" className="p-0">
                Read more
              </Button>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-strike uppercase mb-2">Related Games:</h3>
      <div className="flex flex-wrap gap-4">
        {mechanic.relatedGames.map((gameId) => (
          <ProductCard key={gameId} product={{ id: gameId }} isSmall={true} />
        ))}
      </div>
    </div>
  );
};

const GameFeatures = ({ productDetails }) => {
  return (
    <div className="flex gap-2 my-8">
      <div className="flex flex-col border-foreground border max-w-[230px]">
        <div className="flex bg-foreground text-background justify-center w-full text-[14px] items-center border-b border-foreground">
          Players
        </div>
        <Image
          src="/muhari/players.png"
          width={100}
          height={100}
          alt="players count"
          className="mb-2"
        />
        <div className="flex bg-foreground text-background justify-center w-full text-[14px] items-center border-t border-foreground ">
          2-4
          {/* {productDetails.playersCount} */}
        </div>
      </div>
      <div className="flex flex-col border-foreground border max-w-[230px]">
        <div className="flex bg-foreground text-background justify-center w-full text-[14px] items-center border-b border-foreground">
          Duration
        </div>
        <Image
          src="/muhari/clock.png"
          width={100}
          height={100}
          alt="players count"
          className="mb-2"
        />
        <div className="flex bg-foreground text-background justify-center w-full text-[14px] items-center border-t border-foreground ">
          60 min
        </div>
      </div>

      <div className="flex flex-col border-foreground border max-w-[230px]">
        <div className="flex bg-foreground text-background justify-center w-full text-[14px] items-center border-b border-foreground">
          Age
        </div>
        <Image
          src="/muhari/age.png"
          width={100}
          height={100}
          alt="players count"
          className="mb-2"
        />
        <div className="flex bg-foreground text-background justify-center w-full text-[14px] items-center border-t border-foreground ">
          {productDetails.age}+
        </div>
      </div>
    </div>
  );
};

const BasicFeatures = ({ productDetails }) => {
  return (
    <div className="flex items-center justify-between text-lg py-6 font-strike uppercase">
      <div className="flex items-center text-gray-700">
        <Users className="w-5 h-5 mr-2" />
        <span>{productDetails.playersCount || "2-4"} Players</span>
      </div>
      <span className="mx-4 text-gray-300">|</span>
      <div className="flex items-center text-gray-700">
        <Hourglass className="w-5 h-5 mr-2" />
        <span>{productDetails.duration || "60"} Minutes</span>
      </div>
      <span className="mx-4 text-gray-300">|</span>
      <div className="flex items-center text-gray-700">
        <Dices className="w-5 h-5 mr-2" />
        <span>{productDetails.age || "12"}+ Age</span>
      </div>
    </div>
  );
};

const HowToPlay = ({ productDetails }) => {
  return (
    <div className="flex flex-col items-center gap-8 justify-center  bg-[#FFD045] w-full py-8 ">
      <div className="text-[32px] font-bold text-center">
        {/* Heyya! Reading is the slow way to learn how to play! Watch the video
        instead! */}
        How to Play - Fast Version
      </div>
      {/* 
      {productDetails.howToVideos.map((video, index) => (
          <div key={index}>
            <a href={video} target="_blank" rel="noopener noreferrer">
              Watch Video {index + 1}
            </a>
          </div>
        ))} */}

      <div>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/I1kamcPFiAM"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
      <div className="text-[32px] font-bold text-center">
        Or Slow in Details
      </div>
      <Button className="bg-foreground h-[48px] text-xl text-background hover:bg-background hover:text-foreground">
        Download Rules <Download className="ml-2" />
      </Button>
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

const benefitsData = [
  {
    title: "Endless Replayability",
    description:
      "Use our innovative system to craft over 200,000 unique variants of the game. Each playthrough offers a fresh experience, ensuring you'll never have the same game twice!",
    image: "/placeholder-image-1.jpg",
  },
  {
    title: "Pick Your Hero",
    description:
      "Choose among 12 diverse heroes, from mystical monks to cunning warlocks. Each class offers a unique playstyle and abilities, allowing you to tailor your strategy to your preferences.",
    image: "/placeholder-image-2.jpg",
  },
  {
    title: "Roll 4 Dice on Your Turn",
    description:
      "Roll dice to activate powerful abilities and unleash devastating combos. Outsmart your opponents with tactical decision-making and a bit of luck!",
    image: "/placeholder-image-3.jpg",
  },
  {
    title: "Dynamic Battlefield",
    description:
      "Engage in combat on an ever-changing battlefield. Adapt your strategy as the terrain shifts, offering new challenges and opportunities with each round.",
    image: "/placeholder-image-4.jpg",
  },
  {
    title: "Cooperative & Competitive Modes",
    description:
      "Play solo, team up with friends, or compete against each other. With multiple game modes, you can enjoy the game however you like, making it perfect for game nights of all kinds!",
    image: "/placeholder-image-5.jpg",
  },
];

const KickstarterBenefits = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="my-8">
      <h2 className="text-3xl font-bold text-center mb-4 font-strike uppercase">
        Perks
      </h2>
      <div className="relative overflow-hidden transition-all duration-500">
        <div
          className={`py-8 px-8 flex flex-col gap-4 transition-all duration-500 ${
            expanded ? "max-h-full" : "max-h-[400px] overflow-hidden"
          }`}
        >
          {benefitsData.map((benefit, index) => (
            <div className="box-inner" key={index}>
              <div className="box-broken relative flex flex-row items-center p-4 shadow-lg rounded-lg bg-white mb-4">
                {/* Circular number */}
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  {index + 1}
                </div>
                {/* Benefit content */}
                <div className="flex flex-row items-center w-full">
                  <Image
                    src={benefit.image}
                    alt={benefit.title}
                    width={300}
                    height={200}
                    className="mr-4 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fade out effect for the preview */}
        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-gradient-to-t from-white to-transparent"></div>
        )}
      </div>

      <div className="flex justify-center mt-4">
        <Button onClick={toggleExpanded} className="text-xl">
          {expanded ? <>Collapse</> : <>View All</>}
        </Button>
      </div>
    </div>
  );
};

const Expansions = observer(({ gameId }) => {
  const { getRelatedExpansions, addToCart } = MobxStore;
  const expansions = getRelatedExpansions?.(gameId) ?? [];

  const addAllToCart = () => {
    expansions.forEach((expansion) => addToCart(expansion));
  };

  if (expansions.length === 0) {
    return null; // Don't render anything if there are no available expansions
  }

  return (
    <div className="my-8">
      <h2 className="text-3xl font-bold text-center mb-4 font-strike uppercase">
        Available Expansions
      </h2>
      <div className="flex flex-wrap justify-center gap-4">
        {expansions.map((expansion) => (
          <ProductCard key={expansion.id} product={expansion} isSmall={true} />
        ))}
      </div>
      {expansions.length > 1 && (
        <div className="mt-4 flex justify-center">
          <Button onClick={addAllToCart}>Add All Expansions to Cart</Button>
        </div>
      )}
    </div>
  );
});

// Add this new component
const ComponentsList = () => {
  const neededComponents = [
    "4x Dice (6-sided)",
    "4x Pens/Pencils (different color for each player)",
    "8 colored euro-size cubes per player (different color)- Optional (alternative its provided as print and cut tokens for each player in all colors)",
  ];

  const providedComponents = [
    "1x Map (10,000+ print variations)*",
    "1x Market Sheet (4000+ combinations)",
    "4x Characters Sheets (2 per A4 paper - cut in half)",
    "Optional (euro cubes as tokens)",
    "App - Digital deck of 100+ cards included*",
  ];

  return (
    <div className="box-inner">
      <div className="box-broken w-full bg-gray-100 py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4 font-strike uppercase">
                Needed Components
              </h3>
              <Table>
                <TableBody>
                  {neededComponents.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4 font-strike uppercase">
                Provided Components
              </h3>
              <Table>
                <TableBody>
                  {providedComponents.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SystemsFeatures = () => {
  return (
    <div className="box-inner my-8">
      <div className="box-broken p-8 flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h4 className="text-xl uppercase mb-2">
            {/* <Printer className="inline-block mr-2" /> */}
            <BadgeCheck className="inline-block mr-2" /> Variations Printing
            System *
          </h4>
          <p className="mb-2">
            Our innovative Variations Printing System allows you to generate and
            print unique game setups, ensuring a fresh experience every time you
            play.
          </p>
          <Link href="/blog/variations-printing-system">
            <Button variant="reverse">Learn More</Button>
          </Link>
        </div>

        <div className="flex-1">
          <h4 className="text-xl uppercase mb-2">
            {/* <Smartphone className="inline-block mr-2" /> */}
            <BadgeCheck className="inline-block mr-2" /> App Supplement *
          </h4>
          <p className="mb-2">
            Our companion app enhances your gameplay experience by managing the
            digital deck of cards and providing additional features to
            streamline your game sessions.
          </p>
          <Link href="/blog/companion-app">
            <Button variant="reverse">Learn More</Button>
          </Link>
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

const ProductDetailsPage = observer(({ params }) => {
  const { slug } = params;

  const [productDetails, setProductDetails] = useState(null);

  const { fetchProductDetails } = MobxStore;

  useEffect(() => {
    if (slug) {
      fetchProductDetails(slug).then((details) => {
        setProductDetails(details);
      });
    }
  }, [slug]);

  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const truncateText = useCallback((text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  }, []);

  const fullDescription = `When you purchase this game, you're not just getting a one-time download. You're gaining access to our innovative variants system, allowing you to craft dynamic PDFs tailored to your preferences. Choose from multiple game versions and variants, and download as many as you like!

But that's not all - your purchase includes all future updates and expansions. As we continue to refine and expand the game, you'll always have access to the latest and greatest versions. It's like getting a constantly evolving game that grows with your gaming experience!

Buy once, play endlessly - that's our promise to you!`;

  if (!productDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="py-8 px-4 md:px-8 flex flex-col items-center">
        <div className="w-full max-w-7xl">
          <div className="flex justify-start w-full">
            <Breadcrumbs />
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:justify-center gap-12 mt-6">
            <ImageCarousel
              images={[
                "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fgame1%2Fimage1.png?alt=media",
                "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fgame1%2Fimage2.png?alt=media&",
                "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fgame1%2Fthumbnail.png?alt=media",
                "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fgame1%2Fimage1.png?alt=media",
                "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fgame1%2Fimage2.png?alt=media&",
                "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fgame1%2Fthumbnail.png?alt=media",
              ]}
            />

            <div className="flex flex-col w-full lg:max-w-[440px]">
              <div className="text-[46px] leading-[60px]  whitespace-wrap font-bold font-strike">
                {productDetails.name}
              </div>
              <div className="text-sm leading-[28px] my-4">
                A film, music, and TV guessing game where U must speak good or
                get hit with stick.
              </div>
              <Link href="#ratings" className="w-fit">
                <div className="flex gap-2 items-center border-b  w-fit cursor-pointer my-4 hover:border-foreground">
                  <div className="text-yellow-400 flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar key={star} className="text-xl text-yellow-400" />
                    ))}
                  </div>
                  <div className="text-[16px]">(55 Reviews)</div>
                </div>
              </Link>

              <BasicFeatures productDetails={productDetails} />

              <div className="text-[28px] font-strike uppercase mb-4">
                ${productDetails.price}.00 USD
              </div>

              <Button className="text-xl h-[60px]">Add to cart</Button>

              <div className="mt-6 mb-8 text-xs text-gray-500">
                <p>
                  {showFullDescription
                    ? fullDescription
                    : truncateText(fullDescription, 150)}
                </p>
                <button
                  onClick={toggleDescription}
                  className="mt-2 text-blue-500 hover:underline cursor-pointer"
                >
                  {showFullDescription ? "Show less" : "Read more"}
                </button>
              </div>

              <GameMetrics productDetails={productDetails} />
            </div>
          </div>

          <KickstarterBenefits />

          <HowToPlay />

          <div className="my-4">
            {/* <a
                href={productDetails.kickstarterLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Kickstarter Campaign
              </a> */}
          </div>

          {productDetails.id && (
            <ReviewSection
              productDetails={productDetails}
              productId={productDetails.id}
            />
          )}

          {productDetails && <Expansions gameId={productDetails.id} />}

          <ComponentsList />
          <SystemsFeatures />
          {productDetails && <RelatedGames gameId={productDetails.id} />}
          <MechanicsSection mechanics={productDetails.mechanics} />
        </div>
      </div>
    </div>
  );
});

export default ProductDetailsPage;
