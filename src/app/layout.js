"use client";

import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import ReusableLayout from "@/reusable-ui/ReusableLayout";
import { observer } from "mobx-react";
import AchievementUnlockOverlay from "@/components/AchievementUnlockOverlay";

const inter = Inter({ subsets: ["latin"] });

const RootLayout = observer(({ children }) => {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Protest+Strike&display=swap"
          rel="stylesheet"
        />

        {/* Favicons & Touch Icons */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* PWA & Theme Meta Tags */}
        <meta name="theme-color" content="#13151a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Deno Games" />
        <meta name="msapplication-TileColor" content="#13151a" />

        {/* SEO */}
        <meta
          name="description"
          content="Explore and play printable board games by Deno Games"
        />
        <title>Deno Games</title>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system">
          <ReusableLayout>{children}</ReusableLayout>
          <Toaster />
          <AchievementUnlockOverlay />
        </ThemeProvider>
      </body>
    </html>
  );
});

export default RootLayout;
