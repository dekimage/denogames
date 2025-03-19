"use client";

import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
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
import {
  Loader2,
  Plus,
  Trash,
  Upload,
  X,
  Search,
  Filter,
  SlidersHorizontal,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AdminStore from "@/mobx/AdminStore";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("type-asc");
  const [filteredAchievements, setFilteredAchievements] = useState([]);
  const [typeFilters, setTypeFilters] = useState({
    collectible: true,
    location: true,
    achievement: true,
  });

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

  // Apply search, sort and filters
  useEffect(() => {
    let filtered = [...AdminStore.achievements];

    // Apply type filters
    filtered = filtered.filter((achievement) => {
      const type = achievement.type || "achievement";
      return typeFilters[type];
    });

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (achievement) =>
          achievement.name?.toLowerCase().includes(query) ||
          achievement.description?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const typeA = a.type || "achievement";
      const typeB = b.type || "achievement";

      switch (sortOption) {
        case "type-asc":
          return typeA.localeCompare(typeB);
        case "type-desc":
          return typeB.localeCompare(typeA);
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "oldest":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        default:
          return 0;
      }
    });

    setFilteredAchievements(filtered);
  }, [AdminStore.achievements, searchQuery, sortOption, typeFilters]);

  // Get count of each achievement type
  const typeCounts = AdminStore.achievements.reduce((acc, achievement) => {
    const type = achievement.type || "achievement";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Get badge color based on achievement type
  const getTypeBadgeStyles = (type) => {
    switch (type) {
      case "collectible":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200";
      case "location":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default:
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
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
    <div className="w-full px-4 sm:px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Achievements</h1>
        <Button
          onClick={() => {
            setSelectedAchievement(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Create Achievement
        </Button>
      </div>

      {/* Search, Filter and Sort Controls */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search achievements..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Type Filters */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {Object.values(typeFilters).includes(false) && (
                <Badge variant="secondary" className="ml-2">
                  {Object.values(typeFilters).filter(Boolean).length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-4">
            <div className="space-y-4">
              <h4 className="font-medium">Filter by Type</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="filter-collectible"
                    checked={typeFilters.collectible}
                    onCheckedChange={(checked) =>
                      setTypeFilters({ ...typeFilters, collectible: !!checked })
                    }
                  />
                  <label
                    htmlFor="filter-collectible"
                    className="text-sm flex items-center"
                  >
                    <Badge
                      className={cn("mr-2", getTypeBadgeStyles("collectible"))}
                    >
                      Collectible
                    </Badge>
                    <span className="text-muted-foreground">
                      ({typeCounts.collectible || 0})
                    </span>
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="filter-location"
                    checked={typeFilters.location}
                    onCheckedChange={(checked) =>
                      setTypeFilters({ ...typeFilters, location: !!checked })
                    }
                  />
                  <label
                    htmlFor="filter-location"
                    className="text-sm flex items-center"
                  >
                    <Badge
                      className={cn("mr-2", getTypeBadgeStyles("location"))}
                    >
                      Location
                    </Badge>
                    <span className="text-muted-foreground">
                      ({typeCounts.location || 0})
                    </span>
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="filter-achievement"
                    checked={typeFilters.achievement}
                    onCheckedChange={(checked) =>
                      setTypeFilters({ ...typeFilters, achievement: !!checked })
                    }
                  />
                  <label
                    htmlFor="filter-achievement"
                    className="text-sm flex items-center"
                  >
                    <Badge
                      className={cn("mr-2", getTypeBadgeStyles("achievement"))}
                    >
                      Achievement
                    </Badge>
                    <span className="text-muted-foreground">
                      ({typeCounts.achievement || 0})
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setTypeFilters({
                      collectible: true,
                      location: true,
                      achievement: true,
                    })
                  }
                >
                  Reset
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Sort Options */}
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-full md:w-[220px]">
            <SortAsc className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="type-asc">Type (A-Z)</SelectItem>
            <SelectItem value="type-desc">Type (Z-A)</SelectItem>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Stats */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredAchievements.length} of{" "}
        {AdminStore.achievements.length} achievements
      </div>

      {/* Achievement Cards with expanded grid - SMALLER CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-3">
        {filteredAchievements.map((achievement) => (
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden h-full"
            key={achievement.id}
            onClick={() => {
              setSelectedAchievement(achievement);
              setIsDialogOpen(true);
            }}
          >
            <div className="relative w-full aspect-square bg-gray-100">
              <Image
                src={achievement.image || "/placeholder-image.png"}
                alt={achievement.name}
                fill
                className="object-cover"
              />
            </div>

            <CardContent className="p-2 space-y-2">
              <div className="font-medium text-sm line-clamp-1">
                {achievement.name}
              </div>

              {/* Type badge with custom colors - smaller */}
              <Badge
                className={cn(
                  "capitalize text-xs px-1.5 py-0",
                  getTypeBadgeStyles(achievement.type)
                )}
              >
                {achievement.type || "achievement"}
              </Badge>

              {/* Only show unlocks if they exist - compact version */}
              {achievement.unlocksAddons?.length > 0 && (
                <div className="pt-1">
                  <div className="text-xs text-muted-foreground mb-1">
                    Unlocks:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {achievement.unlocksAddons.map((addonId) => {
                      const addon = AdminStore.products.find(
                        (p) => p.id === addonId
                      );
                      return addon ? (
                        <div
                          key={addonId}
                          className="relative w-6 h-6 border rounded-sm overflow-hidden tooltip"
                          data-tip={addon.name}
                        >
                          <Image
                            src={addon.thumbnail || "/placeholder-image.png"}
                            alt={addon.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No results message */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No achievements found</h3>
          <p className="text-muted-foreground mb-4">
            No achievements match your current search and filters.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSortOption("type-asc");
              setTypeFilters({
                collectible: true,
                location: true,
                achievement: true,
              });
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Your existing dialog code goes here */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
  );
});

export default AchievementsPage;
