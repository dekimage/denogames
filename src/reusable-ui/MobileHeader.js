import { Button } from "@/components/ui/button";
import {
  CalendarCheck,
  Gamepad2,
  GaugeCircle,
  LayoutDashboard,
  MenuIcon,
  Search,
  X,
  ShoppingCart,
  LogIn,
  UserPlus,
  UserIcon,
  Gift,
  ShoppingBag,
  Trophy,
  Star,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import MobxStore from "@/mobx";
import { observer } from "mobx-react";
import { VerticalNavbar } from "./VerticalNavbar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logoImg from "../assets/logo.png";

const MobileHeader = observer(() => {
  const { isMobileOpen, setIsMobileOpen, user, logout, cart } = MobxStore;
  const cartItemCount = cart.length;

  const toggleMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const pathname = usePathname();
  const isRoute = (route) => {
    return pathname.endsWith(route.toLowerCase()) ? "default" : "ghost";
  };

  return (
    <div className="fixed top-0 left-0 right-0 flex justify-between items-center border-b bg-white h-[52px] z-[999] px-2">
      <Button onClick={toggleMenu} className="p-2" variant="ghost">
        {isMobileOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MenuIcon className="h-6 w-6" />
        )}
      </Button>

      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Image
          src={logoImg}
          alt="logo"
          width={48}
          height={48}
          className="cursor-pointer"
        />
      </div>

      <Link href="/cart">
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-6 w-6" />
          {cartItemCount > 0 && (
            <span className="absolute top-[-5px] right-[-5px] inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-600 text-white text-xs font-bold">
              {cartItemCount}
            </span>
          )}
        </Button>
      </Link>

      {isMobileOpen && (
        <div className="fixed top-[52px] left-0 w-full h-full flex flex-col items-center justify-start p-4 bg-white z-[998] overflow-y-auto">
          {!user ? (
            <div className="w-full flex gap-2 mb-6">
              <Link href="/login" className="flex-1">
                <Button
                  variant="cream"
                  className="w-full"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href="/signup" className="flex-1">
                <Button
                  className="w-full"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
              <VerticalNavbar
                links={[
                  {
                    title: "Home",
                    icon: LayoutDashboard,
                    variant: isRoute("/"),
                    href: "/",
                    callBack: () => setIsMobileOpen(false),
                  },
                  {
                    title: "Shop",
                    icon: CalendarCheck,
                    variant: isRoute("Shop"),
                    href: "/shop",
                    callBack: () => setIsMobileOpen(false),
                  },

                  {
                    title: "Blog",
                    icon: GaugeCircle,
                    variant: isRoute("Blog"),
                    href: "/blog",
                    callBack: () => setIsMobileOpen(false),
                  },
                ]}
              />
            </div>
          ) : (
            <>
              <div className="text-center font-medium">
                Logged in as {user.username}
              </div>

              <VerticalNavbar
                links={[
                  {
                    title: "Home",
                    icon: LayoutDashboard,
                    variant: isRoute("/"),
                    href: "/",
                    callBack: () => setIsMobileOpen(false),
                  },
                  {
                    title: "Shop",
                    icon: CalendarCheck,
                    variant: isRoute("Shop"),
                    href: "/shop",
                    callBack: () => setIsMobileOpen(false),
                  },

                  {
                    title: "Blog",
                    icon: GaugeCircle,
                    variant: isRoute("Blog"),
                    href: "/blog",
                    callBack: () => setIsMobileOpen(false),
                  },
                ]}
              />

              <VerticalNavbar
                links={[
                  {
                    title: "Account",
                    icon: UserIcon,
                    variant: isRoute("account"),
                    href: "account",
                    callBack: () => setIsMobileOpen(false),
                  },
                  {
                    title: "My Games",
                    icon: Gamepad2,
                    variant: isRoute("account/my-games"),
                    href: "account/my-games",
                    callBack: () => setIsMobileOpen(false),
                  },

                  {
                    title: "Rewards",
                    icon: Gift,
                    variant: isRoute("account/rewards"),
                    href: "account/rewards",
                    callBack: () => setIsMobileOpen(false),
                  },

                  {
                    title: "Achievements",
                    icon: Trophy,
                    variant: isRoute("account/achievements"),
                    href: "account/achievements",
                    callBack: () => setIsMobileOpen(false),
                  },

                  {
                    title: "My  Orders",
                    icon: ShoppingBag,
                    variant: isRoute("account/my-orders"),
                    href: "account/my-orders",
                    callBack: () => setIsMobileOpen(false),
                  },

                  {
                    title: "My Reviews",
                    icon: Star,
                    variant: isRoute("account/my-reviews"),
                    href: "account/my-reviews",
                    callBack: () => setIsMobileOpen(false),
                  },

                  {
                    title: "Logout",
                    icon: Gamepad2,
                    variant: isRoute("logout"),
                    href: "/",
                    callBack: () => {
                      logout();
                      setIsMobileOpen(false);
                    },
                  },
                ]}
              />
            </>
          )}

          {user && (
            <div className="w-full mt-auto pt-4">
              <Link href="/my-games" className="w-full">
                <Button variant="outline" className="w-full">
                  My Games
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default MobileHeader;
