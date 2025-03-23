"use client";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Calendar,
  User,
  Tag,
  Search,
  Filter,
  X,
  ChevronRight,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/reusable-ui/LoadingSpinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

// Helper function to extract excerpt
const extractExcerpt = (content, maxLength = 150) => {
  // Remove HTML tags
  const plainText = content.replace(/<[^>]+>/g, "");

  // Truncate and add ellipsis if needed
  if (plainText.length > maxLength) {
    return plainText.substring(0, maxLength) + "...";
  }

  return plainText;
};

// Updated Blog Card Component
const BlogCard = ({ blog }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/blog/${blog.slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
      className="cursor-pointer"
    >
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative h-48 w-full">
          <Image
            src={blog.thumbnail || "/placeholder-blog.jpg"}
            alt={blog.title}
            fill
            className="object-cover"
          />
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(blog.date)}</span>
            {blog.readTime && (
              <>
                <span>•</span>
                <Clock className="h-4 w-4" />
                <span>{blog.readTime} min read</span>
              </>
            )}
          </div>
          <CardTitle className="line-clamp-2 text-xl">{blog.title}</CardTitle>

          {/* Categories moved inside the card body */}
          {blog.categories && blog.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {blog.categories.map((category) => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-grow">
          <p className="text-muted-foreground line-clamp-3">
            {extractExcerpt(blog.excerpt || blog.content || "")}
          </p>
        </CardContent>

        <CardFooter className="pt-2 border-t">
          <div className="flex items-center gap-2 w-full">
            {blog.author && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{blog.author}</span>
              </div>
            )}
            <div className="ml-auto">
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// Category Filter Component
const CategoryFilter = ({
  categories,
  selectedCategories,
  onSelectCategory,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Tag className="h-4 w-4" />
        <h3 className="font-medium">Categories</h3>
      </div>

      <ScrollArea className="h-[220px] pr-4">
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center">
              <Button
                variant={
                  selectedCategories.includes(category) ? "default" : "outline"
                }
                size="sm"
                className="w-full justify-start text-sm"
                onClick={() => onSelectCategory(category)}
              >
                {selectedCategories.includes(category) && (
                  <X className="mr-2 h-3 w-3" />
                )}
                {category}
                <span className="ml-auto opacity-70">
                  {categories.filter((c) => c === category).length}
                </span>
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

// Search Component
const BlogSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSearch} className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search articles..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="submit" size="sm" className="absolute right-1 top-1">
          Search
        </Button>
      </div>
    </form>
  );
};

// Mobile Filter Toggle
const MobileFilterToggle = ({ isFilterOpen, toggleFilter }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="lg:hidden flex items-center gap-2 mb-4"
      onClick={toggleFilter}
    >
      <Filter className="h-4 w-4" />
      {isFilterOpen ? "Hide Filters" : "Show Filters"}
    </Button>
  );
};

// Main Blog Page Component
const BlogPage = observer(() => {
  const { blogs, blogsLoading, fetchBlogs, blogsFetched } = MobxStore;
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch blogs if not already fetched
  useEffect(() => {
    if (!blogsFetched && !blogsLoading) {
      fetchBlogs();
    }

    // Extract all unique categories from blogs
    if (blogs.length > 0) {
      const categories = blogs.reduce((acc, blog) => {
        if (blog.categories && Array.isArray(blog.categories)) {
          return [...acc, ...blog.categories];
        }
        return acc;
      }, []);

      // Get unique categories
      const uniqueCategories = [...new Set(categories)].sort();
      setAllCategories(uniqueCategories);
    }
  }, [blogs, blogsFetched, blogsLoading, fetchBlogs]);

  // Filter blogs based on selected categories and search query
  useEffect(() => {
    let filtered = [...blogs];

    // Filter by categories if any are selected
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(
        (blog) =>
          blog.categories &&
          blog.categories.some((category) =>
            selectedCategories.includes(category)
          )
      );
    }

    // Filter by search query if present
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(query) ||
          (blog.excerpt && blog.excerpt.toLowerCase().includes(query)) ||
          (blog.content && blog.content.toLowerCase().includes(query))
      );
    }

    setFilteredBlogs(filtered);
  }, [blogs, selectedCategories, searchQuery]);

  // Toggle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Handle search
  const handleSearch = (term) => {
    setSearchQuery(term);
  };

  // Toggle mobile filter visibility
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery("");
  };

  // Loading state
  if (blogsLoading) {
    return (
      <div className="container mx-auto py-16 flex flex-col justify-center items-center min-h-[60vh]">
        <LoadingSpinner size={40} />
        <p className="mt-4 text-muted-foreground">Loading blog posts...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm mb-8">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
        <span className="font-medium">Blog</span>
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 font-strike">Deno Press</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover new games, explore mechanics and find hidden collectibles.
        </p>
      </div>

      {/* Mobile Filter Toggle */}
      <MobileFilterToggle
        isFilterOpen={isFilterOpen}
        toggleFilter={toggleFilter}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters - Hidden on mobile unless toggled */}
        <div className={`${isFilterOpen ? "block" : "hidden"} lg:block`}>
          <div className="sticky top-24">
            <div className="bg-card rounded-lg border p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Filters</h2>
                {(selectedCategories.length > 0 || searchQuery) && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear all
                  </Button>
                )}
              </div>

              <BlogSearch onSearch={handleSearch} />

              <Separator className="my-4" />

              <CategoryFilter
                categories={allCategories}
                selectedCategories={selectedCategories}
                onSelectCategory={handleCategorySelect}
              />
            </div>
          </div>
        </div>

        {/* Blog Posts */}
        <div className="lg:col-span-3">
          {/* Active Filters */}
          {(selectedCategories.length > 0 || searchQuery) && (
            <div className="mb-6 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">
                Active filters:
              </span>

              {selectedCategories.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {category}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleCategorySelect(category)}
                  />
                </Badge>
              ))}

              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {searchQuery}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSearchQuery("")}
                  />
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="text-sm"
                onClick={clearFilters}
              >
                Clear all
              </Button>
            </div>
          )}

          {/* Results Count */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Showing {filteredBlogs.length} of {blogs.length} blogs
            </p>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Sort by <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setFilteredBlogs(
                      [...filteredBlogs].sort(
                        (a, b) => new Date(b.date) - new Date(a.date)
                      )
                    );
                  }}
                >
                  Newest first
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setFilteredBlogs(
                      [...filteredBlogs].sort(
                        (a, b) => new Date(a.date) - new Date(b.date)
                      )
                    );
                  }}
                >
                  Oldest first
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setFilteredBlogs(
                      [...filteredBlogs].sort((a, b) =>
                        a.title.localeCompare(b.title)
                      )
                    );
                  }}
                >
                  Title A-Z
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Blog Grid */}
          {filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog) => (
                <BlogCard key={blog.id || blog.slug} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/20 rounded-lg">
              <h3 className="text-lg font-medium mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search query.
              </p>
              <Button onClick={clearFilters}>Clear all filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default BlogPage;
