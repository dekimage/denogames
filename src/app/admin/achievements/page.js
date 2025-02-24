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
import { Loader2, Plus, Trash, Upload } from "lucide-react";
import { achievements as dummyAchievements } from "@/data/achievements";
import { useToast } from "@/components/ui/use-toast";
import AdminStore from "@/mobx/AdminStore";

const AchievementForm = ({ achievement, onSave, onCancel }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(
    achievement || {
      id: "",
      key: "",
      name: "",
      description: "",
      requirement: "",
      image: "",
      difficulty: 1,
      isHidden: false,
      unlocksRewards: [],
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
      formData.append("filename", `${formData.id || Date.now()}_${file.name}`);

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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onSave(formData);
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="id">ID</Label>
          <Input
            id="id"
            value={formData.id}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, id: e.target.value }))
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="key">Key</Label>
          <Input
            id="key"
            value={formData.key}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, key: e.target.value }))
            }
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirement">Requirement</Label>
        <Textarea
          id="requirement"
          value={formData.requirement}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, requirement: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <div className="flex items-center gap-4">
          {formData.image && (
            <div className="relative w-20 h-20">
              <Image
                src={formData.image}
                alt="Achievement"
                fill
                className="object-cover rounded-md"
              />
            </div>
          )}
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="flex-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select
            value={formData.difficulty}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, difficulty: parseInt(value) }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={1}>1 Star</SelectItem>
              <SelectItem value={2}>2 Stars</SelectItem>
              <SelectItem value={3}>3 Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="isHidden">Hidden Achievement</Label>
          <Switch
            id="isHidden"
            checked={formData.isHidden}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, isHidden: checked }))
            }
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} type="button">
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
      await AdminStore.fetchAchievements();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch achievements",
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
              <p className="text-sm text-muted-foreground mb-2">
                {achievement.description}
              </p>
              <p className="text-sm">Requirement: {achievement.requirement}</p>
              <div className="flex items-center gap-2 mt-2">
                <span>Difficulty:</span>
                {Array.from({ length: achievement.difficulty }).map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    ★
                  </span>
                ))}
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
