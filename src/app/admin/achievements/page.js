"use client";

import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import Image from "next/image";
import { Loader2, Plus, Trash, Upload, X } from "lucide-react";
import { achievements as dummyAchievements } from "@/data/achievements";
import { useToast } from "@/components/ui/use-toast";
import AdminStore from "@/mobx/AdminStore";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AchievementForm = ({ achievement, onSave, onCancel }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(
    achievement || {
      id: String(Date.now()),
      name: "",
      description: "",
      image: "",
      obtainedBy: "",
      hint: "",
      type: "achievement",
      unlocksAddons: [],
      code: "",
      isHidden: false,
      foundItems: [],
    }
  );

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "achievements");
      formData.append("filename", `${Date.now()}_${file.name}`);

      const token = await auth.currentUser?.getIdToken();
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const { url } = await response.json();
      setFormData((prev) => ({ ...prev, image: url }));
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

  // Get available add-ons from AdminStore
  const availableAddons = AdminStore.products.filter(
    (product) => product.type === "add-on"
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(formData);
      }}
      className="space-y-4 max-h-[80vh] overflow-y-auto p-4"
    >
      <div className="space-y-2">
        <Label>ID</Label>
        <Input
          value={formData.id}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, id: e.target.value }))
          }
          required
          disabled={!!achievement}
        />
      </div>

      <div className="space-y-2">
        <Label>Name</Label>
        <Input
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
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
        <Label>Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, type: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="achievement">Achievement</SelectItem>
            <SelectItem value="collectible">Collectible</SelectItem>
            <SelectItem value="location">Location</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Obtained By</Label>
        <Textarea
          value={formData.obtainedBy}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, obtainedBy: e.target.value }))
          }
          placeholder="How to obtain this achievement..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Hint</Label>
        <Textarea
          value={formData.hint}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, hint: e.target.value }))
          }
          placeholder="Optional hint for players..."
        />
      </div>

      {formData.type === "collectible" && (
        <div className="space-y-2">
          <Label>Code</Label>
          <Input
            value={formData.code}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, code: e.target.value }))
            }
            placeholder="Secret code for collectible..."
          />
        </div>
      )}

      {formData.type === "location" && (
        <div className="space-y-2">
          <Label>Secret Code</Label>
          <Input
            value={formData.code}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, code: e.target.value }))
            }
            placeholder="Secret code to discover this location..."
            required
          />

          <Label className="mt-4">Collectible Items in Location</Label>
          <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-lg">
            {AdminStore.achievements
              .filter((a) => a.type === "collectible")
              .map((collectible) => (
                <div
                  key={collectible.id}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors",
                    formData.foundItems?.includes(collectible.id)
                      ? "border-primary bg-primary/5"
                      : "hover:bg-accent"
                  )}
                  onClick={() => {
                    const currentItems = formData.foundItems || [];
                    const updated = currentItems.includes(collectible.id)
                      ? currentItems.filter((id) => id !== collectible.id)
                      : [...currentItems, collectible.id];
                    setFormData((prev) => ({ ...prev, foundItems: updated }));
                  }}
                >
                  <div className="relative h-10 w-10 flex-shrink-0">
                    <Image
                      src={collectible.image || "/placeholder-image.png"}
                      alt={collectible.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <span className="text-sm font-medium line-clamp-2">
                    {collectible.name}
                  </span>
                  {formData.foundItems?.includes(collectible.id) ? (
                    <Check className="h-4 w-4 text-primary ml-auto" />
                  ) : (
                    <Plus className="h-4 w-4 text-muted-foreground ml-auto" />
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Unlocks Add-ons</Label>
        <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-lg">
          {availableAddons.map((addon) => (
            <div
              key={addon.id}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors",
                formData.unlocksAddons?.includes(addon.id)
                  ? "border-primary bg-primary/5"
                  : "hover:bg-accent"
              )}
              onClick={() => {
                const currentAddons = formData.unlocksAddons || [];
                const updated = currentAddons.includes(addon.id)
                  ? currentAddons.filter((id) => id !== addon.id)
                  : [...currentAddons, addon.id];
                setFormData((prev) => ({ ...prev, unlocksAddons: updated }));
              }}
            >
              <div className="relative h-10 w-10 flex-shrink-0">
                <Image
                  src={addon.thumbnail || "/placeholder-image.png"}
                  alt={addon.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <span className="text-sm font-medium line-clamp-2">
                {addon.name}
              </span>
              {formData.unlocksAddons?.includes(addon.id) ? (
                <Check className="h-4 w-4 text-primary ml-auto" />
              ) : (
                <Plus className="h-4 w-4 text-muted-foreground ml-auto" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Image</Label>
        <div className="flex items-center gap-4">
          {formData.image ? (
            <div className="relative h-20 w-20">
              <Image
                src={formData.image}
                alt="Achievement image"
                fill
                className="object-cover rounded-md"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2"
                onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="h-20 w-20 border-2 border-dashed rounded-md flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="isHidden"
            checked={formData.isHidden}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, isHidden: checked }))
            }
          />
          <Label htmlFor="isHidden">Hidden Achievement</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Achievement
        </Button>
      </div>
    </form>
  );
};

const AchievementsPage = observer(() => {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
      await Promise.all([
        AdminStore.fetchAchievements(),
        AdminStore.fetchProducts(),
      ]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
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
        await AdminStore.updateAchievement(formData.id, formData);
      } else {
        await AdminStore.createAchievement(formData);
      }
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Achievement saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save achievement",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;

    try {
      await AdminStore.deleteAchievement(id);
      toast({
        title: "Success",
        description: "Achievement deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete achievement",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleBulkUpload = async () => {
    try {
      await AdminStore.bulkUploadAchievements(dummyAchievements);
      toast({
        title: "Success",
        description: "Achievements uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload achievements",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Are you sure you want to delete all achievements?")) return;

    try {
      await AdminStore.deleteAllAchievements();
      toast({
        title: "Success",
        description: "All achievements deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete achievements",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Achievements</h1>
        <div className="flex gap-2">
          <Button
            onClick={handleBulkUpload}
            disabled={AdminStore.loading.achievements}
          >
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAll}
            disabled={AdminStore.loading.achievements}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete All
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedAchievement(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Achievement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedAchievement ? "Edit Achievement" : "Add Achievement"}
                </DialogTitle>
              </DialogHeader>
              <AchievementForm
                achievement={selectedAchievement}
                onSave={handleSave}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {AdminStore.achievements.map((achievement) => (
          <Card key={achievement.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="relative w-8 h-8">
                  <Image
                    src={achievement.image}
                    alt={achievement.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                {achievement.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="outline" className="capitalize">
                  {achievement.type}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {achievement.description}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Obtained by:</span>{" "}
                  {achievement.obtainedBy}
                </p>
                {achievement.hint && (
                  <p className="text-sm">
                    <span className="font-medium">Hint:</span>{" "}
                    {achievement.hint}
                  </p>
                )}
                {(achievement.type === "collectible" ||
                  achievement.type === "location") &&
                  achievement.code && (
                    <p className="text-sm">
                      <span className="font-medium">Code:</span>{" "}
                      {achievement.code}
                    </p>
                  )}
                {achievement.type === "location" &&
                  achievement.foundItems?.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-sm font-medium">
                        Collectible Items:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {achievement.foundItems.map((itemId) => {
                          const item = AdminStore.achievements.find(
                            (a) => a.id === itemId
                          );
                          return item ? (
                            <div
                              key={itemId}
                              className="relative w-8 h-8"
                              title={item.name}
                            >
                              <Image
                                src={item.image || "/placeholder-image.png"}
                                alt={item.name}
                                fill
                                className="object-cover rounded-md"
                              />
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                {achievement.unlocksAddons?.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-sm font-medium">Unlocks:</span>
                    <div className="flex gap-2">
                      {achievement.unlocksAddons.map((addonId) => {
                        const addon = AdminStore.products.find(
                          (p) => p.id === addonId
                        );
                        return addon ? (
                          <div
                            key={addonId}
                            className="relative w-8 h-8"
                            title={addon.name}
                          >
                            <Image
                              src={addon.thumbnail || "/placeholder-image.png"}
                              alt={addon.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedAchievement(achievement);
                  setIsDialogOpen(true);
                }}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(achievement.id)}
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

export default AchievementsPage;
