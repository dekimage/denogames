"use client";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  CheckCheck,
  CheckCircle,
  ChevronRight,
  ShoppingBag,
  ShoppingCart,
  Calendar,
  BookOpen,
  Gift,
  Star,
  Users,
  Mail,
  Dice6,
  Package,
} from "lucide-react";
import placeholderImg from "@/assets/placeholder.png";
import FeaturedGamesSlider from "@/components/FeaturedGameSlider";
import { LoadingSpinner } from "@/reusable-ui/LoadingSpinner";
import patreonImg from "@/assets/patreon-logo.png"; // You'll need to add these images
import substackImg from "@/assets/substack-logo.png"; // You'll need to add these images

// Reusable Product Card component
export const ProductCard = observer(({ product, isSmall = false }) => {
  const { addToCart, cart, user } = MobxStore;

  const isInCart = cart.includes(product.id);
  const isPurchased = user
    ? user.purchasedProducts?.includes(product.id)
    : false;

  const getTypeLabel = (type) => {
    switch (type) {
      case "expansion":
        return "Expansion";
      case "bundle":
        return "Bundle";
      default:
        return "Game";
    }
  };

  return (
    <div
      className={`relative border rounded-lg shadow-sm bg-card text-card-foreground hover:shadow-md transition-all ${
        isSmall ? "w-[220px]" : ""
      } overflow-hidden`}
    >
      {isPurchased && (
        <div className="absolute top-2 right-2 z-10 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full px-2 py-1 text-xs flex items-center">
          <CheckCircle size={12} className="mr-1" /> Owned
        </div>
      )}
      <div>
        <Link
          href={`/product-details/${product.slug}`}
          className={`flex justify-center items-center flex-col ${
            isSmall ? "p-2" : "p-4"
          }`}
        >
          <Image
            src={product.thumbnail || placeholderImg}
            alt={product.name}
            width={isSmall ? 300 : 300}
            height={isSmall ? 300 : 300}
            className={isSmall ? "w-28 h-28" : "w-54 h-54"}
          />
          <div className={`flex flex-col w-full ${isSmall ? "pt-2" : "pt-4"}`}>
            <div className="w-full">
              <div
                className={`${
                  isSmall ? "mt-2 text-lg" : "mt-4 text-xl"
                } font-strike`}
              >
                {product.name}
              </div>
              <div className="flex items-center mt-1">
                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                  {getTypeLabel(product.type)}
                </span>
              </div>
              <p
                className={`${
                  isSmall ? "mt-2 text-sm" : "mt-4 text-xl"
                } font-bold text-foreground`}
              >
                ${product.price}
              </p>
            </div>
          </div>
        </Link>
        <div className={isSmall ? "p-2 pt-0" : "p-4 pt-0"}>
          {isPurchased ? (
            <Link href={`/product-details/${product.slug}`} className="w-full">
              <Button
                variant="secondary"
                className="w-full bg-black hover:bg-black/80 text-white"
              >
                PLAY
              </Button>
            </Link>
          ) : isInCart ? (
            <div className="flex items-center">
              <Link href="/cart" className="w-full">
                <Button variant="secondary" className="w-full">
                  <ShoppingBag size={16} className="mr-1" /> CHECKOUT
                </Button>
              </Link>
              {isInCart && (
                <div
                  className={`flex justify-center items-center w-[120px] ${
                    isSmall ? "ml-2" : "ml-4"
                  }`}
                >
                  <CheckCheck
                    className="text-orange-500 dark:text-orange-400 mr-2"
                    size={20}
                  />
                  <span className="text-orange-500 dark:text-orange-400">
                    IN CART
                  </span>
                </div>
              )}
            </div>
          ) : (
            <Button onClick={() => addToCart(product.id)} className="w-full">
              <ShoppingCart size={16} className="mr-1" /> ADD TO CART
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});

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

// Blog Card Component
const BlogCard = ({ blog }) => (
  <div className="border rounded-lg shadow-sm overflow-hidden bg-card text-card-foreground hover:shadow-md transition-shadow">
    <Link href={`/blog/${blog.slug}`}>
      <div className="relative h-40 w-full">
        <Image
          src={blog.thumbnail || placeholderImg}
          alt={blog.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center text-xs text-muted-foreground mb-2">
          <Calendar size={14} className="mr-1" />
          {new Date(blog.date).toLocaleDateString()}
        </div>
        <h3 className="font-strike text-lg mb-2 line-clamp-2">{blog.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {blog.excerpt}
        </p>
      </div>
    </Link>
  </div>
);

// Category Card Component
const CategoryCard = ({ title, description, icon: Icon, href }) => {
  return (
    <Link href={href}>
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

const HomePage = observer(() => {
  const { products, loading, cart, user } = MobxStore;

  if (loading) {
    return <LoadingSpinner />;
  }

  // Filter products by type and other criteria
  const games = products.filter((product) => product.type === "game");
  const expansions = products.filter((product) => product.type === "expansion");

  // Sort by date to get newest games (assuming there's a dateReleased field)
  // If no dateReleased field, we'll need to add it to the products
  const newestGames = [...products]
    .filter((product) => product.type === "game")
    .sort((a, b) => {
      const dateA = a.dateReleased ? new Date(a.dateReleased) : new Date(0);
      const dateB = b.dateReleased ? new Date(b.dateReleased) : new Date(0);
      return dateB - dateA;
    })
    .slice(0, 4); // Get the 4 newest games

  // Coming soon games (games with future release dates)
  const comingSoonGames = [...products]
    .filter((product) => {
      if (!product.dateReleased) return false;
      return new Date(product.dateReleased) > new Date();
    })
    .slice(0, 4);

  // Products ready to add to cart (not in cart and not purchased)
  const readyToAddToCart = products.filter(
    (product) =>
      !cart.includes(product.id) &&
      !(user ? user.purchasedProducts?.includes(product.id) : false)
  );

  // Mock blog posts (replace with actual data when available)
  const blogPosts = [
    {
      id: 1,
      title: "The Art of Game Design: Creating Engaging Mechanics",
      excerpt:
        "Discover the principles behind creating game mechanics that keep players coming back for more.",
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fgame1%2Fimage1.png?alt=media",
      date: "2023-10-15",
      slug: "art-of-game-design",
    },
    {
      id: 2,
      title: "Behind the Scenes: The Making of Monster Mixology",
      excerpt:
        "Take a peek behind the curtain and see how our latest game came to life from concept to final product.",
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fgame1%2Fimage2.png?alt=media",
      date: "2023-09-28",
      slug: "making-of-monster-mixology",
    },
    {
      id: 3,
      title: "Game Night Strategies: How to Host the Perfect Session",
      excerpt:
        "Tips and tricks for hosting an unforgettable game night with friends and family.",
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fgame1%2Fthumbnail.png?alt=media",
      date: "2023-09-10",
      slug: "game-night-strategies",
    },
  ];

  // Featured games for the slider
  const featuredGames = [
    {
      title: "Monster Mixology",
      description:
        "Mix potions, cast spells, and become the ultimate monster mixologist!",
      imgUrl:
        "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fgame1%2Fimage1.png?alt=media",
      button: "Play Now",
      link: "/product-details/monster-mixology",
      index: 1,
    },
    {
      title: "Mystic Quest",
      description:
        "Embark on an epic journey through mystical lands and ancient ruins.",
      imgUrl:
        "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fgame1%2Fimage2.png?alt=media",
      button: "Explore",
      link: "/product-details/mystic-quest",
      index: 2,
    },
    {
      title: "Galactic Conquest",
      description: "Conquer the galaxy and build your interstellar empire!",
      imgUrl:
        "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fgame1%2Fthumbnail.png?alt=media",
      button: "Launch",
      link: "/product-details/galactic-conquest",
      index: 3,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <FeaturedGamesSlider games={featuredGames} />

      <div className="container mx-auto py-8 px-4">
        {/* Newest Games Section */}
        <section className="mb-16">
          <SectionHeader
            title="Newest Games"
            viewAllLink="/shop"
            viewAllText="Shop All"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newestGames.map((game) => (
              <ProductCard key={game.id} product={game} />
            ))}
          </div>
        </section>

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

        {/* Latest Blog Posts */}
        <section className="mb-16">
          <SectionHeader
            title="Latest Blog Posts"
            viewAllLink="/blog"
            viewAllText="See All Posts"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} blog={post} />
            ))}
          </div>
        </section>

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

        {!user?.isSubstack && (
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
        )}

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
              title="Bundles"
              description="Get more value with our carefully curated game bundles"
              icon={Package}
              href="/shop?category=bundle"
            />
          </div>
        </section>

        {/* Community Section */}
        <section className="mb-16">
          <SectionHeader title="Join Our Community" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CommunityCard
              title="Discord Community"
              description="Join our Discord server to connect with other players, find game groups, share strategies, and get help with rules."
              icon={Users}
              ctaText="Join Discord"
              ctaLink="https://discord.gg/yourserver"
            />

            <CommunityCard
              title="Stay Updated"
              description="Subscribe to our email newsletter for game announcements, special offers, and exclusive content."
              icon={Mail}
              ctaText="Subscribe"
              ctaLink="/newsletter"
            />
          </div>
        </section>
      </div>
    </div>
  );
});

export default HomePage;
