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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import {
  Loader2,
  Plus,
  Upload,
  Search,
  Star,
  Check,
  X,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

const DIFFICULTY_OPTIONS = ["easy", "medium", "hard"];
const TYPE_OPTIONS = ["game", "expansion", "add-on"];
const RATING_OPTIONS = [1, 2, 3, 4, 5];
const MECHANICS_OPTIONS = [
  "push-your-luck",
  "resource-management",
  "engine-builder",
  "deck-building",
  "worker-placement",
  "area-control",
];

const ProductForm = ({ product, onSave, onCancel }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: product?.id || String(Date.now()),
    name: product?.name || "",
    description: product?.description || "",
    thumbnail: product?.thumbnail || "",
    price: product?.price || 0,
    stats: product?.stats || {
      minPlayers: 1,
      maxPlayers: 4,
      minDuration: "30",
      maxDuration: "60",
      age: "12",
    },
    complexity: product?.complexity || 1,
    difficulty: product?.difficulty || "easy",
    interaction: product?.interaction || 1,
    luck: product?.luck || 1,
    mechanics: product?.mechanics || [],
    type: product?.type || "game",
    relatedExpansions: product?.relatedExpansions || [],
    relatedAddons: product?.relatedAddons || [],
    relatedGames: product?.relatedGames || "",
    slug: product?.slug || "",
    averageRating: product?.averageRating || 0,
    requiredAchievements: product?.requiredAchievements || [],
    kickstarter: product?.kickstarter || {
      kickstarterActive: false,
      backers: "",
      funded: "",
      date: "",
      thumbnail: "",
      kickstarterLink: product?.kickstarterLink || "",
    },
    howToPlayVideo: product?.howToPlayVideo || "",
    rulebookLink: product?.rulebookLink || "",
    neededComponents: product?.neededComponents || [],
    providedComponents: product?.providedComponents || [],
    carouselImages: product?.carouselImages || [],
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("folder", `products/${formData.slug || "temp"}`);
      formDataUpload.append("filename", `${Date.now()}_${file.name}`);

      const token = await auth.currentUser?.getIdToken();
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataUpload,
      });

      if (!response.ok) throw new Error("Upload failed");
      const { url } = await response.json();
      setFormData((prev) => ({ ...prev, thumbnail: url }));
      toast({ title: "Success", description: "Image uploaded successfully" });
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

  const handleMechanicsChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      mechanics: prev.mechanics.includes(value)
        ? prev.mechanics.filter((m) => m !== value)
        : [...prev.mechanics, value],
    }));
  };

  const isBaseGame = formData.type === "game";

  useEffect(() => {
    if (AdminStore.achievements.length === 0) {
      AdminStore.fetchAchievements();
    }
  }, []);

  const getRelevantFormData = (data) => {
    // Base properties that all product types share
    const baseProperties = {
      id: data.id,
      name: data.name,
      description: data.description,
      thumbnail: data.thumbnail,
      type: data.type,
      slug: data.slug,
      neededComponents: data.neededComponents,
      providedComponents: data.providedComponents,
      carouselImages: data.carouselImages || [],
    };

    // Add type-specific properties
    switch (data.type) {
      case "game":
        return {
          ...baseProperties,
          price: data.price,
          stats: {
            minPlayers: data.stats.minPlayers,
            maxPlayers: data.stats.maxPlayers,
            minDuration: data.stats.minDuration,
            maxDuration: data.stats.maxDuration,
            age: data.stats.age,
          },
          complexity: data.complexity,
          difficulty: data.difficulty,
          interaction: data.interaction,
          luck: data.luck,
          mechanics: data.mechanics,
          relatedExpansions: data.relatedExpansions,
          relatedAddons: data.relatedAddons,
          averageRating: data.averageRating,
          kickstarter: data.kickstarter,
          howToPlayVideo: data.howToPlayVideo,
          rulebookLink: data.rulebookLink,
        };
      case "expansion":
        return {
          ...baseProperties,
          price: data.price,
          relatedGames: data.relatedGames,
          howToPlayVideo: data.howToPlayVideo,
          rulebookLink: data.rulebookLink,
        };
      case "add-on":
        return {
          ...baseProperties,
          requiredAchievements: data.requiredAchievements,
          relatedGames: data.relatedGames,
        };
      default:
        return baseProperties;
    }
  };

  const CarouselImageManager = ({ images, onChange, productSlug }) => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleImageUpload = async (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      setLoading(true);
      try {
        const uploadedUrls = [];
        for (const file of files) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", `products/${productSlug}/carousel`);
          formData.append("filename", `${Date.now()}_${file.name}`);

          const token = await auth.currentUser?.getIdToken();
          const response = await fetch("/api/admin/upload", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });

          if (!response.ok) throw new Error("Upload failed");
          const { url } = await response.json();
          uploadedUrls.push(url);
        }

        onChange([...images, ...uploadedUrls]);
        toast({
          title: "Success",
          description: "Images uploaded successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload images",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const removeImage = async (index) => {
      try {
        const imageUrl = images[index];
        const token = await auth.currentUser?.getIdToken();
        await fetch("/api/admin/upload", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileUrl: imageUrl }),
        });

        const newImages = [...images];
        newImages.splice(index, 1);
        onChange(newImages);
        toast({ title: "Success", description: "Image removed successfully" });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to remove image",
          variant: "destructive",
        });
      }
    };

    const reorderImages = (dragIndex, dropIndex) => {
      const newImages = [...images];
      const [draggedImage] = newImages.splice(dragIndex, 1);
      newImages.splice(dropIndex, 0, draggedImage);
      onChange(newImages);
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-square rounded-lg border overflow-hidden"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("index", index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const dragIndex = parseInt(e.dataTransfer.getData("index"));
                reorderImages(dragIndex, index);
              }}
            >
              <Image
                src={image}
                alt={`Carousel image ${index + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeImage(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <label className="relative aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors">
            <Upload className="h-8 w-8 mb-2" />
            <span>Upload Images</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={loading}
            />
          </label>
        </div>
      </div>
    );
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const relevantData = getRelevantFormData(formData);
        onSave(relevantData);
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
          disabled={!!product}
        />
      </div>

      <div className="space-y-2">
        <Label>Slug</Label>
        <Input
          value={formData.slug}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, slug: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Thumbnail</Label>
        <div className="relative h-48 w-full rounded-lg border-2 border-dashed">
          {formData.thumbnail ? (
            <div className="relative w-full h-full">
              <Image
                src={formData.thumbnail}
                alt="Product thumbnail"
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
        <Label>Product Images</Label>
        <CarouselImageManager
          images={[formData.thumbnail, ...formData.carouselImages]}
          onChange={(images) => {
            const [thumbnail, ...carouselImages] = images;
            setFormData((prev) => ({
              ...prev,
              thumbnail,
              carouselImages,
            }));
          }}
          productSlug={formData.slug}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                name: e.target.value,
              }))
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
              {TYPE_OPTIONS.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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

      <div className="grid grid-cols-3 gap-4">
        {formData.type !== "add-on" ? (
          <div className="space-y-2">
            <Label>Price ($)</Label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  price: parseFloat(e.target.value),
                }))
              }
              required
            />
          </div>
        ) : (
          <div className="col-span-3 space-y-2">
            <Label>Required Achievements</Label>
            <div className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto p-2 border rounded-lg">
              {AdminStore.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors",
                    (formData.requiredAchievements || []).includes(
                      achievement.id
                    )
                      ? "border-primary bg-primary/5"
                      : "hover:bg-accent"
                  )}
                  onClick={() => {
                    const current = formData.requiredAchievements || [];
                    const updated = current.includes(achievement.id)
                      ? current.filter((id) => id !== achievement.id)
                      : [...current, achievement.id];
                    setFormData((prev) => ({
                      ...prev,
                      requiredAchievements: updated,
                      price: 0, // Reset price for add-ons
                    }));
                  }}
                >
                  <div className="relative h-12 w-12 flex-shrink-0">
                    <Image
                      src={achievement.image || "/placeholder-image.png"}
                      alt={achievement.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{achievement.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {achievement.description}
                    </p>
                  </div>
                  {(formData.requiredAchievements || []).includes(
                    achievement.id
                  ) ? (
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  ) : (
                    <Plus className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
            {formData.requiredAchievements?.length > 0 && (
              <div className="mt-4">
                <Label>Selected Achievements</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.requiredAchievements.map((achievementId) => {
                    const achievement = AdminStore.achievements.find(
                      (a) => a.id === achievementId
                    );
                    if (!achievement) return null;
                    return (
                      <Badge
                        key={achievementId}
                        variant="secondary"
                        className="flex items-center gap-2"
                      >
                        <span className="truncate">{achievement.name}</span>
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData((prev) => ({
                              ...prev,
                              requiredAchievements:
                                prev.requiredAchievements.filter(
                                  (id) => id !== achievementId
                                ),
                            }));
                          }}
                        />
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {isBaseGame && (
          <div className="space-y-2">
            <Label>Min Players</Label>
            <Input
              type="number"
              value={formData.stats.minPlayers}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  stats: {
                    ...prev.stats,
                    minPlayers: parseInt(e.target.value),
                  },
                }))
              }
              required
            />
          </div>
        )}

        {isBaseGame && (
          <div className="space-y-2">
            <Label>Max Players</Label>
            <Input
              type="number"
              value={formData.stats.maxPlayers}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  stats: {
                    ...prev.stats,
                    maxPlayers: parseInt(e.target.value),
                  },
                }))
              }
              required
            />
          </div>
        )}
      </div>

      {isBaseGame && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Min Duration (minutes)</Label>
            <Input
              value={formData.stats.minDuration}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  stats: {
                    ...prev.stats,
                    minDuration: e.target.value,
                  },
                }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Max Duration (minutes)</Label>
            <Input
              value={formData.stats.maxDuration}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  stats: {
                    ...prev.stats,
                    maxDuration: e.target.value,
                  },
                }))
              }
              required
            />
          </div>
        </div>
      )}

      {isBaseGame && (
        <div className="space-y-2">
          <Label>Age</Label>
          <Input
            value={formData.stats.age}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                stats: {
                  ...prev.stats,
                  age: e.target.value,
                },
              }))
            }
            required
          />
        </div>
      )}

      {isBaseGame && (
        <div className="space-y-2">
          <Label>Complexity (1-5)</Label>
          <Select
            value={String(formData.complexity || 1)}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                complexity: parseInt(value),
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select complexity" />
            </SelectTrigger>
            <SelectContent>
              {RATING_OPTIONS.map((rating) => (
                <SelectItem key={rating} value={String(rating)}>
                  {rating}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {isBaseGame && (
        <div className="space-y-2">
          <Label>Interaction (1-5)</Label>
          <Select
            value={String(formData.interaction || 1)}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                interaction: parseInt(value),
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select interaction" />
            </SelectTrigger>
            <SelectContent>
              {RATING_OPTIONS.map((rating) => (
                <SelectItem key={rating} value={String(rating)}>
                  {rating}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {isBaseGame && (
        <div className="space-y-2">
          <Label>Luck (1-5)</Label>
          <Select
            value={String(formData.luck || 1)}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, luck: parseInt(value) }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select luck" />
            </SelectTrigger>
            <SelectContent>
              {RATING_OPTIONS.map((rating) => (
                <SelectItem key={rating} value={String(rating)}>
                  {rating}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {isBaseGame && (
        <div className="space-y-2">
          <Label>Mechanics</Label>
          <div className="grid grid-cols-2 gap-2">
            {MECHANICS_OPTIONS.map((mechanic) => (
              <label key={mechanic} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={mechanic}
                  checked={formData.mechanics.includes(mechanic)}
                  onChange={handleMechanicsChange}
                />
                <span>
                  {mechanic
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {formData.type === "game" && (
        <>
          <div className="space-y-2">
            <Label>Related Expansions</Label>
            <div className="grid grid-cols-3 gap-2">
              {AdminStore.products
                .filter((p) => p.type === "expansion")
                .map((expansion) => (
                  <label
                    key={expansion.id}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      value={expansion.id}
                      checked={(formData.relatedExpansions || []).includes(
                        expansion.id
                      )}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          relatedExpansions: prev.relatedExpansions?.includes(
                            value
                          )
                            ? prev.relatedExpansions.filter(
                                (id) => id !== value
                              )
                            : [...(prev.relatedExpansions || []), value],
                        }));
                      }}
                    />
                    <span>{expansion.name}</span>
                  </label>
                ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Related Add-ons</Label>
            <div className="grid grid-cols-3 gap-2">
              {AdminStore.products
                .filter((p) => p.type === "add-on")
                .map((addon) => (
                  <label key={addon.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={addon.id}
                      checked={(formData.relatedAddons || []).includes(
                        addon.id
                      )}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          relatedAddons: prev.relatedAddons?.includes(value)
                            ? prev.relatedAddons.filter((id) => id !== value)
                            : [...(prev.relatedAddons || []), value],
                        }));
                      }}
                    />
                    <span>{addon.name}</span>
                  </label>
                ))}
            </div>
          </div>
        </>
      )}

      {(formData.type === "expansion" || formData.type === "add-on") && (
        <div className="space-y-2">
          <Label>Related Game</Label>
          <Select
            value={formData.relatedGames}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, relatedGames: value }))
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a game" />
            </SelectTrigger>
            <SelectContent>
              {AdminStore.products
                .filter((p) => p.type === "game")
                .map((game) => (
                  <SelectItem key={game.id} value={game.id}>
                    {game.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {isBaseGame && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Kickstarter Details</Label>
            <div className="grid gap-4 p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="kickstarterActive"
                  checked={formData.kickstarter.kickstarterActive}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      kickstarter: {
                        ...prev.kickstarter,
                        kickstarterActive: e.target.checked,
                      },
                    }))
                  }
                />
                <Label htmlFor="kickstarterActive">Active Campaign</Label>
              </div>

              <div className="space-y-2">
                <Label>Kickstarter Link</Label>
                <Input
                  type="url"
                  value={formData.kickstarter.kickstarterLink}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      kickstarter: {
                        ...prev.kickstarter,
                        kickstarterLink: e.target.value,
                      },
                    }))
                  }
                  placeholder="https://www.kickstarter.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label>Backers</Label>
                <Input
                  value={formData.kickstarter.backers}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      kickstarter: {
                        ...prev.kickstarter,
                        backers: e.target.value,
                      },
                    }))
                  }
                  placeholder="e.g., 1,234"
                />
              </div>

              <div className="space-y-2">
                <Label>Funded Amount</Label>
                <Input
                  value={formData.kickstarter.funded}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      kickstarter: {
                        ...prev.kickstarter,
                        funded: e.target.value,
                      },
                    }))
                  }
                  placeholder="e.g., $123,456"
                />
              </div>

              <div className="space-y-2">
                <Label>Campaign Date</Label>
                <Input
                  value={formData.kickstarter.date}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      kickstarter: {
                        ...prev.kickstarter,
                        date: e.target.value,
                      },
                    }))
                  }
                  placeholder="e.g., March 2024"
                />
              </div>

              <div className="space-y-2">
                <Label>Campaign Thumbnail</Label>
                <Input
                  type="url"
                  value={formData.kickstarter.thumbnail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      kickstarter: {
                        ...prev.kickstarter,
                        thumbnail: e.target.value,
                      },
                    }))
                  }
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {(formData.type === "game" || formData.type === "expansion") && (
        <>
          <div className="space-y-2">
            <Label>How to Play Video</Label>
            <Input
              type="url"
              value={formData.howToPlayVideo}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  howToPlayVideo: e.target.value,
                }))
              }
              placeholder="https://www.youtube.com/..."
            />
          </div>

          <div className="space-y-2">
            <Label>Rulebook Link</Label>
            <Input
              type="url"
              value={formData.rulebookLink}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  rulebookLink: e.target.value,
                }))
              }
              placeholder="https://..."
            />
          </div>
        </>
      )}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Needed Components</Label>
          <ComponentsEditor
            components={formData.neededComponents}
            onChange={(components) =>
              setFormData((prev) => ({ ...prev, neededComponents: components }))
            }
            type="needed"
            productSlug={formData.slug}
          />
        </div>

        <div className="space-y-2">
          <Label>Provided Components</Label>
          <ComponentsEditor
            components={formData.providedComponents}
            onChange={(components) =>
              setFormData((prev) => ({
                ...prev,
                providedComponents: components,
              }))
            }
            type="provided"
            productSlug={formData.slug}
          />
        </div>
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

const ComponentsEditor = ({ components, onChange, type, productSlug }) => {
  const [newComponent, setNewComponent] = useState({
    name: "",
    image: "",
    fileUrl: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingComponent, setEditingComponent] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (e, productSlug) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("folder", `products/${productSlug}/components`);
      formDataUpload.append("filename", `${Date.now()}_${file.name}`);

      const token = await auth.currentUser?.getIdToken();
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataUpload,
      });

      if (!response.ok) throw new Error("Upload failed");
      const { url } = await response.json();
      return url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addComponent = async () => {
    if (!newComponent.name) return;

    try {
      onChange([
        ...components,
        {
          name: newComponent.name,
          image: newComponent.image,
          ...(type === "provided" && newComponent.fileUrl
            ? { fileUrl: newComponent.fileUrl }
            : {}),
        },
      ]);
      setNewComponent({ name: "", image: "", fileUrl: "" });
    } catch (error) {
      console.error("Error adding component:", error);
    }
  };

  const updateComponent = async (index) => {
    try {
      if (!editingComponent) return;

      // If there's a new image and an old image exists, delete the old one
      if (
        editingComponent.image !== components[index].image &&
        components[index].image
      ) {
        const token = await auth.currentUser?.getIdToken();
        await fetch("/api/admin/upload", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileUrl: components[index].image }),
        });
      }

      const updatedComponents = [...components];
      updatedComponents[index] = editingComponent;
      onChange(updatedComponents);
      setEditingIndex(null);
      setEditingComponent(null);
    } catch (error) {
      console.error("Error updating component:", error);
    }
  };

  const removeComponent = async (index, e) => {
    e.stopPropagation(); // Prevent event bubbling
    try {
      const component = components[index];
      if (component.image) {
        const token = await auth.currentUser?.getIdToken();
        await fetch("/api/admin/upload", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileUrl: component.image }),
        });
      }

      const newComponents = [...components];
      newComponents.splice(index, 1);
      onChange(newComponents);
    } catch (error) {
      console.error("Error removing component:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {components.map((component, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 border rounded-lg"
          >
            {editingIndex === index ? (
              // Edit mode
              <div className="flex-1 grid gap-4">
                <div className="space-y-2">
                  <Label>Component Name</Label>
                  <Input
                    value={editingComponent.name}
                    onChange={(e) =>
                      setEditingComponent((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Image</Label>
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0">
                      {editingComponent.image ? (
                        <Image
                          src={editingComponent.image}
                          alt={editingComponent.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-100 rounded-md flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        try {
                          const url = await handleImageUpload(e, productSlug);
                          setEditingComponent((prev) => ({
                            ...prev,
                            image: url,
                          }));
                        } catch (error) {
                          console.error("Error uploading image:", error);
                        }
                      }}
                    />
                  </div>
                </div>

                {type === "provided" && (
                  <div className="space-y-2">
                    <Label>File URL (for download)</Label>
                    <Input
                      value={editingComponent.fileUrl || ""}
                      onChange={(e) =>
                        setEditingComponent((prev) => ({
                          ...prev,
                          fileUrl: e.target.value,
                        }))
                      }
                      placeholder="https://example.com/files/component.pdf"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the URL where users can download this component's
                      files
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingIndex(null);
                      setEditingComponent(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateComponent(index);
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              // View mode
              <>
                <div className="relative h-16 w-16 flex-shrink-0">
                  {component.image ? (
                    <Image
                      src={component.image}
                      alt={component.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-100 rounded-md flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{component.name}</p>
                  {type === "provided" && component.fileUrl && (
                    <p className="text-xs text-muted-foreground truncate">
                      File: {component.fileUrl}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingIndex(index);
                      setEditingComponent({ ...component });
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => removeComponent(index, e)}
                  >
                    Remove
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-4 p-4 border rounded-lg">
        <div className="space-y-2">
          <Label>Component Name</Label>
          <Input
            value={newComponent.name}
            onChange={(e) =>
              setNewComponent((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="e.g., 1x Pen/Pencil per Player"
          />
        </div>
        <div className="space-y-2">
          <Label>Image</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              try {
                const url = await handleImageUpload(e, productSlug);
                setNewComponent((prev) => ({ ...prev, image: url }));
              } catch (error) {
                console.error("Error uploading image:", error);
              }
            }}
          />
        </div>

        {type === "provided" && (
          <div className="space-y-2">
            <Label>File URL (for download)</Label>
            <Input
              value={newComponent.fileUrl}
              onChange={(e) =>
                setNewComponent((prev) => ({
                  ...prev,
                  fileUrl: e.target.value,
                }))
              }
              placeholder="https://example.com/files/component.pdf"
            />
            <p className="text-xs text-muted-foreground">
              Enter the URL where users can download this component's files
            </p>
          </div>
        )}

        <Button onClick={addComponent} disabled={loading || !newComponent.name}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Add Component
        </Button>
      </div>
    </div>
  );
};

const ProductsPage = observer(() => {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGameFilter, setSelectedGameFilter] = useState("all");

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
      await AdminStore.fetchProducts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
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
        const currentProduct = AdminStore.getProductById(formData.id);
        if (currentProduct && currentProduct.type !== formData.type) {
          const propertiesToRemove = {
            game: [
              "stats",
              "complexity",
              "difficulty",
              "interaction",
              "luck",
              "mechanics",
              "relatedExpansions",
              "relatedAddons",
              "averageRating",
              "kickstarter",
              "howToPlayVideo",
              "rulebookLink",
            ],
            expansion: ["relatedGames", "price"],
            "add-on": ["relatedGames", "requiredAchievements"],
          };

          const cleanupProperties =
            propertiesToRemove[currentProduct.type] || [];
          const cleanupData = { ...formData };
          cleanupProperties.forEach((prop) => {
            cleanupData[prop] = null;
          });

          // Preserve carouselImages during type changes
          cleanupData.carouselImages = formData.carouselImages;

          await AdminStore.updateProduct(formData.id, cleanupData);
        }
        await AdminStore.updateProduct(formData.id, formData);
      } else {
        await AdminStore.createProduct(formData);
      }
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Product saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product",
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

  // Get list of base games for the filter
  const baseGames = AdminStore.products.filter(
    (product) => product.type === "game"
  );

  // Updated filtering logic
  const filteredProducts = AdminStore.products.filter((product) => {
    // First apply game filter if selected
    if (selectedGameFilter !== "all") {
      if (product.id === selectedGameFilter) return true; // Show the game itself
      if (product.relatedGames === selectedGameFilter) return true; // Show products related to the game
      return false;
    }

    // Then apply search filter
    return product.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="flex items-center gap-2">
          {/* Game Filter Dropdown */}
          <Select
            value={selectedGameFilter}
            onValueChange={setSelectedGameFilter}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by game" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Games</SelectItem>
              {baseGames.map((game) => (
                <SelectItem key={game.id} value={game.id}>
                  {game.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Existing Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Show active filters */}
          {(selectedGameFilter !== "all" || searchQuery) && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-muted-foreground">
                Active filters:
              </span>
              <div className="flex gap-2">
                {selectedGameFilter !== "all" && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                    onClick={() => setSelectedGameFilter("all")}
                  >
                    Game:{" "}
                    {baseGames.find((g) => g.id === selectedGameFilter)?.name}
                    <X className="h-3 w-3 cursor-pointer" />
                  </Badge>
                )}
                {searchQuery && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                    onClick={() => setSearchQuery("")}
                  >
                    Search: {searchQuery}
                    <X className="h-3 w-3 cursor-pointer" />
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedGameFilter("all");
                  setSearchQuery("");
                }}
              >
                Clear all
              </Button>
            </div>
          )}

          {/* Add Product Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedProduct(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedProduct ? "Edit Product" : "Add Product"}
                </DialogTitle>
              </DialogHeader>
              <ProductForm
                product={selectedProduct}
                onSave={handleSave}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative h-48">
              <Image
                src={product.thumbnail || "/placeholder-image.png"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <div className="space-y-2">
                <CardTitle className="flex items-center justify-between">
                  <span>{product.name}</span>
                  {product.type === "add-on" ? (
                    <div className="text-lg font-normal">
                      ${product.price || 0}
                    </div>
                  ) : (
                    <span className="text-lg font-normal">
                      ${product.price || 0}
                    </span>
                  )}
                </CardTitle>
                <Badge
                  className={cn(
                    "capitalize w-fit",
                    product.type === "game" &&
                      "bg-emerald-400 hover:bg-emerald-600",
                    product.type === "expansion" &&
                      "bg-blue-400 hover:bg-blue-600",
                    product.type === "add-on" &&
                      "bg-orange-400 hover:bg-orange-600"
                  )}
                >
                  {product.type || "game"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description || "No description available"}
              </p>

              {product.type === "add-on" ? (
                <div className="space-y-2">
                  <p className="text-sm font-semibold">
                    Required Achievements:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(product.requiredAchievements || []).map(
                      (achievementId) => {
                        const achievement = AdminStore.achievements.find(
                          (a) => a.id === achievementId
                        );
                        if (!achievement) return null;
                        return (
                          <div
                            key={achievementId}
                            className="flex items-center gap-2 p-1 bg-muted rounded-md"
                            title={achievement.description}
                          >
                            <div className="relative h-6 w-6">
                              <Image
                                src={
                                  achievement.image || "/placeholder-image.png"
                                }
                                alt={achievement.name}
                                fill
                                className="object-cover rounded-sm"
                              />
                            </div>
                            <span className="text-xs">{achievement.name}</span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-lg font-semibold">
                  ${product.price || 0}
                </div>
              )}

              {product.type === "game" && (
                <>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="font-semibold">Players:</span>{" "}
                      {product.stats?.minPlayers || 1}-
                      {product.stats?.maxPlayers || 4}
                    </div>
                    <div>
                      <span className="font-semibold">Age:</span>{" "}
                      {product.stats?.age || "12"}+
                    </div>
                    <div>
                      <span className="font-semibold">Duration:</span>{" "}
                      {product.stats?.minDuration || "30"}-
                      {product.stats?.maxDuration || "60"}min
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      {(product.averageRating || 0).toFixed(1)}
                    </div>
                    <div className="capitalize">
                      {product.difficulty || "easy"}
                    </div>
                  </div>
                </>
              )}

              {product.type === "game" &&
                product.relatedExpansions?.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">Expansions:</p>
                    <div className="flex gap-2 overflow-x-auto">
                      {product.relatedExpansions.map((expId) => {
                        const expansion = AdminStore.getProductById(expId);
                        return (
                          expansion && (
                            <div
                              key={expId}
                              className="flex-shrink-0 relative w-12 h-12 rounded overflow-hidden"
                              title={expansion.name}
                            >
                              <Image
                                src={
                                  expansion.thumbnail ||
                                  "/placeholder-image.png"
                                }
                                alt={expansion.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )
                        );
                      })}
                    </div>
                  </div>
                )}

              {product.type === "game" && product.relatedAddons?.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm font-semibold">Add-ons:</p>
                  <div className="flex gap-2 overflow-x-auto">
                    {product.relatedAddons.map((addonId) => {
                      const addon = AdminStore.getProductById(addonId);
                      return (
                        addon && (
                          <div
                            key={addonId}
                            className="flex-shrink-0 relative w-12 h-12 rounded overflow-hidden"
                            title={addon.name}
                          >
                            <Image
                              src={addon.thumbnail || "/placeholder-image.png"}
                              alt={addon.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )
                      );
                    })}
                  </div>
                </div>
              )}

              {(product.type === "expansion" || product.type === "add-on") &&
                product.relatedGames && (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">Related Game:</p>
                    <div className="flex gap-2">
                      {(() => {
                        const game = AdminStore.getProductById(
                          product.relatedGames
                        );
                        return (
                          game && (
                            <div
                              className="flex-shrink-0 relative w-12 h-12 rounded overflow-hidden"
                              title={game.name}
                            >
                              <Image
                                src={game.thumbnail || "/placeholder-image.png"}
                                alt={game.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )
                        );
                      })()}
                    </div>
                  </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedProduct(product);
                  setIsDialogOpen(true);
                }}
              >
                Edit
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
});

export default ProductsPage;
