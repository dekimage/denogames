"use client";

import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { useToast } from "@/components/ui/use-toast";
import AdminStore from "@/mobx/AdminStore";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  useEffect(() => {
    if (!AdminStore.products.length) {
      AdminStore.fetchProducts();
    }
    if (!AdminStore.achievements.length) {
      AdminStore.fetchAchievements();
    }
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("folder", "special-rewards");
      formDataUpload.append("filename", `${Date.now()}_${file.name}`);

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
                type="button"
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
            <label className="flex flex-col items-center justify-center h-full cursor-pointer">
              <Upload className="h-8 w-8 mb-2" />
              <span>Upload Thumbnail</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={loading}
              />
            </label>
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
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Game</Label>
        <Select
          value={formData.gameId}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, gameId: value }))
          }
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a game" />
          </SelectTrigger>
          <SelectContent>
            {AdminStore.products
              .filter((p) => p.type === "game")
              .map((game) => (
                <SelectItem key={game.id} value={game.id}>
                  <div className="flex items-center gap-2">
                    <div className="relative w-6 h-6">
                      <Image
                        src={game.thumbnail || "/placeholder.png"}
                        alt={game.name}
                        fill
                        className="object-cover rounded-sm"
                      />
                    </div>
                    <span>{game.name}</span>
                  </div>
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Required Achievements</Label>
        <div className="border rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
          {AdminStore.achievements.map((achievement) => (
            <label
              key={achievement.id}
              className="flex items-center gap-3 p-2 hover:bg-accent rounded-md cursor-pointer"
            >
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={formData.requiredAchievements.includes(achievement.id)}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setFormData((prev) => ({
                    ...prev,
                    requiredAchievements: isChecked
                      ? [...prev.requiredAchievements, achievement.id]
                      : prev.requiredAchievements.filter(
                          (id) => id !== achievement.id
                        ),
                  }));
                }}
              />
              <div className="relative w-8 h-8">
                <Image
                  src={achievement.thumbnail || "/placeholder.png"}
                  alt={achievement.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div>
                <p className="font-medium">{achievement.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {achievement.description}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>File URL</Label>
        <Input
          value={formData.fileUrl}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, fileUrl: e.target.value }))
          }
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
      </div>
    </form>
  );
};

const SpecialRewardsPage = observer(() => {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedReward, setSelectedReward] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      if (user) {
        fetchData();
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    try {
      await AdminStore.fetchSpecialRewards();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch special rewards",
        variant: "destructive",
      });
      if (error.message.includes("Unauthorized")) {
        router.push("/login");
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (formData.id) {
        await AdminStore.updateSpecialReward(formData.id, formData);
      } else {
        await AdminStore.createSpecialReward(formData);
      }
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Special reward saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save special reward",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await AdminStore.deleteSpecialReward(id);
      toast({
        title: "Success",
        description: "Special reward deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete special reward",
        variant: "destructive",
      });
    }
  };

  const handleBulkUpload = async () => {
    try {
      await AdminStore.bulkUploadSpecialRewards();
      toast({
        title: "Success",
        description: "Special rewards bulk uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to bulk upload special rewards",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAll = async () => {
    try {
      await AdminStore.deleteAllSpecialRewards();
      toast({
        title: "Success",
        description: "All special rewards deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete all special rewards",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const filteredRewards = AdminStore.specialRewards.filter((reward) =>
    reward.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Button
            onClick={handleBulkUpload}
            disabled={AdminStore.loading.specialRewards}
          >
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAll}
            disabled={AdminStore.loading.specialRewards}
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
        {filteredRewards.map((reward) => {
          const game = AdminStore.products.find((p) => p.id === reward.gameId);
          const achievements = reward.requiredAchievements
            .map((id) => AdminStore.achievements.find((a) => a.id === id))
            .filter(Boolean);

          return (
            <Card key={reward.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="relative w-8 h-8">
                    <Image
                      src={reward.thumbnail || "/placeholder.png"}
                      alt={reward.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  {reward.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {reward.description}
                </p>

                {/* Game Section */}
                {game && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Game:</p>
                    <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg">
                      <div className="relative w-10 h-10 flex-shrink-0">
                        <Image
                          src={game.thumbnail || "/placeholder.png"}
                          alt={game.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <span className="text-sm font-medium">{game.name}</span>
                    </div>
                  </div>
                )}

                {/* Required Achievements Section */}
                {achievements.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Required Achievements:
                    </p>
                    <div className="space-y-2">
                      {achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg"
                        >
                          <div className="relative w-8 h-8 flex-shrink-0">
                            <Image
                              src={achievement.thumbnail || "/placeholder.png"}
                              alt={achievement.title}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="text-sm font-medium truncate">
                              {achievement.title}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {achievement.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
          );
        })}
      </div>
    </div>
  );
});

export default SpecialRewardsPage;
