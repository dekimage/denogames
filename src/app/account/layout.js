"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import { LoadingSpinner } from "@/reusable-ui/LoadingSpinner";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Package,
  Trophy,
  GamepadIcon,
  Star,
  Gift,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";

const navItems = [
  { icon: User, label: "Account", href: "/account" },
  { icon: GamepadIcon, label: "My Games", href: "/account/my-games" },
  { icon: Gift, label: "Rewards", href: "/account/rewards" },
  { icon: Trophy, label: "Collectibles", href: "/account/achievements" },
  { icon: Package, label: "My Orders", href: "/account/my-orders" },
  { icon: Star, label: "My Reviews", href: "/account/my-reviews" },
];

const AccountLayout = observer(({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, userFullyLoaded } = MobxStore;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (userFullyLoaded && !user) {
      // Store the current URL to redirect back after login
      localStorage.setItem("redirectAfterLogin", pathname);
      router.push("/login");
    }
  }, [user, userFullyLoaded, router, pathname]);

  // Don't render anything during SSR
  if (!isClient) {
    return null;
  }

  // Show loading spinner while checking auth status
  if (!userFullyLoaded) {
    return <LoadingSpinner />;
  }

  // If user is not authenticated, we'll redirect in the useEffect
  if (!user) {
    return null;
  }

  return (
    <SidebarProvider className="w-full bg-background">
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-primary p-1">
                      <User className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="font-semibold">My Account</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <Link href={item.href} passHref>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.href}
                        >
                          <a className="flex items-center gap-2">
                            <item.icon className="h-4 w-4" />
                            {item.label}
                          </a>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <main>{children}</main>
      </div>
    </SidebarProvider>
  );
});

export default AccountLayout;
