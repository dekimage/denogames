"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Layers,
  ShoppingCart,
  GamepadIcon,
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
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "Customers", href: "/admin/customers" },
  // { icon: Layers, label: "Segments", href: "/admin/segments" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  { icon: GamepadIcon, label: "Games", href: "/admin/games" },
];

export default function Layout({ children }) {
  const pathname = usePathname();

  return (
    <SidebarProvider className="w-full bg-gray-100">
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
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <main className="w-full p-6 bg-gray-100">{children}</main>
      </div>
    </SidebarProvider>
  );
}
