"use client";

import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { VerticalNavbar } from "./VerticalNavbar";

import {
  AppWindow,
  BookOpen,
  FileText,
  GaugeCircle,
  Home,
  LayoutDashboard,
  ListMinus,
  Plus,
  Search,
  SearchCheck,
  Smartphone,
  Store,
  UserIcon,
} from "lucide-react";
import MobxStore from "../mobx";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { observer } from "mobx-react";
import { LoadingSpinner } from "./LoadingSpinner";
import { UserNav } from "./ReusableProfileMenu";
import Image from "next/image";
import logoImg from "../assets/logo.png";

import MobileHeader from "./MobileHeader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import NotificationDropdown from "@/components/Notifications";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ui/themeButton";
import ShoppingCart from "@/components/Cart";

const routesWithoutHeaderFooter = ["/login", "/signup", "/app"];

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
  // "/account",
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

const CreateListDialog = () => {
  const [listName, setListName] = useState("");
  const { addList } = MobxStore;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="cream" className="w-full">
          <Plus size={16} className="mr-2" /> Create List
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New List</DialogTitle>
          <DialogDescription>
            Store different pathways across custom lists.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">List Name</Label>
              <Input
                id="name"
                placeholder="Morning Routine"
                onChange={(e) => setListName(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="cream" onClick={() => setShowDialog(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={() => {
              // setShowDialog(false);
              addList(listName);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ReusableLayout = observer(({ children }) => {
  const { user, cart, logout } = MobxStore;
  const pathname = usePathname();
  const router = useRouter();

  const showHeaderFooter = shouldShowHeaderFooter(pathname);
  const showMvpHeader =
    pathname.startsWith("/mvp") &&
    !pathname.startsWith("/mvp/vampires") &&
    !pathname.startsWith("/mvp/monstermixology");

  const cartItemCount = cart.length;

  const hideFooter = pathname.startsWith("/account");

  return (
    <div className="flex flex-col min-h-screen">
      <div className="hidden sm:block flex-grow">
        {showHeaderFooter && !showMvpHeader && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-white">
            <div className="navigation">
              <NavigationMenu>
                <NavigationMenuList className="gap-4">
                  <NavigationMenuItem>
                    <Link href="/">
                      <Image
                        src={logoImg}
                        alt="logo"
                        width={75}
                        height={75}
                        className="cursor-pointer"
                      />
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/">
                      <Button variant="reverse" className="text-lg">
                        HOME
                      </Button>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/shop" legacyBehavior passHref>
                      <Button variant="reverse" className="text-lg">
                        {/* <Store className="mr-2" /> */}
                        SHOP
                      </Button>
                    </Link>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <Link href="/blog" legacyBehavior passHref>
                      <Button variant="reverse" className="text-lg">
                        {/* <FileText className="mr-2" /> */}
                        BLOG
                      </Button>
                    </Link>
                  </NavigationMenuItem>

                  {/* <NavigationMenuItem>
                    <Link href="/game-finder" legacyBehavior passHref>
                      <Button variant="reverse" className="text-lg">
                        
                        FINDER TOOL
                      </Button>
                    </Link>
                  </NavigationMenuItem> */}
                </NavigationMenuList>
              </NavigationMenu>
              <div className="flex justify-end gap-4 items-center">
                {/* <Link href="/app">
                  <Button size="icon" variant="reverse">
                    <Smartphone />
                  </Button>
                </Link>
                <Link href="/">
                  <Button size="icon" variant="reverse">
                    <Home />
                  </Button>
                </Link> */}
                <ModeToggle />
                <ShoppingCart />
                {/* <Link href="/cart">
                  <div className="relative inline-block">
                    <Button variant="reverse">
                      <ShoppingCart className="mr-2" />
                      CART
                    </Button>
                    {cartItemCount > 0 && (
                      <span className="absolute top-[-5px] right-[-5px] inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-600 text-white text-xs font-bold z-50">
                        {cartItemCount}
                      </span>
                    )}
                  </div>
                </Link> */}
                {user ? (
                  <>
                    <NotificationDropdown />

                    <UserNav user={user} logout={logout} />
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Link href="/login">
                      <Button variant="cream">Login</Button>
                    </Link>
                    <Link href="/signup">
                      <Button>Create Free Account</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {showMvpHeader && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-white print:hidden">
            <div className="navigation max-h-[50px]">
              <NavigationMenu>
                <NavigationMenuList className="gap-4">
                  <NavigationMenuItem>
                    <Link href="/mvp">
                      <Image
                        src={logoImg}
                        alt="logo"
                        width={75}
                        height={75}
                        className="cursor-pointer"
                      />
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
                  <ModeToggle />
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
        )}
        <div
          className={`${
            showHeaderFooter || showMvpHeader ? "pt-[53px] print:pt-0" : ""
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
      <div className="block sm:hidden flex-grow">
        {showHeaderFooter && !showMvpHeader && <MobileHeader />}
        {showMvpHeader && <div>MVP Header</div>}
        {children}
      </div>
      {!hideFooter && <Footer />}
    </div>
  );
});

export default ReusableLayout;

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
