"use client";

import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

import {
  BookOpen,
  Package,
  ShoppingCart as CartIcon,
  Home as HomeIcon,
  User,
  LogIn,
  UserPlus,
  Trophy,
  ShoppingBag,
  Star,
  Gamepad2,
  Sparkle,
} from "lucide-react";
import MobxStore from "../mobx";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { observer } from "mobx-react";
import Image from "next/image";
import logoImg from "../assets/logo.png";

import MobileHeader from "./MobileHeader";

import React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ui/themeButton";
import ShoppingCart from "@/components/Cart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const routesWithoutHeaderFooter = ["/app"];

const routePrefixesWithoutHeaderFooter = [
  "/machines",
  "/app/engine",
  "/admin",
  "/app/the-last-faire",
  "/mvp/builders-town",
  "/mvp/farming",
  "/mvp/pdf",
  "/mvp/vampires",
  "/mvp/monstermixology",
  "/mvp/bazaar",
  "/landing/monstermixology",
];

const shouldShowHeaderFooter = (pathname) => {
  if (routesWithoutHeaderFooter.includes(pathname)) {
    return false;
  }

  for (const prefix of routePrefixesWithoutHeaderFooter) {
    if (pathname.startsWith(prefix)) {
      return false;
    }
  }

  return true;
};

const defaultLayout = [20, 80];

const ReusableLayout = observer(({ children }) => {
  const { user, logout } = MobxStore;
  const pathname = usePathname();

  const showHeaderFooter = shouldShowHeaderFooter(pathname);
  const showMvpHeader =
    pathname.startsWith("/mvp") &&
    !pathname.startsWith("/mvp/vampires") &&
    !pathname.startsWith("/mvp/monstermixology");

  const hideFooter =
    pathname.startsWith("/account") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/app/engine");

  // Helper function to check if a path is active
  const isActive = (path) => pathname === path;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="hidden sm:block flex-grow">
        {showHeaderFooter && !showMvpHeader && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              {/* Logo and Main Navigation */}
              <div className="flex items-center space-x-6">
                <Link href="/" className="flex items-center">
                  <Image
                    src={logoImg}
                    alt="Deno Games"
                    width={48}
                    height={48}
                    className="mr-2"
                  />
                </Link>

                {/* Main Navigation */}
                <div className="hidden md:flex items-center space-x-1">
                  <Link href="/">
                    <Button
                      variant={isActive("/") ? "secondary" : "ghost"}
                      className="flex items-center gap-2"
                    >
                      <HomeIcon className="h-4 w-4" />
                      Home
                    </Button>
                  </Link>

                  <Link href="/shop">
                    <Button
                      variant={isActive("/shop") ? "secondary" : "ghost"}
                      className="flex items-center gap-2"
                    >
                      <Package className="h-4 w-4" />
                      Shop
                    </Button>
                  </Link>

                  <Link href="/blog">
                    <Button
                      variant={isActive("/blog") ? "secondary" : "ghost"}
                      className="flex items-center gap-2"
                    >
                      <BookOpen className="h-4 w-4" />
                      Blog
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center space-x-3">
                <ModeToggle />
                {/* {user && <NotificationDropdown />} */}

                <ShoppingCart />

                {user ? (
                  <div className="flex items-center space-x-3">
                    {/* Notifications */}

                    {/* User Profile Dropdown - Using regular dropdown instead of NavigationMenu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-9 px-3 flex items-center gap-2"
                        >
                          <Avatar className="h-7 w-7">
                            <AvatarImage
                              src={user.avatarImg || ""}
                              alt={user.username}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {user.username?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm hidden md:inline-block">
                            {user.username}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {user.username}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/account" className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            <span>Account</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/account/my-games"
                            className="flex items-center"
                          >
                            <Gamepad2 className="mr-2 h-4 w-4" />
                            <span>My Games</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/account/rewards"
                            className="flex items-center"
                          >
                            <Sparkle className="mr-2 h-4 w-4" />
                            <span>Add-ons</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/account/my-collection"
                            className="flex items-center"
                          >
                            <Trophy className="mr-2 h-4 w-4" />
                            <span>My Collection</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/account/my-orders"
                            className="flex items-center"
                          >
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            <span>My Orders</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/account/my-reviews"
                            className="flex items-center"
                          >
                            <Star className="mr-2 h-4 w-4" />
                            <span>My Reviews</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>
                          <LogIn className="mr-2 h-4 w-4 rotate-180" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link href="/login">
                      <Button
                        variant="outline"
                        size="sm"
                        className="hidden md:flex"
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Log in
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button size="sm">
                        <UserPlus className="mr-2 h-4 w-4" />
                        <span className="hidden md:inline">Sign up</span>
                        <span className="md:hidden">Sign up</span>
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MVP Header - Using proper NavigationMenu structure */}
        {showMvpHeader && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-background print:hidden border-b shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link href="/mvp" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        <Image
                          src={logoImg}
                          alt="logo"
                          width={48}
                          height={48}
                          className="cursor-pointer"
                        />
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Builders Town</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <a
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                              href="/mvp/builders-town"
                            >
                              <div className="mb-2 mt-4 text-lg font-medium">
                                Builders Town
                              </div>
                              <p className="text-sm leading-tight text-muted-foreground">
                                Explore all Builders Town features and tools.
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <ListItem href="/mvp/builders-town/test" title="Cards">
                          View and manage Builders Town cards.
                        </ListItem>
                        <ListItem
                          href="/mvp/builders-town/tracker"
                          title="Tracker"
                        >
                          Track your progress in Builders Town.
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Farming</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <a
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                              href="/mvp/farming"
                            >
                              <div className="mb-2 mt-4 text-lg font-medium">
                                Farming
                              </div>
                              <p className="text-sm leading-tight text-muted-foreground">
                                Explore all Farming features and tools.
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <ListItem href="/mvp/farming/map" title="Map">
                          View and interact with the Farming map.
                        </ListItem>
                        <ListItem href="/mvp/farming/cards" title="Cards">
                          Manage your Farming cards.
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <Link href="/mvp/pdf" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        PDF
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <ModeToggle />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div
          className={`${
            showHeaderFooter || showMvpHeader ? "pt-16 print:pt-0" : ""
          }`}
        >
          <ResizablePanelGroup
            direction="horizontal"
            className="h-full items-stretch"
          >
            <ResizablePanel
              defaultSize={defaultLayout[1]}
              minSize={30}
              style={{ overflow: "auto" }}
            >
              <div className="flex flex-col h-full">
                <div className="flex-grow">{children}</div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden flex-grow">
        {showHeaderFooter && !showMvpHeader && <MobileHeader />}
        {showMvpHeader && <div>MVP Header</div>}
        {children}
      </div>

      {/* Footer */}
      {!hideFooter && <Footer />}
    </div>
  );
});

// Make sure ListItem is properly defined for NavigationMenu
const ListItem = React.forwardRef(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";

export default ReusableLayout;
