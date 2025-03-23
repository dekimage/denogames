import {
  Swords,
  Castle,
  HeartHandshake,
  PartyPopper,
  WalletCards,
  Dice4,
  Puzzle,
  Box,
  ArrowDownUp,
  Pencil,
  User,
  Users,
} from "lucide-react";

// Centralized list of game mechanics used across the application
export const GAME_MECHANICS = [
  { id: "competitive", name: "Competitive", icon: Swords },
  { id: "engine-builder", name: "Engine Building", icon: Castle },
  { id: "co-op", name: "Co-op", icon: HeartHandshake },
  { id: "party", name: "Party", icon: PartyPopper },
  { id: "deck-building", name: "Deck-building", icon: WalletCards },
  { id: "push-your-luck", name: "Push Your Luck", icon: ArrowDownUp },
  { id: "roll-and-write", name: "Roll and Write", icon: Pencil },
  { id: "resource-management", name: "Resource Management", icon: Box },
  { id: "set-collection", name: "Set Collection", icon: Castle },
  { id: "area-control", name: "Area Control", icon: Swords },
  { id: "card-drafting", name: "Card Drafting", icon: WalletCards },
  { id: "worker-placement", name: "Worker Placement", icon: User },
  { id: "dice-rolling", name: "Dice Rolling", icon: Dice4 },
  { id: "hand-management", name: "Hand Management", icon: WalletCards },
  { id: "pattern-building", name: "Pattern Building", icon: Puzzle },
];

export const PLAYER_MODES = [
  {
    id: "solo",
    name: "Solo Games",
    description: "Games playable by one person",
    icon: User,
  },
  {
    id: "duel",
    name: "Duel Games",
    description: "Games for exactly two players",
    icon: Swords,
  },
  {
    id: "group",
    name: "Group Games",
    description: "Games for small groups (3-6 players)",
    icon: Users,
  },
  {
    id: "multiplayer",
    name: "Mass Multiplayer",
    description: "Games supporting large groups (7-99 players)",
    icon: PartyPopper,
  },
];

export const DIFFICULTY_OPTIONS = ["easy", "medium", "hard"];
export const TYPE_OPTIONS = ["game", "expansion", "add-on"];
export const RATING_OPTIONS = [1, 2, 3, 4, 5];
