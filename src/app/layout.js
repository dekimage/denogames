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
        <link
          href="https://fonts.googleapis.com/css2?family=Protest+Strike&display=swap"
          rel="stylesheet"
        />
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
