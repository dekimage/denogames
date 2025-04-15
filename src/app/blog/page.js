"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Filter,
  Search,
  Calendar,
  Home,
  Clock,
  MessageSquare,
  BookOpen,
  Tag,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
import { trackEvent } from "@/lib/analytics/client";
import { CLIENT_EVENTS, EVENT_CATEGORIES } from "@/lib/analytics/events";

// Blog page component
const BlogPage = observer(() => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [allCategories, setAllCategories] = useState([]); // Store all unique categories here

  // Add this new loading skeleton component
  const BlogCardSkeleton = () => (
    <div className="border rounded-lg overflow-hidden shadow-sm animate-pulse">
      <div className="relative aspect-video bg-muted"></div>
      <div className="p-5">
        <div className="flex gap-2 mb-2">
          <div className="h-5 w-16 bg-muted rounded"></div>
          <div className="h-5 w-16 bg-muted rounded"></div>
        </div>
        <div className="h-6 bg-muted rounded mb-2"></div>
        <div className="h-4 bg-muted rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-muted rounded mb-4 w-1/2"></div>
        <div className="flex items-center">
          <div className="h-4 w-24 bg-muted rounded"></div>
        </div>
      </div>
    </div>
  );

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        // Add a small delay to prevent flash of loading state
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (MobxStore.blogsFetched && MobxStore.blogs.length > 0) {
          const categories = new Set();
          MobxStore.blogs.forEach((blog) => {
            if (blog.categories && Array.isArray(blog.categories)) {
              blog.categories.forEach((category) => categories.add(category));
            }
          });

          setAllCategories(Array.from(categories).sort());
          setBlogs(MobxStore.blogs);
          setFilteredBlogs(MobxStore.blogs);
        } else {
          await MobxStore.fetchBlogs();

          const categories = new Set();
          MobxStore.blogs.forEach((blog) => {
            if (blog.categories && Array.isArray(blog.categories)) {
              blog.categories.forEach((category) => categories.add(category));
            }
          });

          setAllCategories(Array.from(categories).sort());
          setBlogs(MobxStore.blogs);
          setFilteredBlogs(MobxStore.blogs);
        }
      } catch (err) {
        console.log("Error fetching blogs:", err);
        setError("Failed to load blog posts. Please try again later.");
      } finally {
        // Only set loading to false after a small delay to ensure state updates have processed
        setTimeout(() => {
          setLoading(false);
        }, 0);
      }
    };

    fetchBlogs();
  }, []); // Empty dependency array ensures this only runs once

  // Filter blogs based on search query and selected categories
  useEffect(() => {
    if (!blogs.length) return;

    let result = [...blogs];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (blog) =>
          blog.title.toLowerCase().includes(query) ||
          blog.excerpt.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter((blog) =>
        selectedCategories.some(
          (category) => blog.categories && blog.categories.includes(category)
        )
      );
    }

    setFilteredBlogs(result);
  }, [blogs, searchQuery, selectedCategories]);

  // Toggle category selection
  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
  };

  if (loading || (!error && blogs.length === 0)) {
    return (
      <div className="container mx-auto py-16 px-4">
        {/* Breadcrumbs skeleton */}
        <div className="flex items-center text-sm mb-8">
          <div className="h-4 w-20 bg-muted rounded"></div>
        </div>

        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 w-32 bg-muted rounded mb-2"></div>
          <div className="h-4 w-64 bg-muted rounded"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar skeleton */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-card rounded-lg border p-6">
              <div className="h-6 w-24 bg-muted rounded mb-6"></div>
              <div className="h-10 bg-muted rounded mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Main content skeleton */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 px-4">
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
        <span className="font-medium">Blog</span>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 font-strike">Blog</h1>
        <p className="text-muted-foreground">
          I write about cool game mechanics that I come up with.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 bg-card rounded-lg border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-lg">Filters</h2>
              {(searchQuery || selectedCategories.length > 0) && (
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Search is applied via useEffect
              }}
              className="mb-6"
            >
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            <Separator className="my-6" />

            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Categories</h3>
              <div className="space-y-2">
                {allCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="rounded text-primary"
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="text-sm cursor-pointer"
                    >
                      {category}
                    </label>
                  </div>
                ))}

                {allCategories.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No categories found
                  </p>
                )}
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
              {(searchQuery || selectedCategories.length > 0) && (
                <Badge variant="secondary" className="ml-1">
                  {(searchQuery ? 1 : 0) + selectedCategories.length}
                </Badge>
              )}
            </Button>

            <div className="relative w-full sm:w-auto">
              <form className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts..."
                    className="pl-10 pr-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedCategories.length > 0) && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 items-center">
                {searchQuery && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 px-2 py-1"
                  >
                    <Search className="h-3 w-3 mr-1" />
                    Search: {searchQuery}
                    <button onClick={() => setSearchQuery("")} className="ml-1">
                      <ChevronUp className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {selectedCategories.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="flex items-center gap-1 px-2 py-1"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {category}
                    <button
                      onClick={() => toggleCategory(category)}
                      className="ml-1"
                    >
                      <ChevronUp className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}

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

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredBlogs.length} of {blogs.length} posts
            </p>
          </div>

          {/* Blog Posts Grid */}
          <AnimatePresence mode="wait">
            {filteredBlogs.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredBlogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
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
                <h2 className="text-xl font-semibold mb-2">No posts found</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  We couldn&apos;t find any blog posts matching your current
                  filters. Try adjusting your search criteria.
                </p>
                <Button onClick={resetFilters}>Reset All Filters</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>
              Filter blog posts by category or search terms
            </SheetDescription>
          </SheetHeader>

          <div className="py-6 space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Search</h3>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium">Categories</h3>
              <div className="space-y-2">
                {allCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`mobile-category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="rounded text-primary"
                    />
                    <label
                      htmlFor={`mobile-category-${category}`}
                      className="text-sm cursor-pointer"
                    >
                      {category}
                    </label>
                  </div>
                ))}

                {allCategories.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No categories found
                  </p>
                )}
              </div>
            </div>
          </div>

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
    </div>
  );
});

// Blog Card Component
export const BlogCard = ({ blog }) => {
  const { user } = MobxStore;

  // Parse the HTML content to get plain text for descriptions
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const excerpt = blog.excerpt ? stripHtml(blog.excerpt) : "";
  const decodedTitle = blog.title ? stripHtml(blog.title) : "";

  const handleBlogClick = async () => {
    await trackEvent({
      action: CLIENT_EVENTS.BLOG_CARD_CLICK,
      context: {
        blogId: blog.id,
        blogSlug: blog.slug,
        categories: blog.categories,
        currentPath: window.location.pathname,
        isFirstTime: user
          ? !user?.analytics?.openBlogs?.includes(blog.id)
          : undefined,
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <Link
        href={`/blog/${blog.slug}`}
        className="block h-full"
        onClick={handleBlogClick}
      >
        <div className="relative aspect-video">
          {blog.thumbnail ? (
            <Image
              src={blog.thumbnail}
              alt={decodedTitle}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="p-5 bg-muted/50">
          <div className="flex gap-2 mb-2 flex-wrap">
            {blog.categories &&
              blog.categories.map((category, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {category}
                </Badge>
              ))}
          </div>
          <h3 className="font-bold text-lg mb-2 line-clamp-2">
            {decodedTitle}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
            {excerpt}
          </p>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="mr-4">{blog.date}</span>
            <ArrowRight className="h-4 w-4 ml-auto" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogPage;
