export const gameFiles = {
    "monster-mixology": [
        {
            id: "core-game",
            title: "Core Game",
            type: "core",
            description: "All files needed to play Monster Mixology",
            image: "/images/games/monster-mixology/core.png", // You'll need to add these images
            items: [
                "3x A4 PDF Game Board",
                "1x Player Sheet (Print & Play)",
                "108x Cards (Print & Play)",
                "Quick Reference Guide"
            ],
            requirements: null, // No requirements for core game if owned
            files: [
                {
                    url: "/files/monster-mixology/core/boards.pdf",
                    filename: "MM_Boards.pdf",
                    size: 2400000 // size in bytes (2.4MB)
                },
                {
                    url: "/files/monster-mixology/core/cards.pdf",
                    filename: "MM_Cards.pdf",
                    size: 4800000
                }
            ]
        },
        {
            id: "rulebook",
            title: "Rulebook",
            type: "core",
            description: "Official Monster Mixology Rulebook",
            image: "/images/games/monster-mixology/rulebook.png",
            items: [
                "Complete Rulebook (English)",
                "Setup Guide",
                "Game Variants"
            ],
            requirements: null,
            files: [
                {
                    url: "/files/monster-mixology/rulebook/MM_Rulebook_EN.pdf",
                    filename: "MM_Rulebook_EN.pdf",
                    size: 1800000
                }
            ]
        },
        {
            id: "halloween-expansion",
            title: "Halloween Expansion",
            type: "expansion",
            description: "Spooky cocktails and creepy customers",
            image: "/images/games/monster-mixology/halloween.png",
            items: [
                "24x New Cards",
                "1x Special Board",
                "New Rules Reference"
            ],
            requirements: {
                type: "purchase",
                value: "mm-halloween-exp"
            },
            files: [
                {
                    url: "/files/monster-mixology/expansions/halloween.pdf",
                    filename: "MM_Halloween.pdf",
                    size: 1200000
                }
            ]
        },
        {
            id: "special-bonus-1",
            title: "Special Bonus: Pro Bartender Pack",
            type: "special",
            description: "Advanced recipes and challenging customers",
            image: "/images/games/monster-mixology/bonus1.png",
            items: [
                "12x Expert Mode Cards",
                "4x Special Customer Cards",
                "Advanced Rules"
            ],
            requirements: {
                type: "level",
                value: 5
            },
            files: [
                {
                    url: "/files/monster-mixology/special/pro-pack.pdf",
                    filename: "MM_ProPack.pdf",
                    size: 900000
                }
            ]
        },
        {
            id: "special-bonus-2",
            title: "Special Bonus: Achievement Pack",
            type: "special",
            description: "Unlock this by completing specific achievements",
            image: "/images/games/monster-mixology/bonus2.png",
            items: [
                "6x Achievement Cards",
                "2x Special Recipes",
                "1x Special Board Layout"
            ],
            requirements: {
                type: "achievement",
                value: "MM_MASTER" // achievement ID
            },
            files: [
                {
                    url: "/files/monster-mixology/special/achievement-pack.pdf",
                    filename: "MM_AchievementPack.pdf",
                    size: 700000
                }
            ]
        }
    ],
    variableFiles: {
        "monster-mixology": {
            luckyGenerator: {
                enabled: true,
                title: "Lucky Generator",
                description: "Generate random combinations of ingredients, monsters, and special effects for unique gameplay experiences. Perfect for adding variety to your Monster Mixology sessions!",
                image: "/images/games/monster-mixology/lucky-generator.png",
                features: [
                    "Random monster combinations",
                    "Special ingredient mixes",
                    "Custom difficulty settings",
                    "Balanced gameplay options"
                ],
                requiredKey: "luckyGen",
                productId: "lucky-generator-mm", // for adding to cart
                price: 4.99
            },
            makeYourOwn: {
                enabled: true,
                title: "Make Your Own Content",
                description: "Create your own custom monsters, ingredients, and recipes. Share your creations with other Monster Mixology players!",
                image: "/images/games/monster-mixology/make-your-own.png",
                features: [
                    "Custom monster creator",
                    "Recipe designer",
                    "Ingredient builder",
                    "Printable templates"
                ],
                requiredKey: "customGen",
                productId: "custom-generator-mm", // for adding to cart
                price: 9.99
            }
        }
    }
};

// Example of how user data would look:
/*
{
    ...other user data...,
    unlockedGenerators: {
        monstermixology: {
            luckyGen: true,
            customGen: true
        }
    }
}
*/ 