const dummyProduct = {
  neededComponents: [
    { name: "4x Dice (6-sided)", image: "/path/to/dice-image.jpg" },
    {
      name: "4x Pens/Pencils (different color for each player)",
      image: "/path/to/pens-image.jpg",
    },
    {
      name: "8 colored euro-size cubes per player (different color)- Optional (alternative its provided as print and cut tokens for each player in all colors)",
      image: "/path/to/cubes-image.jpg",
    },
  ],
  providedComponents: [
    {
      name: "1x Map (10,000+ print variations)*",
      image: "/path/to/map-image.jpg",
    },
    {
      name: "1x Market Sheet (4000+ combinations)",
      image: "/path/to/market-sheet-image.jpg",
    },
    {
      name: "4x Characters Sheets (2 per A4 paper - cut in half)",
      image: "/path/to/character-sheets-image.jpg",
    },
    {
      name: "Optional (euro cubes as tokens)",
      image: "/path/to/tokens-image.jpg",
    },
    {
      name: "App - Digital deck of 100+ cards included*",
      image: "/path/to/app-image.jpg",
    },
  ],
};

const commonShopFAQs = [
  {
    id: "shop-1",
    question: "How does digital delivery work?",
    answer:
      "After purchase, you'll receive an email with download links for all game materials. You can also access your purchases through your account dashboard.",
  },
  {
    id: "shop-2",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and various local payment methods through our secure payment processor.",
  },
  {
    id: "shop-3",
    question: "Do you offer refunds?",
    answer:
      "Yes, we offer a 30-day satisfaction guarantee. If you're not happy with your purchase, contact us for a full refund.",
  },
  {
    id: "shop-4",
    question: "Can I print multiple copies of the game?",
    answer:
      "Yes! Once you purchase the game, you can print as many copies as you need for personal use.",
  },
];

const monstermixologyData = {
  benefitsData: [
    {
      title: "Endless Replayability",
      description:
        "Enjoy a game with virtually limitless possibilities. Each session generates a unique experience, ensuring no two games are ever the same, keeping the fun fresh and exciting!",
      image: "/placeholder-image-1.jpg",
    },
    {
      title: "Push Your Luck",
      description:
        "Every turn is filled with thrilling decisions and unexpected surprises. Test your bravery, make bold choices, and embrace the excitement of the unknown!",
      image: "/placeholder-image-2.jpg",
    },
    {
      title: "Dynamic A4 Sheets",
      description:
        "Experience gameplay on uniquely generated A4 sheets each time you play. With this dynamic system, every session brings a new set of challenges and opportunities.",
      image: "/placeholder-image-3.jpg",
    },
    {
      title: "App Support for Easy Printing",
      description:
        "Simplify your setup with our companion app. All you need is one A4 sheet and access to the app—no more cutting hundreds of cards or tedious preparations!",
      image: "/placeholder-image-4.jpg",
    },
    {
      title: "Exciting Competitive Play",
      description:
        "Gather your friends or family for a fun-filled, competitive experience. Perfect for game nights, it’s designed to be exciting and family-friendly for players of all ages!",
      image: "/placeholder-image-5.jpg",
    },
  ],
  neededComponents: [
    {
      name: "1x Pen/Pencil per Player",
      image: "/path/to/pens-image.jpg",
    },
    {
      name: "1x Device to play the APP (phone, tablet, computer)",
      image: "/path/to/pens-image.jpg",
    },
  ],
  providedComponents: [
    {
      name: "1x Sheet A4 and Letter Size (10,000+ print variations)*",
      image: "/path/to/map-image.jpg",
    },
    {
      name: "25x Unique Character Cards",
      image: "/path/to/map-image.jpg",
    },
    {
      name: "1x App - Digital deck of 100+ cards included (Push your luck Engine)",
      image: "/path/to/app-image.jpg",
    },
    {
      name: "1x Rulebook - English Version",
      image: "/path/to/tokens-image.jpg",
    },
  ],
  faqs: {
    shopFAQs: commonShopFAQs,
    gameFAQs: [
      {
        id: "mm-1",
        question: "How many players can play Monster Mixology?",
        answer:
          "Monster Mixology supports 2-6 players, with an optimal experience at 3-4 players.",
      },
      {
        id: "mm-2",
        question: "What's the average game duration?",
        answer:
          "A typical game lasts 30-45 minutes, perfect for multiple rounds in one session!",
      },
      {
        id: "mm-3",
        question: "Do I need to print new sheets for each game?",
        answer:
          "Yes, each game requires a fresh sheet per player, but they're designed to be printer-friendly and economical.",
      },
      {
        id: "mm-4",
        question: "Can I play without the companion app?",
        answer:
          "While possible, we highly recommend using the companion app as it enhances the gameplay experience and handles card management automatically.",
      },
      {
        id: "mm-5",
        question: "Is the game family-friendly?",
        answer:
          "Absolutely! Monster Mixology is designed to be enjoyed by players of all ages (8+) and is perfect for family game nights.",
      },
    ],
  },
};

export const gamesStaticData = {
  "monster-mixology": monstermixologyData,
};
