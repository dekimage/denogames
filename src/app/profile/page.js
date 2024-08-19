"use client";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FlagTriangleRight, Repeat2 } from "lucide-react";

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
  }) => {
    const [code, setCode] = useState("");
    const { claimXP } = MobxStore;

    const handleClaim = () => {
      claimXP(action, code);
    };

    return (
      <div className="p-4 border rounded-md mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xl font-bold">{title}</div>
          {isOnetime ? (
            <Badge variant="outline">
              <FlagTriangleRight size={14} /> One-time
            </Badge>
          ) : (
            <Badge variant="outline">
              <Repeat2 size={14} className="mr-1" /> Repeatable
            </Badge>
          )}
        </div>

        <p>{description}</p>

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
                <Button className="cursor-auto bg-yellow-200 hover:bg-yellow-200">
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
    );
  }
);

const ProfilePage = observer(() => {
  const { user, orders } = MobxStore;

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold">Profile</h2>

      {/* User Info */}
      <div className="my-4">
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>

      {/* User Stats */}
      <div className="my-4">
        <p>
          <strong>Total Downloads:</strong> {user.totalDownloads}
        </p>
      </div>

      {/* Rewards XP Track */}

      <div className="text-2xl font-bold mt-4">Rewards XP Track</div>
      <ul>
        {user.rewards?.map((reward, index) => (
          <li key={index}>{reward}</li>
        ))}
      </ul>

      {/* Action Cards */}
      <div className="text-2xl font-bold mt-4">How to Earn XP?</div>
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
        />
        <ActionCard
          isOnetime
          hasInput
          action="newsletter"
          title="Join Newsletter"
          description="Join the newsletter and enter the code from the welcome email."
          xp={15}
          claimed={user.newsletterSignedUp}
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
        />
      </div>
    </div>
  );
});

export default ProfilePage;
