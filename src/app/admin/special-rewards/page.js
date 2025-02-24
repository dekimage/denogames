"use client";

import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Loader2, Plus, Trash, Upload, Search } from "lucide-react";
import { specialRewards as dummyRewards } from "@/data/achievements";

const SpecialRewardForm = ({ reward, onSave, onCancel }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(
    reward || {
      id: "",
      title: "",
      description: "",
      thumbnail: "",
      gameId: "",
      requiredAchievements: [],
      fileUrl: "",
    }
  );

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("folder", "special-rewards");
      formDataUpload.append(
        "filename",
        `${formData.id || Date.now()}_${file.name}`
      );

      const token = await auth.currentUser?.getIdToken();
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataUpload,
      });

      if (!response.ok) throw new Error("Upload failed");

      const { url } = await response.json();
      setFormData((prev) => ({ ...prev, thumbnail: url }));
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(formData);
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label>Thumbnail</Label>
        <div className="relative h-48 w-full rounded-lg border-2 border-dashed">
          {formData.thumbnail ? (
            <div className="relative w-full h-full">
              <Image
                src={formData.thumbnail}
                alt="Reward thumbnail"
                fill
                className="rounded-lg object-cover"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, thumbnail: "" }))
                }
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="thumbnail-upload"
                onChange={handleImageUpload}
              />
              <Label htmlFor="thumbnail-upload" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <Upload className="h-8 w-8 mb-2" />
                  <span>Upload thumbnail</span>
                </div>
              </Label>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="Enter reward title"
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Enter reward description"
        />
      </div>

      <div className="space-y-2">
        <Label>Game ID</Label>
        <Input
          value={formData.gameId}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, gameId: e.target.value }))
          }
          placeholder="Enter game ID"
        />
      </div>

      <div className="space-y-2">
        <Label>Required Achievements (comma-separated)</Label>
        <Input
          value={formData.requiredAchievements.join(", ")}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              requiredAchievements: e.target.value
                .split(",")
                .map((a) => a.trim())
                .filter(Boolean),
            }))
          }
          placeholder="Enter required achievements"
        />
      </div>

      <div className="space-y-2">
        <Label>File URL</Label>
        <Input
          value={formData.fileUrl}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, fileUrl: e.target.value }))
          }
          placeholder="Enter file URL"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </form>
  );
};

const SpecialRewardsPage = observer(() => {
  const { toast } = useToast();
  const router = useRouter();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      if (user) {
        fetchRewards();
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchRewards = async () => {
    try {
      const token = await auth.currentUser?.getIdToken(true);
      const response = await fetch("/api/admin/special-rewards", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setRewards(data.specialRewards || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch rewards",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch("/api/admin/special-rewards", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save");

      toast({
        title: "Success",
        description: "Reward saved successfully",
      });
      setIsDialogOpen(false);
      fetchRewards();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save reward",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this reward?")) return;

    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(`/api/admin/special-rewards?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast({
        title: "Success",
        description: "Reward deleted successfully",
      });
      fetchRewards();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete reward",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleBulkUpload = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser?.getIdToken();

      for (const reward of dummyRewards) {
        await fetch("/api/admin/special-rewards", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reward),
        });
      }

      toast({
        title: "Success",
        description: "Rewards uploaded successfully",
      });
      fetchRewards();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload rewards",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Are you sure you want to delete all rewards?")) return;

    try {
      setLoading(true);
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch("/api/admin/special-rewards", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete all");

      toast({
        title: "Success",
        description: "All rewards deleted successfully",
      });
      fetchRewards();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete rewards",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRewards =
    rewards?.filter((reward) =>
      reward?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  if (!isAuthenticated || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Special Rewards</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9"
              placeholder="Search rewards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={handleBulkUpload} disabled={loading}>
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAll}
            disabled={loading}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete All
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedReward(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Reward
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedReward ? "Edit Reward" : "Add Reward"}
                </DialogTitle>
              </DialogHeader>
              <SpecialRewardForm
                reward={selectedReward}
                onSave={handleSave}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRewards.map((reward) => (
          <Card key={reward.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="relative w-8 h-8">
                  <Image
                    src={reward.thumbnail}
                    alt={reward.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                {reward.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {reward.description}
              </p>
              <p className="text-sm">Game: {reward.gameId}</p>
              <p className="text-sm">
                Required Achievements: {reward.requiredAchievements.join(", ")}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedReward(reward);
                  setIsDialogOpen(true);
                }}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(reward.id)}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
});

export default SpecialRewardsPage;
