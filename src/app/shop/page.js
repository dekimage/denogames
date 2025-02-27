"use client";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import { useState, useEffect, useCallback } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";

import { CheckSquare, Square, ChevronDown, ChevronUp } from "lucide-react";
import { ProductCard } from "../page";
import { Button } from "@/components/ui/button";
import {
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
} from "lucide-react";

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
  { name: "Bundle", icon: Box },
];

const getIconForOption = (option) => {
  const iconOption =
    typeOptions.find((type) => type.name === option) ||
    difficultyOptions.find((diff) => diff.name === option) ||
    productOptions.find(
      (prod) => prod.name.toLowerCase() === option.toLowerCase()
    );
  if (iconOption) {
    const IconComponent = iconOption.icon;
    return <IconComponent size={20} className="mr-2" />;
  }
  return null;
};

const FilterSection = observer(
  ({ title, options, selectedOptions, onToggle, isOpen, toggleOpen }) => (
    <div className="mb-8">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleOpen}
      >
        <div className="font-strike text-xl uppercase">{title}</div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      {isOpen && (
        <div className="mt-2">
          {options.map((option) => (
            <div
              key={option.name}
              className="flex items-center justify-between mb-2 cursor-pointer text-grayy"
              onClick={() => onToggle(option.name)}
            >
              <div className="flex items-center">
                {getIconForOption(option.name)}
                <span>{option.name}</span>
              </div>
              {selectedOptions.includes(option.name.toLowerCase()) ? (
                <CheckSquare size={20} className="ml-2" />
              ) : (
                <Square size={20} className="ml-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
);

const ShopPage = observer(() => {
  const { products, loading } = MobxStore;
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    types: [],
    difficulty: [],
    minPlayers: 1,
    maxPlayers: 6,
    products: [],
  });
  const [openSections, setOpenSections] = useState({
    types: true,
    difficulty: true,
    players: true,
    products: true,
  });
  const [sortOption, setSortOption] = useState("newest");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "a-z", label: "A-Z" },
    { value: "price-low-high", label: "Price: Low to High" },
    { value: "price-high-low", label: "Price: High to Low" },
    { value: "product-type", label: "Product Type" },
  ];

  const applyFilters = useCallback(() => {
    let filtered = products.filter((product) => {
      const typeMatch =
        filters.types.length === 0 ||
        filters.types.some((type) => product.types?.includes(type));
      const difficultyMatch =
        filters.difficulty.length === 0 ||
        filters.difficulty.includes(product.difficulty);
      const playersMatch =
        product.minPlayers >= filters.minPlayers &&
        product.maxPlayers <= filters.maxPlayers;
      const productMatch =
        filters.products.length === 0 ||
        filters.products.some(
          (type) => product.type?.toLowerCase() === type.toLowerCase()
        );
      return typeMatch && difficultyMatch && playersMatch && productMatch;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "a-z":
          return (a.name || "").localeCompare(b.name || "");
        case "price-low-high":
          return (a.price || 0) - (b.price || 0);
        case "price-high-low":
          return (b.price || 0) - (a.price || 0);
        case "product-type":
          const typeOrder = { game: 1, expansion: 2, bundle: 3 };
          const aType = a.type || "";
          const bType = b.type || "";
          return (typeOrder[aType] || 4) - (typeOrder[bType] || 4);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [filters, products, sortOption]);

  useEffect(() => {
    if (products.length > 0) {
      applyFilters();
    }
  }, [products, filters, sortOption, applyFilters]);

  const toggleFilter = (filterType, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: prevFilters[filterType].includes(value)
        ? prevFilters[filterType].filter((item) => item !== value)
        : [...prevFilters[filterType], value],
    }));
  };

  const resetFilters = () => {
    setFilters({
      types: [],
      difficulty: [],
      minPlayers: 1,
      maxPlayers: 6,
      products: [],
    });
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    setIsDropdownOpen(false);
  };

  // Add this function to count active filters
  const countActiveFilters = () => {
    return (
      filters.types.length +
      filters.difficulty.length +
      filters.products.length +
      (filters.minPlayers > 1 ? 1 : 0) +
      (filters.maxPlayers < 6 ? 1 : 0)
    );
  };

  return (
    <div className="flex w-full h-full justify-center items-center">
      <div className="text-2xl font-strike uppercase">Under Construction</div>
    </div>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Breadcrumbs />
      <div className="flex mt-8">
        {/* Filters */}
        <div className="w-1/4 pr-8">
          <div className="flex justify-between items-center mb-4">
            <div className="text-2xl font-bold uppercase font-strike">
              Filters
            </div>
            {countActiveFilters() > 0 && (
              <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                {countActiveFilters()}
              </div>
            )}
          </div>
          <FilterSection
            title="Type"
            options={typeOptions}
            selectedOptions={filters.types}
            onToggle={(option) => toggleFilter("types", option.toLowerCase())}
            isOpen={openSections.types}
            toggleOpen={() => toggleSection("types")}
          />
          <FilterSection
            title="Difficulty"
            options={difficultyOptions}
            selectedOptions={filters.difficulty}
            onToggle={(option) =>
              toggleFilter("difficulty", option.toLowerCase())
            }
            isOpen={openSections.difficulty}
            toggleOpen={() => toggleSection("difficulty")}
          />
          <FilterSection
            title="Product"
            options={productOptions}
            selectedOptions={filters.products}
            onToggle={(option) =>
              toggleFilter("products", option.toLowerCase())
            }
            isOpen={openSections.products}
            toggleOpen={() => toggleSection("products")}
          />
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Number of Players</h3>
            <div className="flex items-center">
              <input
                type="number"
                min="1"
                max="6"
                value={filters.minPlayers}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    minPlayers: parseInt(e.target.value),
                  }))
                }
                className="w-16 p-2 border rounded"
              />
              <span className="mx-2">-</span>
              <input
                type="number"
                min="1"
                max="6"
                value={filters.maxPlayers}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxPlayers: parseInt(e.target.value),
                  }))
                }
                className="w-16 p-2 border rounded"
              />
            </div>
          </div>
          <Button onClick={resetFilters} variant="reverse" className="w-fit">
            Reset Filters
          </Button>
        </div>
        {/* Products */}
        <div className="w-3/4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-2xl font-bold  uppercase font-strike ml-4">
              Shop
            </div>
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold  uppercase font-strike ml-4">
                Sort by
              </div>
              <div className="relative">
                <div
                  className="flex items-center justify-between w-48 px-4 py-2 text-sm bg-transparent border-2 border-gray-300 rounded cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>
                    {
                      sortOptions.find((option) => option.value === sortOption)
                        .label
                    }
                  </span>
                  <ChevronDown size={20} />
                </div>
                {isDropdownOpen && (
                  <div className="absolute z-10 w-48 mt-1 bg-white border-2 border-gray-300 rounded shadow-lg">
                    {sortOptions.map((option) => (
                      <div
                        key={option.value}
                        className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSortChange(option.value)}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ShopPage;
