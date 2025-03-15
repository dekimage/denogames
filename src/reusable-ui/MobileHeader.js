"use client";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarCheck,
  Gamepad2,
  BookOpen,
  LayoutDashboard,
  Menu,
  Search,
  X,
  LogIn,
  UserPlus,
  User,
  Gift,
  ShoppingBag,
  Trophy,
  Star,
  Home,
  LogOut,
  ChevronRight,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import logoImg from "@/assets/logo.png";
import ShoppingCart from "@/components/Cart";

const NavItem = ({ href, icon: Icon, title, active, onClick }) => {
  return (
    <Link href={href} className="w-full" onClick={onClick}>
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
          active
            ? "bg-primary/10 text-primary font-medium"
            : "hover:bg-muted text-foreground"
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{title}</span>
        {active && (
          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
        )}
      </div>
    </Link>
  );
};

const NavSection = ({ title, children }) => {
  return (
    <div className="mb-4">
      {title && (
        <div className="px-4 py-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </h3>
        </div>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  );
};

const MobileHeader = observer(() => {
  const { isMobileOpen, setIsMobileOpen, user, logout, cart } = MobxStore;
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMenu = () => {
    setIsMobileOpen(false);
  };

  const isActive = (path) => pathname === path;

  // Animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      x: "-100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-background border-b z-50 flex items-center px-4">
      <div className="flex items-center justify-between w-full">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        <Link
          href="/"
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <Image
            src={logoImg}
            alt="Deno Games"
            width={36}
            height={36}
            className="cursor-pointer"
          />
        </Link>

        <ShoppingCart />
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed top-14 left-0 right-0 bottom-0 bg-background z-40"
          >
            <ScrollArea className="h-full pb-20">
              <div className="p-4">
                {/* Search Bar */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search games, expansions..."
                    className="pl-10"
                  />
                </div>

                {!user ? (
                  <>
                    {/* Auth Buttons for Guests */}
                    <div className="flex gap-2 mb-6">
                      <Link href="/login" className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={closeMenu}
                        >
                          <LogIn className="mr-2 h-4 w-4" />
                          Log in
                        </Button>
                      </Link>
                      <Link href="/signup" className="flex-1">
                        <Button className="w-full" onClick={closeMenu}>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Sign up
                        </Button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    {/* User Profile */}
                    <div className="flex items-center gap-3 mb-6 p-4 bg-muted rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user.photoURL || ""}
                          alt={user.username}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user.username?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">
                          {user.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* Main Navigation */}
                <NavSection>
                  <NavItem
                    href="/"
                    icon={Home}
                    title="Home"
                    active={isActive("/")}
                    onClick={closeMenu}
                  />
                  <NavItem
                    href="/shop"
                    icon={Package}
                    title="Shop"
                    active={isActive("/shop")}
                    onClick={closeMenu}
                  />
                  <NavItem
                    href="/blog"
                    icon={BookOpen}
                    title="Blog"
                    active={isActive("/blog")}
                    onClick={closeMenu}
                  />
                </NavSection>

                {user && (
                  <>
                    <Separator className="my-4" />

                    {/* Account Navigation */}
                    <NavSection title="My Account">
                      <NavItem
                        href="/account"
                        icon={User}
                        title="Account"
                        active={isActive("/account")}
                        onClick={closeMenu}
                      />
                      <NavItem
                        href="/account/my-games"
                        icon={Gamepad2}
                        title="My Games"
                        active={isActive("/account/my-games")}
                        onClick={closeMenu}
                      />
                      <NavItem
                        href="/account/rewards"
                        icon={Gift}
                        title="Rewards"
                        active={isActive("/account/rewards")}
                        onClick={closeMenu}
                      />
                      <NavItem
                        href="/account/achievements"
                        icon={Trophy}
                        title="Achievements"
                        active={isActive("/account/achievements")}
                        onClick={closeMenu}
                      />
                      <NavItem
                        href="/account/my-orders"
                        icon={ShoppingBag}
                        title="My Orders"
                        active={isActive("/account/my-orders")}
                        onClick={closeMenu}
                      />
                      <NavItem
                        href="/account/my-reviews"
                        icon={Star}
                        title="My Reviews"
                        active={isActive("/account/my-reviews")}
                        onClick={closeMenu}
                      />
                    </NavSection>

                    <Separator className="my-4" />

                    {/* Logout Button */}
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => {
                        logout();
                        closeMenu();
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </Button>
                  </>
                )}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
});

export default MobileHeader;
