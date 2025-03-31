"use client";

import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import { Card } from "@/components/ui/card";
import {
  GamepadIcon,
  Package,
  Trophy,
  Star,
  ShoppingCart,
  ChevronRight,
  Sparkle,
  FlagTriangleRight,
  Repeat2,
} from "lucide-react";
import Link from "next/link";
import { MembershipCard } from "@/components/membership-card";
import { UserProfile } from "@/components/UserProfile";
import { LoadingSpinner } from "@/reusable-ui/LoadingSpinner";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Mimage } from "@/components/Mimage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

const AccountPage = observer(() => {
  const { user, products, loading, achievements } = MobxStore;

  // Calculate statistics
  const totalGames = products.filter((p) => p.type === "game").length;
  const totalExpansions = products.filter((p) => p.type === "expansion").length;
  const totalAddons = products.filter((p) => p.type === "add-on").length;
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
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold my-6 font-strike">Account</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* User Profile */}
          <div className="flex justify-center items-center">
            <UserProfile user={user} />
          </div>

          <div className="md:col-span-2">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
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
                icon={Sparkle}
                label="Add-ons"
                value={user.unlockedRewards?.length || 0}
                total={totalAddons}
                href="/account/rewards"
              />
              <StatCard
                icon={Trophy}
                label="Collectibles"
                value={user.achievements?.length || 0}
                total={achievements.length}
                href="/account/my-collection"
              />
              <StatCard
                icon={ShoppingCart}
                label="Orders"
                value={user.orders?.length || 0}
                showProgress={false}
                href="/account/my-orders"
              />
              <StatCard
                icon={Star}
                label="Reviews"
                value={user.reviews?.length || 0}
                showProgress={false}
                subLabel={`${availableToReview} games available to review`}
                href="/account/my-reviews"
              />
            </div>

            {/* Membership Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* <MembershipCard
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
              /> */}
              {/* disabled-feature */}
              {/* <MembershipCard
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
              /> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default AccountPage;
