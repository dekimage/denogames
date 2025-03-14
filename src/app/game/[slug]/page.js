"use client";
import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  CheckCircle,
  Star,
  Users,
  Clock,
  Layers,
  FileText,
  Package,
  Puzzle,
  ChevronRight,
  ArrowLeft,
  ShoppingBag,
  CheckCheck,
  Info,
  AlertCircle,
  Heart,
  Share2,
} from "lucide-react";
import { LoadingSpinner } from "@/reusable-ui/LoadingSpinner";
import placeholderImg from "@/assets/placeholder.png";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/app/home/page";

const GameDetailsPage = observer(() => {
  const { slug } = useParams();
  const router = useRouter();
  const { fetchProductDetails, addToCart, cart, user, products } = MobxStore;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedExpansions, setRelatedExpansions] = useState([]);
  const [mainGame, setMainGame] = useState(null);
  const [otherExpansions, setOtherExpansions] = useState([]);

  // Image gallery state
  const [selectedImage, setSelectedImage] = useState(0);

  // Example product images (replace with actual data when available)
  const productImages = [
    { id: 0, src: placeholderImg, alt: "Main product image" },
    {
      id: 1,
      src: "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fgame1%2Fimage1.png?alt=media",
      alt: "Product image 1",
    },
    {
      id: 2,
      src: "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fgame1%2Fimage2.png?alt=media",
      alt: "Product image 2",
    },
    {
      id: 3,
      src: "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fgame1%2Fthumbnail.png?alt=media",
      alt: "Product image 3",
    },
  ];

  useEffect(() => {
    const loadProductDetails = async () => {
      try {
        setLoading(true);
        const productData = await fetchProductDetails(slug);
        console.log(productData);

        if (!productData) {
          setError("Product not found");
          return;
        }

        setProduct(productData);

        // Set the first image to be the product thumbnail if available
        if (productData.thumbnail) {
          productImages[0] = {
            id: 0,
            src: productData.thumbnail,
            alt: productData.name,
          };
        }

        // Find related content
        if (productData.type === "game") {
          // For games, find related expansions
          const expansions = products.filter(
            (p) =>
              p.type === "expansion" &&
              p.relatedGames &&
              p.relatedGames.includes(productData.id)
          );
          setRelatedExpansions(expansions);
        } else if (
          productData.type === "expansion" &&
          productData.relatedGames?.length > 0
        ) {
          // For expansions, find the main game and other expansions
          const mainGameId = productData.relatedGames[0];
          const mainGameData = products.find((p) => p.id === mainGameId);
          setMainGame(mainGameData);

          // Find other expansions for the same game
          const otherExps = products.filter(
            (p) =>
              p.id !== productData.id &&
              p.type === "expansion" &&
              p.relatedGames &&
              p.relatedGames.includes(mainGameId)
          );
          setOtherExpansions(otherExps);
        }
      } catch (err) {
        console.error("Error loading product details:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadProductDetails();
    }
  }, [slug, fetchProductDetails, products]);

  if (loading) {
    return (
      <div className="container mx-auto py-16 flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-8 text-muted-foreground">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const isInCart = cart.includes(product.id);
  const isPurchased = user
    ? user.purchasedProducts?.includes(product.id)
    : false;

  // Example data for components (replace with actual data when available)
  const providedComponents = [
    "1x Rulebook",
    "1x Game board",
    "120x Game cards",
    "4x Player boards",
    "60x Wooden tokens",
    "1x Scorepad",
  ];

  const requiredComponents = [
    "1x Pen per player",
    "4x Six-sided dice",
    "Timer (optional)",
  ];

  // Generate star rating display
  const renderRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className="h-5 w-5 fill-yellow-400 text-yellow-400"
          />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="h-5 w-5 text-yellow-400" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-5 w-5 text-yellow-400" />
        ))}
        <span className="ml-2 text-sm font-medium">
          {rating.toFixed(1)} ({product.totalReviews || 0} reviews)
        </span>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm mb-6">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
        <Link
          href="/shop"
          className="text-muted-foreground hover:text-foreground"
        >
          Shop
        </Link>
        <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
        <span className="font-medium truncate">{product.name}</span>
      </div>

      {/* Back button */}
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      {/* Product Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image Gallery */}
        <div className="border rounded-lg shadow-sm overflow-hidden bg-card">
          <div className="relative aspect-square">
            <Image
              src={productImages[selectedImage].src}
              alt={productImages[selectedImage].alt}
              fill
              className="object-contain p-4"
            />
          </div>

          {/* Image gallery thumbnails */}
          <div className="flex p-4 gap-2 overflow-x-auto">
            {productImages.map((image, index) => (
              <div
                key={image.id}
                className={`w-16 h-16 border rounded flex-shrink-0 cursor-pointer overflow-hidden transition-all ${
                  selectedImage === index
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-muted hover:border-primary/50"
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
            </Badge>
            {isPurchased && (
              <Badge className="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <CheckCircle className="h-3.5 w-3.5 mr-1" /> Owned
              </Badge>
            )}
            {product.mechanics?.slice(0, 2).map((mechanic, index) => (
              <Badge key={index} variant="secondary">
                {mechanic}
              </Badge>
            ))}
          </div>

          <h1 className="text-3xl font-strike mb-2">{product.name}</h1>

          {product.averageRating && (
            <div className="mb-4">{renderRating(product.averageRating)}</div>
          )}

          <p className="text-2xl font-bold text-primary mb-6">
            ${product.price}
          </p>

          <div className="flex flex-wrap gap-4 mb-6">
            {product.minPlayers && product.maxPlayers && (
              <div className="flex items-center bg-muted/30 px-3 py-1.5 rounded-full">
                <Users className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm">
                  {product.minPlayers}-{product.maxPlayers} Players
                </span>
              </div>
            )}

            {product.playTime && (
              <div className="flex items-center bg-muted/30 px-3 py-1.5 rounded-full">
                <Clock className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm">{product.playTime} min</span>
              </div>
            )}

            {product.complexity && (
              <div className="flex items-center bg-muted/30 px-3 py-1.5 rounded-full">
                <Layers className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm">
                  Complexity: {product.complexity}/5
                </span>
              </div>
            )}

            {product.age && (
              <div className="flex items-center bg-muted/30 px-3 py-1.5 rounded-full">
                <Info className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm">Age: {product.age}+</span>
              </div>
            )}
          </div>

          <div className="mb-6 p-4 border rounded-lg bg-muted/10">
            <p className="text-muted-foreground">
              {product.description || "No description available."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {isPurchased ? (
              <Button className="w-full sm:w-auto bg-black hover:bg-black/80 text-white">
                PLAY
              </Button>
            ) : isInCart ? (
              <div className="flex w-full sm:w-auto items-center">
                <Link href="/cart" className="w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white dark:bg-orange-600 dark:hover:bg-orange-700"
                  >
                    <ShoppingBag size={16} className="mr-1" /> CHECKOUT
                  </Button>
                </Link>
                <div className="flex justify-center items-center ml-4">
                  <CheckCheck
                    className="text-orange-500 dark:text-orange-400 mr-2"
                    size={20}
                  />
                  <span className="text-orange-500 dark:text-orange-400">
                    IN CART
                  </span>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => addToCart(product)}
                className="w-full sm:w-auto"
              >
                <ShoppingCart size={16} className="mr-1" /> ADD TO CART
              </Button>
            )}

            <Button variant="outline" className="w-full sm:w-auto">
              <Heart size={16} className="mr-1" /> Wishlist
            </Button>

            <Button variant="outline" className="w-full sm:w-auto">
              <Share2 size={16} className="mr-1" /> Share
            </Button>
          </div>

          {/* Related Game/Expansion Info */}
          {product.type === "expansion" && mainGame && (
            <div className="border rounded-lg p-4 bg-primary/5">
              <h3 className="font-medium mb-2">Required Base Game:</h3>
              <Link
                href={`/game/${mainGame.slug}`}
                className="flex items-center text-primary hover:underline"
              >
                <Package className="h-4 w-4 mr-2" />
                {mainGame.name}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Game Details Section */}
      <section className="mb-12">
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-strike">Game Details</h2>
          <div className="ml-4 flex-grow h-px bg-border"></div>
        </div>
        <div className="border rounded-lg shadow-sm p-6 bg-card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-muted-foreground mb-4">
                {product.description || "No detailed description available."}
              </p>

              {product.mechanics && product.mechanics.length > 0 && (
                <>
                  <h3 className="font-medium mb-2">Game Mechanics</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.mechanics.map((mechanic, index) => (
                      <Badge key={index} variant="secondary">
                        {mechanic}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div>
              <ul className="space-y-2 text-muted-foreground">
                {product.minPlayers && product.maxPlayers && (
                  <li className="flex justify-between border-b pb-2">
                    <span>Players:</span>
                    <span className="font-medium">
                      {product.minPlayers}-{product.maxPlayers}
                    </span>
                  </li>
                )}
                {product.playTime && (
                  <li className="flex justify-between border-b pb-2">
                    <span>Play Time:</span>
                    <span className="font-medium">
                      {product.playTime} minutes
                    </span>
                  </li>
                )}
                {product.complexity && (
                  <li className="flex justify-between border-b pb-2">
                    <span>Complexity:</span>
                    <span className="font-medium">{product.complexity}/5</span>
                  </li>
                )}
                {product.age && (
                  <li className="flex justify-between border-b pb-2">
                    <span>Age:</span>
                    <span className="font-medium">{product.age}+</span>
                  </li>
                )}
                {product.designer && (
                  <li className="flex justify-between border-b pb-2">
                    <span>Designer:</span>
                    <span className="font-medium">{product.designer}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Components Section */}
      <section className="mb-12">
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-strike">Components</h2>
          <div className="ml-4 flex-grow h-px bg-border"></div>
        </div>
        <div className="border rounded-lg shadow-sm p-6 bg-card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-medium mb-4 flex items-center text-primary">
                <Package className="h-5 w-5 mr-2" />
                Provided Components
              </h3>
              <ul className="space-y-2">
                {providedComponents.map((component, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span>{component}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-4 flex items-center text-blue-600 dark:text-blue-400">
                <Info className="h-5 w-5 mr-2" />
                Required Components
              </h3>
              <ul className="space-y-2">
                {requiredComponents.map((component, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>{component}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="mb-12">
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-strike">Game Rules</h2>
          <div className="ml-4 flex-grow h-px bg-border"></div>
        </div>
        <div className="border rounded-lg shadow-sm p-6 bg-card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Button
                variant="outline"
                className="mb-4 bg-primary/5 border-primary/20 hover:bg-primary/10"
              >
                <FileText className="mr-2 h-4 w-4" /> Download Rulebook PDF
              </Button>

              <p className="text-muted-foreground">
                Download the complete rulebook for detailed instructions on how
                to play {product.name}. The PDF includes setup instructions,
                gameplay rules, and strategy tips.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-4">Video Tutorial</h3>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/NgTymmSsesw"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="mb-12">
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-strike">Customer Reviews</h2>
          <div className="ml-4 flex-grow h-px bg-border"></div>
        </div>
        <div className="border rounded-lg shadow-sm p-6 bg-card">
          {product.totalReviews > 0 ? (
            <div>
              <div className="flex flex-col md:flex-row md:items-center mb-6">
                <div className="mb-4 md:mb-0 md:mr-8 text-center md:text-left">
                  <p className="text-5xl font-bold">
                    {product.averageRating?.toFixed(1) || "0.0"}
                  </p>
                  <div className="flex justify-center md:justify-start">
                    {renderRating(product.averageRating || 0)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on {product.totalReviews} reviews
                  </p>
                </div>

                <div className="flex-1">
                  {/* Rating distribution bars */}
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center">
                        <span className="w-8 text-sm">{star} ★</span>
                        <div className="flex-1 h-2 bg-muted rounded-full mx-2 overflow-hidden">
                          <div
                            className="h-full bg-yellow-400"
                            style={{ width: `${Math.random() * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-8 text-right">
                          {Math.floor(Math.random() * product.totalReviews)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-6">
                <p className="text-center text-muted-foreground">
                  Reviews would be loaded and displayed here.
                </p>

                <div className="flex justify-center">
                  <Button>Load More Reviews</Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No reviews yet. Be the first to review this product!
              </p>
              <Button>Write a Review</Button>
            </div>
          )}
        </div>
      </section>

      {/* Related Products Section */}
      {product.type === "game" && relatedExpansions.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-strike">Available Expansions</h2>
            <div className="ml-4 flex-grow h-px bg-border"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedExpansions.map((expansion) => (
              <ProductCard key={expansion.id} product={expansion} />
            ))}
          </div>
        </section>
      )}

      {product.type === "expansion" && otherExpansions.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-strike">Other Expansions</h2>
            <div className="ml-4 flex-grow h-px bg-border"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherExpansions.map((expansion) => (
              <ProductCard key={expansion.id} product={expansion} />
            ))}
          </div>
        </section>
      )}

      {/* You May Also Like Section */}
      <section className="mb-12">
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-strike">You May Also Like</h2>
          <div className="ml-4 flex-grow h-px bg-border"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products
            .filter(
              (p) =>
                p.id !== product.id &&
                p.type === product.type &&
                (!product.mechanics ||
                  !p.mechanics ||
                  p.mechanics.some((m) => product.mechanics.includes(m)))
            )
            .slice(0, 4)
            .map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
        </div>
      </section>
    </div>
  );
});

export default GameDetailsPage;
