"use client";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FlagTriangleRight, Repeat2, Lock, CheckCircle } from "lucide-react";

import avatarImg from "@/assets/01.png";
import Image from "next/image";
import { Mimage } from "@/components/Mimage";

const ActionCard = observer(
  ({
    action,
    title,
    description,
    cta,
    xp,
    claimed,
    hasInput = false,
    isOnetime = false,
    unavailable = false,
    muhar = false,
  }) => {
    const [code, setCode] = useState("");
    const { claimXP } = MobxStore;

    const handleClaim = () => {
      claimXP(action, code);
    };

    return (
      <div className="box-inner">
        <div className="p-6 mb-4 box-broken">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xl uppercase">{title}</div>
            {isOnetime ? (
              <Badge variant="outline">
                <FlagTriangleRight size={14} /> One-time
              </Badge>
            ) : (
              <Badge variant="outline">
                <Repeat2 size={14} className="mr-1 " /> Repeatable
              </Badge>
            )}
          </div>

          <p>{description}</p>
          <div className="w-full flex justify-center items-center">
            {muhar && <Mimage muhar={muhar} width={200} height={200} />}
          </div>
          {!claimed ? (
            <div className="mt-4">
              {hasInput && (
                <a
                  href={cta}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  {unavailable ? "Unavilable Now" : "Join"}
                </a>
              )}

              {hasInput && (
                <div className="mt-2">
                  <Input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter code here"
                    className="mb-4"
                  />
                </div>
              )}
              <div className="flex">
                <Button className="mr-2 bg-yellow-200 cursor-auto hover:bg-yellow-200">
                  + {xp} XP
                </Button>
                {hasInput ? (
                  <Button className="w-full" onClick={handleClaim}>
                    Claim
                  </Button>
                ) : (
                  <Button className="cursor-auto bg-cream hover:bg-cream">
                    {" "}
                    <Repeat2 size={14} className="mr-1" /> Automatic
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-green-500 mt-4">Obtained</p>
          )}
        </div>
      </div>
    );
  }
);

const XPProgressBar = ({ xp }) => {
  const totalSegments = 10;
  const segmentWidth = 100 / totalSegments; // Percentage width of each segment
  const filledSegments = Math.floor(xp / segmentWidth); // Fully filled segments
  const partialFill = ((xp % segmentWidth) / segmentWidth) * 100; // Partially filled segment

  return (
    <div className="relative w-full h-10">
      {/* XP segments */}
      <div className="flex w-full h-full overflow-x-scroll overflow-y-hidden scrollbar-hide font-strike mt-8 lg:mt-2">
        {Array.from({ length: totalSegments }, (_, index) => (
          <div
            key={index}
            className={`relative flex-1 h-[40px] mx-[2px] justify-center items-center text-2xl ${
              index < filledSegments
                ? "bg-gradient-to-r from-primary to-orange-400"
                : "bg-gray-200"
            } `}
            style={{
              clipPath: "polygon(12% 0, 100% 0, 88% 100%, 0 100%)",
            }}
          >
            {index === filledSegments ? (
              <div className="flex justify-center items-center px-8 py-1 relative">
                <div className="z-10">
                  {(index + 1) * 10}
                  <span className="text-xs">XP</span>
                </div>
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-orange-400"
                  style={{ width: `${partialFill}%` }}
                />
              </div>
            ) : (
              <div className="flex justify-center items-center px-8 py-1">
                {(index + 1) * 10}
                <span className="text-xs">XP</span>
              </div>
            )}
          </div>
        ))}
        <div
          className="absolute w-0 h-0 border-l-[10px] border-r-[10px] border-t-[16px] border-t-yellow-400 border-l-transparent border-r-transparent"
          style={{ left: `calc(${xp}% - 10px)`, top: "-24px" }}
        >
          <div
            className="absolute text-xs text-center w-full ml-[-10px]"
            style={{ top: "-30px", transform: "translateX(-50%)" }}
          >
            {xp}xp
          </div>
        </div>
      </div>
    </div>
  );
};

const staticRewards = [
  {
    id: 1,
    requiresLvl: 1,
    title: "Exclusive 4 characters for Island Explorers",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fgame1%2Fthumbnail.png?alt=media",
    belongsToGame: "Island Explorers",
    belongsToProductId: "island-explorers",
    productSlug: "island-explorers",
  },
  {
    id: 2,
    requiresLvl: 2,
    title: "Exclusive 2 events for Big Fish",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fgame1%2Fimage2.png?alt=media",
    belongsToGame: "Island Explorers",
    belongsToProductId: "island-explorers",
    productSlug: "island-explorers",
  },
  {
    id: 3,
    requiresLvl: 3,
    title: "Exclusive 3 locations for Zany shrooms",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fgame1%2Fimage1.png?alt=media",
    belongsToGame: "Island Explorers",
    belongsToProductId: "island-explorers",
    productSlug: "island-explorers",
  },
  {
    id: 4,
    requiresLvl: 4,
    title: "Exclusive 3 locations for Zany shrooms",
    thumbnail:
      "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fgame1%2Fimage1.png?alt=media",
    belongsToGame: "Island Explorers",
    belongsToProductId: "island-explorers",
    productSlug: "island-explorers",
  },
];

const RewardsCard = ({ reward, userLevel, onClaim }) => {
  const isUnlocked = userLevel - 1 >= reward.requiresLvl;
  const isClaimed = reward.isClaimed;

  return (
    <div className="box-inner">
      <div className="box-broken flex justify-between p-4 lg:p-8 mb-4 border h-[160px]">
        <div className="flex items-center h-full">
          <div className="flex flex-col justify-between items-between h-full">
            <div
              className="h-[40px] bg-gradient-to-r from-primary to-orange-400 justify-center items-center text-2xl"
              style={{
                clipPath: "polygon(12% 0, 100% 0, 88% 100%, 0 100%)",
              }}
            >
              <div className="flex justify-center items-center px-8 py-1">
                {reward.requiresLvl * 10}
                <span className="text-xs">XP</span>
              </div>
            </div>
          </div>

          <div className="ml-4 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-lg">{reward.title}</h3>
              <p className="text-sm text-gray-500">{reward.description}</p>
              <div className="flex items-center gap-2 text-sm">
                <div>Related Game:</div>
                <Link
                  href={`/product-details/${reward.productSlug}`}
                  className="text-blue-500 hover:underline text-sm"
                >
                  {reward.belongsToGame}
                </Link>
              </div>
            </div>
            <div>
              {isClaimed ? (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-500" size={24} />
                  <span className="text-green-500 font-semibold">Unlocked</span>
                </div>
              ) : isUnlocked ? (
                <Button onClick={() => onClaim(reward)}>Claim Reward</Button>
              ) : (
                <Button disabled className="bg-black text-white flex gap-2">
                  <Lock size={24} />
                  <span>Locked</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Image
            src={reward.thumbnail}
            alt={reward.title}
            width={128}
            height={128}
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

const RewardsList = ({ rewards, userLevel, onClaimReward }) => {
  return (
    <div className="mt-8">
      {rewards.map((reward) => (
        <RewardsCard
          key={reward.id}
          reward={reward}
          userLevel={userLevel}
          onClaim={onClaimReward}
        />
      ))}
    </div>
  );
};

const ProfilePage = observer(() => {
  const { user } = MobxStore;

  if (!user) {
    return <div>Loading...</div>;
  }

  function calculateLevel(xp, xpPerLevel = 10) {
    if (xp < 0) return 1; // Ensure level 1 for any negative XP input
    return Math.floor(xp / xpPerLevel) + 1;
  }

  const lvl = calculateLevel(user.xp);

  return (
    <div className="container mx-auto p-2 lg:p-8">
      <div className="text-2xl font-strike uppercase mt-4">Profile</div>
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
      <div className="text-2xl font-strike uppercase my-4 mt-12">
        Rewards Track
      </div>

      <XPProgressBar xp={user.xp} />
      <ul>
        {user.rewards?.map((reward, index) => (
          <li key={index}>{reward}</li>
        ))}
      </ul>

      <RewardsList
        rewards={staticRewards}
        userLevel={lvl}
        onClaimReward={() => console.log("Claimed")}
      />
      {/* Action Cards */}
      <div className="text-2xl font-strike uppercase mt-12">
        How to Earn XP?
      </div>
      {/* <div className="w-full sm:w-1/2">
        Rules: You earn XP by doing certain activities:
        <ul>
          <li className="pl-2">● Buy a game: 10 XP</li>
          <li className="pl-2">● Buy an expansion: 5 XP</li>
          <li className="pl-2">● Write a review: 2 XP</li>
          <li className="pl-2">● Join Discord: 20 XP</li>
          <li className="pl-2">● Join Newsletter: 15 XP</li>
          <li className="pl-2">● Back a Kickstarter: 15 XP</li>
        </ul>
      
      </div> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        <ActionCard
          isOnetime
          hasInput
          action="discord"
          title="Join Discord"
          description="Join our Discord community and enter the code from the welcome channel."
          cta="https://discord.com/invite/your-invite-code"
          xp={20}
          claimed={user.discordJoined}
          muhar="discord"
        />
        <ActionCard
          isOnetime
          hasInput
          action="newsletter"
          title="Join Newsletter"
          description="Join the newsletter and enter the code from the welcome email."
          xp={15}
          claimed={user.newsletterSignedUp}
          muhar="mail"
        />
        <ActionCard
          hasInput
          unavailable
          action="kickstarter"
          title="Back a Kickstarter"
          description="Enter the unique code you receive from the Kickstarter Campaign."
          cta="https://www.kickstarter.com/projects/your-kickstarter"
          xp={15}
          claimed={user.kickstarterBacked}
          muhar="kickstarter"
        />

        <ActionCard
          action="game"
          title="Buy a Game"
          description="You will automatically receive 10 XP for each game you purchase."
          xp={10}
          claimed={user.newsletterSignedUp}
        />
        <ActionCard
          action="expansion"
          title="Buy an Expansion"
          description="You will automatically receive 5 XP for each expansion you purchase."
          xp={5}
          claimed={user.newsletterSignedUp}
        />
        <ActionCard
          action="review"
          title="Write a Review"
          description="You will automatically receive 2 XP for each review you write. *You can only write one review per product and you must have purchased the product."
          xp={2}
          claimed={user.newsletterSignedUp}
          muhar="rating"
        />
      </div>
    </div>
  );
});

export default ProfilePage;
