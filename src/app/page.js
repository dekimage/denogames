"use client";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronRight, Gift, Dice6, Package } from "lucide-react";
import FeaturedGamesSlider from "@/components/FeaturedGameSlider";
import { LoadingSpinner } from "@/reusable-ui/LoadingSpinner";
import patreonImg from "@/assets/patreon-logo.png"; // You'll need to add these images
import substackImg from "@/assets/substack-logo.png"; // You'll need to add these images
import { useState, useEffect, useCallback } from "react";
import { ProductCard } from "@/components/ProductCard";

import { BlogCard } from "./blog/page";
import { useTrackClick } from "@/hooks/useTrackClick";
import { ALLOWED_CLICK_LABELS } from "@/lib/analytics/events";
import Footer from "@/components/Footer";

// Reusable Product Card component

// Section Header with "View All" link
const SectionHeader = ({ title, viewAllLink, viewAllText = "View All" }) => (
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-strike uppercase">{title}</h2>
    {viewAllLink && (
      <Link href={viewAllLink}>
        <div className="font-strike text-light flex items-center hover:text-primary transition-colors">
          {viewAllText} <ChevronRight size={16} />
        </div>
      </Link>
    )}
  </div>
);

// Category Card Component
const CategoryCard = ({ title, description, icon: Icon, href }) => {
  const trackClick = useTrackClick();

  const handleClick = useCallback(() => {
    // Track the click based on the category title
    if (title === "Games") {
      trackClick(ALLOWED_CLICK_LABELS.CATEGORY_GAMES);
    } else if (title === "Expansions") {
      trackClick(ALLOWED_CLICK_LABELS.CATEGORY_EXPANSIONS);
    } else if (title === "Add-ons") {
      trackClick(ALLOWED_CLICK_LABELS.CATEGORY_ADDONS);
    }
  }, [title, trackClick]);

  return (
    <Link href={href} onClick={handleClick}>
      <div className="border rounded-lg shadow-sm bg-card p-8 text-center transition-colors h-full hover:shadow-md">
        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon size={32} className="text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <span className="text-primary font-medium flex items-center justify-center">
          Browse {title} <ChevronRight size={16} />
        </span>
      </div>
    </Link>
  );
};

