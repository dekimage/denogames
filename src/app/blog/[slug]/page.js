"use client";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import MobxStore from "@/mobx";
import Image from "next/image";
import { useParams } from "next/navigation";
import { LoadingSpinner } from "@/reusable-ui/LoadingSpinner";
import { format } from "date-fns";
import Breadcrumbs from "@/components/Breadcrumbs";
import denoImg from "../../../../public/deno.png";

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

const BlogPost = observer(() => {
  const params = useParams();
  const slug = params.slug;

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

  return (
    <div className="container mx-auto py-8">
      <Breadcrumbs />
      <article className="max-w-3xl mx-auto mt-8">
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
    </div>
  );
});

export default BlogPost;
