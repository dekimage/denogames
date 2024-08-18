"use client";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import { useState } from "react";

const ActionCard = observer(
  ({ action, title, description, cta, xp, claimed }) => {
    const [code, setCode] = useState("");
    const { claimXP } = MobxStore;

    const handleClaim = () => {
      claimXP(action, code);
    };

    return (
      <div className="p-4 border rounded-md mb-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <p>{description}</p>
        {!claimed ? (
          <div className="mt-4">
            <a
              href={cta}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              {`Join Now`}
            </a>
            <div className="mt-2">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code here"
                className="p-2 border rounded"
              />
            </div>
            <button
              onClick={handleClaim}
              className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            >
              Claim {xp} XP
            </button>
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

      {/* Purchase History */}
      <h3 className="text-xl font-bold mt-4">Purchase History</h3>
      <table className="min-w-full bg-white border-collapse block md:table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Items</th>
            <th>Amount Paid</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{new Date(order.date).toLocaleDateString()}</td>
              <td>{order.items.map((item) => item.name).join(", ")}</td>
              <td>${order.amountPaid.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Rewards XP Track */}
      <h3 className="text-xl font-bold mt-4">Rewards XP Track</h3>
      <ul>
        {user.rewards?.map((reward, index) => (
          <li key={index}>{reward}</li>
        ))}
      </ul>

      {/* Action Cards */}
      <h3 className="text-xl font-bold mt-4">Earn More XP</h3>
      <div>
        <ActionCard
          action="discord"
          title="Join Discord"
          description="Join our Discord community and enter the code from the welcome channel."
          cta="https://discord.com/invite/your-invite-code"
          xp={10}
          claimed={user.discordJoined}
        />
        <ActionCard
          action="kickstarter"
          title="Back Our Kickstarter"
          description="Back our Kickstarter and enter the unique code you receive."
          cta="https://www.kickstarter.com/projects/your-kickstarter"
          xp={15}
          claimed={user.kickstarterBacked}
        />
        <ActionCard
          action="newsletter"
          title="Sign Up for Newsletter"
          description="Sign up for our newsletter to stay updated."
          xp={5}
          claimed={user.newsletterSignedUp}
        />
      </div>
    </div>
  );
});

export default ProfilePage;