// Community Card Component
const CommunityCard = ({
  title,
  description,
  icon: Icon,
  ctaText,
  ctaLink,
}) => {
  return (
    <div className="border rounded-lg shadow-sm bg-card p-6 transition-colors hover:shadow-md">
      <div className="flex items-start">
        <div className="mr-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon size={24} className="text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-4">{description}</p>
          <Button asChild variant="outline">
            <Link href={ctaLink} target="_blank" rel="noopener noreferrer">
              {ctaText}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

// Membership CTA Component
const MembershipCTA = ({
  title,
  description,
  benefits,
  image,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
}) => {
  return (
    <div className="border rounded-lg shadow-sm bg-card overflow-hidden mb-8">
      <div className="grid md:grid-cols-2 gap-6 p-6">
        <div className="flex flex-col justify-center">
          <h3 className="text-2xl font-bold mb-4">{title}</h3>
          <p className="text-muted-foreground mb-6">{description}</p>

          <div className="space-y-3 mb-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                  <CheckCircle size={14} className="text-primary" />
                </div>
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="w-full sm:w-auto">
              <Link href={ctaLink} target="_blank" rel="noopener noreferrer">
                {ctaText}
              </Link>
            </Button>

            {secondaryCtaText && (
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link
                  href={secondaryCtaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {secondaryCtaText}
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="relative h-[200px] md:h-auto order-first md:order-last">
          <Image src={image} alt={title} fill className="object-contain" />
        </div>
      </div>
    </div>
  );
};

// Create a BlogSection component that handles its own loading state
const BlogSection = observer(() => {
  const { blogs, blogsLoading, fetchBlogs } = MobxStore;
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        await fetchBlogs(3); // Fetch only 3 blogs for the homepage
      } catch (err) {
        setError(err.message);
      }
    };

    loadBlogs();
  }, [fetchBlogs]);

  if (error) {
    return (
      <section className="mb-16">
        <SectionHeader
          title="Latest Blog Posts"
          viewAllLink="/blog"
          viewAllText="See All Posts"
        />
        <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-lg text-center">
          <p>Failed to load blog posts. Please try again later.</p>
        </div>
      </section>
    );
  }

  if (blogsLoading) {
    return (
      <section className="mb-16">
        <SectionHeader
          title="Latest Blog Posts"
          viewAllLink="/blog"
          viewAllText="See All Posts"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border rounded-lg shadow-sm overflow-hidden bg-card animate-pulse"
            >
              <div className="h-40 bg-muted"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Only show the section if we have blogs to display
  if (!blogs || blogs.length === 0) {
    return null;
  }

  // Take only the first 3 blogs
  const latestBlogs = blogs.slice(0, 3);

  return (
    <section className="mb-16">
      <SectionHeader
        title="Latest Blog Posts"
        viewAllLink="/blog"
        viewAllText="See All Posts"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {latestBlogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </section>
  );
});

// Create Account CTA Component for non-logged-in users
// const CreateAccountCTA = () => {
//   return (
//     <div className="border rounded-lg shadow-sm bg-card overflow-hidden mb-8">
//       <div className="grid md:grid-cols-2 gap-6 p-6">
//         <div className="flex flex-col justify-center">
//           <h3 className="text-2xl font-bold mb-4">
//             Create a Free Account - Get a Free Game!
//           </h3>
//           <p className="text-muted-foreground mb-6">
//             Join our community of board game enthusiasts and start your
//             collection with a free game. Track your progress, unlock
//             achievements, and get access to exclusive content!
//           </p>

//           <div className="space-y-3 mb-6">
//             <div className="flex items-start">
//               <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
//                 <Trophy size={14} className="text-primary" />
//               </div>
//               <span>Collect achievements and track your progress</span>
//             </div>
//             <div className="flex items-start">
//               <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
//                 <Gift size={14} className="text-primary" />
//               </div>
//               <span>Unlock mini-expansions and exclusive content</span>
//             </div>
//             <div className="flex items-start">
//               <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
//                 <GameController size={14} className="text-primary" />
//               </div>
//               <span>Build your game collection and track ownership</span>
//             </div>
//             <div className="flex items-start">
//               <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
//                 <BarChart3 size={14} className="text-primary" />
//               </div>
//               <span>Track your game stats and high scores</span>
//             </div>
//             <div className="flex items-start">
//               <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
//                 <BookOpen size={14} className="text-primary" />
//               </div>
//               <span>Access to digital rulebooks and game guides</span>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-3">
//             <Button asChild className="w-full sm:w-auto">
//               <Link href="/signup">
//                 <UserPlus size={16} className="mr-2" /> Create Free Account
//               </Link>
//             </Button>

//             <Button asChild variant="outline" className="w-full sm:w-auto">
//               <Link href="/login">Already have an account? Log in</Link>
//             </Button>
//           </div>
//         </div>

//         <div className="relative h-[200px] md:h-auto order-first md:order-last">
//           <Image
//             src={placeholderImg}
//             alt="Create an account"
//             fill
//             className="object-contain"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

const HomePage = observer(() => {
  const { products, loading, cart, user, blogs, blogsLoading } = MobxStore;
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isContentReady, setIsContentReady] = useState(false);

  useEffect(() => {
    // Function to check if all necessary data is loaded
    const checkDataReady = () => {
      if (!loading && !blogsLoading && products && blogs) {
        setIsContentReady(true);
        setIsInitialLoading(false);
      }
    };

    // Initial check
    checkDataReady();

    // Set a minimum loading time to prevent quick flashes
    const minLoadingTimer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000);

    return () => clearTimeout(minLoadingTimer);
  }, [loading, blogsLoading, products, blogs]);

  // Show loading spinner during initial load
  if (isInitialLoading || !isContentReady) {
    return <LoadingSpinner />;
  }

  const sortedGames = [...products].sort((a, b) => {
    // First check if user owns the games
    const userOwnsA = user?.purchasedProducts?.includes(a.id) || false;
    const userOwnsB = user?.purchasedProducts?.includes(b.id) || false;

    if (userOwnsA !== userOwnsB) {
      return userOwnsA ? 1 : -1;
    }

    // If ownership status is the same, sort by date (newest first)
    const dateA = a.dateReleased ? new Date(a.dateReleased) : new Date(0);
    const dateB = b.dateReleased ? new Date(b.dateReleased) : new Date(0);
    return dateB - dateA;
  });

  const gamesAndExpansions = sortedGames.filter(
    (product) =>
      (product.type === "game" || product.type === "expansion") &&
      !product.isComingSoon
  );

  const addOns = sortedGames.filter((product) => product.type === "add-on");

  // Get the newest games (already sorted by ownership and date)

  // Coming soon games (games with future release dates)
  const comingSoonGames = [...products]
    .filter((product) => product.isComingSoon)
    .slice(0, 4);

  // Products ready to add to cart (not in cart and not purchased)
  const readyToAddToCart = products.filter(
    (product) =>
      !cart.includes(product.id) &&
      !(user ? user.purchasedProducts?.includes(product.id) : false)
  );

  // Featured games for the slider
  const featuredGames = [
    {
      id: "banner-mm-kickstarter", // Unique banner ID
      title: "Monster Mixology",
      description: "Back it now on Kickstarter!",
      imgUrl:
        "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fmonster-mixology%2FGroup%2047%20(1).png?alt=media",
      openNewTab: true,
      button: "Back it now!",
      link: "https://www.kickstarter.com/projects/denogames/monster-mixology",
      type: "kickstarter", // Banner type for analytics
      position: 1, // Position in carousel
    },
    {
      id: "banner-mystic-quest-launch",
      title: "Mystic Quest",
      description:
        "Embark on an epic journey through mystical lands and ancient ruins.",
      imgUrl:
        "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fmonster-mixology%2FGroup%2047%20(1).png?alt=media",
      button: "Explore",
      link: "/product-details/mystic-quest",
      type: "game-launch",
      position: 2,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <FeaturedGamesSlider games={featuredGames} />

      {/* Kickstarter Backer Section - Only show if not claimed */}

      <div className="container mx-auto py-8 px-4">
        {/* Newest Games Section - Now using sortedGames */}
        <section className="mb-16">
          <SectionHeader
            title="Games"
            viewAllLink="/shop"
            viewAllText="Shop All"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {gamesAndExpansions.map((game) => (
              <ProductCard key={game.id} product={game} />
            ))}
          </div>

          <SectionHeader
            title="Add-Ons"
            viewAllLink="/shop?category=add-on"
            viewAllText="See All"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((game) => (
              <ProductCard key={game.id} product={game} />
            ))}
          </div>
        </section>

        {/* Create Account CTA - Only show if user is not logged in */}
        {/* {!user && (
          <section className="mb-16">
            <CreateAccountCTA />
          </section>
        )} */}

        {/* Coming Soon Section */}
        {comingSoonGames.length > 0 && (
          <section className="mb-16">
            <SectionHeader title="Coming Soon" viewAllLink="/coming-soon" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {comingSoonGames.map((game) => (
                <ProductCard key={game.id} product={game} />
              ))}
            </div>
          </section>
        )}

        {/* Membership CTAs - Only show if user is not a member */}
        {!user?.isPatreon && (
          <section className="mb-16">
            <MembershipCTA
              title="Join Patreon - Get Exclusive Games Monthly"
              description="Support my work and get amazing benefits that you won't find anywhere else!"
              benefits={[
                "1 new game + all expansions every month ($5/mo)",
                "Early access to all new releases",
                "Exclusive behind-the-scenes content",
                "Vote on upcoming game themes and mechanics",
                "Special Discord role and community access",
              ]}
              image={patreonImg}
              ctaText="Join Patreon ($5/mo)"
              ctaLink="https://patreon.com/yourpage"
              secondaryCtaText="Learn More"
              secondaryCtaLink="/patreon-benefits"
            />
          </section>
        )}

        {/* Latest Blog Posts - Now using the BlogSection component */}
        <BlogSection />
        {/* disabled-feature */}
        {/* {!user?.isSubstack && (
          <section className="mb-16">
            <MembershipCTA
              title="Subscribe to Deno Press - Free Weekly Newsletter"
              description="Join our community and get exclusive content delivered to your inbox!"
              benefits={[
                "Weekly game design insights and tips",
                "Free mini-expansions for your favorite games",
                "Early access to beta testing opportunities",
                "Exclusive discount codes and giveaways",
                "Behind-the-scenes looks at upcoming projects",
              ]}
              image={substackImg}
              ctaText="Subscribe (Free)"
              ctaLink="https://substack.com/yourpage"
              secondaryCtaText="Read Sample Newsletter"
              secondaryCtaLink="/sample-newsletter"
            />
          </section>
        )} */}

        {/* Popular Categories */}
        <section className="mb-16">
          <SectionHeader title="Browse By Category" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <CategoryCard
              title="Games"
              description="Discover our collection of unique and engaging games"
              icon={Dice6}
              href="/shop?category=game"
            />

            <CategoryCard
              title="Expansions"
              description="Enhance your games with exciting new content and mechanics"
              icon={Gift}
              href="/shop?category=expansion"
            />

            <CategoryCard
              title="Add-ons"
              description="Check out our exclusive add-ons that you can craft with your collectibles"
              icon={Package}
              href="/shop?category=add-on"
            />
          </div>
        </section>
      </div>
    </div>
  );
});

export default HomePage;
