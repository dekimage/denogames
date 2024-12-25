"use client";
import { Button } from "@/components/ui/button";
import MobxStore from "@/mobx";
import { observer } from "mobx-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

const dummyGames = [
  {
    name: "Fantasy Adventures",
    description: "An epic adventure game with treasures and relics.",
    isActive: true,
    createdAt: new Date(),
    cards: Array.from({ length: 15 }, (_, i) => ({
      name: `Treasure ${i + 1}`,
      type: "treasure",
      subtype: i % 2 === 0 ? "golden" : "silver",
      rarity: i % 3 === 0 ? "rare" : "common",
      description: `This is treasure number ${i + 1}.`,
      imageUrl: `https://picsum.photos/200`,
      isSmart: i % 2 === 0,
      actions: i % 2 === 0 ? ["draw_common_treasure"] : [],
    })),
    expansions: [
      {
        name: "Halloween Expansion",
        isActive: true,
        cards: ["treasure_1", "treasure_3", "treasure_5"], // Optional
      },
      {
        name: "Winter Expansion",
        isActive: true,
        cards: ["treasure_2", "treasure_4", "treasure_6"], // Optional
      },
    ],
  },
  {
    name: "Pirate’s Cove",
    description: "A swashbuckling pirate adventure game.",
    isActive: true,
    createdAt: new Date(),
    cards: Array.from({ length: 15 }, (_, i) => ({
      name: `Pirate Card ${i + 1}`,
      type: "quest",
      subtype: i % 2 === 0 ? "epic" : "legendary",
      rarity: i % 3 === 0 ? "rare" : "common",
      description: `This is pirate card number ${i + 1}.`,
      imageUrl: `https://picsum.photos/200`,
      isSmart: i % 2 === 0,
      actions: i % 2 === 0 ? ["draw_epic_quest"] : [],
    })),
    expansions: [
      {
        name: "Sea Monster Expansion",
        isActive: true,
        cards: ["pirate_1", "pirate_3", "pirate_5"], // Optional
      },
      {
        name: "Treasure Hunt Expansion",
        isActive: true,
        cards: ["pirate_2", "pirate_4", "pirate_6"], // Optional
      },
    ],
  },
  {
    name: "Space Explorers",
    description: "A sci-fi exploration and conquest game.",
    isActive: true,
    createdAt: new Date(),
    cards: Array.from({ length: 15 }, (_, i) => ({
      name: `Alien Artifact ${i + 1}`,
      type: "artifact",
      subtype: i % 2 === 0 ? "ancient" : "modern",
      rarity: i % 3 === 0 ? "rare" : "common",
      description: `This is alien artifact number ${i + 1}.`,
      imageUrl: `https://picsum.photos/200`,
      isSmart: i % 2 === 0,
      actions: i % 2 === 0 ? ["draw_rare_artifact"] : [],
    })),
    expansions: [
      {
        name: "Galactic War Expansion",
        isActive: true,
        cards: ["artifact_1", "artifact_3", "artifact_5"], // Optional
      },
      {
        name: "Lost Civilization Expansion",
        isActive: true,
        cards: ["artifact_2", "artifact_4", "artifact_6"], // Optional
      },
    ],
  },
];

const updatedDummyGames = [
  {
    name: "Fantasy Adventures",
    description: "An epic adventure game with treasures and relics.",
    slug: "fantasy-adventures",
    types: {
      relics: { name: "Relics", imageUrl: "https://picsum.photos/200" },
      treasures: {
        name: "Treasures",
        imageUrl: "https://picsum.photos/200",
      },
    },
    methodsConfig: [
      {
        type: "relics",
        name: "Discover Relic",
        method: "discover_relic",
        imageUrl: "https://picsum.photos/200",
      },
      {
        type: "relics",
        name: "Random Relic",
        method: "random_relic",
        imageUrl: "https://picsum.photos/200",
      },
      {
        type: "treasures",
        name: "Draw Epic Treasure",
        method: "draw_epic_treasure",
        imageUrl: "https://picsum.photos/200",
      },
      {
        type: "treasures",
        name: "Random Treasure",
        method: "random_treasure",
        imageUrl: "https://picsum.photos/200",
      },
    ],
  },
  {
    name: "Pirate’s Cove",
    description: "A swashbuckling pirate adventure game.",
    slug: "pirates-cove",
    types: {
      quests: { name: "Quests", imageUrl: "https://picsum.photos/200" },
      treasures: {
        name: "Treasures",
        imageUrl: "https://picsum.photos/200",
      },
    },
    methodsConfig: [
      {
        type: "quests",
        name: "Epic Quest",
        method: "epic_quest",
        imageUrl: "https://picsum.photos/200",
      },
      {
        type: "quests",
        name: "Random Quest",
        method: "random_quest",
        imageUrl: "https://picsum.photos/200",
      },
      {
        type: "treasures",
        name: "Treasure Hunt",
        method: "treasure_hunt",
        imageUrl: "https://picsum.photos/200",
      },
      {
        type: "treasures",
        name: "Hidden Treasure",
        method: "hidden_treasure",
        imageUrl: "https://picsum.photos/200",
      },
    ],
  },
  {
    name: "Space Explorers",
    description: "A sci-fi exploration and conquest game.",
    slug: "space-explorers",
    types: {
      artifacts: {
        name: "Artifacts",
        imageUrl: "https://picsum.photos/200",
      },
      missions: {
        name: "Missions",
        imageUrl: "https://picsum.photos/200",
      },
    },
    methodsConfig: [
      {
        type: "artifacts",
        name: "Ancient Artifact",
        method: "ancient_artifact",
        imageUrl: "https://picsum.photos/200",
      },
      {
        type: "artifacts",
        name: "Random Artifact",
        method: "random_artifact",
        imageUrl: "https://picsum.photos/200",
      },
      {
        type: "missions",
        name: "Explore Mission",
        method: "explore_mission",
        imageUrl: "https://picsum.photos/200",
      },
      {
        type: "missions",
        name: "Complete Mission",
        method: "complete_mission",
        imageUrl: "https://picsum.photos/200",
      },
    ],
  },
];

const GameList = observer(({ games }) => {
  return (
    <div className="flex flex-col gap-6 p-4">
      {games.map((game, i) => (
        <Link href={`/app/${game.slug}`} key={game.slug}>
          <div
            key={game.id}
            className="border border-gray-300 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition"
          >
            <h2 className="text-2xl font-strike uppercase mb-2">{game.name}</h2>
            <p className="text-gray-700 mb-4">{game.description}</p>
            {game.imageUrl && (
              <Image
                src={game.imageUrl}
                alt={game.name}
                className="w-24 h-24 object-cover rounded-md"
                width={200}
                height={200}
              />
            )}
          </div>
        </Link>
      ))}
    </div>
  );
});
const AppPage = observer(() => {
  return (
    <div>
      <GameList
        games={[
          {
            name: "Darkmoon Faire",
            description: "A faire rond of magic and mystery.",
            slug: "the-last-faire",
            imageUrl: "/dungeoneers/cover-ai-images/darkmoon.png",
          },
        ]}
      />
    </div>
  );
});

export default AppPage;
