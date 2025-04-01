"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  GamepadIcon,
  Trophy,
  Gift,
  Package,
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
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "Customers", href: "/admin/customers" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  { icon: GamepadIcon, label: "Games", href: "/admin/games" },
  { icon: GamepadIcon, label: "Delivery", href: "/admin/delivery" },
];

const cmsItems = [
  { icon: Trophy, label: "Achievements", href: "/admin/achievements" },
  { icon: Package, label: "Products", href: "/admin/products" },
];

export default function Layout({ children }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check if we have a stored auth state
    const storedAuth = sessionStorage.getItem("adminAuth");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/verify-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("adminAuth", "true");
      } else {
        setError("Invalid password");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-4 rounded-lg border p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-center">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                disabled={isLoading}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Enter Admin"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider className="w-full">
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-primary p-1">
                      <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="font-semibold">Admin Dashboard</span>
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

            <SidebarGroup>
              <SidebarGroupLabel>CMS</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {cmsItems.map((item) => (
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
        <main className="w-full p-6 bg-background">{children}</main>
      </div>
    </SidebarProvider>
  );
}
