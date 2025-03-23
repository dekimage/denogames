"use client";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import MobxStore from "@/mobx";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { LoadingSpinner } from "@/reusable-ui/LoadingSpinner";
import { format } from "date-fns";
import Breadcrumbs from "@/components/Breadcrumbs";
import denoImg from "../../../../public/deno.png";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, ArrowRightCircle } from "lucide-react";

const author = {
  name: "Deno Gavrilovic",
  image: denoImg,
  bio: "Game Designer & Developer",
};

// Function to decode HTML entities
function decodeHTMLEntities(text) {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
}

// New ProgressBar component
const ProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = `${(scrollPx / winHeightPx) * 100}%`;
      setScrollProgress(scrolled);
    };

    window.addEventListener("scroll", updateScrollProgress);

    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
    };
  }, []);

  return (
    <div className="fixed top-[70px] left-0 w-full h-1 z-50">
      <div
        style={{
          width: scrollProgress,
          height: "100%",
          backgroundImage: "linear-gradient(to right, yellow, orange)",
          boxShadow: "0 2px 4px rgba(255, 215, 0, 0.5)",
          transition: "width 0.1s",
        }}
      />
    </div>
  );
};

// Related blog post card component
const RelatedBlogCard = ({ blog, currentSlug }) => {
  const router = useRouter();

  // Skip current blog post
  if (blog.slug === currentSlug) return null;

  // Decode title
  const decodedTitle = decodeHTMLEntities(blog.title);

  const navigateToBlog = () => {
    router.push(`/blog/${blog.slug}`);
  };

  return (
    <div
      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer bg-card"
      onClick={navigateToBlog}
    >
      <div className="relative h-40 w-full">
        {blog.thumbnail ? (
          <Image
            src={blog.thumbnail}
            alt={decodedTitle}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No Image</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-2">
          {blog.categories?.map((category, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{decodedTitle}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {blog.excerpt
            ? decodeHTMLEntities(blog.excerpt.replace(/<[^>]+>/g, ""))
            : "Continue reading..."}
        </p>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">{blog.date}</span>
          <Button variant="ghost" size="sm" className="p-0 h-auto">
            Read more <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const BlogPost = observer(() => {
  const params = useParams();
  const slug = params.slug;
  const [relatedGames, setRelatedGames] = useState([]);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setIsLoading(true);

      // First ensure we have blogs in the store
      const fetchBlogsIfNeeded = async () => {
        if (MobxStore.blogs.length === 0 && !MobxStore.blogsLoading) {
          await MobxStore.fetchBlogs();
        }
      };

      fetchBlogsIfNeeded().then(() => {
        // Then fetch the specific blog details
        MobxStore.fetchBlogDetails(slug)
          .then((blog) => {
            // Set related games - check both relatedGameIds and relatedGames properties
            if (blog) {
              // Try to get related game IDs from either property
              const gameIds = blog.relatedGameIds || blog.relatedGames || [];

              // Convert to array if it's not already (handle both string and array formats)
              const gameIdsArray = Array.isArray(gameIds)
                ? gameIds
                : [gameIds].filter(Boolean);

              if (gameIdsArray.length > 0) {
                const games = MobxStore.products
                  .filter((product) => gameIdsArray.includes(product.id))
                  .slice(0, 2);

                setRelatedGames(games);
              }
            }

            // Find related blogs based on categories
            if (blog && blog.categories && MobxStore.blogs.length > 0) {
              // Get current blog's categories
              const currentCategories = blog.categories || [];

              // Find blogs with matching categories, excluding current blog
              const blogsWithMatchingCategories = MobxStore.blogs
                .filter(
                  (b) =>
                    b.slug !== slug && // Exclude current blog
                    b.categories?.some((cat) => currentCategories.includes(cat)) // Must share at least one category
                )
                .slice(0, 3); // Get up to 3 related blogs

              // If we don't have enough matching blogs, add recent blogs
              let relatedBlogsList = [...blogsWithMatchingCategories];

              if (relatedBlogsList.length < 3) {
                // Get recent blogs excluding current and already included blogs
                const recentBlogs = MobxStore.blogs
                  .filter(
                    (b) =>
                      b.slug !== slug && // Exclude current
                      !relatedBlogsList.some((rb) => rb.slug === b.slug) // Exclude already included
                  )
                  .slice(0, 3 - relatedBlogsList.length);

                relatedBlogsList = [...relatedBlogsList, ...recentBlogs];
              }

              setRelatedBlogs(relatedBlogsList);
            }
          })
          .finally(() => {
            setIsLoading(false);
          });
      });
    }
  }, [slug]);

  const blog = MobxStore.blogDetails.get(slug);
  const loading = MobxStore.isBlogDetailsLoading(slug);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!blog) {
    return <div>Blog post not found</div>;
  }

  const decodedTitle = decodeHTMLEntities(blog.title);

  const scrollToRelatedGames = () => {
    if (typeof window !== "undefined") {
      const relatedGamesSection = document.getElementById("related-games");

      if (relatedGamesSection) {
        const yOffset = -80; // 80px offset to account for fixed header
        const y =
          relatedGamesSection.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;

        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <ProgressBar />
      <div className="container max-w-[1000px] mx-auto p-4 lg:p-8 mt-[10px]">
        <Breadcrumbs />
        <div className="flex flex-col lg:flex-row mt-4 lg:justify-between items-center">
          <article className="lg:w-4/5 max-w-[600px]">
            <h1 className="text-4xl font-bold mb-4 font-strike uppercase">
              {decodedTitle}
            </h1>
            <div className="mb-6 flex items-center">
              <Image
                src={author.image}
                alt={author.name}
                width={60}
                height={60}
                className="rounded-full mr-4"
              />
              <div>
                <p className="font-semibold text-lg">{author.name}</p>
                <p className="text-muted-foreground text-sm">{author.bio}</p>
                <p className="text-muted-foreground text-xs">
                  {format(new Date(blog.date), "MMMM dd, yyyy")}
                </p>
              </div>
            </div>
            <div className="mb-8 flex flex-wrap gap-2">
              {blog.categories.map((category, index) => (
                <Badge key={index} variant="secondary" className="mr-2">
                  {category}
                </Badge>
              ))}
            </div>
            {blog.thumbnail && (
              <div className="flex justify-center my-8">
                <Image
                  src={blog.thumbnail}
                  alt={blog.title}
                  width={600}
                  height={300}
                  className="w-full w-[400px] h-[400px] rounded-lg"
                />
              </div>
            )}
            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </article>

          {/* Related Games - Desktop */}
          <aside className="hidden lg:block lg:w-1/5">
            <div className="fixed top-24 w-1/5 h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide">
              <h2 className="text-center text-2xl font-bold mb-4 font-strike uppercase sticky top-0 bg-background z-10 py-2">
                Related Games
              </h2>
              <div className="flex flex-col items-center">
                {relatedGames.length > 0 ? (
                  relatedGames.map((product) => (
                    <ProductCard key={product.id} product={product} isSmall />
                  ))
                ) : (
                  <p className="text-muted-foreground text-center text-sm">
                    No related games found
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* Related Games - Mobile */}
        <div
          className="lg:hidden mt-8 max-w-[600px] mx-auto"
          id="related-games"
        >
          <h2 className="text-2xl font-bold mb-4 font-strike uppercase">
            Related Games
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {relatedGames.length > 0 ? (
              relatedGames.map((product) => (
                <ProductCard key={product.id} product={product} isSmall />
              ))
            ) : (
              <p className="text-muted-foreground text-center text-sm py-4">
                No related games found
              </p>
            )}
          </div>
        </div>

        {/* Related Blog Posts Section */}
        {relatedBlogs.length > 0 && (
          <div className="mt-16 mb-24 max-w-[1000px] mx-auto">
            <h2 className="text-2xl font-bold mb-6 font-strike uppercase border-b pb-2">
              Continue Reading
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <RelatedBlogCard
                  key={relatedBlog.slug}
                  blog={relatedBlog}
                  currentSlug={slug}
                />
              ))}
            </div>
          </div>
        )}

        {/* Fixed Footer - Mobile */}
        {relatedGames.length > 0 && (
          <div
            className="cursor-pointer lg:hidden font-strike uppercase fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex justify-between items-center z-10"
            onClick={scrollToRelatedGames}
            style={{ boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="flex items-center space-x-2">
              <div className="max-w-[20%] mr-4">Related Games:</div>
              <div className="flex gap-2">
                {relatedGames.map((p) => (
                  <Image
                    key={p.id}
                    src={p.thumbnail}
                    alt={p.title}
                    width={50}
                    height={50}
                    className="border shadow-xl"
                  />
                ))}
              </div>
            </div>

            <Button variant="reverse" onClick={scrollToRelatedGames}>
              View All
            </Button>
          </div>
        )}
      </div>
    </>
  );
});

export default BlogPost;
