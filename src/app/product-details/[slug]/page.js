"use client";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";

import React, { useEffect, useState, useCallback } from "react";
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
  Plus,
  Minus,
  Mail,
  MessageCircle,
} from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ProductCard } from "@/app/page"; // Adjust the import path as needed
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Cog, BookOpen, ShoppingCart } from "lucide-react";
import { gamesStaticData } from "../productsData";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Dummy data for mechanics
const mechanicsData = [
  {
    id: "deck-builder",
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
    id: "worker-placement",
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
    id: "push-your-luck",
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
  const mechanicsToUse =
    mechanics
      ?.map((mechanicId) => mechanicsData.find((m) => m.id === mechanicId))
      .filter(Boolean)
      .map((m) => m.name) || mechanicsData.map((m) => m.name);

  return (
    <div className="my-2">
      <div className="flex flex-wrap gap-4">
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
        <span>
          {productDetails.minPlayers}-{productDetails.maxPlayers} Players
        </span>
      </div>
      <span className="mx-4 text-gray-300">|</span>
      <div className="flex items-center text-gray-700">
        <Hourglass className="w-5 h-5 mr-2" />
        <span>{productDetails.duration || "45"} Minutes</span>
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
    <div className="flex flex-col items-center gap-8 justify-center font-strike uppercase  bg-[#FFD045] w-full py-8 ">
      <div className="text-[32px] text-center">How to Play - Fast Version</div>

      <div>
        {/* <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/NgTymmSsesw"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe> */}
      </div>
      <div className="text-[32px] text-center">Or Slow in Details</div>
      <Link
        href={
          gamesStaticData[productDetails.slug]?.rulebookUrl ||
          "https://drive.google.com/your-default-rulebook-url"
        }
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button className="bg-foreground h-[48px] text-xl text-background hover:bg-background hover:text-foreground">
          Download Rules <Download className="ml-2" />
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

const benefitsDataDummy = [
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

const KickstarterBenefits = ({ productDetails }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="my-8">
      <h2 className="text-3xl font-bold text-center  font-strike uppercase">
        Perks
      </h2>
      <div className="relative overflow-hidden transition-all duration-500">
        <div
          className={`py-8 px-8 flex flex-col gap-4 transition-all duration-500 ${
            expanded ? "max-h-full" : "max-h-[400px] overflow-hidden"
          }`}
        >
          {(
            gamesStaticData[productDetails.slug]?.benefitsData ||
            benefitsDataDummy
          ).map((benefit, index) => (
            <div className="box-inner" key={index}>
              <div className="box-broken relative flex flex-row items-center p-4 shadow-lg rounded-lg bg-white mb-4">
                {/* Circular number */}
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-4 flex-shrink-0">
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
                    <h3 className="text-xl mb-2">{benefit.title}</h3>
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
                    <Image
                      src={item.image || "/placeholder-image.jpg"}
                      alt={item.name}
                      layout="fill"
                      objectFit="cover"
                    />
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
      <div className="box-broken w-full bg-gray-100 py-12 px-4 md:px-8">
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

const VariationSystem = () => {
  return (
    <div className="flex-1">
      <h4 className="text-xl uppercase mb-2">
        <BadgeCheck className="inline-block mr-2" />
        Variations Printing System *
      </h4>
      <p className="mb-4">
        Our innovative Variations Printing System allows you to generate and
        print unique game setups, ensuring a fresh experience every time you
        play.
      </p>

      <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
        <Image
          src="/gifs/variation-system-demo.gif" // Add your GIF here
          alt="Variation System Demo"
          fill
          className="object-cover"
        />
      </div>

      <Link href="/blog/variations-printing-system">
        <Button variant="reverse">Learn More</Button>
      </Link>
    </div>
  );
};

const CompanionApp = () => {
  return (
    <div className="flex-1">
      <h4 className="text-xl uppercase mb-2">
        <BadgeCheck className="inline-block mr-2" />
        App Supplement *
      </h4>
      <p className="mb-4">
        Our companion app enhances your gameplay experience by managing the
        digital deck of cards and providing additional features to streamline
        your game sessions.
      </p>

      <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
        <Image
          src="/gifs/companion-app-demo.gif" // Add your GIF here
          alt="Companion App Demo"
          fill
          className="object-cover"
        />
      </div>

      <Link href="/blog/companion-app">
        <Button variant="reverse">Learn More</Button>
      </Link>
    </div>
  );
};

const SystemsFeatures = () => {
  return (
    <div className="my-8 flex flex-col gap-6">
      <div className="box-inner">
        <div className="box-broken p-8">
          <VariationSystem />
        </div>
      </div>

      <div className="box-inner">
        <div className="box-broken p-8">
          <CompanionApp />
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

const ProductDescription = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongDescription = description?.length > 150;
  const shortDescription = description?.slice(0, 150);

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

const FAQ = ({ productDetails }) => {
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [questionText, setQuestionText] = useState("");
  const { shopFAQs, gameFAQs } =
    gamesStaticData[productDetails.slug]?.faqs || {};

  const toggleQuestion = (id) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    // Handle question submission logic here
    console.log("Question submitted:", questionText);
    setQuestionText("");
  };

  const renderFAQSection = (questions, title) => (
    <div className="mb-8">
      <h3 className="text-2xl font-strike uppercase mb-8 text-center">
        {title}
      </h3>
      <div className="space-y-2">
        {questions?.map((faq) => (
          <div
            key={faq.id}
            className="border-b border-gray-200 last:border-none"
          >
            <button
              className="w-full text-left py-4 flex justify-between items-center hover:bg-gray-50"
              onClick={() => toggleQuestion(faq.id)}
            >
              <span className="text-xl">{faq.question}</span>
              {expandedQuestions[faq.id] ? <ChevronUp /> : <ChevronDown />}
            </button>
            {expandedQuestions[faq.id] && (
              <div className="pb-4 text-gray-600">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="my-16">
      <h2 className="text-3xl font-bold text-center mb-8 font-strike uppercase">
        Frequently Asked Questions
      </h2>

      <div className="box-inner">
        <div className="box-broken p-16">
          {renderFAQSection(shopFAQs, "Shopping & Delivery")}
          {renderFAQSection(gameFAQs, `About ${productDetails.name}`)}

          <div className="mt-12">
            <h3 className="text-2xl font-strike uppercase mb-6 text-center">
              Didn&apos;t Find What You&apos;re Looking For?
            </h3>

            <form onSubmit={handleSubmitQuestion} className="mb-8">
              <Textarea
                placeholder="Type your question here..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="mb-2"
                maxLength={1500}
              />
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">
                  {questionText.length}/1500 characters
                </span>
                <Button type="submit" className="bg-foreground text-background">
                  Ask Me →
                </Button>
              </div>
            </form>

            <div className="flex justify-center gap-4">
              <a
                href="mailto:denogames.official@gmail.com"
                className="flex items-center gap-2 hover:text-blue-600"
              >
                <Mail className="w-5 h-5" />
                Email Me
              </a>
              <a
                href="https://m.me/denogames"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-blue-600"
              >
                <MessageCircle className="w-5 h-5" />
                Chat
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add new components for download resources

const ResourceOption = ({ label, value, groupName, isSelected, onSelect }) => {
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={value} id={`${groupName}-${value}`} />
      <Label htmlFor={`${groupName}-${value}`} className="cursor-pointer">
        {label}
      </Label>
    </div>
  );
};

const ResourceConfig = ({ config, selectedOption, onOptionSelect }) => {
  return (
    <div className="mb-6 w-full px-4">
      <h4 className="text-lg font-strike uppercase mb-3">{config.label}</h4>
      <RadioGroup
        value={selectedOption}
        onValueChange={(value) => onOptionSelect(config.label, value)}
        className="space-y-2"
      >
        {config.options.map((option) => (
          <ResourceOption
            key={option.key || option}
            label={option.label || option}
            value={option.key || option}
            groupName={config.label.toLowerCase().replace(/\s+/g, "-")}
            isSelected={selectedOption === (option.key || option)}
          />
        ))}
      </RadioGroup>
    </div>
  );
};

const ResourceComponent = ({ resource }) => {
  const [selectedConfigs, setSelectedConfigs] = useState(
    resource.configurations
      ? Object.fromEntries(
          resource.configurations.map((config) => [
            config.label,
            config.options[0].key || config.options[0],
          ])
        )
      : {}
  );

  const handleOptionSelect = (configLabel, option) => {
    setSelectedConfigs((prev) => ({
      ...prev,
      [configLabel]: option.key || option,
    }));
  };

  const handleDownload = () => {
    console.log("Downloading with configs:", selectedConfigs);
    resource.onDownload?.(selectedConfigs);
  };

  return (
    <div className="border-2 border-black rounded-lg">
      <div className="flex flex-col md:flex-row gap-2 mb-2 border-b-2 border-black border-dashed p-2">
        <div className="w-full md:w-[150px] h-[150px] flex-shrink-0">
          <Image
            src={resource.image}
            alt={resource.name}
            width={150}
            height={150}
            className="object-cover rounded-lg w-[150px] h-[150px] border"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-strike uppercase mb-2">
            {resource.name}
          </h3>
          {resource.description && (
            <p className="text-gray-600 mb-2">{resource.description}</p>
          )}
          {resource.instructions && (
            <p className="text-sm text-gray-500">{resource.instructions}</p>
          )}
        </div>
      </div>

      {resource.configurations && resource.configurations.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:justify-around items-center">
          {resource.configurations.map((config) => (
            <ResourceConfig
              key={config.label}
              config={config}
              selectedOption={selectedConfigs[config.label]}
              onOptionSelect={handleOptionSelect}
            />
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <Button
          onClick={handleDownload}
          className="w-[80%] mt-2 bg-foreground text-background h-[48px] text-xl mb-4"
        >
          <Download className="mr-2" /> Download {resource.name}
        </Button>
      </div>
    </div>
  );
};

// Update the DownloadResourcesDialog component to use the data from productsData
const DownloadResourcesDialog = ({ productDetails }) => {
  const resources =
    gamesStaticData[productDetails.slug]?.downloadResources || [];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full bg-foreground h-[48px] text-xl text-background hover:bg-background hover:text-foreground">
          <Download className="mr-2" /> Download Resources
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[80%] lg:max-w-[900px] w-full max-h-[90vh] overflow-y-auto p-4 md:p-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-strike uppercase mb-8 text-center">
            Download Resources
          </h2>
          <div className="space-y-6">
            {resources.map((resource, index) => (
              <ResourceComponent key={index} resource={resource} />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

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
      <div className="py-4 sm:py-8 px-4 md:px-8 flex flex-col items-center">
        <div className="w-full max-w-7xl">
          <div className="flex justify-start w-full">
            <Breadcrumbs />
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
              <div className="text-[46px] leading-[60px]  whitespace-wrap font-bold font-strike">
                {productDetails.name}
              </div>
              <ProductDescription
                description={productDetails.description || "No Description"}
              />
              <MechanicsSection mechanics={productDetails.mechanics} />
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
                      <Button className="w-full bg-foreground h-[48px] text-xl text-background hover:bg-background hover:text-foreground">
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
                  <p className="mt-4 text-sm text-gray-600">
                    When you purchase this game, you&apos;re not just getting a
                    one-time download. You&apos;re gaining access to our
                    innovative variants system, allowing you to craft dynamic
                    PDFs tailored to your preferences. Choose from multiple game
                    versions and variants, and download as many as you like!
                  </p>
                </>
              )}

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

          <KickstarterBenefits productDetails={productDetails} />

          <HowToPlay productDetails={productDetails} />

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

          <ComponentsList productDetails={productDetails} />
          <SystemsFeatures />
          <FAQ productDetails={productDetails} />
          {productDetails && <RelatedGames gameId={productDetails.id} />}
        </div>
      </div>
    </div>
  );
});

export default ProductDetailsPage;
