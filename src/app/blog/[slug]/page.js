"use client";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import MobxStore from "@/mobx";
import Image from "next/image";
import { useParams } from "next/navigation";
import { LoadingSpinner } from "@/reusable-ui/LoadingSpinner";
import { format } from "date-fns";
import Breadcrumbs from "@/components/Breadcrumbs";
import denoImg from "../../../../public/deno.png";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";

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

const BlogPost = observer(() => {
  const params = useParams();
  const slug = params.slug;

  const relatedGames = MobxStore.products?.slice(0, 2) || [];

  useEffect(() => {
    if (slug) {
      MobxStore.fetchBlogDetails(slug);
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
        <div className="flex flex-col lg:flex-row  mt-4 lg:justify-between items-center">
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
                <p className="text-gray-600 text-sm">{author.bio}</p>
                <p className="text-gray-500 text-xs">
                  {format(new Date(blog.date), "MMMM dd, yyyy")}
                </p>
              </div>
            </div>
            <div className="mb-8 flex flex-wrap">
              {blog.categories.map((category, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                  {category}
                </span>
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
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </article>

          {/* Related Games - Desktop */}
          <aside className="hidden lg:block lg:w-1/5">
            <div className="fixed top-24 w-1/5  h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide">
              <h2 className="text-center text-2xl font-bold mb-4 font-strike uppercase sticky top-0 bg-white z-10">
                Related Games
              </h2>
              <div className="flex flex-col items-center">
                {relatedGames.map((product) => (
                  <ProductCard key={product.id} product={product} isSmall />
                ))}
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
          <div className="flex flex-wrap">
            {relatedGames.map((product) => (
              <ProductCard key={product.id} product={product} isSmall />
            ))}
          </div>
        </div>

        {/* Fixed Footer - Mobile */}
        <div
          className="cursor-pointer lg:hidden font-strike uppercase fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center"
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
                  className=" border shadow-xl"
                />
              ))}
            </div>
          </div>

          <Button variant="reverse" onClick={scrollToRelatedGames}>
            View All
          </Button>
        </div>
      </div>
    </>
  );
});

export default BlogPost;
