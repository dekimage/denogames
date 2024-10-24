"use client";

import { useState } from "react";

import GamesTable from "./components/GamesTable";
import GameDetails from "./components/GameDetails";

// Dummy data for games
const gamesData = [
  {
    id: 1,
    image: "/placeholder.svg",
    name: "Cosmic Conquest",
    type: "game",
    soldCopies: 5000,
    totalSales: 120000,
    channel: "kickstarter",
    downloads: 12492,
    popularity: 3,
    averageRating: 4.3,
    rulebookDownloads: 902,
    releaseDate: "2024-10-12",
    channelSales: [
      { channel: "Kickstarter", sales: 715, percentage: 39 },
      { channel: "Direct", sales: 305, percentage: 21 },
      { channel: "Bundle", sales: 290, percentage: 28 },
    ],
    expansions: [
      {
        id: 1,
        image: "/placeholder.svg",
        name: "Galactic Frontiers",
        sales: 2000,
        percentage: 40,
      },
      {
        id: 2,
        image: "/placeholder.svg",
        name: "Alien Alliances",
        sales: 1500,
        percentage: 30,
      },
    ],
    reviews: [
      {
        customer: "John D.",
        rating: 5,
        message: "Amazing game! Highly recommended.",
      },
      {
        customer: "Sarah M.",
        rating: 4,
        message: "Great fun, but a bit complex for beginners.",
      },
    ],
  },
  {
    id: 2,
    image: "/placeholder.svg",
    name: "Mystic Meadows",
    type: "game",
    soldCopies: 3200,
    totalSales: 82000,
    channel: "shop",
    downloads: 9980,
    popularity: 4,
    averageRating: 4.6,
    rulebookDownloads: 650,
    releaseDate: "2023-07-20",
    channelSales: [
      { channel: "Shop", sales: 1800, percentage: 56 },
      { channel: "Kickstarter", sales: 950, percentage: 30 },
      { channel: "Bundle", sales: 450, percentage: 14 },
    ],
    expansions: [
      {
        id: 1,
        image: "/placeholder.svg",
        name: "Forest Creatures",
        sales: 1100,
        percentage: 34,
      },
      {
        id: 2,
        image: "/placeholder.svg",
        name: "Magical Relics",
        sales: 800,
        percentage: 25,
      },
    ],
    reviews: [
      {
        customer: "Emily R.",
        rating: 5,
        message: "Such a beautiful game! The artwork is stunning.",
      },
      {
        customer: "Michael B.",
        rating: 4,
        message:
          "A fun game, but the expansions really add the most excitement.",
      },
    ],
  },
  {
    id: 3,
    image: "/placeholder.svg",
    name: "Dungeon Delvers",
    type: "game",
    soldCopies: 4100,
    totalSales: 102500,
    channel: "bundle",
    downloads: 11200,
    popularity: 5,
    averageRating: 4.8,
    rulebookDownloads: 750,
    releaseDate: "2022-11-10",
    channelSales: [
      { channel: "Bundle", sales: 2100, percentage: 51 },
      { channel: "Direct", sales: 1300, percentage: 32 },
      { channel: "Kickstarter", sales: 700, percentage: 17 },
    ],
    expansions: [
      {
        id: 1,
        image: "/placeholder.svg",
        name: "Cavern of Shadows",
        sales: 1600,
        percentage: 39,
      },
      {
        id: 2,
        image: "/placeholder.svg",
        name: "Crypt Keepers",
        sales: 1300,
        percentage: 32,
      },
    ],
    reviews: [
      {
        customer: "David G.",
        rating: 5,
        message: "One of the best dungeon crawlers I’ve played!",
      },
      {
        customer: "Laura T.",
        rating: 4,
        message: "Very engaging game but takes a while to set up.",
      },
    ],
  },
];

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState(null);

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  const handleNextGame = () => {
    const currentIndex = gamesData.findIndex(
      (game) => game.id === selectedGame.id
    );
    const nextIndex = (currentIndex + 1) % gamesData.length;
    setSelectedGame(gamesData[nextIndex]);
  };

  const handlePreviousGame = () => {
    const currentIndex = gamesData.findIndex(
      (game) => game.id === selectedGame.id
    );
    const previousIndex =
      (currentIndex - 1 + gamesData.length) % gamesData.length;
    setSelectedGame(gamesData[previousIndex]);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Games</h1>
      <GamesTable games={gamesData} onGameClick={handleGameClick} />
      {selectedGame && (
        <GameDetails
          game={selectedGame}
          onNextGame={handleNextGame}
          onPreviousGame={handlePreviousGame}
        />
      )}
    </div>
  );
}
