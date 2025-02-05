import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import ReusableLayout from "@/reusable-ui/ReusableLayout";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="p:domain_verify" content="ca5417736ce461cb01f048d0a01b4935" />
        <link
          href="https://fonts.googleapis.com/css2?family=Protest+Strike&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system">
          <ReusableLayout>{children}</ReusableLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
