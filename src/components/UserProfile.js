"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import MobxStore from "@/mobx";
import { observer } from "mobx-react-lite";
import {
  Edit,
  Upload,
  Trash2,
  User,
  Calendar,
  Save,
  X,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import placeholderImg from "@/assets/01.png";
import { auth } from "@/firebase";

// Predefined avatar options
const AVATAR_OPTIONS = [
  "/avatars/avatar1.png", // Replace these with your actual avatar URLs
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png",
  "/avatars/avatar7.png",
  "/avatars/avatar8.png",
  "/avatars/avatar9.png",
  "/avatars/avatar10.png",
  "/avatars/avatar11.png",
  "/avatars/avatar12.png",
];

const DEFAULT_AVATAR = AVATAR_OPTIONS[0];

export const UserProfile = observer(({ user }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [savingUsername, setSavingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [selectedAvatar, setSelectedAvatar] = useState(
    user?.avatarImg || DEFAULT_AVATAR
  );
  const [savingAvatar, setSavingAvatar] = useState(false);
  const { toast } = useToast();

  // Format the timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown";

    try {
      // Check if it's a Firebase Timestamp object
      if (timestamp.seconds && timestamp.nanoseconds) {
        // Convert Firebase timestamp to JS Date
        return format(new Date(timestamp.seconds * 1000), "MMMM d, yyyy");
      }

      // Check if it's a Firebase server timestamp that might be in a different format
      if (typeof timestamp === "object" && timestamp._seconds) {
        return format(new Date(timestamp._seconds * 1000), "MMMM d, yyyy");
      }

      // If it's a string that represents a date (ISO format)
      if (typeof timestamp === "string" && !isNaN(Date.parse(timestamp))) {
        return format(new Date(timestamp), "MMMM d, yyyy");
      }

      // If it's a number (unix timestamp in milliseconds)
      if (typeof timestamp === "number") {
        return format(new Date(timestamp), "MMMM d, yyyy");
      }

      // If it's already a Date object
      if (timestamp instanceof Date) {
        return format(timestamp, "MMMM d, yyyy");
      }

      // Default fallback
      return "Unknown date format";
    } catch (error) {
      console.error("Error formatting date:", error, timestamp);
      return "Invalid date";
    }
  };

  const joinDate = formatDate(user?.createdAt);

  const updateAvatar = async (newAvatarUrl) => {
    if (newAvatarUrl === user.avatarImg) {
      setIsAvatarDialogOpen(false);
      return;
    }

    setSavingAvatar(true);

    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token)
        throw new Error("You must be logged in to update your profile");

      const response = await fetch("/api/user/update-profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          avatarImg: newAvatarUrl,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update avatar");
      }

      MobxStore.updateUserProfile({ avatarImg: newAvatarUrl });

      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });

      setIsAvatarDialogOpen(false);
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update avatar",
        variant: "destructive",
      });
    } finally {
      setSavingAvatar(false);
    }
  };

  const updateUsername = async () => {
    if (!newUsername.trim() || newUsername === user.username) {
      setIsDialogOpen(false);
      return;
    }

    setSavingUsername(true);

    try {
      // Get token using the existing auth object
      const token = await auth.currentUser?.getIdToken();
      if (!token)
        throw new Error("You must be logged in to update your profile");

      const response = await fetch("/api/user/update-profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          username: newUsername,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update username");
      }

      // Use the existing updateUserProfile method from MobxStore
      MobxStore.updateUserProfile({ username: newUsername });

      toast({
        title: "Success",
        description: "Username updated successfully",
      });

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating username:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update username",
        variant: "destructive",
      });
    } finally {
      setSavingUsername(false);
    }
  };

  return (
    <div className="box-inner max-w-[400px]">
      <div className="box-broken my-4 border p-8">
        <div className="flex flex-col items-center justify-center gap-4">
          {/* Profile Image */}
          <div
            className="relative cursor-pointer"
            onClick={() => setIsAvatarDialogOpen(true)}
          >
            <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary transition-colors">
              <Image
                src={user.avatarImg || DEFAULT_AVATAR}
                alt={user.username}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* User Info */}
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold capitalize">{user.username}</div>
            <p className="text-sm text-muted-foreground">{user.email}</p>

            {/* Account Creation Date */}
            <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Joined {joinDate}</span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(true)}
            className="mt-2"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Avatar Selection Dialog */}
      <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Choose Your Avatar</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 py-4">
            {AVATAR_OPTIONS.map((avatarUrl, index) => (
              <div
                key={index}
                className={`relative cursor-pointer rounded-full overflow-hidden border-4 transition-all ${
                  selectedAvatar === avatarUrl
                    ? "border-primary scale-105"
                    : "border-transparent hover:border-primary/50"
                }`}
                onClick={() => setSelectedAvatar(avatarUrl)}
              >
                <div className="relative w-full pt-[100%]">
                  <Image
                    src={avatarUrl}
                    alt={`Avatar option ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={savingAvatar}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={() => updateAvatar(selectedAvatar)}
              disabled={selectedAvatar === user.avatarImg || savingAvatar}
            >
              {savingAvatar && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Avatar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={savingUsername}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={updateUsername}
              disabled={
                !newUsername.trim() ||
                savingUsername ||
                newUsername === user.username
              }
            >
              {savingUsername && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});
