"use client";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { LoadingSpinner } from "@/reusable-ui/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Filter,
  Search,
  SlidersHorizontal,
  X,
  Home,
  Swords,
  Castle,
  HeartHandshake,
  PartyPopper,
  WalletCards,
  Dice2,
  Dice4,
  Dice6,
  Joystick,
  Puzzle,
  Box,
  Users,
  AlertCircle,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";

// Filter options
const typeOptions = [
  { name: "Competitive", icon: Swords },
  { name: "Engine Building", icon: Castle },
  { name: "Co-op", icon: HeartHandshake },
  { name: "Party", icon: PartyPopper },
  { name: "Deck-building", icon: WalletCards },
];

const difficultyOptions = [
  { name: "Easy", icon: Dice2 },
  { name: "Medium", icon: Dice4 },
  { name: "Hard", icon: Dice6 },
];

const productOptions = [
  { name: "Game", icon: Joystick },
  { name: "Expansion", icon: Puzzle },
  { name: "Add-on", icon: Box },
];

// Sort options
const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "a-z", label: "A-Z" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
  { value: "product-type", label: "Product Type" },
];

// Helper function to get icon for a filter option
const getIconForOption = (option) => {
  const iconOption =
    typeOptions.find(
      (type) => type.name.toLowerCase() === option.toLowerCase()
    ) ||
    difficultyOptions.find(
      (diff) => diff.name.toLowerCase() === option.toLowerCase()
    ) ||
    productOptions.find(
      (prod) => prod.name.toLowerCase() === option.toLowerCase()
    );

  if (iconOption) {
    const IconComponent = iconOption.icon;
    return <IconComponent className="h-4 w-4" />;
  }
  return null;
};

// Filter Badge Component
const FilterBadge = ({ label, onRemove, icon }) => (
  <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1">
    {icon && <span className="mr-1">{icon}</span>}
    {label}
    <X className="h-3 w-3 cursor-pointer ml-1" onClick={onRemove} />
  </Badge>
);

// Desktop Filter Section Component
const FilterSection = ({ title, options, selectedOptions, onToggle }) => (
  <div className="mb-6">
    <h3 className="font-medium mb-3">{title}</h3>
    <div className="space-y-2">
      {options.map((option) => {
        const IconComponent = option.icon;
        const isSelected = selectedOptions.includes(option.name.toLowerCase());

        return (
          <div key={option.name} className="flex items-center space-x-2">
            <Checkbox
              id={`${title}-${option.name}`}
              checked={isSelected}
              onCheckedChange={() => onToggle(option.name.toLowerCase())}
            />
            <label
              htmlFor={`${title}-${option.name}`}
              className="flex items-center text-sm cursor-pointer"
            >
              <IconComponent className="h-4 w-4 mr-2 text-muted-foreground" />
              {option.name}
            </label>
          </div>
        );
      })}
    </div>
  </div>
);

