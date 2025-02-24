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
import { Loader2, Plus, Upload, Search, Star } from "lucide-react";

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
    minPlayers: product?.minPlayers || 1,
    maxPlayers: product?.maxPlayers || 1,
    age: product?.age || "8",
    duration: product?.duration || "30",
    complexity: product?.complexity || 1,
    difficulty: product?.difficulty || "easy",
    interaction: product?.interaction || 1,
    luck: product?.luck || 1,
    mechanics: product?.mechanics || [],
    type: product?.type || "game",
    relatedExpansions: product?.relatedExpansions || [],
    relatedGame: product?.relatedGame || "",
    slug: product?.slug || "",
    averageRating: product?.averageRating || 0,
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

        <div className="space-y-2">
          <Label>Min Players</Label>
          <Input
            type="number"
            value={formData.minPlayers}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                minPlayers: parseInt(e.target.value),
              }))
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Max Players</Label>
          <Input
            type="number"
            value={formData.maxPlayers}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                maxPlayers: parseInt(e.target.value),
              }))
            }
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Age</Label>
          <Input
            value={formData.age}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, age: e.target.value }))
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Duration (minutes)</Label>
          <Input
            value={formData.duration}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, duration: e.target.value }))
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Difficulty</Label>
          <Select
            value={formData.difficulty}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, difficulty: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTY_OPTIONS.map((diff) => (
                <SelectItem key={diff} value={diff}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Complexity (1-5)</Label>
          <Select
            value={String(formData.complexity || 1)}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, complexity: parseInt(value) }))
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

        <div className="space-y-2">
          <Label>Interaction (1-5)</Label>
          <Select
            value={String(formData.interaction || 1)}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, interaction: parseInt(value) }))
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
      </div>

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

      {formData.type === "game" && (
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
                          ? prev.relatedExpansions.filter((id) => id !== value)
                          : [...(prev.relatedExpansions || []), value],
                      }));
                    }}
                  />
                  <span>{expansion.name}</span>
                </label>
              ))}
          </div>
        </div>
      )}

      {formData.type === "expansion" && (
        <div className="space-y-2">
          <Label>Related Game</Label>
          <Select
            value={formData.relatedGame}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, relatedGame: value }))
            }
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

const ProductsPage = observer(() => {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState(null);
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

  const handleDelete = async (id) => {
    try {
      await AdminStore.deleteProduct(id);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
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

  const filteredProducts = AdminStore.products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
              <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded">
                {product.type || "game"}
              </div>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{product.name}</span>
                <span className="text-lg font-normal">
                  ${product.price || 0}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description || "No description available"}
              </p>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="font-semibold">Players:</span>{" "}
                  {product.minPlayers || 1}-{product.maxPlayers || 1}
                </div>
                <div>
                  <span className="font-semibold">Age:</span>{" "}
                  {product.age || "8"}+
                </div>
                <div>
                  <span className="font-semibold">Duration:</span>{" "}
                  {product.duration || "30"}min
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  {(product.averageRating || 0).toFixed(1)}
                </div>
                <div className="capitalize">{product.difficulty || "easy"}</div>
              </div>
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
              {product.type === "expansion" && product.relatedGame && (
                <div className="space-y-1">
                  <p className="text-sm font-semibold">Related Game:</p>
                  <div className="flex gap-2">
                    {(() => {
                      const game = AdminStore.getProductById(
                        product.relatedGame
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
            <CardFooter className="flex justify-end gap-2">
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
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(product.id)}
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

export default ProductsPage;
