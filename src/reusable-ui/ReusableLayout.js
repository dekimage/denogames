"use client";

import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { VerticalNavbar } from "./VerticalNavbar";

import {
  AppWindow,
  BookOpen,
  GaugeCircle,
  Home,
  LayoutDashboard,
  ListMinus,
  Plus,
  Search,
  SearchCheck,
  ShoppingCart,
  Smartphone,
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
import { useState } from "react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import NotificationDropdown from "@/components/Notifications";

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
  const isRoute = (route) => {
    if (route === "/") {
      return pathname.toLowerCase() === `/${route.toLowerCase()}`
        ? "default"
        : "ghost";
    }

    return pathname.toLowerCase().includes(route.toLowerCase())
      ? "default"
      : "ghost";
  };

  const cartItemCount = cart.length;

  return (
    <div>
      <div className="hidden sm:block">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full max-h-[950px] items-stretch"
        >
          <ResizablePanel
            defaultSize={defaultLayout[1]}
            minSize={30}
            style={{ overflow: "auto" }}
          >
            <div>
              <div
                //  className="w-full h-[53px] flex justify-between items-center p-2 border-b gap-4"
                className="navigation"
              >
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
                      <Link href="/shop" legacyBehavior passHref>
                        <Button variant="reverse" className="text-lg">
                          SHOP
                        </Button>
                      </Link>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                      <Link href="/app" legacyBehavior passHref>
                        <Button variant="reverse" className="text-lg">
                          APP
                        </Button>
                      </Link>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                      <Link href="/blog" legacyBehavior passHref>
                        <Button variant="reverse" className="text-lg">
                          BLOG
                        </Button>
                      </Link>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
                <div className="flex justify-end gap-4 items-center">
                  <Link href="/app">
                    <Button size="icon" variant="reverse">
                      <Smartphone />
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button size="icon" variant="reverse">
                      <Home />
                    </Button>
                  </Link>
                  <Link href="/cart">
                    <div className="relative inline-block">
                      <Button size="icon" variant="reverse">
                        <ShoppingCart />
                      </Button>
                      {cartItemCount > 0 && (
                        <span className="absolute top-[-5px] right-[-5px] inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-600 text-white text-xs font-bold z-50">
                          {cartItemCount}
                        </span>
                      )}
                    </div>
                  </Link>
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
              <div className="">{children}</div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <div className="block sm:hidden">
        {/* <MobileHeader /> */}
        {children}
      </div>
    </div>
  );
});

export default ReusableLayout;
