export const placeholderBenefitsImg = "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fmonster-mixology%2FbenefitsImages%2Fplaceholder-1.png?alt=media";
const monsterMixologyCoverImg = "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fmonster-mixology%2Fmm-cover-download.jpg?alt=media";
const monsterMixologyLogoImg = "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fmonster-mixology%2Fmm-logo.png?alt=media";
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

const dummyDownloadResources = [
  {
    name: "Rulebook",
    image: "/path/to/rulebook-image.jpg",
    description: "Complete game rules and setup instructions",
    instructions:
      "Choose your preferred language and download the PDF rulebook.",
    configurations: [
      {
        label: "Language",
        options: ["English", "Spanish", "French", "German"],
      },
      {
        label: "Version",
        options: ["Standard", "Print Friendly", "Mobile Optimized"],
      },
    ],
    onDownload: (configs) => {
      console.log("Downloading rulebook with configs:", configs);
    },
  },
  {
    name: "Main Game Board",
    image: "/path/to/board-image.jpg",
    description: "The primary game board for testing purposes",
    instructions:
      "Select your preferences below. Note: A4 is standard European size, Letter is US standard.",
    configurations: [
      {
        label: "Paper Size",
        options: ["A4", "Letter"],
      },
      {
        label: "Player Count",
        options: ["2 Players", "3 Players", "4 Players", "5-6 Players"],
      },
      {
        label: "Difficulty",
        options: ["Normal", "Advanced", "Expert"],
      },
    ],
    onDownload: (configs) => {
      console.log("Downloading game board with configs:", configs);
    },
  },
];

const monstermixologyData = {
  rulebookUrl:
    "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/rulebooks%2FMonster%20Mixology%20Rulebook.pdf?alt=media",
  benefitsData: [
    {
      title: "Endless Replayability",
      description:
        "Enjoy a game with virtually limitless possibilities. Each session generates a unique experience, ensuring no two games are ever the same, keeping the fun fresh and exciting!",
      image: placeholderBenefitsImg
    },
    {
      title: "Push Your Luck",
      description:
        "Every turn is filled with thrilling decisions and unexpected surprises. Test your bravery, make bold choices, and embrace the excitement of the unknown!",
      image: placeholderBenefitsImg
    },
    {
      title: "Dynamic A4 Sheets",
      description:
        "Experience gameplay on uniquely generated A4 sheets each time you play. With this dynamic system, every session brings a new set of challenges and opportunities.",
      image: placeholderBenefitsImg
    },
    {
      title: "App Support for Easy Printing",
      description:
        "Simplify your setup with our companion app. All you need is one A4 sheet and access to the app—no more cutting hundreds of cards or tedious preparations!",
      image: placeholderBenefitsImg
    },
    {
      title: "Exciting Competitive Play",
      description:
        "Gather your friends or family for a fun-filled, competitive experience. Perfect for game nights, it’s designed to be exciting and family-friendly for players of all ages!",
      image: placeholderBenefitsImg
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
  downloadResources: [
    {
      type: "main-sheet",
      name: "Main Game Sheet",
      image: monsterMixologyCoverImg || placeholderBenefitsImg,
      description: "The primary game sheet where all the mixing action happens",
      instructions:
        "Choose your paper size and player count. Higher player counts will adjust the layout accordingly.",
      configurations: [
        {
          label: "Paper Size",
          options: [
            { label: "A4", key: "A4" },
            { label: "LETTER", key: "LETTER" },
          ],
        },
        {
          label: "Color Type",
          options: [
            { label: "Full Color", key: "color" },
            { label: "Low Ink", key: "black" },
          ],
        },
        {
          label: "Monster Cards",
          options: [
            {
              label: "Random* (Over 2,000,000+ combinations)",
              key: "random",
            },
            {
              label: "Select Your Monsters (Opens Monster Picker Mode)",
              key: "select",
            },
            {
              label: "Basic Sheet (Preset 12 Monsters)",
              key: "preset",
            },
          ],
        },
      ],
      onDownload: (configs) => {
        console.log("Downloading MM main sheet with configs:", configs);
      },
    },
    {
      type: "rulebook",
      name: "Monster Mixology Rulebook",
      image: monsterMixologyLogoImg || placeholderBenefitsImg,
      description:
        "Official Monster Mixology rulebook with complete game instructions and setup guide",
      instructions:
        "Select your preferred language and format. The print-friendly version uses less ink.",
      onDownload: (configs) => {
        console.log("Downloading MM rulebook with configs:", configs);
      },
    },
  ],
};

export const gamesStaticData = {
  "monster-mixology": monstermixologyData,
};

export const dummyData = {
  downloadResources: dummyDownloadResources,
  // ... other dummy data
};
