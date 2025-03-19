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

export const UserProfile = observer(({ user }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingUsername, setSavingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { toast } = useToast();

  // Format the timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown";

    // Check if it's a Firebase Timestamp object
    if (timestamp.seconds) {
      // Convert Firebase timestamp to JS Date
      return format(new Date(timestamp.seconds * 1000), "MMMM d, yyyy");
    }

    // If it's already a Date object or timestamp string
    return format(new Date(timestamp), "MMMM d, yyyy");
  };

  const joinDate = formatDate(user?.createdAt);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.includes("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 2MB",
        variant: "destructive",
      });
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadProfileImage = async () => {
    if (!imageFile) return;

    setUploadingImage(true);

    try {
      // Get token using the existing auth object
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("You must be logged in to upload an image");

      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("userId", user.uid);

      const response = await fetch("/api/user/profile-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload image");
      }

      // Use the existing updateUserProfile method from MobxStore
      MobxStore.updateUserProfile({ avatarImg: result.imageUrl });

      toast({
        title: "Success",
        description: "Profile image updated successfully",
      });

      // Reset state
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload profile image",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const deleteProfileImage = async () => {
    setUploadingImage(true);

    try {
      // Get token using the existing auth object
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("You must be logged in to delete your image");

      const response = await fetch("/api/user/profile-image", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.uid }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete image");
      }

      // Use the existing updateUserProfile method from MobxStore
      MobxStore.updateUserProfile({ avatarImg: null });

      toast({
        title: "Success",
        description: "Profile image removed successfully",
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove profile image",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
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
          {/* Profile Image with Upload/Delete Controls */}
          <div className="relative group">
            <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full overflow-hidden border-2 border-primary/20">
              <Image
                src={imagePreview || user.avatarImg || placeholderImg}
                alt={user.username}
                fill
                className="object-cover"
              />
            </div>

            {/* Image Controls Overlay */}
            <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex flex-col gap-2">
                <label htmlFor="profile-image" className="cursor-pointer">
                  <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                    <Upload className="h-4 w-4 text-black" />
                  </div>
                </label>
                <input
                  type="file"
                  id="profile-image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploadingImage}
                />

                {user.avatarImg && (
                  <button
                    onClick={deleteProfileImage}
                    disabled={uploadingImage}
                    className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center"
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* Upload Indicator */}
            {imageFile && !uploadingImage && (
              <div className="absolute -right-2 -bottom-2">
                <Button
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={uploadProfileImage}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Loading Indicator */}
            {uploadingImage && (
              <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
            )}
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