// Mobile Filter Sheet Component
const MobileFilterSheet = ({
  isOpen,
  onOpenChange,
  filters,
  setFilters,
  resetFilters,
}) => (
  <Sheet open={isOpen} onOpenChange={onOpenChange}>
    <SheetContent className="w-full sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Filters</SheetTitle>
        <SheetDescription>
          Refine your product search with these filters.
        </SheetDescription>
      </SheetHeader>

      <ScrollArea className="h-[calc(100vh-180px)] mt-6 pr-4">
        <Accordion
          type="multiple"
          defaultValue={["types", "difficulty", "products", "players"]}
        >
          <AccordionItem value="types">
            <AccordionTrigger>Game Types</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                {typeOptions.map((option) => {
                  const IconComponent = option.icon;
                  const isSelected = filters.types.includes(
                    option.name.toLowerCase()
                  );

                  return (
                    <div
                      key={option.name}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`mobile-${option.name}`}
                        checked={isSelected}
                        onCheckedChange={() => {
                          setFilters((prev) => ({
                            ...prev,
                            types: isSelected
                              ? prev.types.filter(
                                  (t) => t !== option.name.toLowerCase()
                                )
                              : [...prev.types, option.name.toLowerCase()],
                          }));
                        }}
                      />
                      <label
                        htmlFor={`mobile-${option.name}`}
                        className="flex items-center text-sm cursor-pointer"
                      >
                        <IconComponent className="h-4 w-4 mr-2 text-muted-foreground" />
                        {option.name}
                      </label>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="difficulty">
            <AccordionTrigger>Difficulty</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                {difficultyOptions.map((option) => {
                  const IconComponent = option.icon;
                  const isSelected = filters.difficulty.includes(
                    option.name.toLowerCase()
                  );

                  return (
                    <div
                      key={option.name}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`mobile-${option.name}`}
                        checked={isSelected}
                        onCheckedChange={() => {
                          setFilters((prev) => ({
                            ...prev,
                            difficulty: isSelected
                              ? prev.difficulty.filter(
                                  (d) => d !== option.name.toLowerCase()
                                )
                              : [...prev.difficulty, option.name.toLowerCase()],
                          }));
                        }}
                      />
                      <label
                        htmlFor={`mobile-${option.name}`}
                        className="flex items-center text-sm cursor-pointer"
                      >
                        <IconComponent className="h-4 w-4 mr-2 text-muted-foreground" />
                        {option.name}
                      </label>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="products">
            <AccordionTrigger>Product Types</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                {productOptions.map((option) => {
                  const IconComponent = option.icon;
                  const isSelected = filters.products.includes(
                    option.name.toLowerCase()
                  );

                  return (
                    <div
                      key={option.name}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`mobile-${option.name}`}
                        checked={isSelected}
                        onCheckedChange={() => {
                          setFilters((prev) => ({
                            ...prev,
                            products: isSelected
                              ? prev.products.filter(
                                  (p) => p !== option.name.toLowerCase()
                                )
                              : [...prev.products, option.name.toLowerCase()],
                          }));
                        }}
                      />
                      <label
                        htmlFor={`mobile-${option.name}`}
                        className="flex items-center text-sm cursor-pointer"
                      >
                        <IconComponent className="h-4 w-4 mr-2 text-muted-foreground" />
                        {option.name}
                      </label>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="players">
            <AccordionTrigger>Number of Players</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 pt-2">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">
                      Min Players: {filters.minPlayers}
                    </span>
                    <span className="text-sm">
                      Max Players: {filters.maxPlayers}
                    </span>
                  </div>
                  <div className="px-2">
                    <Slider
                      defaultValue={[filters.minPlayers, filters.maxPlayers]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(value) => {
                        setFilters((prev) => ({
                          ...prev,
                          minPlayers: value[0],
                          maxPlayers: value[1],
                        }));
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-muted-foreground">1</span>
                    <span className="text-xs text-muted-foreground">10+</span>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>

      <SheetFooter className="flex-row justify-between mt-6 gap-2">
        <Button variant="outline" className="flex-1" onClick={resetFilters}>
          Reset All
        </Button>
        <SheetClose asChild>
          <Button className="flex-1">Apply Filters</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
);

// Main Shop Page Component
const ShopPage = observer(() => {
  const { products, loading, loadingProducts } = MobxStore;
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    types: [],
    difficulty: [],
    minPlayers: 1,
    maxPlayers: 10,
    products: [],
  });
  const [sortOption, setSortOption] = useState("newest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [error, setError] = useState(null);

  // Apply filters and sorting
  const applyFilters = useCallback(() => {
    try {
      let filtered = [...products];

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (product) =>
            product.name?.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query)
        );
      }

      // Apply category filters
      if (filters.types.length > 0) {
        filtered = filtered.filter((product) =>
          product.types?.some((type) =>
            filters.types.includes(type.toLowerCase())
          )
        );
      }

      // Apply difficulty filter
      if (filters.difficulty.length > 0) {
        filtered = filtered.filter((product) =>
          filters.difficulty.includes(product.difficulty?.toLowerCase())
        );
      }

      // Apply product type filter
      if (filters.products.length > 0) {
        filtered = filtered.filter((product) =>
          filters.products.includes(product.type?.toLowerCase())
        );
      }

      // Apply player count filter
      filtered = filtered.filter(
        (product) =>
          (product.minPlayers >= filters.minPlayers || !product.minPlayers) &&
          (product.maxPlayers <= filters.maxPlayers || !product.maxPlayers)
      );

      // Apply sorting
      filtered.sort((a, b) => {
        // First priority: user ownership (owned products last)
        const userPurchases = MobxStore.user?.purchasedProducts || [];
        const userRewards = MobxStore.user?.unlockedRewards || [];

        // Check if user owns the product based on product type
        const isProductOwnedA =
          a.type?.toLowerCase() === "add-on"
            ? userRewards.includes(a.id)
            : userPurchases.includes(a.id);

        const isProductOwnedB =
          b.type?.toLowerCase() === "add-on"
            ? userRewards.includes(b.id)
            : userPurchases.includes(b.id);

        // If ownership status is different, prioritize non-owned products
        if (isProductOwnedA !== isProductOwnedB) {
          return isProductOwnedA ? 1 : -1; // Non-owned products first (owned products last)
        }

        // Second priority: for non-owned products, sort by type (games first, expansions second, add-ons last)
        const getTypeOrder = (product) => {
          const type = product.type?.toLowerCase();
          if (type === "game") return 1;
          if (type === "expansion") return 2;
          if (type === "add-on") return 3;
          return 4; // Any other type
        };

        const typeOrderA = getTypeOrder(a);
        const typeOrderB = getTypeOrder(b);

        if (typeOrderA !== typeOrderB) {
          return typeOrderA - typeOrderB;
        }

        // Third priority: apply the selected sort option
        switch (sortOption) {
          case "newest":
            return (
              new Date(b.dateReleased || 0) - new Date(a.dateReleased || 0)
            );
          case "a-z":
            return (a.name || "").localeCompare(b.name || "");
          case "price-low-high":
            return (a.price || 0) - (b.price || 0);
          case "price-high-low":
            return (b.price || 0) - (a.price || 0);
          case "product-type":
            // Already handled by second priority
            return 0;
          default:
            return 0;
        }
      });

      setFilteredProducts(filtered);
    } catch (err) {
      console.error("Error applying filters:", err);
      setError("An error occurred while filtering products. Please try again.");
    }
  }, [products, filters, sortOption, searchQuery]);

  // Apply filters whenever dependencies change
  useEffect(() => {
    if (products.length > 0) {
      applyFilters();
    }
  }, [products, filters, sortOption, searchQuery, applyFilters]);

  // Toggle a filter option
  const toggleFilter = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      types: [],
      difficulty: [],
      minPlayers: 1,
      maxPlayers: 10,
      products: [],
    });
    setSearchQuery("");
  };

  // Count active filters for badge
  const countActiveFilters = () => {
    return (
      filters.types.length +
      filters.difficulty.length +
      filters.products.length +
      (searchQuery ? 1 : 0) +
      (filters.minPlayers > 1 || filters.maxPlayers < 10 ? 1 : 0)
    );
  };

  // Handle search input
  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already applied via the useEffect
  };

  // Loading state
  if (loading || loadingProducts) {
    return (
      <div className="container mx-auto py-16 flex flex-col justify-center items-center min-h-[60vh]">
        <LoadingSpinner size={40} />
        <p className="mt-4 text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="flex items-center text-sm mb-8">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground"
          >
            <Home className="h-4 w-4 inline mr-1" /> Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
          <span className="font-medium">Shop</span>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm mb-8">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          <Home className="h-4 w-4 inline mr-1" /> Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
        <span className="font-medium">Shop</span>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Shop</h1>
        <p className="text-muted-foreground">
          Browse our collection of games, expansions, and bundles.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 bg-card rounded-lg border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-lg">Filters</h2>
              {countActiveFilters() > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-8 px-2"
                >
                  Reset
                </Button>
              )}
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            <Separator className="my-6" />

            {/* Game Types Filter */}
            <FilterSection
              title="Game Types"
              options={typeOptions}
              selectedOptions={filters.types}
              onToggle={(value) => toggleFilter("types", value)}
            />

            <Separator className="my-6" />

            {/* Difficulty Filter */}
            <FilterSection
              title="Difficulty"
              options={difficultyOptions}
              selectedOptions={filters.difficulty}
              onToggle={(value) => toggleFilter("difficulty", value)}
            />

            <Separator className="my-6" />

            {/* Product Types Filter */}
            <FilterSection
              title="Product Types"
              options={productOptions}
              selectedOptions={filters.products}
              onToggle={(value) => toggleFilter("products", value)}
            />

            <Separator className="my-6" />

            {/* Player Count Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Number of Players</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Min: {filters.minPlayers}</span>
                    <span className="text-sm">Max: {filters.maxPlayers}</span>
                  </div>
                  <div className="px-2">
                    <Slider
                      defaultValue={[filters.minPlayers, filters.maxPlayers]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(value) => {
                        setFilters((prev) => ({
                          ...prev,
                          minPlayers: value[0],
                          maxPlayers: value[1],
                        }));
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-muted-foreground">1</span>
                    <span className="text-xs text-muted-foreground">10+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 lg:hidden">
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full sm:w-auto"
              onClick={() => setIsMobileFilterOpen(true)}
            >
              <Filter className="h-4 w-4" />
              Filters
              {countActiveFilters() > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {countActiveFilters()}
                </Badge>
              )}
            </Button>

            <div className="relative w-full sm:w-auto">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10 pr-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Active Filters */}
          {countActiveFilters() > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 items-center">
                {searchQuery && (
                  <FilterBadge
                    label={`Search: ${searchQuery}`}
                    onRemove={() => setSearchQuery("")}
                    icon={<Search className="h-3 w-3" />}
                  />
                )}

                {filters.types.map((type) => (
                  <FilterBadge
                    key={`type-${type}`}
                    label={type}
                    onRemove={() => toggleFilter("types", type)}
                    icon={getIconForOption(type)}
                  />
                ))}

                {filters.difficulty.map((difficulty) => (
                  <FilterBadge
                    key={`difficulty-${difficulty}`}
                    label={difficulty}
                    onRemove={() => toggleFilter("difficulty", difficulty)}
                    icon={getIconForOption(difficulty)}
                  />
                ))}

                {filters.products.map((product) => (
                  <FilterBadge
                    key={`product-${product}`}
                    label={product}
                    onRemove={() => toggleFilter("products", product)}
                    icon={getIconForOption(product)}
                  />
                ))}

                {(filters.minPlayers > 1 || filters.maxPlayers < 10) && (
                  <FilterBadge
                    label={`Players: ${filters.minPlayers}-${filters.maxPlayers}`}
                    onRemove={() =>
                      setFilters((prev) => ({
                        ...prev,
                        minPlayers: 1,
                        maxPlayers: 10,
                      }))
                    }
                    icon={<Users className="h-3 w-3" />}
                  />
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm h-8"
                  onClick={resetFilters}
                >
                  Clear all
                </Button>
              </div>
            </div>
          )}

          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} products
            </p>

            <div className="flex items-center gap-2">
              <span className="text-sm whitespace-nowrap">Sort by:</span>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          <AnimatePresence mode="wait">
            {filteredProducts.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="bg-muted/30 rounded-full p-6 mb-4">
                  <AlertCircle className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  No products found
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  We couldn't find any products matching your current filters.
                  Try adjusting your search criteria.
                </p>
                <Button onClick={resetFilters}>Reset All Filters</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <MobileFilterSheet
        isOpen={isMobileFilterOpen}
        onOpenChange={setIsMobileFilterOpen}
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
      />
    </div>
  );
});

export default ShopPage;
