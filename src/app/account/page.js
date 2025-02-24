"use client";

import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  GamepadIcon,
  Package,
  Trophy,
  Calendar,
  Star,
  ShoppingCart,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { MembershipCard } from "@/components/membership-card";
import avatarImg from "@/assets/01.png";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const StatCard = ({
  icon: Icon,
  label,
  value,
  total,
  href,
  subLabel,
  showProgress = true,
}) => (
  <Link href={href}>
    <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">{label}</h3>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">
              {showProgress ? `${value}/${total}` : value}
            </span>
            {subLabel && (
              <span className="text-sm text-muted-foreground mb-1">
                {subLabel}
              </span>
            )}
          </div>
          {showProgress && (
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{
                  width: `${Math.min((value / total) * 100, 100)}%`,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  </Link>
);

const AccountOverview = observer(() => {
  const { user, products } = MobxStore;

  function calculateLevel(xp, xpPerLevel = 10) {
    if (xp < 0) return 1; // Ensure level 1 for any negative XP input
    return Math.floor(xp / xpPerLevel) + 1;
  }

  const lvl = calculateLevel(user.xp);

  // Calculate statistics
  const totalGames = products.filter((p) => p.type === "game").length;
  const totalExpansions = products.filter((p) => p.type === "expansion").length;
  const ownedGames = products.filter(
    (p) => p.type === "game" && user.purchasedProducts?.includes(p.id)
  ).length;
  const ownedExpansions = products.filter(
    (p) => p.type === "expansion" && user.purchasedProducts?.includes(p.id)
  ).length;

  // Calculate reviews stats
  const purchasedProducts = products.filter((product) =>
    user.purchasedProducts?.includes(product.id)
  );
  const reviewedProductIds = new Set(
    user.reviews?.map((review) => review.productId) || []
  );
  const availableToReview = purchasedProducts.filter(
    (product) => !reviewedProductIds.has(product.id)
  ).length;

  // Format the join date
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Welcome back, {user.username}!</h1>

      {/* User Info */}
      <div className="box-inner  max-w-[400px]">
        <div className="box-broken my-4 border p-8">
          <div className="flex flex-col items-center justify-center gap-2">
            <Image
              src={avatarImg}
              alt={user.username}
              width={100}
              height={100}
              className="h-16 w-16 sm:h-32 sm:w-32 object-cover rounded-full"
            />
            <div className="text-xl font-bold capitalize">{user.username}</div>
            <p>{user.email}</p>
            <div>Level {lvl}</div>

            <Button variant="reverse">Edit Profile</Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={GamepadIcon}
          label="Games Owned"
          value={ownedGames}
          total={totalGames}
          href="/account/my-games"
        />
        <StatCard
          icon={Package}
          label="Expansions"
          value={ownedExpansions}
          total={totalExpansions}
          href="/account/my-games"
        />
        <StatCard
          icon={Trophy}
          label="Deno Points"
          value={user.xp || 0}
          total={100}
          href="/account/rewards"
        />
        <StatCard
          icon={Trophy}
          label="Achievements"
          value={user.achievements?.length || 0}
          total={100}
          href="/account/achievements"
        />
        <StatCard
          icon={Star}
          label="Reviews"
          value={user.reviews?.length || 0}
          showProgress={false}
          subLabel={`${availableToReview} games available to review`}
          href="/account/my-reviews"
        />
        <StatCard
          icon={ShoppingCart}
          label="Orders"
          value={user.orders?.length || 0}
          showProgress={false}
          href="/account/my-orders"
        />
      </div>

      {/* Membership Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MembershipCard
          title={
            user.tags?.isActivePatreon
              ? "Thank you for being a Patron!"
              : "Patreon Member"
          }
          description={
            user.tags?.isActivePatreon
              ? "I am forever thankful for your support, you are the reason I make games everyday."
              : "Become a Patreon supporter for 5$/mo and get a new game every month (cheaper than via shop) + get all future Kickstarters for just 1$ as a special member."
          }
          image="/path/to/patreon-image.jpg"
          xpAmount={20}
          isRecurring={true}
          isActive={user.tags?.isActivePatreon}
          ctaText="Become Patreon"
          ctaLink="https://patreon.com/yourpage"
          ctaTarget="_blank"
        />

        <MembershipCard
          title={
            user.tags?.isActiveSubstack
              ? "Thank you for reading Deno Press"
              : "Subscribe to Deno Press"
          }
          description={
            user.tags?.isActiveSubstack
              ? "You can find all posts in our archive. Check out our top posts below!"
              : "Join our amazing 150 members reading 1 email/week. Get game reviews, behind-the-scenes content, and exclusive rewards!"
          }
          image="/path/to/substack-image.jpg"
          xpAmount={15}
          isRecurring={true}
          isActive={user.tags?.isActiveSubstack}
          ctaText="Join (Free)"
          ctaLink="https://substack.com/yourpage"
          ctaTarget="_blank"
          links={
            user.tags?.isActiveSubstack
              ? [
                  { text: "Archive", href: "/archive" },
                  { text: "Top Post 1", href: "/post-1" },
                  { text: "Top Post 2", href: "/post-2" },
                ]
              : []
          }
        />

        <MembershipCard
          title={
            user.tags?.isActiveDiscord
              ? "Thank you for being a Discord Member"
              : "Join our Discord"
          }
          description={
            user.tags?.isActiveDiscord
              ? "You're part of an amazing community. Keep sharing and collaborating!"
              : "Join our lovely community where we discuss game mechanics, collaborate on projects, find playtest buddies, and share scores."
          }
          image="/path/to/discord-image.jpg"
          xpAmount={10}
          isRecurring={false}
          isActive={user.tags?.isActiveDiscord}
          ctaText="Join Discord"
          ctaLink="https://discord.gg/yourserver"
          ctaTarget="_blank"
        />

        <MembershipCard
          title="Monster Mixology on Kickstarter"
          description={
            user.tags?.backedMonsterMixology
              ? "Thank you for backing Monster Mixology! Your support means everything."
              : "Back our latest game on Kickstarter and get exclusive rewards!"
          }
          image="/path/to/kickstarter-image.jpg"
          xpAmount={25}
          isRecurring={false}
          isActive={user.tags?.backedMonsterMixology}
          ctaText={
            user.tags?.backedMonsterMixology ? "Go to Game" : "Back it Now"
          }
          ctaLink={
            user.tags?.backedMonsterMixology
              ? "/games/monster-mixology"
              : "https://kickstarter.com/projects/yourgame"
          }
          ctaTarget="_blank"
        />
      </div>

      {/* Account Details */}
      <Card className="mt-6">
        <CardHeader>
          <h3 className="text-xl font-semibold">Account Details</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Username</label>
            <p className="font-medium">{user.username}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Member Since</label>
            <p className="font-medium">{memberSince}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

export default AccountOverview;
