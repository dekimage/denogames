import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAvatarShortcut } from "@/utils/transformers";
import { useRouter } from "next/navigation";

export function UserNav({ user, logout }) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {/* <AvatarImage src="/avatars/01.png" alt="@shadcn" /> */}
            <AvatarFallback>
              {user ? getAvatarShortcut(user.username) : "AA"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/account")}>
            Account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/account/my-games")}>
            My Games
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/account/rewards")}>
            Rewards
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/account/achievements")}
          >
            Collectibles
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/account/my-orders")}>
            My Orders
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/account/my-reviews")}>
            My Reviews
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
