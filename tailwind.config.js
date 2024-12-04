/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  variants: {
    extend: {
      display: ["print"],
    },
  },
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      zIndex: {
        60: "60",
      },
      // Instead of spreading all colors, manually include only the ones you use
      colors: {
        blacky: "#232323",
        darky: "#1d1d1d",
        darkest: "#111111",
        grayy: "#5f5f5f",
        cream: "#F6EECB",
        light: "#c4c4c4",
        brown: "#995936",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Use only the required Tailwind colors
        gray: colors.gray, // Updated from coolGray
        stone: colors.stone, // Updated from warmGray
        neutral: colors.neutral, // Updated from trueGray
        slate: colors.slate, // Updated from blueGray
        sky: colors.sky, // Updated from lightBlue
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        wobble: {
          "0%, 100%": { transform: "translateX(0%)" },
          "15%": { transform: "translateX(-25%) rotate(-5deg)" },
          "30%": { transform: "translateX(20%) rotate(3deg)" },
          "45%": { transform: "translateX(-15%) rotate(-3deg)" },
          "60%": { transform: "translateX(10%) rotate(2deg)" },
          "75%": { transform: "translateX(-5%) rotate(-1deg)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
        },
        pulsate: {
          "0%": {
            boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.7)",
            transform: "scale(1.1)",
          },
          "70%": {
            boxShadow: "0 0 0 20px rgba(34, 197, 94, 0)",
            transform: "scale(1.1)",
          },
          "100%": {
            boxShadow: "0 0 0 0 rgba(34, 197, 94, 0)",
            transform: "scale(1.1)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        wobble: "wobble 1s ease-in-out",
        shake: "shake 0.5s ease-in-out 2s",
        highlight: "pulsate 1.5s ease-in-out infinite",
      },
      fontFamily: {
        strike: ['"Protest Strike"', "sans-serif"],
        default: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  safelist: ["box-1"],
};
